import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  PlayCircle,
  Settings,
  CheckCircle,
  Bot,
  MessageSquare,
  Database,
  Zap,
} from "lucide-react";

const GuideSection = () => {
  const steps = [
    {
      icon: <Database className="w-8 h-8" />,
      title: "Create Projects",
      description:
        "Start with REST API, GraphQL, or WebSocket projects. Choose from templates or build from scratch.",
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Build API Flows",
      description:
        "Drag and drop components to design your API architecture. Connect endpoints, add logic, and configure responses.",
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "Test & Simulate",
      description:
        "Run real-time simulations to test your API endpoints. Monitor performance and debug issues instantly.",
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Assistance",
      description:
        "Get help from our AI assistant for debugging, optimization suggestions, and best practices guidance.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-pulse"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/5 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent/5 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/3 w-16 h-16 bg-primary/5 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            How It Works
          </Badge>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            Build APIs in
            <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-gradient-x">
              {" "}
              4 Simple Steps
            </span>
          </h2>
          <p
            className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            OneBlock streamlines the entire API development process from design
            to testing, with AI assistance at every step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group animate-fade-in-up hover:scale-105 transition-all duration-500"
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/20 bg-gradient-to-br from-background to-primary/5 hover:from-primary/10 hover:to-primary/5">
                <CardContent className="p-6 text-center relative">
                  {/* Step number with floating animation */}
                  <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm animate-bounce">
                    {index + 1}
                  </div>

                  <div className="relative z-10">
                    {/* Icon with floating and rotation animation */}
                    <div className="mb-4 text-primary inline-flex p-3 bg-primary/10 rounded-full group-hover:animate-bounce transition-all duration-300 group-hover:scale-110">
                      <div className="group-hover:rotate-12 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm group-hover:text-foreground transition-colors duration-300">
                      {step.description}
                    </p>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                </CardContent>
              </Card>

              {/* Arrow between steps with flow animation */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-20">
                  <div className="animate-pulse">
                    <ArrowRight className="w-6 h-6 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div
          className="mt-20 text-center animate-fade-in-up"
          style={{ animationDelay: "1.6s" }}
        >
          <Card className="max-w-6xl mx-auto overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-2xl transition-all duration-500">
            <CardContent className="p-8">
              <h3
                className="text-3xl font-bold mb-8 text-foreground animate-fade-in-up"
                style={{ animationDelay: "1.8s" }}
              >
                See OneBlock in Action
              </h3>

              {/* Main Workflow Diagram */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Left: Project Creation & Flow Building */}
                <div
                  className="space-y-6 animate-fade-in-left"
                  style={{ animationDelay: "2s" }}
                >
                  <h4 className="text-xl font-semibold text-foreground mb-4">
                    Project Development Workflow
                  </h4>

                  {/* Project Creation with floating animation */}
                  <div className="bg-white/60 rounded-lg p-4 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-float">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                        <Database className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        Create Project
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <span className="hover:text-primary transition-colors duration-300">
                        REST API
                      </span>
                      <span>•</span>
                      <span className="hover:text-primary transition-colors duration-300">
                        GraphQL
                      </span>
                      <span>•</span>
                      <span className="hover:text-primary transition-colors duration-300">
                        WebSocket
                      </span>
                    </div>
                  </div>

                  {/* Flow Building with connection animation */}
                  <div
                    className="bg-white/60 rounded-lg p-4 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-float"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center animate-pulse">
                        <Settings className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="font-medium text-foreground">
                        Design Flow
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-ping"></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60 animate-flow"></div>
                      </div>
                      <div
                        className="w-3 h-3 bg-secondary rounded-full animate-ping"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-secondary to-accent relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-secondary/60 to-accent/60 animate-flow"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                      <div
                        className="w-3 h-3 bg-accent rounded-full animate-ping"
                        style={{ animationDelay: "0.6s" }}
                      ></div>
                    </div>
                  </div>

                  {/* Simulation with pulse animation */}
                  <div
                    className="bg-white/60 rounded-lg p-4 border border-primary/20 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
                        <PlayCircle className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-foreground">
                        Test & Simulate
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <span className="hover:text-accent transition-colors duration-300">
                        Real-time Testing
                      </span>
                      <span>•</span>
                      <span className="hover:text-accent transition-colors duration-300">
                        Performance Metrics
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: AI Assistant & Real-time Features */}
                <div
                  className="space-y-6 animate-fade-in-right"
                  style={{ animationDelay: "2.2s" }}
                >
                  <h4 className="text-xl font-semibold text-foreground mb-4">
                    AI-Powered Features
                  </h4>

                  {/* AI Chatbot with glow effect */}
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/30 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 animate-float">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        AI Assistant
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm hover:text-primary transition-colors duration-300">
                        <MessageSquare className="w-3 h-3 text-primary animate-bounce" />
                        <span className="text-muted-foreground">
                          Debug help
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm hover:text-primary transition-colors duration-300">
                        <Zap className="w-3 h-3 text-primary animate-pulse" />
                        <span className="text-muted-foreground">
                          Optimization tips
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm hover:text-primary transition-colors duration-300">
                        <CheckCircle
                          className="w-3 h-3 text-primary animate-bounce"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <span className="text-muted-foreground">
                          Best practices
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Collaboration with sparkle effect */}
                  <div
                    className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-4 border border-secondary/30 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 hover:scale-105 animate-float"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center animate-pulse">
                        <Zap className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="font-medium text-foreground">
                        Real-time Features
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        <span className="text-muted-foreground hover:text-green-500 transition-colors duration-300">
                          Live collaboration
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div
                          className="w-2 h-2 bg-blue-500 rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <span className="text-muted-foreground hover:text-blue-500 transition-colors duration-300">
                          Auto-save
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <div
                          className="w-2 h-2 bg-purple-500 rounded-full animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                        <span className="text-muted-foreground hover:text-purple-500 transition-colors duration-300">
                          Instant feedback
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Community Sharing with wave effect */}
                  <div
                    className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-4 border border-accent/30 hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105 animate-float"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-foreground">
                        Share & Collaborate
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground hover:text-accent transition-colors duration-300">
                          Public projects
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground hover:text-accent transition-colors duration-300">
                          Team collaboration
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-muted-foreground hover:text-accent transition-colors duration-300">
                          Version control
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA with slide-up animation */}
              <div
                className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg p-6 border border-primary/20 animate-slide-up"
                style={{ animationDelay: "2.4s" }}
              >
                <h4 className="text-xl font-semibold text-foreground mb-3">
                  Ready to Build Your First API?
                </h4>
                <p className="text-muted-foreground mb-4">
                  Join thousands of developers who are already using OneBlock to
                  build, test, and deploy APIs faster than ever.
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2 hover:text-primary transition-colors duration-300">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span>No setup required</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-secondary transition-colors duration-300">
                    <div
                      className="w-2 h-2 bg-secondary rounded-full animate-pulse"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <span>AI-powered assistance</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:text-accent transition-colors duration-300">
                    <div
                      className="w-2 h-2 bg-accent rounded-full animate-pulse"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                    <span>Real-time collaboration</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes flow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-flow {
          animation: flow 2s linear infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default GuideSection;
