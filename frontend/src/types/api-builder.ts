export interface APIComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string; // Icon name from lucide-react
  color: string; // Tailwind color class
  inputs: number;
  outputs: number;
  config?: Record<string, any>;
}

export interface CanvasComponent extends APIComponent {
  instanceId: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface Connection {
  id: string;
  sourceId: string;
  sourcePort: number;
  targetId: string;
  targetPort: number;
  animated?: boolean;
}

export type ComponentType =
  | "endpoint-get"
  | "endpoint-post"
  | "endpoint-put"
  | "endpoint-delete"
  | "endpoint-patch"
  | "middleware-auth"
  | "middleware-cors"
  | "middleware-rate-limit"
  | "middleware-logging"
  | "database"
  | "cache"
  | "external-api"
  | "queue"
  | "webhook"
  | "file-storage"
  | "email-service"
  | "notification"
  | "validation"
  | "transformation";

export type ComponentCategory =
  | "Endpoints"
  | "Middleware"
  | "Database"
  | "External"
  | "Processing"
  | "Storage"
  | "Communication";

export interface SimulationStep {
  id: string;
  componentId: string;
  timestamp: number;
  type: "request" | "response" | "process" | "error";
  message: string;
  data?: any;
  duration?: number;
}

export interface SimulationState {
  isRunning: boolean;
  steps: SimulationStep[];
  currentStep: number;
  speed: number; // 1x, 2x, 0.5x
}

export interface CanvasState {
  components: CanvasComponent[];
  connections: Connection[];
  selectedComponent: string | null;
  viewportOffset: { x: number; y: number };
  zoom: number;
}

export interface APIFlow {
  id: string;
  name: string;
  canvas: CanvasState;
  simulation: SimulationState;
  created: Date;
  modified: Date;
}
