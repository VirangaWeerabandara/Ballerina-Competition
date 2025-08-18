import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import { Card, CardContent } from "@/components/ui/card";
import FlowBuilder from "@/components/flow/FlowBuilder";

interface ProjectData {
  id: string;
  name: string;
  type: "rest-api" | "graphql" | "websocket";
  template: string;
}

const ProjectEditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData>({
    id: projectId || "new",
    name: "Untitled API Project",
    type: "rest-api",
    template: "basic-crud",
  });

  // Load project data (in a real app, this would fetch from an API)
  useEffect(() => {
    if (projectId && projectId !== "new") {
      // Simulate loading project data
      const mockProject: ProjectData = {
        id: projectId,
        name: "E-commerce API",
        type: "rest-api",
        template: "basic-crud",
      };
      setProject(mockProject);
    }
  }, [projectId]);

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
          onBack={handleBack}
          onSave={handleSave}
        />
      </SignedIn>
    </>
  );
};

export default ProjectEditorPage;
