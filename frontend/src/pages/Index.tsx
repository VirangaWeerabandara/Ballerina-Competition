import HeroSection from "@/components/sections/HeroSection";
import GuideSection from "@/components/sections/GuideSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";
import NavigationBar from "@/components/sections/NavigationBar";

const Index = () => {
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
