
// import { useEffect, useMemo, useState } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   AlignJustify,
//   ChevronDown,
//   X,
//   LogOut,
//   Map as MapIcon,
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { getAllSessions } from "@/api";
// import { formatDistanceToNow } from "date-fns";

// interface Session {
//   session_id: string;
//   created_at: number;
//   region_name: string | null;
//   region_id: string | null;
// }

// interface RegionGroup {
//   id: string; // region_id or "__unknown__"
//   name: string; // region_name or fallback
//   sessions: Session[];
//   latest: number; // latest created_at in the group
// }

// export default function DashboardLayout() {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile only
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [openRegionId, setOpenRegionId] = useState<string | null>(null);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const navItems = [
//     { label: "Map", icon: MapIcon, route: "/dashboard/map" },
//   ];

//   // Close mobile drawer on route change + ESC to close
//   useEffect(() => {
//     setIsSidebarOpen(false);
//   }, [location.pathname]);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setIsSidebarOpen(false);
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   const closeMobileSidebar = () => setIsSidebarOpen(false);

//   const titleFromPath = () => {
//     const pathParts = location.pathname.split("/");
//     const id = pathParts[3];
//     if (id) return `${id}`;
//     const active = navItems.find((n) => location.pathname.startsWith(n.route));
//     return active?.label || "Dashboard";
//   };

//   useEffect(() => {
//     const fetchSessions = async () => {
//       try {
//         const sessions = await getAllSessions();
//         setSessions(sessions);
//       } catch (error) {
//         console.error("Error fetching sessions:", error);
//       }
//     };
//     fetchSessions();
//   }, []);

//   const formatDate = (timestamp: number) => {
//     return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
//   };

//   const handleSessionClick = (session: Session) => {
//     // Navigate to map page with session parameters to open split view
//     navigate(
//       `/dashboard/map?sessionId=${session.session_id}&regionId=${session.region_id}&regionName=${session.region_name}`
//     );
//   };

//   const THEME = "#2e014a"; // Updated to match map theme

//   // Group sessions by region (stable across renders)
//   const regionGroups: RegionGroup[] = useMemo(() => {
//     const map = new Map<string, RegionGroup>();

//     for (const s of sessions) {
//       const id = s.region_id ?? "__unknown__";
//       const name = s.region_name ?? "Unknown Region";
//       const existing = map.get(id);
//       if (existing) {
//         existing.sessions.push(s);
//         if (s.created_at > existing.latest) existing.latest = s.created_at;
//       } else {
//         map.set(id, {
//           id,
//           name,
//           sessions: [s],
//           latest: s.created_at ?? 0,
//         });
//       }
//     }

//     // Sort sessions in each group (newest first)
//     for (const g of map.values()) {
//       g.sessions.sort((a, b) => b.created_at - a.created_at);
//     }

//     // Sort groups: alphabetical by name, Unknown last
//     const groups = Array.from(map.values());
//     groups.sort((a, b) => {
//       const aUnknown = a.id === "__unknown__";
//       const bUnknown = b.id === "__unknown__";
//       if (aUnknown && !bUnknown) return 1;
//       if (!aUnknown && bUnknown) return -1;
//       return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
//     });

//     return groups;
//   }, [sessions]);

//   // Toggle a single open region; ensures only one expanded at a time
//   const toggleRegion = (id: string) => {
//     setOpenRegionId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <div className="flex h-screen" style={{ backgroundColor: THEME }}>
//       {/* Mobile Toggle */}
//       <Button
//         aria-label="Toggle sidebar"
//         variant="outline"
//         size="icon"
//         className="fixed top-4 left-4 z-50 md:hidden bg-white/90 shadow-lg backdrop-blur"
//         onClick={() => setIsSidebarOpen((v) => !v)}
//       >
//         {isSidebarOpen ? <X className="w-4 h-4" /> : <AlignJustify className="w-4 h-4" />}
//       </Button>

//       {/* Sidebar - Always Open on Desktop */}
//       <aside
//         className={[
//           "w-72",
//           `bg-[${THEME}] backdrop-blur border-r border-gray-200/10 flex flex-col fixed inset-y-0 left-0`,
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full",
//           "md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-30 shadow-xl",
//         ].join(" ")}
//         aria-label="Sidebar navigation"
//         style={{ backgroundColor: THEME }}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-white/10">
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-semibold text-white">DRC</span>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className={`flex-1 flex flex-col p-3`} style={{ backgroundColor: THEME }}>
//           {/* Main Navigation Items */}
//           <ul className="space-y-1 flex-shrink-0">
//             {navItems.map((item, index) => {
//               const Icon = item.icon as any;
//               const isActive = location.pathname.startsWith(item.route);

//               const baseBtn = "group relative w-full h-11 rounded-xl transition-all overflow-hidden";
//               const activeClasses = isActive ? "bg-white/10 text-white" : "text-white hover:bg-white/10";

//               return (
//                 <li key={index}>
//                   <Link
//                     to={item.route}
//                     onClick={closeMobileSidebar}
//                     className={`${baseBtn} ${activeClasses} pl-3 pr-2 flex items-center gap-3`}
//                   >
//                     <span
//                       className={[
//                         "absolute left-0 top-0 h-full w-1 rounded-r",
//                         isActive ? "bg-gradient-to-b from-blue-600 to-cyan-500" : "bg-transparent",
//                       ].join(" ")}
//                     />
//                     <Icon className="w-5 h-5" />
//                     <span className="font-medium text-sm truncate">{item.label}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>

//           {/* Sessions grouped by region */}
//           <div className="mt-6">
//             <div className="px-5 mb-2 flex items-center justify-between">
//               <h2 className="text-xs font-semibold text-white uppercase">Previous Chats</h2>
//             </div>

//             {/* Scroll container */}
//             <div className="h-96 overflow-y-auto space-y-1 px-2 border border-white/10 rounded-lg mx-2 bg-white/5">
//               {regionGroups.length === 0 && (
//                 <div className="text-xs text-white/50 text-center py-4">No previous chats</div>
//               )}

//               {regionGroups.map((group) => (
//                 <div key={group.id} className="rounded-lg">
//                   {/* Region header */}
//                   <button
//                     onClick={() => toggleRegion(group.id)}
//                     aria-expanded={openRegionId === group.id}
//                     className="w-full text-left group flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors"
//                   >
//                     <div className="flex items-center gap-2">
//                       <MapIcon className="w-4 h-4" />
//                       <span className="text-sm font-semibold text-white truncate">{group.name}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-white/70">{group.sessions.length}</span>
//                       <ChevronDown
//                         className={`w-4 h-4 transition-transform ${openRegionId === group.id ? "rotate-180" : ""}`}
//                       />
//                     </div>
//                   </button>

//                   {/* Only the expanded region reveals its chats */}
//                   {openRegionId === group.id && (
//                     <div className="mt-1 space-y-1 pb-2">
//                       {group.sessions.map((session) => (
//                         <button
//                           key={session.session_id}
//                           onClick={() => handleSessionClick(session)}
//                           className="w-full text-left group flex flex-col p-3 hover:bg-white/10 rounded-lg transition-colors"
//                         >
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-white truncate">
//                               {session.region_name || "Unnamed Region"}
//                             </span>
//                             <span className="text-xs text-white/70">{formatDate(session.created_at)}</span>
//                           </div>
//                           <span className="text-xs text-white/50 truncate">{session.region_id ?? "no-region"}</span>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </nav>

//         {/* User Profile */}
//         <div className="p-4 border-t border-white/10 flex-shrink-0" style={{ backgroundColor: THEME }}>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-between h-12 hover:bg-white/10 rounded-xl text-white"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full grid place-items-center shadow">
//                     <span className="text-white font-bold text-sm">
//                       {user?.studentProfile?.firstName?.charAt(0) || "U"}
//                     </span>
//                   </div>
//                   <div className="text-left">
//                     <p className="font-medium text-white text-sm leading-tight truncate">
//                       {user?.studentProfile?.firstName} {user?.studentProfile?.lastName || "User"}
//                     </p>
//                     <p className="text-white/70 text-xs truncate">
//                       {user?.studentProfile?.role || "Admin"}
//                     </p>
//                   </div>
//                 </div>
//                 <ChevronDown className="w-4 h-4 text-white/70" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuItem
//                 onClick={() => {
//                   logout();
//                   closeMobileSidebar();
//                 }}
//                 className="text-red-600 focus:text-red-600"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Top Header (hidden for map pages) */}
//         {location.pathname !== "/dashboard/map" &&
//           !location.pathname.startsWith("/dashboard/chat/") && (
//             <header className="border-b border-white/10 px-6 py-4 shadow-sm" style={{ backgroundColor: THEME }}>
//               <div className="flex items-center justify-between">
//                 <h1 className="text-2xl font-bold text-white md:ml-0 ml-12">{titleFromPath()}</h1>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Logout
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem
//                       onClick={() => {
//                         logout();
//                         closeMobileSidebar();
//                       }}
//                       className="text-red-600 focus:text-red-600"
//                     >
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Confirm Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </header>
//           )}

//         {/* Page Content */}
//         <main className="flex-1 overflow-auto text-white" style={{ backgroundColor: THEME }}>
//           <Outlet />
//         </main>
//       </div>

//       {/* Mobile Overlay */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/40 z-20 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//           aria-hidden="true"
//         />
//       )}
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  ChevronDown,
  X,
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
import { getAllSessions } from "@/api";
import { formatDistanceToNow } from "date-fns";

interface Session {
  session_id: string;
  created_at: number;
  region_name: string | null;
  region_id: string | null;
}

interface RegionGroup {
  id: string; // region_id or "__unknown__"
  name: string; // region_name or fallback
  sessions: Session[];
  latest: number; // latest created_at in the group
}

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile only
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openRegionId, setOpenRegionId] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Map", icon: MapIcon, route: "/dashboard/map" },
  ];

  // Close mobile drawer on route change + ESC to close
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
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleSessionClick = (session: Session) => {
    // Navigate to map page with session parameters to open split view
    navigate(
      `/dashboard/map?sessionId=${session.session_id}&regionId=${session.region_id}&regionName=${session.region_name}`
    );
  };

  const THEME = "#2e014a"; // Updated to match map theme

  // Group sessions by region (stable across renders)
  const regionGroups: RegionGroup[] = useMemo(() => {
    const map = new Map<string, RegionGroup>();

    for (const s of sessions) {
      const id = s.region_id ?? "__unknown__";
      const name = s.region_name ?? "Unknown Region";
      const existing = map.get(id);
      if (existing) {
        existing.sessions.push(s);
        if (s.created_at > existing.latest) existing.latest = s.created_at;
      } else {
        map.set(id, {
          id,
          name,
          sessions: [s],
          latest: s.created_at ?? 0,
        });
      }
    }

    // Sort sessions in each group (newest first)
    for (const g of map.values()) {
      g.sessions.sort((a, b) => b.created_at - a.created_at);
    }

    // Sort groups: alphabetical by name, Unknown last
    const groups = Array.from(map.values());
    groups.sort((a, b) => {
      const aUnknown = a.id === "__unknown__";
      const bUnknown = b.id === "__unknown__";
      if (aUnknown && !bUnknown) return 1;
      if (!aUnknown && bUnknown) return -1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    return groups;
  }, [sessions]);

  // Toggle a single open region; ensures only one expanded at a time
  const toggleRegion = (id: string) => {
    setOpenRegionId((prev) => (prev === id ? null : id));
  };

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
          "w-72",
          `bg-[${THEME}] backdrop-blur border-r border-gray-200/10 flex flex-col fixed inset-y-0 left-0`,
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-30 shadow-xl",
        ].join(" ")}
        aria-label="Sidebar navigation"
        style={{ backgroundColor: THEME }}
      >
        {/* Header */}
        {/* <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">DRC</span>
          </div>
        </div> */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
  <div className="flex items-center gap-2">
    <a
      href="/dashboard/map"
      className="text-sm font-semibold text-white hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-sm"
      aria-label="Go to home"
    >
      DRC
    </a>
  </div>
</div>

        {/* Navigation */}
        <nav className={`flex-1 flex flex-col p-3`} style={{ backgroundColor: THEME }}>
          {/* Main Navigation Items */}
          <ul className="space-y-1 flex-shrink-0">
            {navItems.map((item, index) => {
              const Icon = item.icon as any;
              const isActive = location.pathname.startsWith(item.route);

              const baseBtn = "group relative w-full h-11 rounded-xl transition-all overflow-hidden";
              const activeClasses = isActive ? "bg-white/10 text-white" : "text-white hover:bg-white/10";

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
                    <span className="font-medium text-sm truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sessions grouped by region */}
          <div className="mt-6">
            <div className="px-5 mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-white uppercase">Previous Chats</h2>
            </div>

            {/* Scroll container */}
            <div className="h-96 overflow-y-auto space-y-1 px-2 border border-white/10 rounded-lg mx-2 bg-white/5">
              {regionGroups.length === 0 && (
                <div className="text-xs text-white/50 text-center py-4">No previous chats</div>
              )}

              {regionGroups.map((group) => (
                <div key={group.id} className="rounded-lg">
                  {/* Region header */}
                  <button
                    onClick={() => toggleRegion(group.id)}
                    aria-expanded={openRegionId === group.id}
                    className="w-full text-left group flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white truncate">{group.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70">{group.sessions.length}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform text-white/80 ${openRegionId === group.id ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Only the expanded region reveals its chats */}
                  {openRegionId === group.id && (
                    <div className="mt-1 space-y-1 pb-2">
                      {group.sessions.map((session) => (
                        <button
                          key={session.session_id}
                          onClick={() => handleSessionClick(session)}
                          className="w-full text-left group flex flex-col p-3 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-white truncate">
                              {session.region_name || "Unnamed Region"}
                            </span>
                            <span className="text-xs text-white/70">{formatDate(session.created_at)}</span>
                          </div>
                          <span className="text-xs text-white/50 truncate">{session.region_id ?? "no-region"}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
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
