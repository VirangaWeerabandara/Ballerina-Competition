import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-accent to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,132,27,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,132,27,0.05),transparent_70%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-accent-foreground/20 rounded-full animate-float [animation-delay:2s]" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary/30 rounded-full animate-float [animation-delay:4s]" />

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-slide-up">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Backend Simulation Platform
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            OneBlock
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Simulate, Test, and Deploy backend services with ease. Support for{" "}
            <span className="text-primary font-semibold">REST APIs</span>,
            <span className="text-primary font-semibold"> GraphQL</span>, and
            <span className="text-primary font-semibold"> WebSockets</span> in
            one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-6 animate-glow">
              <Code className="w-5 h-5 mr-2" />
              Start Building
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <Database className="w-5 h-5 mr-2" />
              View Docs
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
            <Badge variant="secondary" className="px-4 py-2">
              REST API
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              GraphQL
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              WebSocket
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Real-time Testing
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              Mock Data
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
