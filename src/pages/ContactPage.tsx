import PageLayout from "@/components/PageLayout";
import EmergencySection from "@/components/EmergencySection";
import ServiceAreaSection from "@/components/ServiceAreaSection";

const ContactPage = () => (
  <PageLayout
    title="Contact Us | Mr Red OSB Service – Car & Bike Repair Bangalore"
    description="Contact Mr Red OSB Service for emergency roadside assistance, doorstep car & bike repair in Bangalore. Call +91 98869 19869 or WhatsApp us now."
    canonicalPath="/contact"
  >
    <EmergencySection />
    <ServiceAreaSection />
  </PageLayout>
);

export default ContactPage;
