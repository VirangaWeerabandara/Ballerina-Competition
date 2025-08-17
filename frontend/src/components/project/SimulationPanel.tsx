import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [simulationStats, setSimulationStats] = useState({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    uptime: 0,
  });

  // Simulate the backend service execution
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Simulate random activity
      if (blocks.length > 0) {
        const randomBlock = blocks[Math.floor(Math.random() * blocks.length)];
        const logTypes: SimulationLog["type"][] = [
          "info",
          "success",
          "warning",
        ];
        const randomType =
          logTypes[Math.floor(Math.random() * logTypes.length)];

        const messages = {
          "get-endpoint": [
            "Received GET request",
            "Processing query parameters",
            "Returning response",
          ],
          "post-endpoint": [
            "Received POST request",
            "Validating request body",
            "Creating new resource",
          ],
          database: [
            "Executing query",
            "Connection established",
            "Data retrieved successfully",
          ],
          auth: [
            "Validating token",
            "User authenticated",
            "Permissions verified",
          ],
          "websocket-server": [
            "New connection established",
            "Broadcasting message",
            "Client disconnected",
          ],
        };

        const blockMessages = messages[
          randomBlock.id as keyof typeof messages
        ] || ["Processing..."];
        const randomMessage =
          blockMessages[Math.floor(Math.random() * blockMessages.length)];

        const newLog: SimulationLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date(),
          blockId: randomBlock.instanceId,
          blockName: randomBlock.name,
          type: randomType,
          message: randomMessage,
          data:
            randomType === "success"
              ? { responseTime: Math.floor(Math.random() * 200) + 50 }
              : undefined,
        };

        setLogs((prev) => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs

        // Update active blocks
        setActiveBlocks((prev) => new Set([...prev, randomBlock.instanceId]));
        setTimeout(() => {
          setActiveBlocks((prev) => {
            const newSet = new Set(prev);
            newSet.delete(randomBlock.instanceId);
            return newSet;
          });
        }, 1000);

        // Update stats
        setSimulationStats((prev) => ({
          ...prev,
          totalRequests: prev.totalRequests + 1,
          successfulRequests:
            randomType === "success"
              ? prev.successfulRequests + 1
              : prev.successfulRequests,
          failedRequests:
            randomType === "error"
              ? prev.failedRequests + 1
              : prev.failedRequests,
          averageResponseTime: Math.floor(Math.random() * 150) + 75,
          uptime: prev.uptime + 1,
        }));
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating, blocks]);

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

  const getBlockIcon = (blockId: string) => {
    if (
      blockId.includes("endpoint") ||
      blockId.includes("get") ||
      blockId.includes("post")
    ) {
      return <Globe className="w-4 h-4" />;
    }
    if (blockId.includes("database")) {
      return <Database className="w-4 h-4" />;
    }
    return <Zap className="w-4 h-4" />;
  };

  const handleReset = () => {
    setLogs([]);
    setActiveBlocks(new Set());
    setSimulationStats({
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      uptime: 0,
    });
    onReset();
  };

  return (
    <div className="w-96 bg-card border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Simulation</h3>
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
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isSimulating ? "bg-green-500 animate-pulse" : "bg-gray-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isSimulating ? "Running" : "Stopped"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="logs" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {logs.map((log) => (
                  <Card key={log.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-3">
                      <div className="flex items-start space-x-2">
                        {getLogIcon(log.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm truncate">
                              {log.blockName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {log.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {log.message}
                          </p>
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
                    <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No logs yet. Start simulation to see activity.
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
            </div>
          </TabsContent>

          <TabsContent value="blocks" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {blocks.map((block) => (
                  <Card
                    key={block.instanceId}
                    className={`transition-all ${
                      activeBlocks.has(block.instanceId)
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded ${block.color} text-white flex items-center justify-center`}
                        >
                          {getBlockIcon(block.id)}
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
                ))}
                {blocks.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No blocks in canvas yet.
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
