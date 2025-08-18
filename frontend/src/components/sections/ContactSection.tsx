import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Send } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Mail className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-primary">Get Started?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or need help? Contact our team and we'll get back to
            you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MessageSquare className="w-6 h-6 mr-3 text-primary" />
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    className="border-2 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    className="border-2 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Your Company"
                  className="border-2 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  className="min-h-[120px] border-2 focus:border-primary resize-none"
                />
              </div>

              <Button className="w-full text-lg py-6 animate-glow">
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">
                  Why Choose OneBlock?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                    <div>
                      <h4 className="font-semibold mb-1">Lightning Fast</h4>
                      <p className="text-muted-foreground">
                        Deploy and test your services in seconds, not hours.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                    <div>
                      <h4 className="font-semibold mb-1">Developer Friendly</h4>
                      <p className="text-muted-foreground">
                        Intuitive interface designed by developers, for
                        developers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3" />
                    <div>
                      <h4 className="font-semibold mb-1">Enterprise Ready</h4>
                      <p className="text-muted-foreground">
                        Scalable architecture for teams of all sizes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent-foreground/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Enterprise Support</h3>
                <p className="text-muted-foreground mb-6">
                  Need dedicated support for your team? Our enterprise plan
                  includes:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-accent-foreground rounded-full" />
                    <span className="text-sm">24/7 Priority Support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-accent-foreground rounded-full" />
                    <span className="text-sm">Custom Integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-accent-foreground rounded-full" />
                    <span className="text-sm">Dedicated Account Manager</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
