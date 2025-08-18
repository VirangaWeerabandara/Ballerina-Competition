import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  ArrowRight,
  BarChart3,
  Timer,
  TrendingUp,
} from "lucide-react";
import {
  CanvasComponent,
  Connection,
  SimulationStep,
  SimulationState,
} from "@/types/api-builder";

interface SimulationPanelProps {
  components: CanvasComponent[];
  connections: Connection[];
  simulation: SimulationState;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const SimulationPanel: React.FC<SimulationPanelProps> = ({
  components,
  connections,
  simulation,
  onStart,
  onStop,
  onReset,
  onSpeedChange,
  className = "",
}) => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    throughput: 0,
  });

  // Calculate statistics from simulation steps
  useEffect(() => {
    const requests = simulation.steps.filter((step) => step.type === "request");
    const responses = simulation.steps.filter(
      (step) => step.type === "response"
    );
    const errors = simulation.steps.filter((step) => step.type === "error");

    const responseTimes = simulation.steps
      .filter((step) => step.duration)
      .map((step) => step.duration!);

    setStats({
      totalRequests: requests.length,
      successfulRequests: responses.length,
      failedRequests: errors.length,
      avgResponseTime:
        responseTimes.length > 0
          ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          : 0,
      throughput:
        simulation.isRunning && requests.length > 0
          ? requests.length / ((Date.now() - requests[0].timestamp) / 1000)
          : 0,
    });
  }, [simulation.steps]);

  const getStepIcon = (type: SimulationStep["type"]) => {
    switch (type) {
      case "request":
        return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case "response":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "process":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStepBadgeVariant = (type: SimulationStep["type"]) => {
    switch (type) {
      case "request":
        return "default";
      case "response":
        return "default";
      case "process":
        return "secondary";
      case "error":
        return "destructive";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getComponentName = (componentId: string) => {
    const component = components.find((c) => c.instanceId === componentId);
    return component?.name || "Unknown Component";
  };

  return (
    <div
      className={`w-96 bg-card border-l border-border h-full flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Simulation</h2>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={simulation.isRunning ? "destructive" : "default"}
              onClick={simulation.isRunning ? onStop : onStart}
              disabled={components.length === 0}
            >
              {simulation.isRunning ? (
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
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              disabled={simulation.isRunning}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status and Speed Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  simulation.isRunning
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-500"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                {simulation.isRunning ? "Running" : "Stopped"}
              </span>
            </div>

            {simulation.isRunning && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Speed:</span>
                <select
                  value={simulation.speed}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="text-xs bg-background border rounded px-2 py-1"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {simulation.isRunning && simulation.steps.length > 0 && (
            <div className="space-y-1">
              <Progress
                value={(simulation.currentStep / simulation.steps.length) * 100}
                className="h-2"
              />
              <div className="text-xs text-muted-foreground text-center">
                Step {simulation.currentStep + 1} of {simulation.steps.length}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="flow" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="flow">Flow</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3">
                {simulation.steps.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No simulation data yet. Start the simulation to see the
                      API flow.
                    </p>
                  </div>
                ) : (
                  simulation.steps.map((step, index) => (
                    <Card
                      key={step.id}
                      className={`transition-all ${
                        index === simulation.currentStep
                          ? "ring-2 ring-primary bg-primary/5"
                          : index < simulation.currentStep
                          ? "opacity-75"
                          : "opacity-50"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          {getStepIcon(step.type)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm truncate">
                                {getComponentName(step.componentId)}
                              </span>
                              <Badge
                                variant={getStepBadgeVariant(step.type)}
                                className="text-xs"
                              >
                                {step.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              {step.message}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimestamp(step.timestamp)}</span>
                              </div>
                              {step.duration && <span>{step.duration}ms</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-hidden mt-4">
            <div className="px-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {stats.totalRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Requests
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {stats.successfulRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Successful
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {Math.round(stats.avgResponseTime)}ms
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg Response
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-500">
                      {stats.failedRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Success Rate */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Success Rate</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-2">
                    <Progress
                      value={
                        stats.totalRequests > 0
                          ? (stats.successfulRequests / stats.totalRequests) *
                            100
                          : 0
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium">
                      {stats.totalRequests > 0
                        ? Math.round(
                            (stats.successfulRequests / stats.totalRequests) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Throughput */}
              {simulation.isRunning && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Live Throughput
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg font-bold">
                      {stats.throughput.toFixed(2)} req/s
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {simulation.steps.map((step) => (
                  <div
                    key={step.id}
                    className="text-xs font-mono p-2 bg-muted/50 rounded"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-muted-foreground">
                        {formatTimestamp(step.timestamp)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {step.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div>{step.message}</div>
                    {step.data && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-muted-foreground">
                          Data
                        </summary>
                        <pre className="mt-1 text-xs overflow-auto">
                          {JSON.stringify(step.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SimulationPanel;
