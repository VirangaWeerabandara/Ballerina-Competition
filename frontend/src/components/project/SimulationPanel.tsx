import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Square,
  RotateCcw,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Database,
  Globe,
  Info,
  ArrowRight,
  Server,
  Users,
  Shield,
  FileText,
  Loader2,
  Pause,
} from "lucide-react";
import { CanvasBlock, Connection } from "./ProjectCanvas";

export interface SimulationLog {
  id: string;
  timestamp: Date;
  blockId: string;
  blockName: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  data?: any;
  explanation?: string;
  stepNumber?: number;
}

interface SimulationPanelProps {
  blocks: CanvasBlock[];
  connections: Connection[];
  isSimulating: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  blocks,
  connections,
  isSimulating,
  onStart,
  onStop,
  onReset,
}) => {
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [activeBlocks, setActiveBlocks] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationStats, setSimulationStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    uptime: 0,
  });
  const [simulationSpeed, setSimulationSpeed] = useState(5000); // 5 seconds per step (much slower default)

  // Store timeouts for cleanup
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);

  // Cleanup function to clear all timeouts
  const clearAllTimeouts = () => {
    timeoutIds.forEach((id) => clearTimeout(id));
    setTimeoutIds([]);
  };

  // Cleanup on unmount or when simulation stops
  useEffect(() => {
    if (!isSimulating) {
      clearAllTimeouts();
      setActiveBlocks(new Set());
      setIsPaused(false);
    }
  }, [isSimulating]);

  // Cleanup when paused
  useEffect(() => {
    if (isPaused) {
      clearAllTimeouts();
    }
  }, [isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Educational content for different block types
  const getBlockExplanation = (blockType: string, action: string) => {
    const explanations = {
      "get-endpoint": {
        start:
          "This GET endpoint receives HTTP requests from clients. It's like a reception desk that handles incoming requests.",
        process:
          "The endpoint processes the request, validates parameters, and prepares to fetch data.",
        complete:
          "Data is successfully retrieved and formatted as a JSON response to send back to the client.",
      },
      "post-endpoint": {
        start:
          "This POST endpoint receives data from clients to create or update resources. It's like a form submission handler.",
        process:
          "The endpoint validates the incoming data, checks business rules, and prepares to save the information.",
        complete:
          "The new resource is successfully created and stored in the database.",
      },
      database: {
        start:
          "The database component establishes a secure connection to the data storage system.",
        process:
          "Executing the SQL query to retrieve or modify data according to the request.",
        complete:
          "Database operation completed successfully, data is ready for the next step in the flow.",
      },
      auth: {
        start:
          "Authentication service validates the user's identity using tokens or credentials.",
        process: "Checking user permissions and validating the security token.",
        complete:
          "User is authenticated and authorized to access the requested resource.",
      },
    };

    return (
      explanations[blockType as keyof typeof explanations]?.[
        action as keyof (typeof explanations)[keyof typeof explanations]
      ] ||
      "This service component is processing the request according to its configured logic."
    );
  };

  // Simulate the backend service execution with better pacing and explanations
  useEffect(() => {
    if (!isSimulating) return;

    let stepCounter = 0;
    const totalSteps = Math.max(blocks.length * 3, 6); // At least 6 steps for educational purposes
    const newTimeoutIds: NodeJS.Timeout[] = [];

    const runSimulationStep = () => {
      if (stepCounter >= totalSteps || !isSimulating || isPaused) {
        if (stepCounter >= totalSteps) {
          onStop();
        }
        return;
      }

      stepCounter++;
      setCurrentStep(stepCounter);

      // Find blocks that can be processed at this step
      const availableBlocks = blocks.filter((block) => {
        // Entry points (no incoming connections) can start immediately
        const isEntryPoint = connections.every(
          (conn) => conn.toBlockId !== block.instanceId
        );
        if (isEntryPoint && stepCounter <= 2) return true;

        // Other blocks can be processed after their dependencies
        const hasDependencies = connections.some(
          (conn) => conn.toBlockId === block.instanceId
        );
        if (hasDependencies && stepCounter > 2) return true;

        return false;
      });

      if (availableBlocks.length > 0) {
        const selectedBlock =
          availableBlocks[Math.floor(Math.random() * availableBlocks.length)];

        // Simulate the three phases of processing
        simulateBlockProcessing(selectedBlock, stepCounter, newTimeoutIds);
      }

      // Schedule next step (only if not paused and still simulating)
      if (!isPaused && isSimulating) {
        const timeoutId = setTimeout(runSimulationStep, simulationSpeed);
        newTimeoutIds.push(timeoutId);
      }
    };

    // Start the simulation after a brief delay
    const initialTimeoutId = setTimeout(runSimulationStep, 2000);
    newTimeoutIds.push(initialTimeoutId);

    // Store all timeout IDs for cleanup
    setTimeoutIds(newTimeoutIds);
  }, [isSimulating, blocks, connections, simulationSpeed, isPaused]);

  // Simulate block processing with three phases
  const simulateBlockProcessing = (
    block: CanvasBlock,
    step: number,
    timeoutIds: NodeJS.Timeout[]
  ) => {
    const phases = [
      {
        action: "start",
        message: `Starting ${block.name}`,
        type: "info" as const,
        explanation: getBlockExplanation(block.id, "start"),
      },
      {
        action: "process",
        message: `Processing request in ${block.name}`,
        type: "info" as const,
        explanation: getBlockExplanation(block.id, "process"),
      },
      {
        action: "complete",
        message: `${block.name} completed successfully`,
        type: "success" as const,
        explanation: getBlockExplanation(block.id, "complete"),
      },
    ];

    phases.forEach((phase, index) => {
      const timeoutId = setTimeout(() => {
        // Check if simulation is still running and not paused
        if (!isSimulating || isPaused) return;

        const log: SimulationLog = {
          id: `log_${Date.now()}_${block.instanceId}_${phase.action}`,
          timestamp: new Date(),
          blockId: block.instanceId,
          blockName: block.name,
          type: phase.type,
          message: phase.message,
          explanation: phase.explanation,
          stepNumber: step,
          data: {
            responseTime: Math.floor(Math.random() * 300) + 100,
            phase: phase.action,
          },
        };

        setLogs((prev) => [log, ...prev.slice(0, 49)]); // Keep last 50 logs

        // Show active state
        setActiveBlocks((prev) => new Set([...prev, block.instanceId]));

        // Remove active state after a delay
        const activeTimeoutId = setTimeout(() => {
          if (isSimulating) {
            // Only update if still simulating
            setActiveBlocks((prev) => {
              const newSet = new Set(prev);
              newSet.delete(block.instanceId);
              return newSet;
            });
          }
        }, 2000);
        timeoutIds.push(activeTimeoutId);

        // Update stats
        setSimulationStats((prev) => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          successfulRequests: prev.successfulRequests + 1,
          averageResponseTime: Math.floor(Math.random() * 200) + 100,
          uptime: prev.uptime + 1,
        }));
      }, index * 1500);

      timeoutIds.push(timeoutId);
    });
  };

  const getLogIcon = (type: SimulationLog["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBlockIcon = (blockId: string, className = "w-4 h-4") => {
    if (
      blockId.includes("endpoint") ||
      blockId.includes("get") ||
      blockId.includes("post")
    ) {
      return <Globe className={className} />;
    }
    if (blockId.includes("database")) {
      return <Database className={className} />;
    }
    if (blockId.includes("auth")) {
      return <Shield className={className} />;
    }
    return <Server className={className} />;
  };

  const handleReset = () => {
    // Clear all timeouts first
    clearAllTimeouts();

    // Reset all state
    setLogs([]);
    setActiveBlocks(new Set());
    setCurrentStep(0);
    setIsPaused(false);
    setSimulationStats({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      uptime: 0,
    });

    // Call the parent reset function
    onReset();
  };

  const handleSpeedChange = (speed: number) => {
    setSimulationSpeed(speed);
  };

  const handlePauseToggle = () => {
    if (isPaused) {
      // Resume simulation
      setIsPaused(false);
    } else {
      // Pause simulation - clear all pending timeouts
      clearAllTimeouts();
      setIsPaused(true);
    }
  };

  return (
    <div className="w-96 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" />
            API Simulation
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={isSimulating ? "destructive" : "default"}
              onClick={isSimulating ? onStop : onStart}
              disabled={blocks.length === 0}
            >
              {isSimulating ? (
                <>
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </>
              )}
            </Button>

            {isSimulating && (
              <Button
                size="sm"
                variant={isPaused ? "default" : "outline"}
                onClick={handlePauseToggle}
                disabled={blocks.length === 0}
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </>
                )}
              </Button>
            )}

            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status and Speed Control */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isSimulating
                  ? isPaused
                    ? "bg-yellow-500"
                    : "bg-green-500 animate-pulse"
                  : "bg-gray-500"
              }`}
            />
            <span className="text-sm text-muted-foreground">
              {isSimulating ? (isPaused ? "Paused" : "Running") : "Stopped"}
            </span>
            {isSimulating && (
              <Badge variant="outline" className="text-xs">
                Step {currentStep}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {isSimulating && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>
                  Step {currentStep} of {Math.max(blocks.length * 3, 6)}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(
                      (currentStep / Math.max(blocks.length * 3, 6)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Speed:</span>
            <div className="flex space-x-1">
              {[1000, 2000, 3000, 5000].map((speed) => (
                <Button
                  key={speed}
                  size="sm"
                  variant={simulationSpeed === speed ? "default" : "outline"}
                  className="h-6 px-2 text-xs"
                  onClick={() => handleSpeedChange(speed)}
                >
                  {speed === 1000
                    ? "Fast"
                    : speed === 2000
                    ? "Normal"
                    : speed === 3000
                    ? "Slow"
                    : "Very Slow"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="logs" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="logs">Flow Logs</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="blocks">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                {logs.map((log) => (
                  <Card key={log.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-3">
                        {getLogIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-sm truncate">
                              {log.blockName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {log.type}
                            </Badge>
                            {log.stepNumber && (
                              <Badge variant="secondary" className="text-xs">
                                Step {log.stepNumber}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground mb-2">
                            {log.message}
                          </p>
                          {log.explanation && (
                            <div className="bg-muted/50 p-2 rounded-md mb-2">
                              <div className="flex items-center space-x-1 mb-1">
                                <Info className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-medium text-muted-foreground">
                                  What's happening:
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {log.explanation}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{log.timestamp.toLocaleTimeString()}</span>
                            {log.data?.responseTime && (
                              <span>• {log.data.responseTime}ms</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {logs.length === 0 && (
                  <div className="text-center py-8">
                    <Server className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      No simulation logs yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click Start to see how your API services work together
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-hidden mt-4">
            <div className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {simulationStats.totalRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Requests
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {simulationStats.successfulRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Successful
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {simulationStats.averageResponseTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg Response
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {Math.floor(simulationStats.uptime / 60)}m
                    </div>
                    <div className="text-xs text-muted-foreground">Uptime</div>
                  </CardContent>
                </Card>
              </div>

              {/* Educational Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    How API Services Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    • <strong>Endpoints</strong> receive HTTP requests from
                    clients
                  </p>
                  <p>
                    • <strong>Authentication</strong> validates user identity
                    and permissions
                  </p>
                  <p>
                    • <strong>Database</strong> stores and retrieves data
                  </p>
                  <p>
                    • <strong>Services</strong> process business logic and data
                  </p>
                  <p>
                    • Each step processes data and passes it to the next service
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blocks" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                {blocks.map((block) => (
                  <TooltipProvider key={block.instanceId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Card
                          className={`transition-all cursor-pointer ${
                            activeBlocks.has(block.instanceId)
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center border border-border">
                                {getBlockIcon(
                                  block.id,
                                  "w-5 h-5 text-foreground"
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {block.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {block.category}
                                </div>
                              </div>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  activeBlocks.has(block.instanceId)
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-gray-300"
                                }`}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="space-y-2">
                          <p className="font-medium">{block.name}</p>
                          <p className="text-sm">{block.description}</p>
                          <div className="flex items-center space-x-2 text-xs">
                            <span>Inputs: {block.inputs}</span>
                            <ArrowRight className="w-3 h-3" />
                            <span>Outputs: {block.outputs}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
                {blocks.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No services in canvas yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Drag services from the palette to build your API
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimulationPanel;
