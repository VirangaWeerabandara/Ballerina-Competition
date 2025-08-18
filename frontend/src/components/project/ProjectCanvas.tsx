import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Play,
  MoreVertical,
  Globe,
  Database,
  MessageSquare,
  Server,
  Users,
  Lock,
  Zap,
  Settings,
  CloudRain,
} from "lucide-react";
import { BlockType } from "./ComponentSidebar";

export interface CanvasBlock extends BlockType {
  id: string;
  instanceId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  fromBlockId: string;
  fromPort: number;
  toBlockId: string;
  toPort: number;
}

interface ProjectCanvasProps {
  blocks: CanvasBlock[];
  connections: Connection[];
  onBlockAdd: (block: CanvasBlock) => void;
  onBlockUpdate: (blockId: string, updates: Partial<CanvasBlock>) => void;
  onBlockDelete: (blockId: string) => void;
  onConnectionAdd: (connection: Connection) => void;
  onConnectionDelete: (connectionId: string) => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

const ProjectCanvas: React.FC<ProjectCanvasProps & { showGrid?: boolean }> = ({
  blocks,
  connections,
  onBlockAdd,
  onBlockUpdate,
  onBlockDelete,
  onConnectionAdd,
  onConnectionDelete,
  onSimulate,
  isSimulating,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedBlock, setDraggedBlock] = useState<CanvasBlock | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{
    blockId: string;
    port: number;
  } | null>(null);
  // Pan/zoom state
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOrigin, setPanOrigin] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);

  // Function to reconstruct the icon from the block id
  const getIconForBlock = (blockId: string): React.ReactNode => {
    switch (blockId) {
      case "get-endpoint":
      case "post-endpoint":
      case "put-endpoint":
      case "delete-endpoint":
        return <Globe className="w-4 h-4" />;
      case "database":
      case "query-resolver":
      case "mutation-resolver":
      case "subscription-resolver":
        return <Database className="w-4 h-4" />;
      case "auth":
        return <Lock className="w-4 h-4" />;
      case "cache":
      case "event-handler":
        return <Zap className="w-4 h-4" />;
      case "external-api":
        return <CloudRain className="w-4 h-4" />;
      case "middleware":
      case "schema":
        return <Settings className="w-4 h-4" />;
      case "websocket-server":
        return <Server className="w-4 h-4" />;
      case "room-manager":
        return <Users className="w-4 h-4" />;
      case "broadcast":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  // Fix: Allow drop by preventing default and stopping propagation
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      console.log("🎯 DROP EVENT RECEIVED in ProjectCanvas!");
      e.preventDefault();
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      try {
        // Try to get data from multiple formats
        let dataString =
          e.dataTransfer.getData("application/json") ||
          e.dataTransfer.getData("text/plain") ||
          e.dataTransfer.getData("application/x-block-data");

        if (!dataString) {
          console.error("No drag data found");
          return;
        }

        const serializableBlockData = JSON.parse(dataString);

        // Reconstruct the full BlockType with icon
        const blockData: BlockType = {
          ...serializableBlockData,
          icon: getIconForBlock(serializableBlockData.id),
        };

        // Adjust for pan/zoom
        const x = (e.clientX - rect.left - canvasOffset.x) / scale - 75;
        const y = (e.clientY - rect.top - canvasOffset.y) / scale - 40;
        const newBlock: CanvasBlock = {
          ...blockData,
          instanceId: `${blockData.id}_${Date.now()}`,
          x,
          y,
          width: 150,
          height: 80,
        };
        console.log("✅ Adding block to canvas:", newBlock);
        onBlockAdd(newBlock);
        setIsDragOver(false);
        console.log("✅ Block add completed!");
      } catch (error) {
        console.error("Error parsing dropped data:", error);
        setIsDragOver(false);
      }
    },
    [onBlockAdd, canvasOffset, scale]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    console.log("Drag over canvas - effect set to copy");
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    console.log("Drag enter canvas");
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragOver to false if we're actually leaving the canvas area
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const isOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;
      if (isOutside) {
        setIsDragOver(false);
      }
    }
  }, []);

  const handleBlockMouseDown = (block: CanvasBlock, e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // Only drag from the block itself, not children

    setDraggedBlock(block);
    setIsDragging(true);
    setSelectedBlock(block.instanceId);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left - canvasOffset.x - block.x * scale,
        y: e.clientY - rect.top - canvasOffset.y - block.y * scale,
      });
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging && draggedBlock && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        // Adjust for pan/zoom
        const newX =
          (e.clientX - rect.left - canvasOffset.x - dragOffset.x) / scale;
        const newY =
          (e.clientY - rect.top - canvasOffset.y - dragOffset.y) / scale;
        onBlockUpdate(draggedBlock.instanceId, { x: newX, y: newY });
      } else if (isPanning) {
        const dx = e.clientX - panStart.x;
        const dy = e.clientY - panStart.y;
        setCanvasOffset({
          x: panOrigin.x + dx,
          y: panOrigin.y + dy,
        });
      }
    },
    [
      isDragging,
      draggedBlock,
      dragOffset,
      onBlockUpdate,
      isPanning,
      panStart,
      panOrigin,
      scale,
      canvasOffset,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedBlock(null);
    setIsPanning(false);
  }, []);

  // Enhanced pan handling for middle mouse button and empty canvas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if not clicking on a block and using middle mouse button or clicking on empty canvas
    if (e.target === canvasRef.current || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanOrigin({ ...canvasOffset });
    }
  };

  // Handle middle mouse button down specifically
  const handleCanvasMouseDownMiddle = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      setPanOrigin({ ...canvasOffset });
    }
  };

  // Zoom with wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    let newScale = scale + scaleAmount;
    newScale = Math.max(0.2, Math.min(2.5, newScale));
    setScale(newScale);
  };

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "0":
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setScale(1);
          setCanvasOffset({ x: 0, y: 0 });
        }
        break;
      case "Home":
        e.preventDefault();
        setCanvasOffset({ x: 0, y: 0 });
        setScale(1);
        break;
      case "Escape":
        setIsConnecting(false);
        setConnectionStart(null);
        setSelectedBlock(null);
        break;
    }
  }, []);

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handlePortClick = (
    blockId: string,
    portIndex: number,
    isOutput: boolean
  ) => {
    if (!isConnecting) {
      if (isOutput) {
        setIsConnecting(true);
        setConnectionStart({ blockId, port: portIndex });
      }
    } else {
      if (!isOutput && connectionStart) {
        const newConnection: Connection = {
          id: `conn_${Date.now()}`,
          fromBlockId: connectionStart.blockId,
          fromPort: connectionStart.port,
          toBlockId: blockId,
          toPort: portIndex,
        };
        onConnectionAdd(newConnection);
      }
      setIsConnecting(false);
      setConnectionStart(null);
    }
  };

  const renderConnectionLines = () => {
    return connections.map((connection) => {
      const fromBlock = blocks.find(
        (b) => b.instanceId === connection.fromBlockId
      );
      const toBlock = blocks.find((b) => b.instanceId === connection.toBlockId);

      if (!fromBlock || !toBlock) return null;

      // Calculate port positions relative to block
      const fromPortY =
        (fromBlock.height / (fromBlock.outputs + 1)) *
        (connection.fromPort + 1);
      const toPortY =
        (toBlock.height / (toBlock.inputs + 1)) * (connection.toPort + 1);

      // Adjust for pan/zoom
      const fromX = (fromBlock.x + fromBlock.width) * scale + canvasOffset.x;
      const fromY = (fromBlock.y + fromPortY) * scale + canvasOffset.y;
      const toX = toBlock.x * scale + canvasOffset.x;
      const toY = (toBlock.y + toPortY) * scale + canvasOffset.y;

      return (
        <svg
          key={connection.id}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1, width: "100%", height: "100%" }}
        >
          <path
            d={`M ${fromX} ${fromY} C ${fromX + 50 * scale} ${fromY} ${
              toX - 50 * scale
            } ${toY} ${toX} ${toY}`}
            stroke="hsl(var(--primary))"
            strokeWidth={2 * scale}
            fill="none"
            className="drop-shadow-sm"
          />
        </svg>
      );
    });
  };

  const renderBlock = (block: CanvasBlock) => {
    const isSelected = selectedBlock === block.instanceId;
    // Adjust for pan/zoom
    const left = block.x * scale + canvasOffset.x;
    const top = block.y * scale + canvasOffset.y;
    const width = block.width * scale;
    const height = block.height * scale;

    return (
      <div
        key={block.instanceId}
        className={`absolute cursor-move transition-all ${
          isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
        }`}
        style={{
          left,
          top,
          width,
          height,
          zIndex: isSelected ? 10 : 2,
        }}
        onMouseDown={(e) => handleBlockMouseDown(block, e)}
      >
        <Card className="h-full border-2">
          <CardContent className="p-3 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded ${block.color} text-white flex items-center justify-center`}
                >
                  {block.icon}
                </div>
                <span className="font-medium text-sm truncate">
                  {block.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlockDelete(block.instanceId);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-between">
              {/* Input ports */}
              <div className="flex flex-col space-y-1">
                {Array.from({ length: block.inputs }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-background border-2 border-muted rounded-full cursor-pointer hover:border-primary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(block.instanceId, i, false);
                    }}
                  />
                ))}
              </div>

              {/* Output ports */}
              <div className="flex flex-col space-y-1">
                {Array.from({ length: block.outputs }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-primary border-2 border-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(block.instanceId, i, true);
                    }}
                  />
                ))}
              </div>
            </div>

            <Badge variant="outline" className="text-xs mt-1 self-center">
              {block.category}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div
      className="flex-1 relative overflow-hidden bg-background"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ pointerEvents: "auto" }}
    >
      {/* Top toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
          <span className="font-medium">Controls:</span>
          <span className="ml-2">🖱️ Middle drag to pan</span>
          <span className="ml-2">🔍 Scroll to zoom</span>
          <span className="ml-2">⌨️ Ctrl+0 to reset</span>
        </div>
        <Button
          onClick={onSimulate}
          disabled={isSimulating || blocks.length === 0}
          className="bg-primary hover:bg-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          {isSimulating ? "Simulating..." : "Simulate"}
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative select-none transition-all ${
          isDragOver ? "bg-primary/5 ring-2 ring-primary ring-inset" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onClick={() => setSelectedBlock(null)}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        style={{
          pointerEvents: "auto",
          cursor: isPanning ? "grabbing" : isDragOver ? "copy" : "default",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        {/* Grid background */}
        {showGrid && (
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(120,120,120,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120,120,120,0.4) 1px, transparent 1px),
                linear-gradient(rgba(120,120,120,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(120,120,120,0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${24 * scale}px ${24 * scale}px, ${
                24 * scale
              }px ${24 * scale}px, ${120 * scale}px ${120 * scale}px, ${
                120 * scale
              }px ${120 * scale}px`,
              backgroundPosition: `${canvasOffset.x % (24 * scale)}px ${
                canvasOffset.y % (24 * scale)
              }px, ${canvasOffset.x % (24 * scale)}px ${
                canvasOffset.y % (24 * scale)
              }px, ${canvasOffset.x % (120 * scale)}px ${
                canvasOffset.y % (120 * scale)
              }px, ${canvasOffset.x % (120 * scale)}px ${
                canvasOffset.y % (120 * scale)
              }px`,
            }}
          />
        )}

        {/* Pan indicator */}
        {isPanning && (
          <div className="absolute top-4 left-4 z-20">
            <Badge
              variant="secondary"
              className="bg-muted-foreground text-muted"
            >
              Panning... Release to stop
            </Badge>
          </div>
        )}

        {/* Connection lines */}
        {renderConnectionLines()}

        {/* Blocks */}
        {blocks.map(renderBlock)}

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MoreVertical className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Start Building Your Service
              </h3>
              <p className="text-muted-foreground">
                Drag components from the sidebar to start designing your backend
                service
              </p>
            </div>
          </div>
        )}

        {/* Connection helper */}
        {isConnecting && (
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="default" className="bg-primary">
              Connecting... Click on an input port to complete
            </Badge>
          </div>
        )}

        {/* Drop zone indicator */}
        {isDragOver && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="bg-primary/10 border-2 border-dashed border-primary rounded-lg p-8 text-center">
              <div className="text-primary font-semibold text-lg mb-2">
                Drop Component Here
              </div>
              <div className="text-primary/70 text-sm">
                Release to add component to canvas
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCanvas;
