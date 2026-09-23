import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingContactButtons from "@/components/FloatingContactButtons";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  canonicalPath: string;
}

const BASE_URL = "https://mrredosbservice.com";

const PageLayout = ({ children, title, description, canonicalPath }: PageLayoutProps) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", `${BASE_URL}${canonicalPath}`, "property");

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE_URL}${canonicalPath}`;

    return () => {
      canonical.href = `${BASE_URL}/`;
    };
  }, [title, description, canonicalPath]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-16">{children}</div>
      <FooterSection />
      <WhatsAppButton />
      <FloatingContactButtons />
    </div>
  );
};

export default PageLayout;
