import PageLayout from "@/components/PageLayout";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";

const CarServicePage = () => (
  <PageLayout
    title="Car service and repair near Sarjapur Road | Mr Red OSB Service"
    description="Looking for car service in HSR Layout or a car mechanic near me? We provide premium car maintenance and are the best nearby car service centre in Bangalore."
    canonicalPath="/car-service"
  >
    <StatsSection />
    <ServicesSection />
  </PageLayout>
);

export default CarServicePage;
