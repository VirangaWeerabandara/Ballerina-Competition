import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
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
  RotateCcw,
  HardDrive,
  Mail,
  Bell,
  Layers,
} from "lucide-react";
import { APIComponent } from "@/types/api-builder";
import { getComponentsByCategory } from "@/data/api-components";

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
  RotateCcw,
  HardDrive,
  Mail,
  Bell,
  Layers,
};

interface DraggableComponentProps {
  component: APIComponent;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  component,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: {
      type: "component",
      component,
    },
  });

  const IconComponent =
    iconMap[component.icon as keyof typeof iconMap] || Database;

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-move transition-all duration-200 hover:shadow-md border-2 ${
        isDragging
          ? "opacity-50 shadow-lg border-primary scale-105"
          : "border-transparent hover:border-primary/20"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div
            className={`w-10 h-10 rounded-lg bg-white border-2 ${component.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
          >
            <IconComponent className="w-5 h-5 text-neutral-800 dark:text-neutral-300" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate mb-1">
              {component.name}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {component.description}
            </p>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs px-1 py-0">
                In: {component.inputs}
              </Badge>
              <Badge variant="outline" className="text-xs px-1 py-0">
                Out: {component.outputs}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface ComponentPaletteProps {
  className?: string;
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  className = "",
}) => {
  const componentsByCategory = getComponentsByCategory();
  const categories = Object.keys(componentsByCategory);

  return (
    <div
      className={`w-80 bg-card border-r border-border h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <h2 className="font-semibold text-lg mb-1">API Components</h2>
        <p className="text-sm text-muted-foreground">
          Drag components to build your API flow
        </p>
      </div>

      {/* Component Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {categories.map((category, index) => (
            <div key={category}>
              <h3 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {componentsByCategory[category].map((component) => (
                  <DraggableComponent
                    key={component.id}
                    component={component}
                  />
                ))}
              </div>
              {index < categories.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground text-center">
          <div className="font-medium mb-1">Quick Tips</div>
          <div>• Drag components to canvas</div>
          <div>• Connect output to input ports</div>
          <div>• Run simulation to test flow</div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;
