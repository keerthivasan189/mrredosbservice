import PageLayout from "@/components/PageLayout";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";

const BikeServicePage = () => (
  <PageLayout
    title="Bike service and repair in HSR Layout | Mr Red OSB Service"
    description="Top-rated bike service in HSR Layout, Bengaluru. Looking for a motorcycle mechanic or two wheeler service near Sarjapur Road? We offer complete bike maintenance."
    canonicalPath="/bike-service"
  >
    <StatsSection />
    <ServicesSection />
  </PageLayout>
);

export default BikeServicePage;
