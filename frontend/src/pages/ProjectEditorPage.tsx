import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import { Card, CardContent } from "@/components/ui/card";
import FlowBuilder from "@/components/flow/FlowBuilder";

import { Node, Edge } from "reactflow";

interface ProjectData {
  id: string;
  name: string;
  type: "rest-api" | "graphql" | "websocket";
  template: string;
  nodes?: Node[];
  edges?: Edge[];
}

const exampleProjectData: Record<string, ProjectData> = {
  example_chatbot: {
    id: "example_chatbot",
    name: "Chatbot API",
    type: "rest-api",
    template: "chatbot-template",
    nodes: [
      {
        id: "1",
        type: "apiNode",
        position: { x: 100, y: 200 },
        data: {
          label: "GET /chat",
          type: "endpoint-get",
          category: "Endpoints",
          description: "Get chat messages",
          icon: "Download",
          color: "bg-blue-400",
          inputs: 0,
          outputs: 1,
        },
      },
      {
        id: "2",
        type: "apiNode",
        position: { x: 350, y: 200 },
        data: {
          label: "POST /chat",
          type: "endpoint-post",
          category: "Endpoints",
          description: "Send chat message",
          icon: "Upload",
          color: "bg-green-400",
          inputs: 0,
          outputs: 1,
        },
      },
      {
        id: "3",
        type: "apiNode",
        position: { x: 600, y: 200 },
        data: {
          label: "AI Bot Logic",
          type: "external-api",
          category: "External",
          description: "Bot response logic",
          icon: "Bot",
          color: "bg-purple-400",
          inputs: 1,
          outputs: 1,
        },
      },
    ],
    edges: [
      {
        id: "e1-3",
        source: "1",
        target: "3",
        sourceHandle: "output-0",
        targetHandle: "input-0",
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        sourceHandle: "output-0",
        targetHandle: "input-0",
      },
    ],
  },
  example_weather: {
    id: "example_weather",
    name: "Weather Data Service",
    type: "rest-api",
    template: "weather-template",
    nodes: [
      {
        id: "1",
        type: "apiNode",
        position: { x: 100, y: 200 },
        data: {
          label: "GET /weather",
          type: "endpoint-get",
          category: "Endpoints",
          description: "Get weather info",
          icon: "Download",
          color: "bg-blue-400",
          inputs: 0,
          outputs: 1,
        },
      },
      {
        id: "2",
        type: "apiNode",
        position: { x: 350, y: 200 },
        data: {
          label: "Weather API",
          type: "external-api",
          category: "External",
          description: "External weather provider",
          icon: "Cloud",
          color: "bg-cyan-400",
          inputs: 1,
          outputs: 1,
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        sourceHandle: "output-0",
        targetHandle: "input-0",
      },
    ],
  },
  example_blog: {
    id: "example_blog",
    name: "Blog Platform API",
    type: "rest-api",
    template: "blog-template",
    nodes: [
      {
        id: "1",
        type: "apiNode",
        position: { x: 100, y: 200 },
        data: {
          label: "GET /posts",
          type: "endpoint-get",
          category: "Endpoints",
          description: "Get blog posts",
          icon: "Download",
          color: "bg-blue-400",
          inputs: 0,
          outputs: 1,
        },
      },
      {
        id: "2",
        type: "apiNode",
        position: { x: 350, y: 200 },
        data: {
          label: "POST /posts",
          type: "endpoint-post",
          category: "Endpoints",
          description: "Create blog post",
          icon: "Upload",
          color: "bg-green-400",
          inputs: 0,
          outputs: 1,
        },
      },
      {
        id: "3",
        type: "apiNode",
        position: { x: 600, y: 200 },
        data: {
          label: "Database",
          type: "database",
          category: "Database",
          description: "Blog DB",
          icon: "Database",
          color: "bg-yellow-400",
          inputs: 2,
          outputs: 1,
        },
      },
    ],
    edges: [
      {
        id: "e1-3",
        source: "1",
        target: "3",
        sourceHandle: "output-0",
        targetHandle: "input-0",
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        sourceHandle: "output-0",
        targetHandle: "input-1",
      },
    ],
  },
};

const ProjectEditorPage = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to get query params
  function getQueryParam(param: string) {
    return new URLSearchParams(location.search).get(param);
  }

  const [project, setProject] = useState<ProjectData>({
    id: projectId || "new",
    name: "Untitled API Project",
    type: "rest-api",
    template: "basic-crud",
    nodes: [],
    edges: [],
  });

  // Load project data or example data
  useEffect(() => {
    const isExample = getQueryParam("example") === "true";
    if (isExample && projectId && exampleProjectData[projectId]) {
      setProject(exampleProjectData[projectId]);
    } else if (projectId && projectId !== "new") {
      // Simulate loading project data
      const mockProject: ProjectData = {
        id: projectId,
        name: "E-commerce API",
        type: "rest-api",
        template: "basic-crud",
      };
      setProject(mockProject);
    }
  }, [projectId, location.search]);

  const handleSave = (projectData: any) => {
    console.log("Saving project:", projectData);
    // Here you would typically save to your backend
    // For now, we'll just save to localStorage
    localStorage.setItem(`project_${project.id}`, JSON.stringify(projectData));
  };

  const handleBack = () => {
    navigate("/projects");
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
        <FlowBuilder
          projectName={project.name}
          initialNodes={project.nodes}
          initialEdges={project.edges}
          onBack={handleBack}
          onSave={handleSave}
        />
      </SignedIn>
    </>
  );
};

export default ProjectEditorPage;
