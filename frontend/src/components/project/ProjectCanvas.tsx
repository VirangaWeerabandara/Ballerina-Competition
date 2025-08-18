import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Play, MoreVertical } from "lucide-react";
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

  // Fix: Allow drop by preventing default and stopping propagation
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      try {
        const blockData = JSON.parse(
          e.dataTransfer.getData("application/json")
        ) as BlockType;
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
        onBlockAdd(newBlock);
      } catch (error) {
        console.error("Error parsing dropped data:", error);
      }
    },
    [onBlockAdd, canvasOffset, scale]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  // Pan start on empty canvas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if not clicking on a block
    if (e.target === canvasRef.current) {
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

      // Adjust for pan/zoom
      const fromX = (fromBlock.x + fromBlock.width) * scale + canvasOffset.x;
      const fromY =
        (fromBlock.y + fromBlock.height / 2) * scale + canvasOffset.y;
      const toX = toBlock.x * scale + canvasOffset.x;
      const toY = (toBlock.y + toBlock.height / 2) * scale + canvasOffset.y;

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
      className="flex-1 relative overflow-hidden bg-muted/20"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top toolbar */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
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
        className="w-full h-full relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => setSelectedBlock(null)}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        style={{
          pointerEvents: "auto",
          cursor: isPanning ? "grabbing" : "default",
        }}
      >
        {/* Grid background */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * scale}px ${20 * scale}px`,
              backgroundPosition: `${canvasOffset.x % (20 * scale)}px ${
                canvasOffset.y % (20 * scale)
              }px`,
            }}
          />
        )}

        {/* Connection lines */}
        {renderConnectionLines()}

        {/* Blocks */}
        {blocks.map(renderBlock)}

        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
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
      </div>
    </div>
  );
};

export default ProjectCanvas;
