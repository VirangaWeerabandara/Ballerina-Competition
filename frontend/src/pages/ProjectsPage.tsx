import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Calendar,
  ExternalLink,
  Menu,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@asgardeo/react";
import CreateProjectModal, {
  ProjectType,
} from "@/components/project/CreateProjectModal";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  endpoints: number;
}

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const mockProjects: Project[] = [
    {
      id: "1",
      title: "E-commerce API",
      description: "Complete REST API for online store with payment processing",
      category: "E-commerce",
      date: "2 hours ago",
      endpoints: 24,
    },
    {
      id: "2",
      title: "User Management System",
      description: "Authentication and user management services",
      category: "Auth",
      date: "1 day ago",
      endpoints: 12,
    },
    {
      id: "3",
      title: "Payment Gateway Integration",
      description: "Secure payment processing API with multiple providers",
      category: "Finance",
      date: "3 days ago",
      endpoints: 8,
    },
    {
      id: "4",
      title: "Social Media API",
      description: "Posts, comments, likes and social interaction features",
      category: "Social",
      date: "1 week ago",
      endpoints: 18,
    },
    {
      id: "5",
      title: "IoT Data Collector",
      description: "Real-time sensor data aggregation and processing",
      category: "IoT",
      date: "2 weeks ago",
      endpoints: 6,
    },
    {
      id: "6",
      title: "Analytics Dashboard API",
      description: "Business intelligence and reporting services",
      category: "Analytics",
      date: "1 month ago",
      endpoints: 15,
    },
  ];

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleProjectSubmit = (data: {
    name: string;
    type: ProjectType;
    template: string;
  }) => {
    // Create new project and navigate to editor
    const newProjectId = `project_${Date.now()}`;
    console.log("Creating project:", data);
    navigate(
      `/projects/editor/${newProjectId}?name=${encodeURIComponent(
        data.name
      )}&type=${data.type}&template=${data.template}`
    );
    setIsCreateModalOpen(false);
  };

  const handleProjectClick = (projectId: string) => {
    // Navigate to project editor
    navigate(`/projects/editor/${projectId}`);
  };

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="w-96">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Access Required</h1>
              <p className="text-muted-foreground mb-6">
                You need to sign in to access your projects.
              </p>
              <SignInButton className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Sign In to Continue
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="bg-card border-b border-border">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt="OneBlock" className="h-8 w-8" />
                    <span className="text-xl font-bold text-foreground">
                      OneBlock
                    </span>
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-medium">Projects</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  My Projects
                </h1>
                <p className="text-muted-foreground">
                  Manage and monitor your API projects
                </p>
              </div>

              <Button
                onClick={handleCreateProject}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 group"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-2">
                          {project.category}
                        </Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.date}</span>
                      </div>
                      <span>{project.endpoints} endpoints</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "No projects found" : "No projects yet"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Try adjusting your search terms."
                    : "Create your first project to get started."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={handleCreateProject}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                )}
              </div>
            )}
          </main>

          {/* Create Project Modal */}
          <CreateProjectModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleProjectSubmit}
          />
        </div>
      </SignedIn>
    </>
  );
};

export default ProjectsPage;
