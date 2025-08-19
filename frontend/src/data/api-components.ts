import { APIComponent, ComponentType } from "@/types/api-builder";

export const REST_API_COMPONENTS: APIComponent[] = [
  // Endpoints
  {
    id: "endpoint-get",
    type: "endpoint-get",
    name: "GET Endpoint",
    description: "Handle HTTP GET requests",
    category: "Endpoints",
    icon: "Download",
    color: "bg-blue-400",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/api/resource",
      description: "Retrieve data",
    },
  },
  {
    id: "endpoint-post",
    type: "endpoint-post",
    name: "POST Endpoint",
    description: "Handle HTTP POST requests",
    category: "Endpoints",
    icon: "Upload",
    color: "bg-green-400",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/api/resource",
      description: "Create new data",
    },
  },
  {
    id: "endpoint-put",
    type: "endpoint-put",
    name: "PUT Endpoint",
    description: "Handle HTTP PUT requests",
    category: "Endpoints",
    icon: "RefreshCw",
    color: "bg-orange-400",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/api/resource/:id",
      description: "Update existing data",
    },
  },
  {
    id: "endpoint-delete",
    type: "endpoint-delete",
    name: "DELETE Endpoint",
    description: "Handle HTTP DELETE requests",
    category: "Endpoints",
    icon: "Trash2",
    color: "bg-red-400",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/api/resource/:id",
      description: "Delete data",
    },
  },
  {
    id: "endpoint-patch",
    type: "endpoint-patch",
    name: "PATCH Endpoint",
    description: "Handle HTTP PATCH requests",
    category: "Endpoints",
    icon: "Edit",
    color: "bg-purple-400",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/api/resource/:id",
      description: "Partial update",
    },
  },

  // Middleware
  {
    id: "middleware-auth",
    type: "middleware-auth",
    name: "Authentication",
    description: "Validate user authentication",
    category: "Middleware",
    icon: "Shield",
    color: "bg-indigo-400",
    inputs: 1,
    outputs: 2, // success, failure
    config: {
      type: "JWT",
      secret: "your-secret-key",
    },
  },
  {
    id: "middleware-cors",
    type: "middleware-cors",
    name: "CORS",
    description: "Handle Cross-Origin Resource Sharing",
    category: "Middleware",
    icon: "Globe",
    color: "bg-teal-400",
    inputs: 1,
    outputs: 1,
    config: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  },
  {
    id: "middleware-rate-limit",
    type: "middleware-rate-limit",
    name: "Rate Limiting",
    description: "Limit request frequency",
    category: "Middleware",
    icon: "Timer",
    color: "bg-yellow-400",
    inputs: 1,
    outputs: 2, // allowed, blocked
    config: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
  {
    id: "middleware-logging",
    type: "middleware-logging",
    name: "Request Logging",
    description: "Log all requests and responses",
    category: "Middleware",
    icon: "FileText",
    color: "bg-gray-400",
    inputs: 1,
    outputs: 1,
    config: {
      level: "info",
      format: "combined",
    },
  },

  // Database
  {
    id: "database",
    type: "database",
    name: "Database",
    description: "Data storage and retrieval",
    category: "Database",
    icon: "Database",
    color: "bg-emerald-400",
    inputs: 1,
    outputs: 1,
    config: {
      type: "PostgreSQL",
      connection: "postgresql://localhost:5432/mydb",
    },
  },

  // External
  {
    id: "external-api",
    type: "external-api",
    name: "External API",
    description: "Call external APIs",
    category: "External",
    icon: "ExternalLink",
    color: "bg-violet-400",
    inputs: 1,
    outputs: 1,
    config: {
      url: "https://api.external.com",
      method: "GET",
      headers: {},
    },
  },
  {
    id: "webhook",
    type: "webhook",
    name: "Webhook",
    description: "Send webhook notifications",
    category: "External",
    icon: "Webhook",
    color: "bg-pink-400",
    inputs: 1,
    outputs: 1,
    config: {
      url: "https://webhook.example.com",
      method: "POST",
    },
  },

  // Processing
  {
    id: "validation",
    type: "validation",
    name: "Data Validator",
    description: "Validate request data",
    category: "Processing",
    icon: "CheckCircle",
    color: "bg-lime-400",
    inputs: 1,
    outputs: 2, // valid, invalid
    config: {
      schema: "JSON Schema",
      strict: true,
    },
  },
  {
    id: "transformation",
    type: "transformation",
    name: "Data Transformer",
    description: "Transform data format",
    category: "Processing",
    icon: "RotateCcw",
    color: "bg-amber-400",
    inputs: 1,
    outputs: 1,
    config: {
      format: "JSON to XML",
    },
  },

  // Storage
  {
    id: "file-storage",
    type: "file-storage",
    name: "File Storage",
    description: "Store and manage files",
    category: "Storage",
    icon: "HardDrive",
    color: "bg-stone-400",
    inputs: 1,
    outputs: 1,
    config: {
      provider: "AWS S3",
      bucket: "my-bucket",
    },
  },

  // Communication
  {
    id: "email-service",
    type: "email-service",
    name: "Email Service",
    description: "Send email notifications",
    category: "Communication",
    icon: "Mail",
    color: "bg-rose-400",
    inputs: 1,
    outputs: 1,
    config: {
      provider: "SendGrid",
      from: "noreply@example.com",
    },
  },
  {
    id: "notification",
    type: "notification",
    name: "Push Notification",
    description: "Send push notifications",
    category: "Communication",
    icon: "Bell",
    color: "bg-fuchsia-400",
    inputs: 1,
    outputs: 1,
    config: {
      provider: "FCM",
      topic: "general",
    },
  },
  {
    id: "queue",
    type: "queue",
    name: "Message Queue",
    description: "Queue messages for processing",
    category: "Communication",
    icon: "Layers",
    color: "bg-slate-400",
    inputs: 1,
    outputs: 1,
    config: {
      provider: "RabbitMQ",
      queue: "default",
    },
  },
];

