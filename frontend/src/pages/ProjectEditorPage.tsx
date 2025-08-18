import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAsgardeo,
} from "@asgardeo/react";
import { Card, CardContent } from "@/components/ui/card";
import FlowBuilder from "@/components/flow/FlowBuilder";

import exampleProjectData, { ProjectData } from "@/data/exampleProjectData";

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
      // Fetch project from backend
      const fetchProject = async () => {
        try {
          const BACKEND_BASE_URL = import.meta.env
            .VITE_BACKEND_BASE_URL as string;
          const res = await fetch(
            `${BACKEND_BASE_URL}/projects/byId?projectId=${encodeURIComponent(
              projectId
            )}`
          );
          const data = await res.json();
          if (data && data.project) {
            const p = data.project;
            setProject({
              id: p.projectId,
              name: p.title,
              type:
                p.projectType === "RESTApi"
                  ? "rest-api"
                  : p.projectType === "GraphQL"
                  ? "graphql"
                  : "websocket",
              template: p.blockLayout?.template || "",
              nodes: p.blockLayout?.nodes || [],
              edges: p.blockLayout?.edges || [],
            });
          }
        } catch (e) {
          // fallback: show empty project
          setProject({
            id: projectId,
            name: "Untitled API Project",
            type: "rest-api",
            template: "basic-crud",
            nodes: [],
            edges: [],
          });
        }
      };
      fetchProject();
    }
  }, [projectId, location.search]);

  const { user } = useAsgardeo();
  const handleSave = async (projectData: any) => {
    console.log("Saving project:", projectData);
    // Save to backend
    try {
      const userEmail = user?.email || "";
      // Use the name and isShared from the FlowBuilder (projectData)
      const payload = {
        projectId: project.id,
        email: userEmail,
        title: projectData.name, // Use the name from FlowBuilder
        projectType:
          project.type === "rest-api"
            ? "RESTApi"
            : project.type === "graphql"
            ? "GraphQL"
            : "WebSocket",
        isShared: projectData.isShared ?? false, // Use isShared from FlowBuilder
        blockLayout: {
          description: projectData.description || "",
          endpoints: (projectData.nodes || []).map(
            (n: any) => n.data?.label || n.id
          ),
          nodes: projectData.nodes,
          edges: projectData.edges,
        },
      };
      const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;
      const res = await fetch(`${BACKEND_BASE_URL}/projects/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        console.log("Project saved to backend");
      } else {
        const err = await res.json();
        console.error("Failed to save project:", err.error || res.statusText);
      }
    } catch (e) {
      console.error("Error saving project:", e);
    }
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
