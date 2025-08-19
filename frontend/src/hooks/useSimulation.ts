import { useState, useCallback, useRef, useEffect } from "react";
import {
  CanvasComponent,
  Connection,
  SimulationStep,
  SimulationState,
} from "@/types/api-builder";

interface SimulationHookReturn {
  simulation: SimulationState;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  setSpeed: (speed: number) => void;
}

export const useSimulation = (
  components: CanvasComponent[],
  connections: Connection[]
): SimulationHookReturn => {
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    steps: [],
    currentStep: 0,
    speed: 1,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get entry points (components with no inputs or endpoints)
  const getEntryPoints = useCallback(() => {
    return components.filter((component) => {
      const hasIncomingConnections = connections.some(
        (conn) => conn.targetId === component.instanceId
      );
      return !hasIncomingConnections || component.type.startsWith("endpoint-");
    });
  }, [components, connections]);

  // Find connected components
  const getConnectedComponents = useCallback(
    (componentId: string, visited = new Set<string>()): CanvasComponent[] => {
      if (visited.has(componentId)) return [];
      visited.add(componentId);

      const component = components.find((c) => c.instanceId === componentId);
      if (!component) return [];

      const connectedIds = connections
        .filter((conn) => conn.sourceId === componentId)
        .map((conn) => conn.targetId);

      const connectedComponents = connectedIds.flatMap((id) =>
        getConnectedComponents(id, visited)
      );

      return [component, ...connectedComponents];
    },
    [components, connections]
  );

  // Generate simulation steps for a request flow
  const generateSimulationSteps = useCallback(
    (entryPoint: CanvasComponent): SimulationStep[] => {
      const steps: SimulationStep[] = [];
      const flowComponents = getConnectedComponents(entryPoint.instanceId);
      const startTime = Date.now();

      // Simulate request processing through the flow
      flowComponents.forEach((component, index) => {
        const stepTime = startTime + index * 100 * (2 - simulation.speed); // Adjust timing based on speed

        // Request step
        steps.push({
          id: `${component.instanceId}_request_${stepTime}`,
          componentId: component.instanceId,
          timestamp: stepTime,
          type: "request",
          message: getRequestMessage(component),
          duration: getProcessingTime(component),
        });

        // Processing step
        steps.push({
          id: `${component.instanceId}_process_${stepTime + 50}`,
          componentId: component.instanceId,
          timestamp: stepTime + 50,
          type: "process",
          message: getProcessingMessage(component),
          data: generateMockData(component),
        });

        // Response step (with some random failures)
        const isSuccess = Math.random() > 0.1; // 90% success rate
        steps.push({
          id: `${component.instanceId}_response_${stepTime + 100}`,
          componentId: component.instanceId,
          timestamp: stepTime + 100,
          type: isSuccess ? "response" : "error",
          message: isSuccess
            ? getSuccessMessage(component)
            : getErrorMessage(component),
          duration: getProcessingTime(component),
          data: isSuccess
            ? generateResponseData(component)
            : generateErrorData(component),
        });
      });

      return steps;
    },
    [simulation.speed, getConnectedComponents]
  );

  // Start simulation
  const startSimulation = useCallback(() => {
    const entryPoints = getEntryPoints();
    if (entryPoints.length === 0) {
      console.warn("No entry points found for simulation");
      return;
    }

    // Generate steps for all entry points
    const allSteps = entryPoints.flatMap((entryPoint) =>
      generateSimulationSteps(entryPoint)
    );

    // Sort steps by timestamp
    allSteps.sort((a, b) => a.timestamp - b.timestamp);

    setSimulation((prev) => ({
      ...prev,
      isRunning: true,
      steps: allSteps,
      currentStep: 0,
    }));

    // Start step-by-step execution
    let currentIndex = 0;
    const executeNextStep = () => {
      if (currentIndex < allSteps.length) {
        setSimulation((prev) => ({
          ...prev,
          currentStep: currentIndex,
        }));
        currentIndex++;

        stepTimeoutRef.current = setTimeout(
          executeNextStep,
          1000 / simulation.speed
        );
      } else {
        // Simulation completed
        setSimulation((prev) => ({
          ...prev,
          isRunning: false,
        }));
      }
    };

    executeNextStep();

    // Also simulate periodic new requests
    intervalRef.current = setInterval(() => {
      if (entryPoints.length > 0) {
        const randomEntryPoint =
          entryPoints[Math.floor(Math.random() * entryPoints.length)];
        const newSteps = generateSimulationSteps(randomEntryPoint);

        setSimulation((prev) => ({
          ...prev,
          steps: [...prev.steps, ...newSteps].sort(
            (a, b) => a.timestamp - b.timestamp
          ),
        }));
      }
    }, 3000 / simulation.speed);
  }, [getEntryPoints, generateSimulationSteps, simulation.speed]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (stepTimeoutRef.current) {
      clearTimeout(stepTimeoutRef.current);
      stepTimeoutRef.current = null;
    }

    setSimulation((prev) => ({
      ...prev,
      isRunning: false,
    }));
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    stopSimulation();
    setSimulation((prev) => ({
      ...prev,
      steps: [],
      currentStep: 0,
    }));
  }, [stopSimulation]);

  // Set simulation speed
  const setSpeed = useCallback((speed: number) => {
    setSimulation((prev) => ({
      ...prev,
      speed,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current);
    };
  }, []);

  return {
    simulation,
    startSimulation,
    stopSimulation,
    resetSimulation,
    setSpeed,
  };
};

