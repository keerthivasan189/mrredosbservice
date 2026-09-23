import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import { Wrench, Battery, CircleDot, Fuel, AlertTriangle, Cog, Car, Bike } from "lucide-react";

const serviceAreas = [
  { icon: Wrench, label: "Engine Repair", position: "top-[25%] left-[30%]" },
  { icon: Battery, label: "Battery Jumpstart", position: "top-[40%] left-[65%]" },
  { icon: CircleDot, label: "Puncture Repair", position: "top-[70%] left-[20%]" },
  { icon: Fuel, label: "Fuel Delivery", position: "top-[60%] left-[75%]" },
  { icon: AlertTriangle, label: "Emergency Roadside", position: "top-[15%] left-[55%]" },
  { icon: Cog, label: "Engine Check", position: "top-[55%] left-[45%]" },
];

const DetailedCarSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 240 100" fill="none" className={className}>
    {/* Wheels */}
    <circle cx="55" cy="78" r="16" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
    <circle cx="55" cy="78" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="185" cy="78" r="16" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
    <circle cx="185" cy="78" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Body */}
    <path d="M30 62 L60 25 Q65 20, 75 20 L165 20 Q175 20, 180 25 L210 62 L220 62 Q225 62, 225 67 L225 72 Q225 77, 220 77 L20 77 Q15 77, 15 72 L15 67 Q15 62, 20 62 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
    {/* Windows */}
    <path d="M65 58 L85 28 L155 28 L175 58 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.04" />
    <line x1="120" y1="28" x2="120" y2="58" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    {/* Headlights */}
    <rect x="208" y="50" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    <rect x="18" y="50" width="14" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    {/* Door handle */}
    <line x1="105" y1="48" x2="118" y2="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Grill */}
    <line x1="210" y1="64" x2="210" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="214" y1="64" x2="214" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="218" y1="64" x2="218" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
);

const DetailedBikeSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 110" fill="none" className={className}>
    {/* Wheels */}
    <circle cx="40" cy="85" r="20" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
    <circle cx="40" cy="85" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="40" cy="85" r="3" fill="currentColor" fillOpacity="0.3" />
    <circle cx="160" cy="85" r="20" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.05" />
    <circle cx="160" cy="85" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="160" cy="85" r="3" fill="currentColor" fillOpacity="0.3" />
    {/* Spokes */}
    {[0, 45, 90, 135].map((angle) => (
      <line key={`l-${angle}`} x1="40" y1="85" x2={40 + 18 * Math.cos((angle * Math.PI) / 180)} y2={85 + 18 * Math.sin((angle * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    ))}
    {[0, 45, 90, 135].map((angle) => (
      <line key={`r-${angle}`} x1="160" y1="85" x2={160 + 18 * Math.cos((angle * Math.PI) / 180)} y2={85 + 18 * Math.sin((angle * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    ))}
    {/* Frame */}
    <path d="M40 85 L70 45 L110 40 L140 55 L160 85" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M70 45 L90 85" stroke="currentColor" strokeWidth="2" />
    {/* Tank */}
    <path d="M72 42 Q90 30, 112 38 L108 48 Q88 38, 72 48 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1" />
    {/* Seat */}
    <path d="M108 38 Q120 32, 138 40 L135 45 Q118 38, 110 44 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08" />
    {/* Handlebar */}
    <path d="M68 42 L58 25 M58 25 L48 20 M58 25 L68 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Exhaust */}
    <path d="M140 60 L165 65 L170 70 L160 72" stroke="currentColor" strokeWidth="1.5" fill="none" />
    {/* Engine block */}
    <rect x="80" y="55" width="25" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.06" />
    {/* Headlight */}
    <circle cx="55" cy="30" r="5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
    {/* Fender */}
    <path d="M25 72 Q40 60, 55 72" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

function VehicleCard({
  type,
  delay,
}: {
  type: "car" | "bike";
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [hoveredService, setHoveredService] = useState<number | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 20);
    setRotateY(x * 20);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHoveredService(null);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative glass-card p-8 cursor-pointer overflow-hidden group"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 60%)`,
        }}
      />

      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <h3 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
          {type === "car" ? "Car Services" : "Bike Services"}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {type === "car"
            ? "Hover over service areas to explore"
            : "Interactive — move your mouse around"}
        </p>

        {/* Vehicle SVG */}
        <div className="relative mx-auto" style={{ maxWidth: type === "car" ? 320 : 280 }}>
          {type === "car" ? (
            <DetailedCarSVG className="w-full text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.3)]" />
          ) : (
            <DetailedBikeSVG className="w-full text-accent drop-shadow-[0_0_20px_hsl(var(--accent)/0.3)]" />
          )}

          {/* Service hotspots */}
          {serviceAreas.slice(type === "car" ? 3 : 0, type === "car" ? 6 : 3).map((area, i) => (
            <motion.div
              key={area.label}
              className={`absolute ${area.position} z-10`}
              onMouseEnter={() => setHoveredService(i)}
              onMouseLeave={() => setHoveredService(null)}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.3 + i * 0.1, type: "spring" }}
            >
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${hoveredService === i ? "bg-primary/30 scale-125" : "bg-primary/10"}`}>
                <div className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/20" />
                <area.icon className={`w-4 h-4 transition-colors ${hoveredService === i ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              {hoveredService === i && (
                <motion.div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-3 py-1 rounded-lg z-20"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-xs font-medium text-primary">{area.label}</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const Vehicle3DSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="container mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
          Interactive Explore
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Explore Our Service Areas
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Hover over the vehicles to discover the services we offer. Move your mouse for a 3D perspective effect.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <VehicleCard type="bike" delay={0.1} />
        <VehicleCard type="car" delay={0.2} />
      </div>
    </div>
  </section>
);

export default Vehicle3DSection;
