"use client";
import { JSX, useState } from "react";
import {
  MousePointer,
  Hand,
  Minus,
  Square,
  Circle,
  Type,
  Code,
} from "lucide-react";

type ToolType =
  | "select"
  | "pan"
  | "line"
  | "rectangle"
  | "circle"
  | "text"
  | "code";

interface Props {
  onSelectTool: (tool: ToolType) => void;
}

const tools: { type: ToolType; icon: JSX.Element; label: string }[] = [
  { type: "select", icon: <MousePointer size={18} />, label: "Select" },
  { type: "pan", icon: <Hand size={18} />, label: "Pan" },
  { type: "line", icon: <Minus size={18} />, label: "Line" },
  { type: "rectangle", icon: <Square size={18} />, label: "Rectangle" },
  { type: "circle", icon: <Circle size={18} />, label: "Circle" },
  { type: "text", icon: <Type size={18} />, label: "Text" },
  { type: "code", icon: <Code size={18} />, label: "Code View" },
];

export default function CanvasToolbar({ onSelectTool }: Props) {
  const [activeTool, setActiveTool] = useState<ToolType>("select");

  const handleClick = (tool: ToolType) => {
    setActiveTool(tool);
    onSelectTool(tool);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#2d2d2d] text-white rounded-lg shadow-md px-3 py-2 flex space-x-3 z-50">
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => handleClick(tool.type)}
          title={tool.label}
          className={`p-2 rounded-md hover:bg-[#444] ${
            activeTool === tool.type ? "bg-blue-600" : ""
          }`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}
