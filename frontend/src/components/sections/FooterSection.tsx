import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Linkedin, Mail, Code, Zap } from "lucide-react";

const FooterSection = () => {
  const footerLinks = {
    Product: [
      { name: "REST API", href: "#" },
      { name: "GraphQL", href: "#" },
      { name: "WebSocket", href: "#" },
      { name: "Mock Data", href: "#" },
      { name: "Testing Tools", href: "#" }
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
      { name: "Contact", href: "#" }
    ],
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Community", href: "#" },
      { name: "Status", href: "#" }
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
      { name: "Compliance", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "GitHub", icon: <Github className="w-5 h-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { name: "Email", icon: <Mail className="w-5 h-5" />, href: "#" }
  ];

  return (
    <footer className="bg-accent border-t border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-foreground/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Newsletter Section */}
        <div className="py-16 text-center border-b border-border">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Stay Updated
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get the latest updates from <span className="text-primary">OneBlock</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for product updates, new features, and developer tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email..." 
              className="flex-1 px-4 py-3 rounded-lg bg-card border-2 border-input focus:border-primary outline-none transition-colors"
            />
            <Button className="px-8 py-3">Subscribe</Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-foreground rounded-lg flex items-center justify-center">
                  <Code className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">OneBlock</span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The ultimate platform for backend service simulation. 
                Test REST APIs, GraphQL, and WebSockets with ease.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/20 hover:text-primary"
                  >
                    {link.icon}
                  </Button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <div key={category} className="col-span-1">
                <h3 className="font-semibold mb-4 text-foreground">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Bottom Section */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-muted-foreground text-sm">
            © 2024 OneBlock. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-muted-foreground">Built with</span>
            <Badge variant="secondary" className="px-3 py-1">React</Badge>
            <Badge variant="secondary" className="px-3 py-1">TypeScript</Badge>
            <Badge variant="secondary" className="px-3 py-1">Tailwind</Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;