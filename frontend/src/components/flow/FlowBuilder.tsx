import React, { useState, useCallback } from "react";
import { ReactFlowProvider, useNodesState, useEdgesState } from "reactflow";
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
  Play,
  LogOut,
} from "lucide-react";
import FlowPalette from "./FlowPalette";
import FlowCanvas from "./FlowCanvas";
import SimulationPanel from "../project/SimulationPanel";
import { useAsgardeo } from "@asgardeo/react";

interface FlowBuilderProps {
  projectName?: string;
  onBack?: () => void;
  onSave?: (data: any) => void;
}

const FlowBuilderContent: React.FC<FlowBuilderProps> = ({
  projectName = "Untitled API Project",
  onBack,
  onSave,
}) => {
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

  const handleSimulation = useCallback(() => {
    setIsSimulating(!isSimulating);
    // TODO: Implement actual simulation logic
  }, [isSimulating]);

  const handleSave = useCallback(() => {
    const projectData = {
      name: projectName,
      nodes: nodes,
      edges: edges,
      timestamp: new Date().toISOString(),
    };

    if (onSave) {
      onSave(projectData);
    } else {
      localStorage.setItem("flow-builder-project", JSON.stringify(projectData));
      console.log("Project saved to localStorage");
    }
  }, [projectName, onSave, nodes, edges]);

  const handleExport = useCallback(() => {
    const projectData = {
      name: projectName,
      nodes: nodes,
      edges: edges,
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
  }, [projectName, nodes, edges]);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="h-16 bg-card/70 border-b border-border flex items-center justify-between px-6 backdrop-blur-md shadow-md">
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
                    REST API Flow
                  </Badge>
                  <span>• React Flow Editor</span>
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

            <Button
              onClick={() => signOut()}
              className="bg-transparent border border-primary/90 text-primary hover:bg-primary/10 transition-colors"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Component Palette */}
          {showComponentPalette ? (
            <div className="relative">
              <FlowPalette />
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
                className="absolute top-2 left-0 z-30 bg-card border border-border rounded-r px-1 py-2 hover:bg-muted transition-colors"
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
