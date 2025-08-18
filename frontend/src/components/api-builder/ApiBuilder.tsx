import React, { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Share,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Download,
} from "lucide-react";
import ComponentPalette from "./ComponentPalette";
import ApiCanvas from "./ApiCanvas";
import SimulationPanel from "./SimulationPanel";
import { CanvasComponent, Connection, APIComponent } from "@/types/api-builder";
import { getComponentById } from "@/data/api-components";
import { useSimulation } from "@/hooks/useSimulation";

interface ApiBuilderProps {
  projectName?: string;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const ApiBuilder: React.FC<ApiBuilderProps> = ({
  projectName = "Untitled API Project",
  onBack,
  onSave,
}) => {
  // Canvas state
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  // UI state
  const [showComponentPalette, setShowComponentPalette] = useState(true);
  const [showSimulationPanel, setShowSimulationPanel] = useState(true);

  // Drag state
  const [draggedComponent, setDraggedComponent] = useState<APIComponent | null>(
    null
  );

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Handle drag over for better debugging
  const handleDragOver = useCallback((event: DragOverEvent) => {
    console.log("🔄 Drag over:", { over: event.over?.id });
  }, []);

  // Simulation
  const {
    simulation,
    startSimulation,
    stopSimulation,
    resetSimulation,
    setSpeed,
  } = useSimulation(components, connections);

  // Component management
  const handleComponentMove = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setComponents((prev) =>
        prev.map((comp) =>
          comp.instanceId === id ? { ...comp, position } : comp
        )
      );
    },
    []
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    console.log("🚀 Drag started:", active.data.current);
    if (active.data.current?.type === "component") {
      setDraggedComponent(active.data.current.component);
    }
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over, delta } = event;

      console.log("🎯 Drag ended:", {
        active: active.id,
        over: over?.id,
        delta,
      });
      setDraggedComponent(null);

      if (!over) {
        console.log("❌ No drop target");
        return;
      }

      // Handle dropping new component from palette onto canvas
      if (
        active.data.current?.type === "component" &&
        over.id === "api-canvas"
      ) {
        console.log("✅ Dropping new component on canvas");
        const component = active.data.current.component as APIComponent;
        const canvasElement = document.getElementById("api-canvas");

        if (canvasElement) {
          const rect = canvasElement.getBoundingClientRect();
          // Calculate position based on drop location or fallback to grid
          let x, y;

          if (
            event.activatorEvent &&
            "clientX" in event.activatorEvent &&
            "clientY" in event.activatorEvent
          ) {
            // Use actual mouse position if available
            const mouseEvent = event.activatorEvent as MouseEvent;
            x = Math.max(10, mouseEvent.clientX - rect.left - 100);
            y = Math.max(10, mouseEvent.clientY - rect.top - 60);
          } else {
            // Fallback to grid positioning
            const componentsCount = components.length;
            x = 100 + (componentsCount % 4) * 220;
            y = 100 + Math.floor(componentsCount / 4) * 140;
          }

          const newCanvasComponent: CanvasComponent = {
            ...component,
            instanceId: `${component.id}_${Date.now()}`,
            position: { x, y },
            size: { width: 200, height: 120 },
          };

          console.log("📦 Adding component to canvas:", newCanvasComponent);
          setComponents((prev) => {
            const newComponents = [...prev, newCanvasComponent];
            console.log("📋 Updated components array:", newComponents);
            return newComponents;
          });
        }
      }
      // Handle moving existing component within canvas
      else if (
        active.data.current?.type === "canvas-component" &&
        over.id === "api-canvas" &&
        delta
      ) {
        console.log("🔄 Moving existing component");
        const componentId = active.id as string;
        const currentComponent = components.find(
          (c) => c.instanceId === componentId
        );

        if (currentComponent) {
          const newX = currentComponent.position.x + delta.x;
          const newY = currentComponent.position.y + delta.y;

          console.log("📍 Moving component to:", { x: newX, y: newY });
          handleComponentMove(componentId, { x: newX, y: newY });
        }
      } else {
        console.log("❌ Invalid drop:", {
          type: active.data.current?.type,
          target: over.id,
        });
      }
    },
    [components, handleComponentMove]
  );

  const handleComponentDelete = useCallback(
    (id: string) => {
      setComponents((prev) => prev.filter((comp) => comp.instanceId !== id));
      setConnections((prev) =>
        prev.filter((conn) => conn.sourceId !== id && conn.targetId !== id)
      );
      if (selectedComponent === id) {
        setSelectedComponent(null);
      }
    },
    [selectedComponent]
  );

  const handleComponentSelect = useCallback((id: string | null) => {
    setSelectedComponent(id);
  }, []);

  // Connection management
  const handleConnectionAdd = useCallback((connection: Connection) => {
    setConnections((prev) => [...prev, connection]);
  }, []);

  const handleConnectionDelete = useCallback((id: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  }, []);

  // Save project
  const handleSave = useCallback(() => {
    const projectData = {
      name: projectName,
      components,
      connections,
      timestamp: new Date().toISOString(),
    };

    if (onSave) {
      onSave(projectData);
    } else {
      // Default save behavior - could save to localStorage
      localStorage.setItem("api-builder-project", JSON.stringify(projectData));
      console.log("Project saved to localStorage");
    }
  }, [projectName, components, connections, onSave]);

  // Export project
  const handleExport = useCallback(() => {
    const projectData = {
      name: projectName,
      components,
      connections,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [projectName, components, connections]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-semibold">{projectName}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    REST API
                  </Badge>
                  <span>• {components.length} components</span>
                  <span>• {connections.length} connections</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          {showComponentPalette ? (
            <div className="relative">
              <ComponentPalette />
              <button
                className="absolute top-2 right-0 z-30 bg-card border border-border rounded-l px-1 py-2 hover:bg-muted transition-colors"
                style={{ transform: "translateX(100%)" }}
                onClick={() => setShowComponentPalette(false)}
                aria-label="Hide component palette"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="w-6 h-full flex items-center justify-center bg-card border-r border-border hover:bg-muted transition-colors"
              onClick={() => setShowComponentPalette(true)}
              aria-label="Show component palette"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Canvas */}
          <div id="api-canvas" className="flex-1">
            <ApiCanvas
              components={components}
              connections={connections}
              selectedComponent={selectedComponent}
              onComponentAdd={() => {}} // Handled by drag and drop
              onComponentMove={handleComponentMove}
              onComponentDelete={handleComponentDelete}
              onComponentSelect={handleComponentSelect}
              onConnectionAdd={handleConnectionAdd}
              onConnectionDelete={handleConnectionDelete}
              onSimulate={startSimulation}
              isSimulating={simulation.isRunning}
            />
          </div>

          {/* Simulation Panel */}
          {showSimulationPanel ? (
            <div className="relative">
              <button
                className="absolute top-2 left-0 z-30 bg-card border border-border rounded-r px-1 py-2 hover:bg-muted transition-colors"
                style={{ transform: "translateX(-100%)" }}
                onClick={() => setShowSimulationPanel(false)}
                aria-label="Hide simulation panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <SimulationPanel
                components={components}
                connections={connections}
                simulation={simulation}
                onStart={startSimulation}
                onStop={stopSimulation}
                onReset={resetSimulation}
                onSpeedChange={setSpeed}
              />
            </div>
          ) : (
            <button
              className="w-6 h-full flex items-center justify-center bg-card border-l border-border hover:bg-muted transition-colors"
              onClick={() => setShowSimulationPanel(true)}
              aria-label="Show simulation panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-card border-t border-border flex items-center justify-between px-6 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Components: {components.length}</span>
            <span>Connections: {connections.length}</span>
            <span>Selected: {selectedComponent ? "Yes" : "None"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Status: {simulation.isRunning ? "Simulating" : "Ready"}</span>
            <span>Last saved: Just now</span>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {draggedComponent && (
          <div className="bg-card border-2 border-primary rounded-lg p-3 shadow-lg opacity-90">
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded ${draggedComponent.color} text-white flex items-center justify-center`}
              >
                {/* Icon would go here */}
              </div>
              <span className="font-medium">{draggedComponent.name}</span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default ApiBuilder;
