import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAsgardeo } from "@asgardeo/react";
import HeroSection from "@/components/sections/HeroSection";
import GuideSection from "@/components/sections/GuideSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import NavigationBar from "@/components/sections/NavigationBar";

const Index = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoading } = useAsgardeo();

  useEffect(() => {
    // If user is already signed in and not loading, redirect to projects
    if (isSignedIn && !isLoading) {
      navigate("/projects", { replace: true });
    }
  }, [isSignedIn, isLoading, navigate]);

  // Don't render the landing page if user is signed in
  if (isSignedIn && !isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <NavigationBar />
      <HeroSection />
      <GuideSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
