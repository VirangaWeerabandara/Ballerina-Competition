import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Shield,
  Globe,
  Timer,
  FileText,
  Zap,
  ExternalLink,
  Webhook,
  CheckCircle,
  HardDrive,
  Mail,
  Bell,
  Layers,
  RotateCcw,
} from "lucide-react";
import { getComponentsByCategory } from "@/data/api-components";
import { APIComponent } from "@/types/api-builder";

const iconMap = {
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Edit,
  Shield,
  Globe,
  Timer,
  FileText,
  Database,
  Zap,
  ExternalLink,
  Webhook,
  CheckCircle,
  HardDrive,
  Mail,
  Bell,
  Layers,
  RotateCcw,
};

interface DraggableComponentProps {
  component: APIComponent;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
}) => {
  const IconComponent =
    iconMap[component.icon as keyof typeof iconMap] || Database;

  const onDragStart = (event: React.DragEvent, component: APIComponent) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(component)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-primary/20"
      draggable
      onDragStart={(event) => onDragStart(event, component)}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg ${component.color} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
          >
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{component.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {component.description}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {component.category}
              </Badge>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                {component.inputs}
                <span className="mx-1">→</span>
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                {component.outputs}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FlowPaletteProps {
  projectType: "rest-api" | "graphql" | "websocket";
}

const FlowPalette: React.FC<FlowPaletteProps> = ({ projectType }) => {
  const categories = [
    "Endpoints",
    "Middleware",
    "Database",
    "Processing",
    "Storage",
    "Communication",
    "External",
  ];

  const allCategories = getComponentsByCategory(projectType);

  const getProjectTypeDisplayName = (type: string) => {
    switch (type) {
      case "rest-api":
        return "REST API";
      case "graphql":
        return "GraphQL";
      case "websocket":
        return "WebSocket";
      default:
        return "API";
    }
  };

  return (
    <div className="w-80 bg-white/60 h-full flex flex-col backdrop-blur-2xl shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold">
          {getProjectTypeDisplayName(projectType)} Components
        </h2>
        <p className="text-sm text-muted-foreground">
          Drag components to the canvas
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.map((category) => {
            const components = allCategories[category] || [];
            if (components.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-sm font-medium text-foreground mb-3 flex items-center">
                  {category}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {components.length}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {components.map((component) => (
                    <DraggableComponent
                      key={component.id}
                      component={component}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default FlowPalette;
