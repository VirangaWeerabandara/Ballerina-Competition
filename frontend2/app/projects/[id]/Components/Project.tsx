'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  Globe, 
  Server, 
  Cloud, 
  Cpu, 
  Network, 
  Move, 
  Square, 
  Circle, 
  Type, 
  Link, 
  Play, 
  Settings 
} from 'lucide-react';

const ProjectwithID = () => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);
  const canvasRef = useRef(null);

  const apis = [
    { id: 'rest', name: 'REST API', icon: Globe, color: 'bg-orange-100 text-orange-600' },
    { id: 'graphql', name: 'GraphQL', icon: Database, color: 'bg-orange-100 text-orange-600' },
    { id: 'websocket', name: 'WebSocket', icon: Network, color: 'bg-orange-100 text-orange-600' },
    { id: 'grpc', name: 'gRPC', icon: Server, color: 'bg-orange-100 text-orange-600' },
    { id: 'cloud', name: 'Cloud API', icon: Cloud, color: 'bg-orange-100 text-orange-600' },
    { id: 'microservice', name: 'Microservice', icon: Cpu, color: 'bg-orange-100 text-orange-600' }
  ];

  const tools = [
    { id: 'endpoint', name: 'Endpoint', icon: Square, color: 'bg-orange-500' },
    { id: 'database', name: 'Database', icon: Database, color: 'bg-orange-600' },
    { id: 'service', name: 'Service', icon: Circle, color: 'bg-orange-500' },
    { id: 'text', name: 'Text', icon: Type, color: 'bg-orange-400' },
    { id: 'connector', name: 'Connector', icon: Link, color: 'bg-orange-600' }
  ];

  // Canvas panning
  const handleMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - canvasPosition.x, y: e.clientY - canvasPosition.y });
    }
  }, [canvasPosition]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasScale(prev => Math.max(0.1, Math.min(3, prev * delta)));
  }, []);

  // Tool drag and drop
  const handleToolDragStart = (e, tool) => {
    setDraggedElement(tool);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    if (draggedElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - canvasPosition.x) / canvasScale;
      const y = (e.clientY - rect.top - canvasPosition.y) / canvasScale;
      
      const newElement = {
        id: Date.now(),
        type: draggedElement.id,
        name: draggedElement.name,
        x,
        y,
        color: draggedElement.color,
        icon: draggedElement.icon
      };
      
      setCanvasElements(prev => [...prev, newElement]);
      setDraggedElement(null);
    }
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden">
      {/* Left Sidebar - APIs */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${leftSidebarOpen ? 'w-64' : 'w-12'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          {leftSidebarOpen && <h2 className="font-semibold text-gray-800">APIs</h2>}
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {leftSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
        
        {leftSidebarOpen && (
          <div className="flex-1 p-4 space-y-2">
            {apis.map((api) => {
              const IconComponent = api.icon;
              return (
                <div
                  key={api.id}
                  onClick={() => setSelectedAPI(api)}
                  className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedAPI?.id === api.id ? 'ring-2 ring-orange-500' : ''
                  } ${api.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent size={20} />
                    <span className="font-medium">{api.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full cursor-move bg-gray-50 relative"
          style={{
            backgroundImage: `
              radial-gradient(circle, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: `${20 * canvasScale}px ${20 * canvasScale}px`,
            backgroundPosition: `${canvasPosition.x}px ${canvasPosition.y}px`
          }}
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
        >
          {/* Canvas Elements */}
          <div
            style={{
              transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
              transformOrigin: '0 0'
            }}
          >
            {canvasElements.map((element) => {
              const IconComponent = element.icon;
              return (
                <div
                  key={element.id}
                  className={`absolute p-4 rounded-lg shadow-lg bg-white border-2 cursor-move select-none`}
                  style={{
                    left: element.x,
                    top: element.y,
                    borderColor: '#f97316' // orange-500
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent size={24} className="text-gray-600" />
                    <span className="font-medium text-gray-800">{element.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Canvas Info */}
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow text-sm text-gray-600">
            Zoom: {Math.round(canvasScale * 100)}% | Position: ({Math.round(canvasPosition.x)}, {Math.round(canvasPosition.y)})
          </div>

          {/* Selected API Info */}
          {selectedAPI && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <div className="flex items-center space-x-3 mb-2">
                <selectedAPI.icon size={24} className="text-gray-600" />
                <h3 className="font-semibold">{selectedAPI.name}</h3>
              </div>
              <p className="text-sm text-gray-600">
                Drag tools from the right panel to start building your API architecture.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Tools */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${rightSidebarOpen ? 'w-64' : 'w-12'} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {rightSidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          {rightSidebarOpen && <h2 className="font-semibold text-gray-800">Tools</h2>}
        </div>
        
        {rightSidebarOpen && (
          <div className="flex-1 p-4 space-y-3">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Components</h3>
              {tools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    draggable
                    onDragStart={(e) => handleToolDragStart(e, tool)}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-grab hover:bg-gray-50 border border-gray-200 mb-2 transition-all hover:shadow-sm"
                  >
                    <div className={`p-2 rounded ${tool.color} text-white`}>
                      <IconComponent size={16} />
                    </div>
                    <span className="font-medium text-gray-700">{tool.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Actions</h3>
              <button className="w-full flex items-center space-x-2 p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors mb-2">
                <Play size={16} />
                <span>Run Simulation</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 bg-orange-400 text-white rounded hover:bg-orange-500 transition-colors">
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectwithID;