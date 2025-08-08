import { useEffect, useState } from "react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  AlignJustify, 
  ChevronDown, 
  X, 
  MessageCircle , 
  LogOut,
  Map
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Logo from "../../assets/images/auxplutes.png"

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { label: "Map", icon: Map, route: "/dashboard/map" },
    { label: "Previous Sessions", icon: MessageCircle , route: "/dashboard/sessions" },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Function to close mobile sidebar when navigation item is clicked
  const closeMobileSidebar = () => {
    setIsSidebarOpen(false)
  }

  // close the sidebar when user at dashboard/tickets/:id or map page
  useEffect(() => {
    if ( location.pathname === '/dashboard/map') {
      setIsCollapsed(true)
    }
  }, [location.pathname])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-4 h-4" /> : <AlignJustify className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-30 shadow-lg`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <img src={Logo} alt="AuxPlutes Logo" className="h-8 w-auto" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex hover:bg-gray-100"
          >
            <AlignJustify className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <TooltipProvider>
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.route
              
              return (
                isCollapsed ? (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`w-full justify-center px-0 h-12 transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-blue-800 hover:bg-blue-50'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        asChild
                      >
                        <Link to={item.route} onClick={closeMobileSidebar}>
                          <Icon className="w-5 h-5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`w-full justify-start h-12 transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-blue-800 hover:bg-blue-50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    asChild
                  >
                    <Link to={item.route} onClick={closeMobileSidebar}>
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </Button>
                )
              )
            })}
          </TooltipProvider>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start'} h-12 hover:bg-gray-50`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.studentProfile?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <>
                      <div className="flex-1 text-left flex flex-col justify-center">
                        <p className="font-medium text-gray-900 text-sm truncate">
                          {user?.studentProfile?.firstName} {user?.studentProfile?.lastName || 'User'}
                        </p>
                        <p className="text-gray-500 text-xs truncate"> {user?.studentProfile?.role || 'Admin'} </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => {
                  logout()
                  closeMobileSidebar()
                }} 
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        {location.pathname !== '/dashboard/map' && location.pathname !== '/dashboard/google-map' && (
          <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900 md:ml-0 ml-12">
                  {(() => {
                    const pathParts = location.pathname.split('/')
                    const baseRoute = `/${pathParts[1]}`
                    const subRoute = pathParts[2]
                    const id = pathParts[3]

                    if (id) {
                      return `${id}`
                    }
                    
                    return navItems.find(item => item.route === location.pathname)?.label || 'Dashboard'
                  })()}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
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
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}