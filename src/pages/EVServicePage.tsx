import PageLayout from "@/components/PageLayout";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";

const EVServicePage = () => (
  <PageLayout
    title="Electric bike and scooter service in Bengaluru | Mr Red OSB Service"
    description="Professional electric bike service in Bengaluru. We offer EV two wheeler service, including electric scooter repair near HSR Layout and Sarjapur Road."
    canonicalPath="/ev-service"
  >
    <StatsSection />
    <ServicesSection />
  </PageLayout>
);

export default EVServicePage;
