'use client';
import React, { useState, ReactNode } from 'react';
import { Menu, X, Search, User, LucideIcon, CirclePlus, Folders, Store, MessagesSquare, Icon, LogOut } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current: boolean;
}

interface ApiRouteItem {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  status?: 'active' | 'inactive' | 'testing';
}

interface CanvasElement {
  id: string;
  type: 'endpoint' | 'database' | 'service';
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
}

interface LayoutProps {
  children?: ReactNode;
  onCreateNewClick: () => void;
}

const ProjectsLayout: React.FC<LayoutProps> = ({ children, onCreateNewClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set(['users', 'products']));
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [canvasPosition, setCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("User signed out");
  };

  const navigation: NavigationItem[] = [
    { name: 'Projects', href: '/projects', icon: Folders, current: currentPage === 'projects' },
    { name: 'Marketplace', href: '/marketplace', icon: Store, current: false },
    { name: 'Community', href: '/community', icon: MessagesSquare, current: false },
  ];

  const mockProjects: Project[] = [
    { id: '1', name: 'E-commerce API', description: 'Complete REST API for online store', lastModified: '2 hours ago', endpoints: 24 },
    { id: '2', name: 'User Management', description: 'Authentication and user services', lastModified: '1 day ago', endpoints: 12 },
    { id: '3', name: 'Payment Gateway', description: 'Payment processing API', lastModified: '3 days ago', endpoints: 8 },
    { id: '4', name: 'Social Media API', description: 'Posts, comments, and social features', lastModified: '1 week ago', endpoints: 18 },
    { id: '5', name: 'IoT Data Collector', description: 'Sensor data aggregation API', lastModified: '2 weeks ago', endpoints: 6 },
    { id: '6', name: 'Analytics Dashboard', description: 'Business intelligence API', lastModified: '1 month ago', endpoints: 15 },
  ];

  const apiRoutes: { [key: string]: ApiRouteItem[] } = {
    users: [
      { id: '1', name: 'Get Users', method: 'GET', path: '/api/users', status: 'active' },
      { id: '2', name: 'Create User', method: 'POST', path: '/api/users', status: 'active' },
      { id: '3', name: 'Update User', method: 'PUT', path: '/api/users/:id', status: 'testing' },
      { id: '4', name: 'Delete User', method: 'DELETE', path: '/api/users/:id', status: 'inactive' }
    ],
    products: [
      { id: '5', name: 'Get Products', method: 'GET', path: '/api/products', status: 'active' },
      { id: '6', name: 'Create Product', method: 'POST', path: '/api/products', status: 'active' },
      { id: '7', name: 'Update Product', method: 'PATCH', path: '/api/products/:id', status: 'testing' }
    ],
    orders: [
      { id: '8', name: 'Get Orders', method: 'GET', path: '/api/orders', status: 'active' },
      { id: '9', name: 'Create Order', method: 'POST', path: '/api/orders', status: 'testing' }
    ]
  };

  const canvasElements: CanvasElement[] = [
    { id: '1', type: 'endpoint', x: 200, y: 150, width: 150, height: 80, data: { method: 'GET', path: '/users', name: 'Get Users' } },
    { id: '2', type: 'database', x: 500, y: 200, width: 120, height: 100, data: { name: 'Users DB', type: 'PostgreSQL' } },
    { id: '3', type: 'service', x: 300, y: 350, width: 140, height: 90, data: { name: 'Auth Service', type: 'Microservice' } },
  ];

  const toggleRouteExpansion = (routeGroup: string) => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeGroup)) {
      newExpanded.delete(routeGroup);
    } else {
      newExpanded.add(routeGroup);
    }
    setExpandedRoutes(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-700 bg-green-100 border-green-200';
      case 'POST': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'PUT': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'PATCH': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'DELETE': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCanvasElement = (element: CanvasElement) => {
    const baseClasses = "absolute border-2 rounded-lg shadow-md cursor-move transition-all hover:shadow-lg";
    
    switch (element.type) {
      case 'endpoint':
        return (
          <div
            key={element.id}
            className={`${baseClasses} bg-blue-50 border-blue-300`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            <div className="p-3 h-full flex flex-col justify-center">
              <div className={`text-xs font-medium px-2 py-1 rounded mb-1 ${getMethodColor(element.data.method)}`}>
                {element.data.method}
              </div>
              <div className="text-sm font-semibold text-gray-800">{element.data.name}</div>
              <div className="text-xs text-gray-600 font-mono">{element.data.path}</div>
            </div>
          </div>
        );
      case 'database':
        return (
          <div
            key={element.id}
            className={`${baseClasses} bg-green-50 border-green-300`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            <div className="p-3 h-full flex flex-col justify-center items-center">
              <Database className="w-8 h-8 text-green-600 mb-2" />
              <div className="text-sm font-semibold text-gray-800 text-center">{element.data.name}</div>
              <div className="text-xs text-gray-600">{element.data.type}</div>
            </div>
          </div>
        );
      case 'service':
        return (
          <div
            key={element.id}
            className={`${baseClasses} bg-purple-50 border-purple-300`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
            }}
          >
            <div className="p-3 h-full flex flex-col justify-center items-center">
              <Settings className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-sm font-semibold text-gray-800 text-center">{element.data.name}</div>
              <div className="text-xs text-gray-600">{element.data.type}</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Projects Page
  if (currentPage === 'projects') {
    return (
      <div className="min-h-screen bg-orange-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">oneBlok</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4">
              <div className="space-y-2">
                {navigation.map((item: NavigationItem) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        item.current
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                      }`}
                    >
                      <Icon className={`mr-3 w-5 h-5 ${
                        item.current ? 'text-white' : 'text-gray-500'
                      }`} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-orange-100 text-orange-700">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">John Doe</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:pl-56">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                  <p className="text-sm text-gray-600">Manage your projects here</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                {/* Create New */}
                <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </button>
              </div>
            </div>
          </header>

          {/* Projects Grid */}
          <main className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-orange-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <Code2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-xs text-gray-500">{project.lastModified}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{project.endpoints} endpoints</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Canvas Page (API Simulator)
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-lg transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">oneBlok</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-2">
              {navigation.map((item: NavigationItem) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      item.current
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                    }`}
                  >
                    <Icon className={`mr-3 w-5 h-5 ${
                      item.current ? 'text-white' : 'text-gray-500'
                    }`} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={()=>{}}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer w-full">
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john@example.com</p>
                </div>
              </div>

              <LogOut onClick={handleSignOut} className="w-5 h-5 text-gray-400 hover:text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* pagetext */}
              <div className="flex-col items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900">Projects</h1>
                <p className="text-sm text-gray-500">Manage your projects here</p>
              </div>

              {/* Header actions */}
              <div className="flex items-center space-x-4">
                {/* Search bar */}
                <div className="flex-1 max-w-lg mx-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                </div>
                
                {/* create new button */}
                <button className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-400 transition-colors"
                  onClick={onCreateNewClick}
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium px-2">Create New</span>
                    <CirclePlus className="w-4 h-4" />
                  </div>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Save className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Infinite Canvas */}
            <div className="flex-1 relative overflow-hidden bg-gray-50">
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: `${canvasPosition.x}px ${canvasPosition.y}px`
                }}
              />
              
              {/* Canvas Elements */}
              <div 
                className="absolute inset-0"
                style={{
                  transform: `scale(${canvasZoom / 100}) translate(${canvasPosition.x}px, ${canvasPosition.y}px)`,
                  transformOrigin: '0 0'
                }}
              >
                {canvasElements.map(renderCanvasElement)}
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                  <line x1="350" y1="190" x2="500" y2="240" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="275" y1="230" x2="300" y2="350" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              </div>
              
              {/* Add Element Floating Button */}
              <button className="absolute top-4 left-4 bg-orange-500 text-white p-3 rounded-xl shadow-lg hover:bg-orange-600 transition-colors">
                <Route className="w-5 h-5" />
              </button>
            </div>

            {/* Canvas Tools Bar */}
            <div className="bg-gray-600 text-white px-6 py-3">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-2">
                  <MousePointer className="w-4 h-4" />
                  <span className="text-sm">Select</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Move className="w-4 h-4" />
                  <span className="text-sm">Move</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Element</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Route className="w-4 h-4" />
                  <span className="text-sm">Connect</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Project Tools */}
          <div className={`${rightSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-gray-100 flex-shrink-0`}>
            <div className="w-80 h-full flex flex-col">
              <div className="p-6 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Project tools</h2>
                  <button
                    onClick={() => setRightSidebarOpen(false)}
                    className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                <div className="space-y-3">
                  {Object.entries(apiRoutes).map(([routeGroup, routes]) => (
                    <div key={routeGroup} className="bg-white rounded-xl border border-gray-200 shadow-sm">
                      <button
                        onClick={() => toggleRouteExpansion(routeGroup)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-t-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <Database className="w-5 h-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 capitalize">{routeGroup}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {routes.length}
                          </span>
                        </div>
                        {expandedRoutes.has(routeGroup) ? 
                          <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      
                      {expandedRoutes.has(routeGroup) && (
                        <div className="border-t border-gray-200">
                          {routes.map((route) => (
                            <div key={route.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded border ${getMethodColor(route.method)}`}>
                                  {route.method}
                                </span>
                                {route.status && (
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(route.status)}`}>
                                    {route.status}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 mb-1">{route.name}</p>
                              <p className="text-xs text-gray-500 font-mono">{route.path}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Element Library */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Element Library</h3>
                  <div className="space-y-2">
                    <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Route className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">API Endpoint</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Database</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200 cursor-pointer hover:border-orange-300 hover:bg-orange-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">Service</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Right Sidebar Button (when closed) */}
      {!rightSidebarOpen && (
        <button
          onClick={() => setRightSidebarOpen(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-30"
        >
          <Settings className="w-5 h-5" />
          
</button>
      )}
    </div>
  );
};

export default ProjectsLayout;
