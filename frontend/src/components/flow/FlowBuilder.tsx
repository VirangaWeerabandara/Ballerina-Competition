import React, { useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Save,
  Share,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Download,
  Play,
  LogOut,
} from "lucide-react";
import FlowPalette from "./FlowPalette";
import FlowCanvas from "./FlowCanvas";
import SimulationPanel from "../project/SimulationPanel";
import { useAsgardeo } from "@asgardeo/react";

import { Node, Edge } from "reactflow";

interface FlowBuilderProps {
  projectName?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onBack?: () => void;
  onSave?: (data: any) => void;
}

import { useEffect } from "react";
const FlowBuilderContent: React.FC<FlowBuilderProps> = ({
  projectName = "Untitled API Project",
  initialNodes = [],
  initialEdges = [],
  onBack,
  onSave,
}) => {
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Reset nodes/edges when initialNodes/initialEdges change (e.g., when loading a new example)
  useEffect(() => {
    setNodes(initialNodes || []);
  }, [JSON.stringify(initialNodes)]);
  useEffect(() => {
    setEdges(initialEdges || []);
  }, [JSON.stringify(initialEdges)]);

  // UI state
  const [showComponentPalette, setShowComponentPalette] = useState(true);
  const [showSimulationPanel, setShowSimulationPanel] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const { user, signIn, signOut, isSignedIn, isLoading } = useAsgardeo();

  // Simulation state - simplified for now
  const [simulation] = useState({
    isRunning: false,
    steps: [],
    currentStep: 0,
    speed: 1,
  });

  // Public/Private toggle state (reversed: checked = Private, unchecked = Public)
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSimulation = useCallback(() => {
    setIsSimulating(!isSimulating);
    // TODO: Implement actual simulation logic
  }, [isSimulating]);

  const handleSave = useCallback(() => {
    const projectData = {
      name: projectName,
      nodes: nodes,
      edges: edges,
      isShared: !isPrivate, // isShared is true when not private
      timestamp: new Date().toISOString(),
    };

    if (onSave) {
      onSave(projectData);
    } else {
      localStorage.setItem("flow-builder-project", JSON.stringify(projectData));
      console.log("Project saved to localStorage");
    }
    toast.success("Project saved!");
  }, [projectName, onSave, nodes, edges, isPrivate]);

  return (
    <ReactFlowProvider>
      <Toaster position="bottom-right" />
      <div className="h-screen flex flex-col bg-white/60 backdrop-blur-2xl">
        {/* Header */}
        <header className="h-16 bg-white/40 flex items-center justify-between px-6 backdrop-blur-2xl shadow-md">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center px-2 py-1 bg-transparent hover:bg-primary/10 border-none shadow-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}

            <Separator orientation="vertical" className="h-6" />

            <div className="flex items-center space-x-3">
              {/* Editable project name with badge to the right */}
              <div className="flex items-center">
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    if (typeof onSave === "function") {
                      // If parent manages projectName, call onSave with new name (optional)
                      // Otherwise, do nothing
                    } else {
                      // If local, update state (not supported in this version)
                    }
                  }}
                  onBlur={(e) => {
                    // Optionally trigger save on blur
                  }}
                  className="text-lg font-semibold bg-transparent border border-gray/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40 px-2 mr-2 w-auto min-w-[80px] max-w-[300px] truncate transition-shadow shadow-sm"
                  style={{ minWidth: 80, maxWidth: 300 }}
                  spellCheck={false}
                  readOnly={typeof onSave !== "function"}
                />
                <Badge
                  variant="outline"
                  className="ml-0 bg-white/40 text-blue-400 border-blue-300/30 backdrop-blur-sm shadow-sm px-2 py-1 text-xs font-semibold"
                >
                  REST API
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Public/Private Toggle (reversed) */}
            <div className="flex items-center mr-2">
              <Switch
                id="private-toggle"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                className="mr-2"
              />
              <label
                htmlFor="private-toggle"
                className="text-sm select-none cursor-pointer"
              >
                {isPrivate ? "Private" : "Public"}
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="flex items-center px-2 py-1 bg-transparent hover:bg-primary/10 border-none shadow-none"
            >
              <Save className="w-4 h-4 mr-1" />
              <span className="font-medium">Save</span>
            </Button>

            <Button
              onClick={() => signOut()}
              className="bg-transparent border border-primary/90 text-primary hover:bg-primary/10 transition-colors"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden bg-white/30 backdrop-blur-2xl">
          {/* Component Palette */}
          {showComponentPalette ? (
            <div className="relative">
              <FlowPalette />
              <button
                className="absolute top-2 right-0 z-30 bg-white/60 rounded-l px-1 py-2 hover:bg-muted/60 backdrop-blur-2xl transition-colors"
                style={{ transform: "translateX(100%)" }}
                onClick={() => setShowComponentPalette(false)}
                aria-label="Hide component palette"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              className="w-6 h-full flex items-center justify-center bg-white/60 hover:bg-muted/60 backdrop-blur-2xl transition-colors"
              onClick={() => setShowComponentPalette(true)}
              aria-label="Show component palette"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Canvas */}
          <div className="flex-1">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
              onSimulate={handleSimulation}
              isSimulating={isSimulating}
            />
          </div>

          {/* Simulation Panel */}
          {showSimulationPanel ? (
            <div className="relative">
              <button
                className="absolute top-2 left-0 z-30 bg-white/60 rounded-r px-1 py-2 hover:bg-muted/60 backdrop-blur-2xl transition-colors"
                style={{ transform: "translateX(-100%)" }}
                onClick={() => setShowSimulationPanel(false)}
                aria-label="Hide simulation panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <SimulationPanel
                blocks={nodes.map((node) => ({
                  instanceId: node.id,
                  id: node.data.type,
                  name: node.data.label,
                  type: node.data.type,
                  category: node.data.category,
                  description: node.data.description,
                  icon: node.data.icon,
                  color: node.data.color,
                  inputs: node.data.inputs,
                  outputs: node.data.outputs,
                  x: node.position.x,
                  y: node.position.y,
                  width: 200,
                  height: 120,
                }))}
                connections={edges.map((edge) => ({
                  id: edge.id,
                  fromBlockId: edge.source,
                  fromPort: parseInt(edge.sourceHandle?.split("-")[1] || "0"),
                  toBlockId: edge.target,
                  toPort: parseInt(edge.targetHandle?.split("-")[1] || "0"),
                }))}
                isSimulating={isSimulating}
                onStart={handleSimulation}
                onStop={handleSimulation}
                onReset={() => setIsSimulating(false)}
              />
            </div>
          ) : (
            <button
              className="w-6 h-full flex items-center justify-center bg-white/60 hover:bg-muted/60 backdrop-blur-2xl transition-colors"
              onClick={() => setShowSimulationPanel(true)}
              aria-label="Show simulation panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-white/40 flex items-center justify-between px-6 text-xs text-muted-foreground backdrop-blur-2xl">
          <div className="flex items-center space-x-4">
            <span>Powered by React Flow</span>
            <span>Status: {isSimulating ? "Simulating" : "Ready"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Auto-save enabled</span>
            <span>Last saved: Just now</span>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
};

const FlowBuilder: React.FC<FlowBuilderProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent {...props} />
    </ReactFlowProvider>
  );
};

export default FlowBuilder;
