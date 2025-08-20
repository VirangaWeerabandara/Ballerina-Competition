export interface APIComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string; // Icon name from lucide-react
  color: string; // Text color class
  bgColor: string; // Background color class
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
  | "graphql-endpoint"
  | "graphql-playground"
  | "query-resolver"
  | "mutation-resolver"
  | "subscription-resolver"
  | "schema-definition"
  | "websocket-server"
  | "websocket-client"
  | "room-manager"
  | "broadcast"
  | "connection-pool"
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
