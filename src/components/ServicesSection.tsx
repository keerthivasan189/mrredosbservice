import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Car, Bike, Battery, Cpu, CircleDot, Fuel, AlertTriangle, Wrench, Truck, Cog, Zap, PlugZap, Settings, ShieldCheck } from "lucide-react";

import hondaLogo from "@/assets/brands/honda.png";
import toyotaLogo from "@/assets/brands/toyota.png";
import hyundaiLogo from "@/assets/brands/hyundai.png";
import marutiLogo from "@/assets/brands/maruti.png";
import tataLogo from "@/assets/brands/tata.png";
import mahindraLogo from "@/assets/brands/mahindra.png";
import bmwLogo from "@/assets/brands/bmw.png";
import mercedesLogo from "@/assets/brands/mercedes.png";
import yamahaLogo from "@/assets/brands/yamaha.png";
import royalenfieldLogo from "@/assets/brands/royalenfield.png";
import bajajLogo from "@/assets/brands/bajaj.png";
import ktmLogo from "@/assets/brands/ktm.png";
import kiaLogo from "@/assets/brands/kia.png";
import fordLogo from "@/assets/brands/ford.png";

type Service = {
  icon: typeof Car;
  title: string;
  desc: string;
  accent: boolean;
};

const bikeServices: Service[] = [
  { icon: Wrench, title: "Engine Repair", desc: "Complete engine overhaul and repair at your doorstep.", accent: false },
  { icon: CircleDot, title: "Puncture Repair", desc: "Quick tyre puncture fix wherever you are.", accent: false },
  { icon: Battery, title: "Battery Replacement", desc: "Dead battery? We bring a fresh one to you.", accent: true },
  { icon: Fuel, title: "Fuel Delivery", desc: "Ran out of fuel? We deliver to your exact location.", accent: true },
  { icon: AlertTriangle, title: "Emergency Breakdown", desc: "24/7 emergency breakdown assistance on any road.", accent: false },
];

const carServices: Service[] = [
  { icon: Battery, title: "Battery Jumpstart", desc: "Instant jumpstart to get you back on the road.", accent: true },
  { icon: Cpu, title: "Engine Check", desc: "Advanced OBD diagnostics to pinpoint any engine issue.", accent: false },
  { icon: CircleDot, title: "Flat Tyre Repair", desc: "Quick puncture repair and tyre replacement service.", accent: false },
  { icon: Truck, title: "Towing Assistance", desc: "Professional towing to the nearest service center.", accent: true },
  { icon: Cog, title: "Roadside Emergency Fix", desc: "On-the-spot repairs for common breakdowns.", accent: false },
];

const electricBikeServices: Service[] = [
  { icon: PlugZap, title: "EV Battery Service", desc: "Lithium-ion battery health check, replacement & recycling.", accent: true },
  { icon: Zap, title: "Charger Repair", desc: "Home & portable charger diagnostics and repair.", accent: false },
  { icon: Cpu, title: "Motor & Controller Check", desc: "BLDC motor inspection and controller diagnostics.", accent: true },
  { icon: Settings, title: "Software & Display Fix", desc: "Firmware updates, error code clearing & display repair.", accent: false },
  { icon: ShieldCheck, title: "Full EV Health Check", desc: "Complete electric bike inspection — brakes, wiring & range test.", accent: false },
  { icon: CircleDot, title: "Tyre & Brake Service", desc: "Disc brake pad replacement and tubeless tyre repair.", accent: true },
];

// ─── Brand logos marquee ────────────────────────────────
const brands = [
  { name: "Honda", logo: hondaLogo },
  { name: "Toyota", logo: toyotaLogo },
  { name: "Hyundai", logo: hyundaiLogo },
  { name: "Maruti Suzuki", logo: marutiLogo },
  { name: "Tata", logo: tataLogo },
  { name: "Mahindra", logo: mahindraLogo },
  { name: "BMW", logo: bmwLogo },
  { name: "Mercedes", logo: mercedesLogo },
  { name: "Yamaha", logo: yamahaLogo },
  { name: "Royal Enfield", logo: royalenfieldLogo },
  { name: "Bajaj", logo: bajajLogo },
  { name: "KTM", logo: ktmLogo },
  { name: "Kia", logo: kiaLogo },
  { name: "Ford", logo: fordLogo },
];

const BrandMarquee = () => {
  const doubled = [...brands, ...brands];
  return (
    <div className="w-full overflow-hidden py-8 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="flex animate-marquee gap-12 w-max">
        {doubled.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex flex-col items-center gap-2 min-w-[100px] group"
          >
            <div className="w-16 h-16 rounded-xl bg-white/90 dark:bg-white/95 border border-border/30 flex items-center justify-center p-2.5 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
              <img
                src={brand.logo}
                alt={`${brand.name} bike and car service in Bangalore – Mr Red OSB Service`}
                className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy"
                width={64}
                height={64}
              />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="glass-card-hover p-6 relative overflow-hidden cursor-default group"
      style={{
        background: `radial-gradient(600px circle at var(--x, 50%) var(--y, 50%), hsl(var(${service.accent ? "--accent" : "--primary"}) / 0.06), transparent 40%)`,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), hsl(var(${service.accent ? "--accent" : "--primary"}) / 0.08), transparent 40%)`,
        }}
      />
      <motion.div
        className={`w-12 h-12 rounded-xl ${service.accent ? "bg-accent/10" : "bg-primary/10"} flex items-center justify-center mb-4`}
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <service.icon className={`w-5 h-5 ${service.accent ? "text-accent" : "text-primary"}`} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">{service.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
      <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full ${service.accent ? "bg-accent/5" : "bg-primary/5"} opacity-0 group-hover:opacity-100 transition-opacity blur-sm`} />
    </motion.div>
  );
}

const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState<"bike" | "car" | "electric">("bike");
  const services = activeTab === "bike" ? bikeServices : activeTab === "car" ? carServices : electricBikeServices;

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-0 left-0 w-full h-full opacity-[0.015]" viewBox="0 0 800 600" preserveAspectRatio="none">
          <path d="M0 300 Q200 100 400 300 T800 250" stroke="currentColor" fill="none" strokeWidth="80" strokeLinecap="round" className="text-foreground" />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">What We Do</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Bike & Car Service in Bangalore</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">Affordable doorstep bike, car & electric bike repair near HSR Layout, Sarjapur Road & Bommanahalli.</p>

          {/* Tabs */}
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 glass-card p-1 rounded-2xl sm:rounded-full">
            <button
              onClick={() => setActiveTab("bike")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[11px] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm rounded-full font-semibold transition-all duration-300 ${
                activeTab === "bike"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Bike className="w-4 h-4" />
              Bike Services
            </button>
            <button
              onClick={() => setActiveTab("car")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[11px] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm rounded-full font-semibold transition-all duration-300 ${
                activeTab === "car"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="w-4 h-4" />
              Car Services
            </button>
            <button
              onClick={() => setActiveTab("electric")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[11px] sm:gap-2 sm:px-6 sm:py-3 sm:text-sm rounded-full font-semibold transition-all duration-300 ${
                activeTab === "electric"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="w-4 h-4" />
              Electric Bike
            </button>
          </div>
        </motion.div>

        {/* Brand Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10"
        >
          <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2 font-medium">Brands We Service in Bangalore</p>
          <BrandMarquee />
        </motion.div>

        <motion.div
          key={activeTab}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
