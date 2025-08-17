import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Settings, Share, Save } from "lucide-react";
import ComponentSidebar, {
  BlockType,
} from "@/components/project/ComponentSidebar";
import ProjectCanvas, {
  CanvasBlock,
  Connection,
} from "@/components/project/ProjectCanvas";
import SimulationPanel from "@/components/project/SimulationPanel";
import { ProjectType } from "@/components/project/CreateProjectModal";

interface ProjectData {
  id: string;
  name: string;
  type: ProjectType;
  template: string;
  blocks: CanvasBlock[];
  connections: Connection[];
}

const ProjectEditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData>({
    id: projectId || "new",
    name: "Untitled Project",
    type: "rest-api",
    template: "basic-crud",
    blocks: [],
    connections: [],
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load project data (in a real app, this would fetch from an API)
  useEffect(() => {
    if (projectId && projectId !== "new") {
      // Simulate loading project data
      const mockProject: ProjectData = {
        id: projectId,
        name: "E-commerce API",
        type: "rest-api",
        template: "basic-crud",
        blocks: [],
        connections: [],
      };
      setProject(mockProject);
    }
  }, [projectId]);

  const handleBlockAdd = (block: CanvasBlock) => {
    setProject((prev) => ({
      ...prev,
      blocks: [...prev.blocks, block],
    }));
  };

  const handleBlockUpdate = (
    blockId: string,
    updates: Partial<CanvasBlock>
  ) => {
    setProject((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.instanceId === blockId ? { ...block, ...updates } : block
      ),
    }));
  };

  const handleBlockDelete = (blockId: string) => {
    setProject((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.instanceId !== blockId),
      connections: prev.connections.filter(
        (conn) => conn.fromBlockId !== blockId && conn.toBlockId !== blockId
      ),
    }));
  };

  const handleConnectionAdd = (connection: Connection) => {
    setProject((prev) => ({
      ...prev,
      connections: [...prev.connections, connection],
    }));
  };

  const handleConnectionDelete = (connectionId: string) => {
    setProject((prev) => ({
      ...prev,
      connections: prev.connections.filter((conn) => conn.id !== connectionId),
    }));
  };

  const handleSimulationStart = () => {
    if (project.blocks.length === 0) {
      alert("Add some blocks to the canvas before starting simulation");
      return;
    }
    setIsSimulating(true);
  };

  const handleSimulationStop = () => {
    setIsSimulating(false);
  };

  const handleSimulationReset = () => {
    setIsSimulating(false);
    // Reset simulation state
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Project saved:", project);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (blockType: BlockType) => {
    // Handle drag start if needed
  };

  const getProjectTypeColor = (type: ProjectType) => {
    switch (type) {
      case "rest-api":
        return "bg-blue-500";
      case "graphql":
        return "bg-purple-500";
      case "websocket":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getProjectTypeName = (type: ProjectType) => {
    switch (type) {
      case "rest-api":
        return "REST API";
      case "graphql":
        return "GraphQL";
      case "websocket":
        return "WebSocket";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-96">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You need to sign in to access the project editor.
              </p>
              <SignInButton className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Sign In to Continue
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="h-screen flex flex-col bg-background">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/projects")}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </Button>

              <div className="h-6 w-px bg-border" />

              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-lg font-semibold">{project.name}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className={`text-white ${getProjectTypeColor(
                        project.type
                      )}`}
                    >
                      {getProjectTypeName(project.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Template: {project.template}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
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
            {/* Left Sidebar - Components */}
            <ComponentSidebar
              projectType={project.type}
              onDragStart={handleDragStart}
            />

            {/* Center - Canvas */}
            <ProjectCanvas
              blocks={project.blocks}
              connections={project.connections}
              onBlockAdd={handleBlockAdd}
              onBlockUpdate={handleBlockUpdate}
              onBlockDelete={handleBlockDelete}
              onConnectionAdd={handleConnectionAdd}
              onConnectionDelete={handleConnectionDelete}
              onSimulate={handleSimulationStart}
              isSimulating={isSimulating}
            />

            {/* Right Sidebar - Simulation */}
            <SimulationPanel
              blocks={project.blocks}
              connections={project.connections}
              isSimulating={isSimulating}
              onStart={handleSimulationStart}
              onStop={handleSimulationStop}
              onReset={handleSimulationReset}
            />
          </div>

          {/* Status Bar */}
          <div className="h-8 bg-card border-t border-border flex items-center justify-between px-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Blocks: {project.blocks.length}</span>
              <span>Connections: {project.connections.length}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Status: {isSimulating ? "Running" : "Stopped"}</span>
              <span>Last saved: Just now</span>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default ProjectEditorPage;
