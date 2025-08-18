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
    color: "bg-cyan-400",
    inputs: 1,
    outputs: 1,
    config: {
      origins: ["*"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  },
  {
    id: "middleware-rate-limit",
    type: "middleware-rate-limit",
    name: "Rate Limiter",
    description: "Limit request rate per user",
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
    name: "Request Logger",
    description: "Log incoming requests",
    category: "Middleware",
    icon: "FileText",
    color: "bg-gray-400",
    inputs: 1,
    outputs: 1,
    config: {
      format: "combined",
      destination: "console",
    },
  },

  // Database
  {
    id: "database",
    type: "database",
    name: "Database",
    description: "Store and retrieve data",
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
  {
    id: "cache",
    type: "cache",
    name: "Cache",
    description: "Cache frequently accessed data",
    category: "Database",
    icon: "Zap",
    color: "bg-pink-400",
    inputs: 1,
    outputs: 1,
    config: {
      type: "Redis",
      ttl: 3600, // 1 hour
    },
  },

  // External Services
  {
    id: "external-api",
    type: "external-api",
    name: "External API",
    description: "Call external REST API",
    category: "External",
    icon: "ExternalLink",
    color: "bg-teal-400",
    inputs: 1,
    outputs: 2, // success, error
    config: {
      baseUrl: "https://api.example.com",
      timeout: 5000,
    },
  },
  {
    id: "webhook",
    type: "webhook",
    name: "Webhook",
    description: "Send webhook notifications",
    category: "External",
    icon: "Webhook",
    color: "bg-violet-400",
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

export const getComponentsByCategory = () => {
  const categories: Record<string, APIComponent[]> = {};

  REST_API_COMPONENTS.forEach((component) => {
    if (!categories[component.category]) {
      categories[component.category] = [];
    }
    categories[component.category].push(component);
  });

  return categories;
};

export const getComponentById = (id: string): APIComponent | undefined => {
  return REST_API_COMPONENTS.find((component) => component.id === id);
};
