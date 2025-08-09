import { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  ChevronDown,
  X,
  MessageCircle,
  LogOut,
  Map as MapIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAllSessions } from "@/api";
import { formatDistanceToNow } from 'date-fns'; // Add this import for date formatting

const COLLAPSE_KEY = "dash:isCollapsed";

interface Session {
  session_id: string;
  created_at: number;
  region_name: string | null;
  region_id: string | null;
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(COLLAPSE_KEY);
    return saved ? saved === "1" : false;
  });
  const [sessions, setSessions] = useState<Session[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Map", icon: MapIcon, route: "/dashboard/map" },
    // { label: "Previous Sessions", icon: MessageCircle, route: "/dashboard/sessions" },
  ];

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  }, []);

  // collapse on map route by default
  useEffect(() => {
    if (location.pathname === "/dashboard/map" || location.pathname.startsWith("/dashboard/chat/")) {
      setIsCollapsed(true);
      localStorage.setItem(COLLAPSE_KEY, "1");
    }
  }, [location.pathname]);

  // auto-close mobile drawer on route change + ESC key to close
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMobileSidebar = () => setIsSidebarOpen(false);

  const titleFromPath = () => {
    const pathParts = location.pathname.split("/");
    const id = pathParts[3];
    if (id) return `${id}`;
    const active = navItems.find((n) => location.pathname.startsWith(n.route));
    return active?.label || "Dashboard";
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessions = await getAllSessions();
        setSessions(sessions);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleSessionClick = (session: any) => {
    // Navigate directly to the chat session
    navigate(`/dashboard/chat/${session.session_id}?regionId=${session.region_id}&regionName=${session.region_name}`, {
      state: {
        regionId: session.region_id,
        regionName: session.region_name
      }
    });
  };

  const THEME = '#160041';

  return (
    <div className="flex h-screen" style={{ backgroundColor: THEME }}>
      {/* Mobile Toggle */}
      <Button
        aria-label="Toggle sidebar"
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white/90 shadow-lg backdrop-blur"
        onClick={() => setIsSidebarOpen((v) => !v)}
      >
        {isSidebarOpen ? <X className="w-4 h-4" /> : <AlignJustify className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={[
          isCollapsed ? "w-16" : "w-72", // Increased width from w-64 to w-72
          `bg-[${THEME}] backdrop-blur border-r border-gray-200 flex flex-col fixed inset-y-0 left-0`,
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-30 shadow-xl",
        ].join(" ")}
        aria-label="Sidebar navigation"
      >
        {/* Gradient cap */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              {/* <img src={Logo} alt="AuxPlutes Logo" className="h-8 w-auto" /> */}
              <span className="text-sm font-semibold text-white">DRC</span>
            </div>
          )}
          <Button
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex hover:bg-white/10 text-white hover:text-white"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto flex flex-col p-3 ${THEME} backdrop-blur`}>
          <TooltipProvider delayDuration={150}>
            <ul className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.route);

                const baseBtn =
                  "group relative w-full h-11 rounded-xl transition-all overflow-hidden";
                const activeClasses = isActive
                  ? "bg-white/10 text-white"
                  : "text-white hover:bg-white/10 hover:text-black";

                if (isCollapsed) {
                  return (
                    <li key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={item.route}
                            onClick={closeMobileSidebar}
                            className={`${baseBtn} ${activeClasses} flex items-center justify-center`}
                          >
                            {/* left active indicator */}
                            <span
                              className={[
                                "absolute left-0 top-0 h-full w-1 rounded-r",
                                isActive ? "bg-gradient-to-b from-blue-600 to-cyan-500" : "bg-transparent",
                              ].join(" ")}
                            />
                            <Icon className="w-5 h-5 hover:text-white" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-white">{item.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }

                return (
                  <li key={index}>
                    <Link
                      to={item.route}
                      onClick={closeMobileSidebar}
                      className={`${baseBtn} ${activeClasses} pl-3 pr-2 flex items-center gap-3`}
                    >
                      <span
                        className={[
                          "absolute left-0 top-0 h-full w-1 rounded-r",
                          isActive ? "bg-gradient-to-b from-blue-600 to-cyan-500" : "bg-transparent",
                        ].join(" ")}
                      />
                      <Icon className="w-5 h-5 text-white" />
                      <span className="font-medium text-sm truncate text-white">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </TooltipProvider>

          {/* Sessions List */}
          <div className={`mt-6 ${THEME} backdrop-blur`}>
            {isCollapsed ? (
              // Collapsed view with tooltips
              <div className="space-y-1">
                {/* On Collapse */}
                {/* {sessions.map((session) => (
                  <TooltipProvider key={session.session_id} delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleSessionClick(session)}
                          className="w-10 h-10 mx-auto flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(session.region_name || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col gap-1">
                        <p className="font-medium">{session.region_name || 'Unnamed Region'}</p>
                        <p className="text-xs text-gray-500">{session.region_id}</p>
                        <p className="text-xs text-gray-500">{formatDate(session.created_at)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))} */}
              </div>
            ) : (
              // Expanded view
              <>
                <div className="px-3 mb-2 flex items-center justify-between">
                  <h2 className="text-xs font-semibold text-white uppercase">Previous Chats</h2>
                </div>
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <button
                      key={session.session_id}
                      onClick={() => handleSessionClick(session)}
                      className="w-full text-left group flex flex-col p-3 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">
                          {session.region_name || 'Unnamed Region'}
                        </span>
                        <span className="text-xs text-white">
                          {formatDate(session.created_at)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 truncate">
                        {session.region_id}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t border-gray-200 ${THEME} backdrop-blur`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full ${isCollapsed ? "justify-center px-0" : "justify-between"} h-12 hover:bg-gray-100 rounded-xl`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full grid place-items-center shadow">
                    <span className="text-white font-bold text-sm">
                      {user?.studentProfile?.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="text-left">
                      <p className="font-medium text-gray-900 text-sm leading-tight truncate">
                        {user?.studentProfile?.firstName} {user?.studentProfile?.lastName || "User"}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {user?.studentProfile?.role || "Admin"}
                      </p>
                    </div>
                  )}
                </div>
                {!isCollapsed && <ChevronDown className="w-4 h-4 text-gray-400" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  closeMobileSidebar();
                }}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (hidden for map pages) */}
        {location.pathname !== "/dashboard/map" &&
          !location.pathname.startsWith("/dashboard/chat/") && (
            <header className="border-b border-gray-200 px-6 py-4 shadow-sm" style={{ backgroundColor: '#450275' }}>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white md:ml-0 ml-12">{titleFromPath()}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        closeMobileSidebar();
                      }}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Confirm Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
          )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto text-white" style={{ backgroundColor: '#450275' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
