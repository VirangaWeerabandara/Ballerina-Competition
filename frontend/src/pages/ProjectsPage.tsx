import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, ExternalLink, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
// Delete project handler

import { Link, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAsgardeo,
} from "@asgardeo/react";
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

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"my" | "examples" | "community">(
    "my"
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [communityProjects, setCommunityProjects] = useState<Project[]>([]);

  const navigate = useNavigate();
  const { signOut, user } = useAsgardeo();

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/projects/remove?projectId=${encodeURIComponent(
          projectId
        )}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
      } else {
        setError("Failed to delete project.");
      }
    } catch (err) {
      setError("Failed to delete project.");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  // Example projects (different from user's projects)
  const exampleProjects: Project[] = [
    {
      id: "example_chatbot",
      title: "Chatbot API",
      description: "Conversational AI API for customer support and FAQs.",
      category: "AI",
      date: "Example",
      endpoints: 10,
    },
    {
      id: "example_weather",
      title: "Weather Data Service",
      description: "REST API for real-time and historical weather data.",
      category: "Data",
      date: "Example",
      endpoints: 2,
    },
    {
      id: "example_blog",
      title: "Blog Platform API",
      description: "API for posts, comments, and user profiles in a blog.",
      category: "Content",
      date: "Example",
      endpoints: 3,
    },
    {
      id: "example_finance",
      title: "Enterprise Finance Suite",
      description:
        "A complex API for multi-user, multi-account finance management: transactions, accounts, budgets, analytics, audit, and admin endpoints with layered middleware and database integration.",
      category: "Finance",
      date: "Example",
      endpoints: 12,
    },
    {
      id: "example_iot",
      title: "IoT Device Manager",
      description:
        "Manage IoT devices, telemetry, and alerts. Includes endpoints for device registration, data, and control.",
      category: "IoT",
      date: "Example",
      endpoints: 4,
    },
    {
      id: "example_social",
      title: "Social Media API",
      description:
        "Endpoints for posts, likes, follows, and notifications in a social network.",
      category: "Social",
      date: "Example",
      endpoints: 5,
    },
  ];

  // Fetch projects for the logged-in user and community projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.email) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BACKEND_BASE_URL}/projects/byEmail?email=${encodeURIComponent(
            user.email
          )}`
        );
        const data = await res.json();
        if (data.projects) {
          setProjects(
            data.projects.map((p: any) => ({
              id: p.projectId,
              title: p.title,
              description: p.blockLayout?.description || "No description",
              category: p.projectType,
              date: "Recently",
              endpoints: Array.isArray(p.blockLayout?.endpoints)
                ? p.blockLayout.endpoints.length
                : 0,
            }))
          );
        } else {
          setProjects([]);
        }
      } catch (err) {
        setError("Failed to load projects.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCommunityProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_BASE_URL}/projects/shared`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setCommunityProjects(
            data.map((p: any) => ({
              id: p.projectId,
              title: p.title,
              description: p.blockLayout?.description || "No description",
              category: p.projectType,
              date: "Shared",
              endpoints: Array.isArray(p.blockLayout?.endpoints)
                ? p.blockLayout.endpoints.length
                : 0,
            }))
          );
        } else {
          setCommunityProjects([]);
        }
      } catch (err) {
        setError("Failed to load community projects.");
        setCommunityProjects([]);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "my" && user?.email) {
      fetchProjects();
    } else if (activeTab === "community") {
      fetchCommunityProjects();
    }
  }, [activeTab, user?.email]);

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommunityProjects = communityProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleProjectClick = (projectId: string) => {
    // Only navigate if the project still exists in the list (prevents navigation after delete)
    const exists = projects.some((p) => p.id === projectId);
    if (exists) {
      navigate(`/projects/editor/${projectId}`);
    }
  };

  // Handle clicking an example project
  const handleExampleClick = (example: Project) => {
    // Pass example=true and exampleId for the editor to load the example
    navigate(`/projects/editor/${example.id}?example=true`);
  };

  const handleProjectSubmit = async (data: {
    name: string;
    type: ProjectType;
    template: string;
    isShared: boolean;
  }) => {
    if (!user?.email) return;
    setLoading(true);
    setError(null);

    // Map frontend type to backend enum
    let projectType = "RESTApi";
    if (data.type === "graphql") projectType = "GraphQL";
    if (data.type === "websocket") projectType = "WebSocket";

    const newProject = {
      projectId: `project_${Date.now()}`,
      email: user.email,
      title: data.name,
      projectType,
      isShared: !!data.isShared, // ensure boolean and matches toggle
      blockLayout: {
        description: "",
        endpoints: [],
        nodes: [],
        edges: [],
        template: data.template,
      },
    };

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/projects/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const result = await res.json();
      if (res.ok) {
        setIsCreateModalOpen(false);
        // Optionally, refresh projects list
        setProjects((prev) => [
          ...prev,
          {
            id: newProject.projectId,
            title: newProject.title,
            description: "",
            category: projectType,
            date: "Recently",
            endpoints: 0,
          },
        ]);
        // Only navigate after creating a project, not after deleting
        navigate(`/projects/editor/${newProject.projectId}`);
      } else {
        setError(result.error || "Failed to create project.");
      }
    } catch (err) {
      setError("Failed to create project.");
    } finally {
      setLoading(false);
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
          <header className="bg-card border-b border-border relative">
            <div className="container mx-auto px-6 py-4 relative">
              <div className="flex items-center justify-between relative">
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex items-center space-x-2">
                    <img src="/logo.svg" alt="OneBlock" className="h-8" />
                  </Link>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-medium">Projects</span>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => signOut()}
                    className="bg-transparent border border-primary/90 text-primary hover:bg-primary/10 transition-colors"
                  >
                    Logout
                  </Button>
                </div>

                {/* Absolutely centered toggle, always in the middle of the header */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none z-10">
                  <span className="inline-flex items-center gap-2 text-base font-semibold cursor-pointer">
                    <span
                      className={
                        activeTab === "my"
                          ? "text-primary underline underline-offset-4"
                          : "text-muted-foreground hover:text-primary"
                      }
                      onClick={() => setActiveTab("my")}
                    >
                      My Projects
                    </span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span
                      className={
                        activeTab === "examples"
                          ? "text-primary underline underline-offset-4"
                          : "text-muted-foreground hover:text-primary"
                      }
                      onClick={() => setActiveTab("examples")}
                    >
                      Examples
                    </span>
                    <span className="mx-2 text-muted-foreground">|</span>
                    <span
                      className={
                        activeTab === "community"
                          ? "text-primary underline underline-offset-4"
                          : "text-muted-foreground hover:text-primary"
                      }
                      onClick={() => setActiveTab("community")}
                    >
                      Community
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-6 py-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                {activeTab === "my" && (
                  <>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      My Projects
                    </h1>
                    <p className="text-muted-foreground">
                      Manage and monitor your API projects
                    </p>
                  </>
                )}
                {activeTab === "examples" && (
                  <>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Example Projects
                    </h1>
                    <p className="text-muted-foreground">
                      Explore ready-made API project templates and demos
                    </p>
                  </>
                )}
                {activeTab === "community" && (
                  <>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Community Projects
                    </h1>
                    <p className="text-muted-foreground">
                      Discover and use projects shared by the community
                    </p>
                  </>
                )}
              </div>

              {activeTab === "my" && (
                <Button
                  onClick={handleCreateProject}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "examples" ? (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Example Projects
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exampleProjects.map((example) => (
                    <Card
                      key={example.id}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50 group border-dashed border-2 border-muted"
                      onClick={() => handleExampleClick(example)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {example.title}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-2">
                              {example.category}
                            </Badge>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {example.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{example.date}</span>
                          </div>
                          <span>{example.endpoints} endpoints</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : activeTab === "community" ? (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Community Projects
                </h2>
                {/* Search Bar for Community Projects */}
                <div className="relative mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search community projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    Loading community projects...
                  </div>
                ) : error ? (
                  <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredCommunityProjects.map((project) => (
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
                    {filteredCommunityProjects.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <ExternalLink className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                          No community projects found
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Be the first to share a project with the community!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <>
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

                {/* Loading/Error State */}
                {loading ? (
                  <div className="text-center py-12">Loading projects...</div>
                ) : error ? (
                  <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                  <>
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
                              <div className="flex items-center gap-2">
                                <AlertDialog
                                  open={
                                    deleteDialogOpen &&
                                    pendingDeleteId === project.id
                                  }
                                  onOpenChange={(open) => {
                                    setDeleteDialogOpen(open);
                                    if (!open) setPendingDeleteId(null);
                                  }}
                                >
                                  <AlertDialogTrigger asChild>
                                    <Trash2
                                      className="h-4 w-4 text-primary hover:text-primary/80 cursor-pointer transition-colors"
                                      aria-label="Delete project"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPendingDeleteId(project.id);
                                        setDeleteDialogOpen(true);
                                      }}
                                    />
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you sure you want to delete this
                                        project?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        onClick={() =>
                                          setDeleteDialogOpen(false)
                                        }
                                      >
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteProject(project.id)
                                        }
                                        className="bg-primary/80 text-primary-foreground hover:bg-primary"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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
                  </>
                )}
              </>
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
