import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import HowItWorks from "@/components/HowItWorks";
import StatsSection from "@/components/StatsSection";
import Vehicle3DSection from "@/components/Vehicle3DSection";
import EmergencySection from "@/components/EmergencySection";
import BookingSection from "@/components/BookingSection";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import HeroSection from "@/components/HeroSection";
import WelcomePopup from "@/components/WelcomePopup";
import FAQSection from "@/components/FAQSection";
import ServiceAreaSection from "@/components/ServiceAreaSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <WelcomePopup />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <Vehicle3DSection />
      <HowItWorks />
      <EmergencySection />
      <BookingSection />
      <ServiceAreaSection />
      <FAQSection />
      <FooterSection />
      <WhatsAppButton />
      <FloatingContactButtons />
    </div>
  );
};

export default Index;
