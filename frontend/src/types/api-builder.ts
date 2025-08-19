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
