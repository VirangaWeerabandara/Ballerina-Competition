'use client';
import React, { useRef, useState, useEffect, use } from "react";
import CanvasToolbar from "./canvasinteractiontoolbar";

type Tool =
  | "select"
  | "pan"
  | "line"
  | "rectangle"
  | "circle"
  | "text"
  | "code";

interface Node {
  id: number;
  x: number;
  y: number;
  label: string;
}

let nodeId = 0;

const CanvasInteractionTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [draggingNodeId, setDraggingNodeId] = useState<number | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });

  useEffect(() => {
    drawCanvas();
  }, [nodes, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset.x, offset.y);

    nodes.forEach((node) => {
      ctx.fillStyle = "#ffa94d";
      ctx.fillRect(node.x, node.y, 100, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "14px sans-serif";
      ctx.fillText(node.label, node.x + 10, node.y + 30);
    });

    ctx.restore();
  };

  const getMousePos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left || 0) - offset.x,
      y: e.clientY - (rect?.top || 0) - offset.y,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);

    if (tool === "select") {
      const node = nodes.find(
        (n) => x >= n.x && x <= n.x + 100 && y >= n.y && y <= n.y + 50
      );
      if (node) setDraggingNodeId(node.id);
    } else if (tool === "pan") {
      setIsPanning(true);
      setLastPan({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tool === "pan" && isPanning) {
      const dx = e.clientX - lastPan.x;
      const dy = e.clientY - lastPan.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPan({ x: e.clientX, y: e.clientY });
    }

    if (tool === "select" && draggingNodeId !== null) {
      const { x, y } = getMousePos(e);
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId ? { ...n, x, y } : n
        )
      );
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);
    const newNode: Node = {
      id: ++nodeId,
      x,
      y,
      label: `API ${nodeId}`,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  return (

      <CanvasToolbar onSelectTool={setTool} />

  );
};

export default CanvasInteractionTool;
