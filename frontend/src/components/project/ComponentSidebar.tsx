import React, { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Database,
  MessageSquare,
  Server,
  Users,
  Lock,
  Zap,
  Settings,
  CloudRain,
  Monitor,
} from "lucide-react";
import { ProjectType } from "./CreateProjectModal";

export interface BlockType {
  id: string;
  name: string;
  category: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
  inputs: number;
  outputs: number;
}

interface ComponentSidebarProps {
  projectType: ProjectType;
  onDragStart: (blockType: BlockType) => void;
}

const ComponentSidebar: React.FC<ComponentSidebarProps> = ({
  projectType,
  onDragStart,
}) => {
  const getBlocksForType = (type: ProjectType): BlockType[] => {
    const commonBlocks: BlockType[] = [
      {
        id: "database",
        name: "Database",
        category: "Storage",
        icon: (props) => <Database {...props} />,
        color: "bg-green-500",
        description: "Data storage and retrieval",
        inputs: 1,
        outputs: 1,
      },
      {
        id: "auth",
        name: "Authentication",
        category: "Security",
        icon: (props) => <Lock {...props} />,
        color: "bg-red-500",
        description: "User authentication service",
        inputs: 1,
        outputs: 2,
      },
      {
        id: "cache",
        name: "Cache",
        category: "Performance",
        icon: (props) => <Zap {...props} />,
        color: "bg-yellow-500",
        description: "In-memory data caching",
        inputs: 1,
        outputs: 1,
      },
      {
        id: "external-api",
        name: "External API",
        category: "Integration",
        icon: (props) => <CloudRain {...props} />,
        color: "bg-indigo-500",
        description: "Third-party API integration",
        inputs: 1,
        outputs: 1,
      },
    ];

    switch (type) {
      case "rest-api":
        return [
          {
            id: "get-endpoint",
            name: "GET Endpoint",
            category: "HTTP",
            icon: (props) => <Globe {...props} />,
            color: "bg-blue-500",
            description: "HTTP GET request handler",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "post-endpoint",
            name: "POST Endpoint",
            category: "HTTP",
            icon: (props) => <Globe {...props} />,
            color: "bg-green-600",
            description: "HTTP POST request handler",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "put-endpoint",
            name: "PUT Endpoint",
            category: "HTTP",
            icon: (props) => <Globe {...props} />,
            color: "bg-orange-500",
            description: "HTTP PUT request handler",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "delete-endpoint",
            name: "DELETE Endpoint",
            category: "HTTP",
            icon: (props) => <Globe {...props} />,
            color: "bg-red-600",
            description: "HTTP DELETE request handler",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "middleware",
            name: "Middleware",
            category: "Processing",
            icon: (props) => <Settings {...props} />,
            color: "bg-purple-500",
            description: "Request/response middleware",
            inputs: 1,
            outputs: 1,
          },
          ...commonBlocks,
        ];

      case "graphql":
        return [
          {
            id: "query-resolver",
            name: "Query Resolver",
            category: "GraphQL",
            icon: (props) => <Database {...props} />,
            color: "bg-blue-500",
            description: "GraphQL query resolver",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "mutation-resolver",
            name: "Mutation Resolver",
            category: "GraphQL",
            icon: (props) => <Database {...props} />,
            color: "bg-green-500",
            description: "GraphQL mutation resolver",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "subscription-resolver",
            name: "Subscription Resolver",
            category: "GraphQL",
            icon: (props) => <Database {...props} />,
            color: "bg-purple-500",
            description: "GraphQL subscription resolver",
            inputs: 0,
            outputs: 1,
          },
          {
            id: "schema",
            name: "Schema Definition",
            category: "GraphQL",
            icon: (props) => <Settings {...props} />,
            color: "bg-indigo-500",
            description: "GraphQL schema definition",
            inputs: 3,
            outputs: 0,
          },
          ...commonBlocks,
        ];

      case "websocket":
        return [
          {
            id: "websocket-server",
            name: "WebSocket Server",
            category: "WebSocket",
            icon: (props) => <Server {...props} />,
            color: "bg-blue-500",
            description: "WebSocket connection handler",
            inputs: 0,
            outputs: 2,
          },
          {
            id: "room-manager",
            name: "Room Manager",
            category: "WebSocket",
            icon: (props) => <Users {...props} />,
            color: "bg-purple-500",
            description: "Manage user rooms/channels",
            inputs: 1,
            outputs: 1,
          },
          {
            id: "broadcast",
            name: "Broadcast",
            category: "WebSocket",
            icon: (props) => <MessageSquare {...props} />,
            color: "bg-green-500",
            description: "Broadcast messages to clients",
            inputs: 2,
            outputs: 0,
          },
          {
            id: "event-handler",
            name: "Event Handler",
            category: "WebSocket",
            icon: (props) => <Zap {...props} />,
            color: "bg-orange-500",
            description: "Handle incoming events",
            inputs: 1,
            outputs: 1,
          },
          ...commonBlocks,
        ];

      default:
        return commonBlocks;
    }
  };

  const blocks = getBlocksForType(projectType);
  const categories = Array.from(new Set(blocks.map((block) => block.category)));

  const handleDragStart = (block: BlockType) => (e: React.DragEvent) => {
    console.log("Drag start - block:", block.name);
    // Create a serializable version without the React icon component
    const serializableBlock = {
      id: block.id,
      name: block.name,
      category: block.category,
      color: block.color,
      description: block.description,
      inputs: block.inputs,
      outputs: block.outputs,
    };
    // Set multiple data formats for better compatibility
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify(serializableBlock)
    );
    e.dataTransfer.setData("text/plain", JSON.stringify(serializableBlock));
    e.dataTransfer.setData(
      "application/x-block-data",
      JSON.stringify(serializableBlock)
    );

    // Set the allowed effects
    e.dataTransfer.effectAllowed = "copy";
    console.log(
      "Drag start - effectAllowed set to:",
      e.dataTransfer.effectAllowed
    );
    onDragStart(block);
  };

  return (
    <div className="w-80 bg-card border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-lg">Components</h3>
        <p className="text-sm text-muted-foreground">
          Drag components to the canvas
        </p>
      </div>

      <div className="p-4 space-y-6">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="font-medium text-sm mb-3 text-muted-foreground uppercase tracking-wide">
              {category}
            </h4>
            <div className="space-y-2">
              {blocks
                .filter((block) => block.category === category)
                .map((block) => (
                  <Card
                    key={block.id}
                    className="cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={handleDragStart(block)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0 border border-border">
                          <block.icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm truncate">
                            {block.name}
                          </h5>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {block.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              In: {block.inputs}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Out: {block.outputs}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentSidebar;
