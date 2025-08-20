import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
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

interface APINodeData {
  label: string;
  type: string;
  category: string;
  icon: string;
  color: string;
  bgColor: string;
  inputs: number;
  outputs: number;
  description: string;
  onDelete?: (id: string) => void;
}

const APINode: React.FC<NodeProps<APINodeData>> = ({ data, id, selected }) => {
  const IconComponent = iconMap[data.icon as keyof typeof iconMap] || Database;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <Card
      className={`min-w-[200px] transition-all duration-200 bg-white/60 backdrop-blur-2xl shadow-lg border-none ${
        selected ? "ring-2 ring-blue-500" : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        {/* Input Handles */}
        {Array.from({ length: data.inputs }).map((_, i) => (
          <Handle
            key={`input-${i}`}
            type="target"
            position={Position.Left}
            id={`input-${i}`}
            style={{
              top: `${30 + i * 20}px`,
              background: "#6b7280",
              width: "12px",
              height: "12px",
              border: "2px solid #fff",
            }}
          />
        ))}

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 shadow-sm border border-border/30 ${data.bgColor}`}
            >
              <IconComponent className={`w-4 h-4 ${data.color}`} />
            </div>
            <div>
              <div className="font-medium text-sm truncate">{data.label}</div>
              <Badge variant="outline" className="text-xs mt-1">
                {data.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>

        {/* Output Handles */}
        {Array.from({ length: data.outputs }).map((_, i) => (
          <Handle
            key={`output-${i}`}
            type="source"
            position={Position.Right}
            id={`output-${i}`}
            style={{
              top: `${30 + i * 20}px`,
              background: "#3b82f6",
              width: "12px",
              height: "12px",
              border: "2px solid #fff",
            }}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default APINode;
