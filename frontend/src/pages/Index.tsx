import HeroSection from "@/components/sections/HeroSection";
import GuideSection from "@/components/sections/GuideSection";
import ContactSection from "@/components/sections/ContactSection";
import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <GuideSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