export const GRAPHQL_API_COMPONENTS: APIComponent[] = [
  // GraphQL Endpoints
  {
    id: "graphql-endpoint",
    type: "graphql-endpoint",
    name: "GraphQL Endpoint",
    description: "Handle GraphQL queries and mutations",
    category: "Endpoints",
    icon: "Database",
    color: "bg-purple-500",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/graphql",
      introspection: true,
    },
  },
  {
    id: "graphql-playground",
    type: "graphql-playground",
    name: "GraphQL Playground",
    description: "Interactive GraphQL IDE",
    category: "Endpoints",
    icon: "Globe",
    color: "bg-indigo-500",
    inputs: 0,
    outputs: 0,
    config: {
      path: "/playground",
      enabled: true,
    },
  },

  // GraphQL Resolvers
  {
    id: "query-resolver",
    type: "query-resolver",
    name: "Query Resolver",
    description: "Resolve GraphQL queries",
    category: "Processing",
    icon: "Download",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    config: {
      type: "Query",
      fields: ["id", "name", "email"],
    },
  },
  {
    id: "mutation-resolver",
    type: "mutation-resolver",
    name: "Mutation Resolver",
    description: "Resolve GraphQL mutations",
    category: "Processing",
    icon: "Upload",
    color: "bg-green-500",
    inputs: 1,
    outputs: 1,
    config: {
      type: "Mutation",
      operations: ["create", "update", "delete"],
    },
  },
  {
    id: "subscription-resolver",
    type: "subscription-resolver",
    name: "Subscription Resolver",
    description: "Resolve GraphQL subscriptions",
    category: "Processing",
    icon: "Bell",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    config: {
      type: "Subscription",
      events: ["userCreated", "dataUpdated"],
    },
  },

  // GraphQL Schema
  {
    id: "schema-definition",
    type: "schema-definition",
    name: "Schema Definition",
    description: "Define GraphQL schema types",
    category: "Processing",
    icon: "FileText",
    color: "bg-teal-500",
    inputs: 0,
    outputs: 1,
    config: {
      types: ["User", "Post", "Comment"],
      directives: ["@auth", "@cache"],
    },
  },

  // Shared components (reuse from REST API)
  ...REST_API_COMPONENTS.filter(
    (comp) =>
      !comp.category.includes("Endpoints") && comp.category !== "Processing"
  ),
];

export const WEBSOCKET_API_COMPONENTS: APIComponent[] = [
  // WebSocket Endpoints
  {
    id: "websocket-server",
    type: "websocket-server",
    name: "WebSocket Server",
    description: "Handle WebSocket connections",
    category: "Endpoints",
    icon: "MessageSquare",
    color: "bg-green-500",
    inputs: 0,
    outputs: 1,
    config: {
      path: "/ws",
      protocols: ["ws", "wss"],
    },
  },
  {
    id: "websocket-client",
    type: "websocket-client",
    name: "WebSocket Client",
    description: "Connect to external WebSocket servers",
    category: "Endpoints",
    icon: "ExternalLink",
    color: "bg-blue-500",
    inputs: 1,
    outputs: 1,
    config: {
      url: "wss://external-server.com/ws",
      reconnect: true,
    },
  },

  // WebSocket Management
  {
    id: "room-manager",
    type: "room-manager",
    name: "Room Manager",
    description: "Manage WebSocket rooms and channels",
    category: "Processing",
    icon: "Users",
    color: "bg-purple-500",
    inputs: 1,
    outputs: 2,
    config: {
      rooms: ["general", "private", "broadcast"],
      maxUsers: 100,
    },
  },
  {
    id: "broadcast",
    type: "broadcast",
    name: "Broadcast Service",
    description: "Broadcast messages to all connected clients",
    category: "Processing",
    icon: "Bell",
    color: "bg-orange-500",
    inputs: 1,
    outputs: 1,
    config: {
      type: "all",
      filter: "none",
    },
  },
  {
    id: "connection-pool",
    type: "connection-pool",
    name: "Connection Pool",
    description: "Manage WebSocket connection lifecycle",
    category: "Processing",
    icon: "Layers",
    color: "bg-indigo-500",
    inputs: 1,
    outputs: 1,
    config: {
      maxConnections: 1000,
      timeout: 30000,
    },
  },

  // Shared components (reuse from REST API)
  ...REST_API_COMPONENTS.filter(
    (comp) =>
      !comp.category.includes("Endpoints") && comp.category !== "Processing"
  ),
];

export const getComponentsByCategory = (
  projectType: "rest-api" | "graphql" | "websocket" = "rest-api"
) => {
  const components = getComponentsForProjectType(projectType);
  const categories: Record<string, APIComponent[]> = {};

  components.forEach((component) => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });

  return categories;
};

export const getComponentsForProjectType = (
  projectType: "rest-api" | "graphql" | "websocket"
): APIComponent[] => {
  switch (projectType) {
    case "graphql":
      return GRAPHQL_API_COMPONENTS;
    case "websocket":
      return WEBSOCKET_API_COMPONENTS;
    case "rest-api":
    default:
      return REST_API_COMPONENTS;
  }
};

export const getComponentById = (
  id: string,
  projectType: "rest-api" | "graphql" | "websocket" = "rest-api"
): APIComponent | undefined => {
  const components = getComponentsForProjectType(projectType);
  return components.find((component) => component.id === id);
};
