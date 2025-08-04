"use client";

import React, { useState, ReactNode } from 'react';
import { Menu, X, Search, User, LucideIcon, CirclePlus, Folders, Store, MessagesSquare } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  current: boolean;
}

interface LayoutProps {
  children?: ReactNode;
  onCreateNewClick: () => void;
}

const ProjectsLayout: React.FC<LayoutProps> = ({ children, onCreateNewClick }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navigation: NavigationItem[] = [
    { name: 'Projects', href: '/projects', icon: Folders, current: true },
    { name: 'Marketplace', href: '/', icon: Store, current: false },
    { name: 'Community', href: '/about', icon: MessagesSquare, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {/* SVG Logo */}
                <img src="/logo/logo.svg" alt="Icon" className="justify-center-safe" />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item: NavigationItem) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-4 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-orange-50 text-orange-500 border-r-2 border-orange-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 w-5 h-5 ${
                    item.current ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500 truncate">john@example.com</p>
              </div>
            </div>
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
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children || (
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h1>
                  <p className="text-gray-600 mb-6">
                    This is a responsive layout template for your Next.js application. 
                    The sidebar collapses on mobile devices and can be toggled with the menu button.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Responsive Design</h3>
                      <p className="text-blue-700 text-sm">
                        The layout automatically adapts to different screen sizes.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Tailwind CSS</h3>
                      <p className="text-green-700 text-sm">
                        Styled with utility-first CSS framework for rapid development.
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-900 mb-2">Next.js Ready</h3>
                      <p className="text-purple-700 text-sm">
                        Built specifically for Next.js applications with proper routing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsLayout;