import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PlayCircle, Settings, CheckCircle } from "lucide-react";

const GuideSection = () => {
  const steps = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Configure Services",
      description:
        "Set up your REST API, GraphQL, or WebSocket endpoints with our intuitive interface.",
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "Run Simulations",
      description:
        "Test your backend services in real-time with our powerful simulation engine.",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Analyze Results",
      description:
        "Get detailed insights and performance metrics for your backend services.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            How It Works
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started in
            <span className="text-primary"> 3 Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From setup to deployment, OneBlock makes backend simulation simple
            and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <Card className="h-full border-2 border-border hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 bg-primary/10">
                <CardContent className="p-8 text-center relative">
                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="relative z-10">
                    <div className="mb-6 text-primary inline-flex p-4 bg-primary/10 rounded-full">
                      {step.icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Animated Application Flow Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-8 text-foreground">
                See How OneBlock Works
              </h3>

              {/* Animated Flow Diagram */}
              <div className="relative flex items-center justify-center space-x-8 mb-8">
                {/* Step 1: Design */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border-2 border-primary/30 animate-pulse">
                      <Settings className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                      1
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-2 bg-gradient-to-r from-primary/40 to-primary/20 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-foreground mt-2">
                      Design
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="flex items-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-primary/60 to-primary/30 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-primary/60 border-t-2 border-t-transparent border-b-2 border-b-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Step 2: Build */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center border-2 border-secondary/30 animate-pulse">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                      2
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-2 bg-gradient-to-r from-secondary/40 to-secondary/20 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-foreground mt-2">
                      Build
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="flex items-center">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-secondary/60 to-secondary/30 relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-secondary/60 border-t-2 border-t-transparent border-b-2 border-b-transparent animate-pulse"></div>
                  </div>
                </div>

                {/* Step 3: Test */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/30 animate-pulse">
                      <PlayCircle className="w-8 h-8 text-accent-foreground" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
                      3
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-2 bg-gradient-to-r from-accent/40 to-accent/20 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-foreground mt-2">
                      Test
                    </p>
                  </div>
                </div>
              </div>

              {/* Animated API Flow */}
              <div className="relative bg-white/50 rounded-lg p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-foreground">
                      API Flow
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">Real-time</div>
                </div>

                {/* Animated API Nodes */}
                <div className="flex items-center justify-center space-x-4">
                  {/* Request Node */}
                  <div className="relative">
                    <div className="w-12 h-8 bg-primary/20 rounded-lg border border-primary/30 flex items-center justify-center animate-pulse">
                      <span className="text-xs font-medium text-primary">
                        GET
                      </span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                      Request
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-primary/40 to-secondary/40 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60 h-full rounded-full animate-pulse"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-secondary/60 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>

                  {/* Processing Node */}
                  <div className="relative">
                    <div className="w-12 h-8 bg-secondary/20 rounded-lg border border-secondary/30 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-spin"></div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                      Process
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-secondary/40 to-accent/40 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 to-accent/60 h-full rounded-full animate-pulse"></div>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-accent/60 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>

                  {/* Response Node */}
                  <div className="relative">
                    <div className="w-12 h-8 bg-accent/20 rounded-lg border border-accent/30 flex items-center justify-center animate-pulse">
                      <span className="text-xs font-medium text-accent-foreground">
                        200
                      </span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                      Response
                    </div>
                  </div>
                </div>

                {/* Data Flow Animation */}
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex space-x-1">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-primary/60 rounded-full animate-ping"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground mt-6 text-sm">
                Watch your API come to life with real-time simulation and
                testing
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GuideSection;
