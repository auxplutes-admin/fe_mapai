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
import { formatDistanceToNow } from 'date-fns';

interface Session {
  session_id: string;
  created_at: number;
  region_name: string | null;
  region_id: string | null;
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile only
  const [sessions, setSessions] = useState<Session[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Map", icon: MapIcon, route: "/dashboard/map" },
  ];

  // Auto-close mobile drawer on route change + ESC key to close
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
    // Navigate to map page with session parameters to open split view
    navigate(`/dashboard/map?sessionId=${session.session_id}&regionId=${session.region_id}&regionName=${session.region_name}`);
  };

  const THEME = '#2e014a'; // Updated to match map theme

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

      {/* Sidebar - Always Open on Desktop */}
      <aside
        className={[
          "w-72", // Always expanded width
          `bg-[${THEME}] backdrop-blur border-r border-gray-200/10 flex flex-col fixed inset-y-0 left-0`,
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-30 shadow-xl",
        ].join(" ")}
        aria-label="Sidebar navigation"
        style={{ backgroundColor: THEME }}
      >
        {/* Gradient cap */}
        {/* <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" /> */}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">DRC</span>
          </div>
        </div>

        {/* Navigation - REMOVED overflow-y-auto */}
        <nav className={`flex-1 flex flex-col p-3`} style={{ backgroundColor: THEME }}>
          {/* Main Navigation Items */}
          <ul className="space-y-1 flex-shrink-0">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.route);

              const baseBtn =
                "group relative w-full h-11 rounded-xl transition-all overflow-hidden";
              const activeClasses = isActive
                ? "bg-white/10 text-white"
                : "text-white hover:bg-white/10";

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
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sessions List Container with fixed height */}
          <div className="mt-6">
            <div className="px-5 mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-white uppercase">Previous Chats</h2>
            </div>
            {/* Fixed height container with scrollbar */}
            <div className="h-96 overflow-y-auto space-y-1 px-2 border border-white/10 rounded-lg mx-2 bg-white/5">
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
                    <span className="text-xs text-white/70">
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 truncate">
                    {session.region_id}
                  </span>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="text-xs text-white/50 text-center py-4">
                  No previous chats
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10 flex-shrink-0" style={{ backgroundColor: THEME }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-12 hover:bg-white/10 rounded-xl text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full grid place-items-center shadow">
                    <span className="text-white font-bold text-sm">
                      {user?.studentProfile?.firstName?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white text-sm leading-tight truncate">
                      {user?.studentProfile?.firstName} {user?.studentProfile?.lastName || "User"}
                    </p>
                    <p className="text-white/70 text-xs truncate">
                      {user?.studentProfile?.role || "Admin"}
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-white/70" />
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header (hidden for map pages) */}
        {location.pathname !== "/dashboard/map" &&
          !location.pathname.startsWith("/dashboard/chat/") && (
            <header className="border-b border-white/10 px-6 py-4 shadow-sm" style={{ backgroundColor: THEME }}>
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
        <main className="flex-1 overflow-auto text-white" style={{ backgroundColor: THEME }}>
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