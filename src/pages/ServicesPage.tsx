import PageLayout from "@/components/PageLayout";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";

const ServicesPage = () => (
  <PageLayout
    title="Car, Bike & Electric Bike Service in Bangalore | Mr Red OSB Service"
    description="Explore car, bike & electric bike repair services in Bangalore — EV battery service, motor diagnostics, oil change, tyre replacement, and more at your doorstep near HSR Layout."
    canonicalPath="/services"
  >
    <StatsSection />
    <ServicesSection />
  </PageLayout>
);

export default ServicesPage;
