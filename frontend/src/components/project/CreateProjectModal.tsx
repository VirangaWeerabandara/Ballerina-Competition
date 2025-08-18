import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Database, Zap, MessageSquare, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Add this if you have a Switch component

export type ProjectType = "rest-api" | "graphql" | "websocket";

interface ProjectTemplate {
  id: ProjectType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    type: ProjectType;
    template: string;
    isShared: boolean;
  }) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [projectName, setProjectName] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isShared, setIsShared] = useState(false);

  const projectTypes: ProjectTemplate[] = [
    {
      id: "rest-api",
      name: "REST API",
      description: "Build RESTful web services with HTTP endpoints",
      icon: <Globe className="w-8 h-8" />,
      color: "bg-blue-500",
      features: [
        "HTTP Methods",
        "Route Parameters",
        "Middleware",
        "Request/Response",
      ],
    },
    {
      id: "graphql",
      name: "GraphQL API",
      description: "Create flexible GraphQL APIs with resolvers",
      icon: <Database className="w-8 h-8" />,
      color: "bg-purple-500",
      features: ["Queries", "Mutations", "Subscriptions", "Schema Definition"],
    },
    {
      id: "websocket",
      name: "WebSocket",
      description: "Real-time communication with WebSocket connections",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-green-500",
      features: [
        "Real-time Events",
        "Bidirectional Communication",
        "Broadcasting",
        "Connection Management",
      ],
    },
  ];

  const templates = {
    "rest-api": [
      {
        id: "basic-crud",
        name: "Basic CRUD API",
        description: "Simple Create, Read, Update, Delete operations",
      },
      {
        id: "auth-api",
        name: "Authentication API",
        description: "User authentication with JWT tokens",
      },
      {
        id: "ecommerce-api",
        name: "E-commerce API",
        description: "Product catalog and order management",
      },
      {
        id: "blog-api",
        name: "Blog API",
        description: "Posts, comments, and user management",
      },
    ],
    graphql: [
      {
        id: "basic-schema",
        name: "Basic Schema",
        description: "Simple queries and mutations",
      },
      {
        id: "social-media",
        name: "Social Media Schema",
        description: "Users, posts, likes, and comments",
      },
      {
        id: "ecommerce-schema",
        name: "E-commerce Schema",
        description: "Products, orders, and inventory",
      },
    ],
    websocket: [
      {
        id: "chat-server",
        name: "Chat Server",
        description: "Real-time messaging application",
      },
      {
        id: "game-server",
        name: "Game Server",
        description: "Multiplayer game backend",
      },
      {
        id: "notification-server",
        name: "Notification Server",
        description: "Push notifications system",
      },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && selectedType && selectedTemplate) {
      onSubmit({
        name: projectName,
        type: selectedType,
        template: selectedTemplate,
        isShared,
      });
      // Reset form
      setProjectName("");
      setSelectedType(null);
      setSelectedTemplate("");
      setIsShared(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Create New Project</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>

            {/* Project Type Selection */}
            <div className="space-y-4">
              <Label>Select Project Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all border-2 ${
                      selectedType === type.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 rounded-full ${type.color} text-white flex items-center justify-center mx-auto mb-4`}
                      >
                        {type.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {type.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {type.features.map((feature) => (
                          <Badge
                            key={feature}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Template Selection */}
            {selectedType && (
              <div className="space-y-4">
                <Label>Choose Template</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates[selectedType].map((template) => (
                    <Card
                      key={template.id}
                      className={`cursor-pointer transition-all border ${
                        selectedTemplate === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Shared Switch */}
            <div className="flex items-center space-x-3 pt-2">
              <Switch
                id="is-shared"
                checked={isShared}
                onCheckedChange={setIsShared}
              />
              <Label htmlFor="is-shared">Public</Label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!projectName || !selectedType || !selectedTemplate}
                className="bg-primary hover:bg-primary/90"
              >
                <Zap className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectModal;
