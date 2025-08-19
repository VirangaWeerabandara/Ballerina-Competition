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
  bgColor: string;
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
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);

  const projectTypes: ProjectTemplate[] = [
    {
      id: "rest-api",
      name: "REST API",
      description: "Build RESTful web services with HTTP endpoints",
      icon: <Globe className="w-8 h-8" />,
      color: "text-primary-blue",
      bgColor: "bg-primary-blue/10",
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
      color: "text-primary-purple",
      bgColor: "bg-primary-purple/10",
      features: ["Queries", "Mutations", "Subscriptions", "Schema Definition"],
    },
    {
      id: "websocket",
      name: "WebSocket",
      description: "Real-time communication with WebSocket connections",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "text-primary-emerald",
      bgColor: "bg-primary-emerald/10",
      features: [
        "Real-time Events",
        "Bidirectional Communication",
        "Broadcasting",
        "Connection Management",
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onSubmit({
        name: "Untitled Project",
        type: selectedType,
        template: "basic-crud",
        isShared: false,
      });
      setSelectedType(null);
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
                        className={`w-16 h-16 rounded-full ${type.bgColor} ${type.color} flex items-center justify-center mx-auto mb-4 border border-border/30`}
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!selectedType}
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
