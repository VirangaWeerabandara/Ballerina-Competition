import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Play,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Shield,
  Globe,
  Timer,
  FileText,
  Database,
  Zap,
  ExternalLink,
  Webhook,
  CheckCircle,
  RotateCcw as Transform,
  HardDrive,
  Mail,
  Bell,
  Layers,
} from "lucide-react";
import { CanvasComponent, Connection } from "@/types/api-builder";

const iconMap = {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Shield,
  Globe,
  Timer,
  FileText,
  Database,
  Zap,
  ExternalLink,
  Webhook,
  CheckCircle,
  RotateCcw: Transform,
  HardDrive,
  Mail,
  Bell,
  Layers,
};

interface CanvasComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onPortClick: (
    componentId: string,
    portIndex: number,
    isOutput: boolean
  ) => void;
  connections: Connection[];
  scale: number;
}

const CanvasComponentItem: React.FC<CanvasComponentProps> = ({
  component,
  isSelected,
  onSelect,
  onDelete,
  onMove,
  onPortClick,
  connections,
  scale,
}) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: component.instanceId,
      data: {
        type: "canvas-component",
        component,
      },
    });

  const IconComponent =
    iconMap[component.icon as keyof typeof iconMap] || Database;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(component.instanceId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(component.instanceId);
  };

  const style = {
    left: component.position.x * scale,
    top: component.position.y * scale,
    width: component.size.width * scale,
    height: component.size.height * scale,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) ${
          isDragging ? "rotate(5deg)" : ""
        }`
      : isDragging
      ? "rotate(5deg)"
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`absolute cursor-move transition-all duration-200 ${
        isDragging ? "opacity-75 z-50" : ""
      } ${
        isSelected ? "ring-2 ring-primary shadow-lg z-10" : "hover:shadow-md"
      }`}
      style={style}
      onClick={handleClick}
    >
      <Card className="h-full border-2 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-3 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-md ${component.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
              >
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="font-medium text-sm truncate">
                {component.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Body with Ports */}
          <div className="flex-1 flex items-center justify-between">
            {/* Input Ports */}
            <div className="flex flex-col space-y-2">
              {Array.from({ length: component.inputs }).map((_, i) => {
                const hasConnection = connections.some(
                  (conn) =>
                    conn.targetId === component.instanceId &&
                    conn.targetPort === i
                );
                return (
                  <button
                    key={i}
                    className={`w-4 h-4 border-2 rounded-full transition-all hover:scale-110 ${
                      hasConnection
                        ? "bg-primary border-primary shadow-sm"
                        : "bg-background border-muted-foreground hover:border-primary hover:bg-primary/10"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPortClick(component.instanceId, i, false);
                    }}
                    title={`Input ${i + 1}${
                      hasConnection ? " (connected)" : ""
                    }`}
                  />
                );
              })}
            </div>

            {/* Component Info */}
            <div className="flex-1 text-center px-2">
              <Badge variant="outline" className="text-xs">
                {component.category}
              </Badge>
            </div>

            {/* Output Ports */}
            <div className="flex flex-col space-y-2">
              {Array.from({ length: component.outputs }).map((_, i) => {
                const hasConnection = connections.some(
                  (conn) =>
                    conn.sourceId === component.instanceId &&
                    conn.sourcePort === i
                );
                return (
                  <button
                    key={i}
                    className={`w-4 h-4 border-2 rounded-full transition-all hover:scale-110 ${
                      hasConnection
                        ? "bg-green-500 border-green-500 shadow-sm"
                        : "bg-primary border-primary hover:bg-primary/80"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPortClick(component.instanceId, i, true);
                    }}
                    title={`Output ${i + 1}${
                      hasConnection ? " (connected)" : ""
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ApiCanvasProps {
  components: CanvasComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  onComponentAdd: (component: CanvasComponent) => void;
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
  onComponentDelete: (id: string) => void;
  onComponentSelect: (id: string | null) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (id: string) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

const ApiCanvas: React.FC<ApiCanvasProps> = ({
  components,
  connections,
  selectedComponent,
  onComponentAdd,
  onComponentMove,
  onComponentDelete,
  onComponentSelect,
  onConnectionAdd,
  onConnectionDelete,
  onSimulate,
  isSimulating,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connectionMode, setConnectionMode] = useState<{
    active: boolean;
    sourceId: string;
    sourcePort: number;
  } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { setNodeRef, isOver } = useDroppable({
    id: "api-canvas",
    data: {
      type: "canvas",
    },
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onComponentSelect(null);
      setConnectionMode(null);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setConnectionMode(null);
        onComponentSelect(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onComponentSelect]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }

    // Update mouse position for connection preview
    if (connectionMode?.active && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handlePortClick = (
    componentId: string,
    portIndex: number,
    isOutput: boolean
  ) => {
    if (isOutput) {
      setConnectionMode({
        active: true,
        sourceId: componentId,
        sourcePort: portIndex,
      });
    } else if (connectionMode?.active) {
      // Create connection
      const newConnection: Connection = {
        id: `conn_${Date.now()}`,
        sourceId: connectionMode.sourceId,
        sourcePort: connectionMode.sourcePort,
        targetId: componentId,
        targetPort: portIndex,
      };
      onConnectionAdd(newConnection);
      setConnectionMode(null);
    }
  };

  const resetView = () => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const renderConnections = () => {
    return connections.map((connection) => {
      const sourceComponent = components.find(
        (c) => c.instanceId === connection.sourceId
      );
      const targetComponent = components.find(
        (c) => c.instanceId === connection.targetId
      );

      if (!sourceComponent || !targetComponent) return null;

      // Calculate exact port positions
      const sourcePortY =
        sourceComponent.position.y + 45 + connection.sourcePort * 20; // Header + port spacing
      const targetPortY =
        targetComponent.position.y + 45 + connection.targetPort * 20;

      const sourceX = sourceComponent.position.x + sourceComponent.size.width;
      const sourceY = sourcePortY;
      const targetX = targetComponent.position.x;
      const targetY = targetPortY;

      const midX = (sourceX + targetX) / 2;

      return (
        <g key={connection.id}>
          <path
            d={`M ${sourceX * scale + panOffset.x} ${
              sourceY * scale + panOffset.y
            } 
                C ${midX * scale + panOffset.x} ${
              sourceY * scale + panOffset.y
            } 
                  ${midX * scale + panOffset.x} ${
              targetY * scale + panOffset.y
            } 
                  ${targetX * scale + panOffset.x} ${
              targetY * scale + panOffset.y
            }`}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="none"
            className="drop-shadow-sm"
            style={{ pointerEvents: "stroke", cursor: "pointer" }}
            onClick={() => onConnectionDelete(connection.id)}
          />
          {/* Connection arrowhead */}
          <polygon
            points={`${targetX * scale + panOffset.x - 6},${
              targetY * scale + panOffset.y - 3
            } ${targetX * scale + panOffset.x},${
              targetY * scale + panOffset.y
            } ${targetX * scale + panOffset.x - 6},${
              targetY * scale + panOffset.y + 3
            }`}
            fill="hsl(var(--primary))"
          />
          {/* Source dot */}
          <circle
            cx={sourceX * scale + panOffset.x}
            cy={sourceY * scale + panOffset.y}
            r={3}
            fill="hsl(var(--primary))"
          />
        </g>
      );
    });
  };

  return (
    <div
      className="flex-1 relative overflow-hidden bg-background"
      ref={setNodeRef}
      style={{ minHeight: "100%" }}
    >
      {/* Debug drop zone indicator */}
      <div className="absolute top-2 left-2 z-50 bg-red-500 text-white px-2 py-1 text-xs rounded">
        Drop Zone: {isOver ? "ACTIVE" : "inactive"}
      </div>

      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm border rounded-lg px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((prev) => Math.min(3, prev * 1.2))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs font-mono px-2">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((prev) => Math.max(0.1, prev * 0.8))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={onSimulate}
          disabled={isSimulating || components.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          {isSimulating ? "Simulating..." : "Simulate"}
        </Button>
      </div>

      {/* Canvas */}
      <div
        id="api-canvas"
        ref={canvasRef}
        className={`w-full h-full relative transition-all ${
          isOver ? "bg-primary/5" : ""
        } ${isPanning ? "cursor-grabbing" : "cursor-default"}`}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: `
            linear-gradient(rgba(120,120,120,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,120,120,0.3) 1px, transparent 1px),
            linear-gradient(rgba(120,120,120,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,120,120,0.15) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * scale}px ${20 * scale}px, ${20 * scale}px ${
            20 * scale
          }px, ${100 * scale}px ${100 * scale}px, ${100 * scale}px ${
            100 * scale
          }px`,
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
        }}
      >
        {/* Connection Lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {renderConnections()}

          {/* Preview connection line */}
          {connectionMode?.active &&
            (() => {
              const sourceComponent = components.find(
                (c) => c.instanceId === connectionMode.sourceId
              );
              if (!sourceComponent) return null;

              const sourcePortY =
                sourceComponent.position.y +
                45 +
                connectionMode.sourcePort * 20;
              const sourceX =
                sourceComponent.position.x + sourceComponent.size.width;
              const sourceY = sourcePortY;

              return (
                <path
                  d={`M ${sourceX * scale + panOffset.x} ${
                    sourceY * scale + panOffset.y
                  } L ${mousePos.x} ${mousePos.y}`}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  fill="none"
                  opacity={0.7}
                />
              );
            })()}
        </svg>

        {/* Components */}
        <div
          style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px)` }}
        >
          {components.map((component) => (
            <CanvasComponentItem
              key={component.instanceId}
              component={component}
              isSelected={selectedComponent === component.instanceId}
              onSelect={onComponentSelect}
              onDelete={onComponentDelete}
              onMove={onComponentMove}
              onPortClick={handlePortClick}
              connections={connections}
              scale={scale}
            />
          ))}
        </div>

        {/* Empty State */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="text-center pointer-events-none">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MoreVertical className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start Building Your API
              </h3>
              <p className="text-muted-foreground max-w-md">
                Drag components from the left panel to design your REST API
                flow. Connect components to define the data flow.
              </p>
            </div>
          </div>
        )}

        {/* Connection Mode Indicator */}
        {connectionMode?.active && (
          <div className="absolute top-4 left-4 z-20 bg-orange-500 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none animate-pulse">
            <div className="text-sm font-medium">🔗 Connecting...</div>
            <div className="text-xs opacity-90">
              Click an input port to complete connection
            </div>
            <button
              className="text-xs underline mt-1 pointer-events-auto"
              onClick={() => setConnectionMode(null)}
            >
              Cancel (ESC)
            </button>
          </div>
        )}

        {/* Drop Indicator */}
        {isOver && (
          <div className="absolute inset-0 border-2 border-dashed border-primary bg-primary/5 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-primary/10 border border-primary rounded-lg p-4 pointer-events-none">
              <div className="text-primary font-medium">
                Drop component here
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiCanvas;
