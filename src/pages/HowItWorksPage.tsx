import PageLayout from "@/components/PageLayout";
import HowItWorks from "@/components/HowItWorks";
import Vehicle3DSection from "@/components/Vehicle3DSection";

const HowItWorksPage = () => (
  <PageLayout
    title="How Doorstep Car & Bike Service Works | Mr Red OSB Service Bangalore"
    description="Book online, a certified mechanic comes to your location, and your vehicle is fixed on the spot. Learn how Mr Red OSB Service works in 3 simple steps."
    canonicalPath="/how-it-works"
  >
    <HowItWorks />
    <Vehicle3DSection />
  </PageLayout>
);

export default HowItWorksPage;