// Helper functions for generating simulation messages and data

function getRequestMessage(component: CanvasComponent): string {
  switch (component.type) {
    case "endpoint-get":
      return `Incoming GET request to ${
        component.config?.path || "/api/resource"
      }`;
    case "endpoint-post":
      return `Incoming POST request to ${
        component.config?.path || "/api/resource"
      }`;
    case "endpoint-put":
      return `Incoming PUT request to ${
        component.config?.path || "/api/resource"
      }`;
    case "endpoint-delete":
      return `Incoming DELETE request to ${
        component.config?.path || "/api/resource"
      }`;
    case "endpoint-patch":
      return `Incoming PATCH request to ${
        component.config?.path || "/api/resource"
      }`;
    case "middleware-auth":
      return "Validating authentication token";
    case "middleware-cors":
      return "Processing CORS headers";
    case "middleware-rate-limit":
      return "Checking rate limits";
    case "database":
      return "Querying database";
    case "cache":
      return "Checking cache for data";
    case "external-api":
      return "Calling external API";
    default:
      return `Processing in ${component.name}`;
  }
}

function getProcessingMessage(component: CanvasComponent): string {
  switch (component.type) {
    case "middleware-auth":
      return "Decoding JWT token and validating claims";
    case "validation":
      return "Validating request data against schema";
    case "transformation":
      return "Transforming data format";
    case "database":
      return "Executing SQL query";
    case "cache":
      return "Checking Redis cache";
    case "external-api":
      return "Sending HTTP request to external service";
    default:
      return `Processing request in ${component.name}`;
  }
}

function getSuccessMessage(component: CanvasComponent): string {
  switch (component.type) {
    case "endpoint-get":
      return "Returned data successfully";
    case "endpoint-post":
      return "Resource created successfully";
    case "endpoint-put":
      return "Resource updated successfully";
    case "endpoint-delete":
      return "Resource deleted successfully";
    case "middleware-auth":
      return "Authentication successful";
    case "database":
      return "Query executed successfully";
    case "cache":
      return "Cache hit - data retrieved";
    case "external-api":
      return "External API responded successfully";
    default:
      return `${component.name} completed successfully`;
  }
}

function getErrorMessage(component: CanvasComponent): string {
  switch (component.type) {
    case "middleware-auth":
      return "Authentication failed - invalid token";
    case "middleware-rate-limit":
      return "Rate limit exceeded";
    case "database":
      return "Database query failed";
    case "cache":
      return "Cache miss - data not found";
    case "external-api":
      return "External API request failed";
    default:
      return `Error in ${component.name}`;
  }
}

function getProcessingTime(component: CanvasComponent): number {
  // Return realistic processing times in milliseconds
  switch (component.type) {
    case "middleware-auth":
      return Math.random() * 50 + 10; // 10-60ms
    case "middleware-cors":
      return Math.random() * 10 + 1; // 1-11ms
    case "database":
      return Math.random() * 200 + 50; // 50-250ms
    case "cache":
      return Math.random() * 20 + 5; // 5-25ms
    case "external-api":
      return Math.random() * 1000 + 200; // 200-1200ms
    default:
      return Math.random() * 100 + 25; // 25-125ms
  }
}

function generateMockData(component: CanvasComponent): any {
  switch (component.type) {
    case "endpoint-get":
      return {
        method: "GET",
        path: component.config?.path,
        query: { page: 1, limit: 10 },
      };
    case "endpoint-post":
      return {
        method: "POST",
        path: component.config?.path,
        body: { name: "New Resource" },
      };
    case "middleware-auth":
      return { userId: "12345", role: "user", exp: Date.now() + 3600000 };
    case "database":
      return {
        table: "users",
        operation: "SELECT",
        rows: Math.floor(Math.random() * 100),
      };
    default:
      return { component: component.name, timestamp: Date.now() };
  }
}

function generateResponseData(component: CanvasComponent): any {
  switch (component.type) {
    case "endpoint-get":
      return {
        status: 200,
        data: Array.from({ length: 5 }, (_, i) => ({
          id: i + 1,
          name: `Item ${i + 1}`,
        })),
      };
    case "endpoint-post":
      return {
        status: 201,
        data: { id: Date.now(), name: "New Resource", created: true },
      };
    case "database":
      return {
        affected_rows: Math.floor(Math.random() * 10) + 1,
        execution_time: "0.05s",
      };
    case "cache":
      return { hit: true, data: { cached_at: new Date().toISOString() } };
    default:
      return { success: true, timestamp: Date.now() };
  }
}

function generateErrorData(component: CanvasComponent): any {
  switch (component.type) {
    case "middleware-auth":
      return { error: "Invalid token", code: 401 };
    case "database":
      return { error: "Connection timeout", code: "DB_TIMEOUT" };
    case "external-api":
      return { error: "Service unavailable", status: 503 };
    default:
      return { error: "Internal error", timestamp: Date.now() };
  }
}
