import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, PlayCircle, Settings, CheckCircle } from "lucide-react";

const GuideSection = () => {
  const steps = [
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Configure Services",
      description: "Set up your REST API, GraphQL, or WebSocket endpoints with our intuitive interface.",
      color: "from-primary/20 to-primary/5"
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "Run Simulations",
      description: "Test your backend services in real-time with our powerful simulation engine.",
      color: "from-accent-foreground/20 to-accent-foreground/5"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Analyze Results", 
      description: "Get detailed insights and performance metrics for your backend services.",
      color: "from-secondary/40 to-secondary/10"
    }
  ];

  return (
    <section className="py-24 relative">
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
            From setup to deployment, OneBlock makes backend simulation simple and efficient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/20">
                <CardContent className="p-8 text-center relative overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-50`} />
                  
                  {/* Step number */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="mb-6 text-primary inline-flex p-4 bg-card rounded-full">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
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

        {/* Demo Video Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-4xl mx-auto overflow-hidden border-2 border-primary/20">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 text-primary mb-4 mx-auto animate-glow cursor-pointer hover:scale-110 transition-transform" />
                  <p className="text-xl font-semibold">Watch Demo Video</p>
                  <p className="text-muted-foreground">See OneBlock in action</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default GuideSection;