import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowDown, Phone, MapPin } from "lucide-react";
import logo from "@/assets/mr-red-logo-transparent.png";
import slide1 from "@/assets/slide1.jpg";
import slide2 from "@/assets/slide2.jpg";
import slide3 from "@/assets/slide3.jpg";
import { useRef, useState, useEffect } from "react";

const slides = [slide1, slide2, slide3];

/* ── SVG vehicle silhouettes ── */
const CarSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 40" fill="none" className={className}>
    <path d="M20 28c0-3.3 2.7-6 6-6s6 2.7 6 6M88 28c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 24h100c2 0 4-2 4-4v-2c0-2-1-4-3-5l-20-8c-2-1-4-1.5-6-1.5H40c-3 0-5 1-7 3l-12 8c-3 2-5 4-5 6v0c0 2 1.5 3.5 3.5 3.5H10z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.1"/>
    <line x1="45" y1="4" x2="40" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    <line x1="75" y1="4" x2="80" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
  </svg>
);

const BikeSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" fill="none" className={className}>
    <circle cx="20" cy="38" r="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05"/>
    <circle cx="80" cy="38" r="10" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.05"/>
    <path d="M20 38L35 18h15l5 10h10l15-10v20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M50 28l8-14h12l5 6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="56" cy="12" r="3" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

/* ── Particle speed lines ── */
const SpeedLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 8 }).map((_, i) => {
      const w = 60 + Math.random() * 120;
      const top = 15 + Math.random() * 70;
      const dur = 2.5 + Math.random() * 2;
      const alpha = 0.15 + Math.random() * 0.2;
      return (
        <div
          key={i}
          className="absolute h-[1px] rounded-full"
          style={{
            width: `${w}px`,
            top: `${top}%`,
            right: 0,
            background: `linear-gradient(90deg, hsl(var(--primary) / ${alpha}), transparent)`,
            animation: `speedline ${dur}s linear ${i * 0.5}s infinite`,
          }}
        />
      );
    })}
  </div>
);

/* ── Floating vehicle decorations ── */
const FloatingVehicles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-[20%] text-primary/10 w-32" style={{ animation: "drive-right 18s linear 2s infinite" }}>
      <CarSVG />
    </div>
    <div className="absolute top-[60%] right-0 text-accent/10 w-24" style={{ animation: "drive-right 14s linear 5s infinite", animationDirection: "reverse" }}>
      <BikeSVG />
    </div>
  </div>
);

/* ── Animated road ── */
const RoadStrip = () => (
  <div className="absolute bottom-0 left-0 right-0 h-12 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
    <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-muted/30">
      <div className="flex gap-6 animate-road-dash">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-6 h-[2px] bg-accent/40 flex-shrink-0" />
        ))}
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    document.getElementById("book-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Slideshow background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ y: bgY }}
        >
           <img
             src={slides[currentSlide]}
             alt={[
               "Professional bike repair service at doorstep in Bangalore",
               "Doorstep car repair and maintenance service in HSR Layout Bangalore",
               "Emergency roadside assistance for bikes and cars near Sarjapur Road"
             ][currentSlide]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/75" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--background)) 80%)" }} />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-primary" : "bg-muted-foreground/40 hover:bg-muted-foreground/60"}`}
          />
        ))}
      </div>

      <SpeedLines />
      <FloatingVehicles />
      <RoadStrip />

      <motion.div className="relative z-10 text-center max-w-3xl mx-auto pt-20 flex flex-col items-center" style={{ opacity }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 flex justify-center"
        >
          <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full scale-150" />
          <img src={logo} alt="Mr Red OSB Service – Best Bike, Car & Electric Bike Service Near HSR Layout Bangalore" className="brand-logo h-auto w-full max-w-[15rem] sm:max-w-[19rem] lg:max-w-[22rem] relative z-10" />
        </motion.div>

        <motion.a
          href="https://maps.app.goo.gl/QJCsnfeVUYQs7RYR9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border border-primary/20 text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300 mb-6 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span>Visit Our Shop</span>
        </motion.a>

        <motion.h1
          className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-foreground">Bike, Car & Electric Bike Service in Bangalore,</span>
          <br />
          <span className="text-gradient">At Your Doorstep</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          Bike, car or electric bike breakdown near HSR Layout, Sarjapur Road, or Bommanahalli? Our expert mechanics handle EV battery, motor & doorstep repair — same day service, 24/7.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={scrollToBooking}
            className="relative group bg-gradient-to-r from-primary to-accent text-primary-foreground px-10 py-4 rounded-full text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
          >
            <span className="relative z-10 flex items-center gap-2">
              🔧 Book Emergency Service
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </button>
          <button
            onClick={scrollToBooking}
            className="relative group border-2 border-primary/60 text-primary px-10 py-4 rounded-full text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] hover:border-primary hover:bg-primary/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              📅 Book Now
            </span>
          </button>
          <a
            href="tel:+919886919869"
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors text-base group"
          >
            <Phone className="w-4 h-4 group-hover:animate-pulse" />
            Call Now
          </a>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-16 mt-16 opacity-[0.08]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ delay: 1, duration: 1.5 }}
        >
          <CarSVG className="w-40 text-foreground" />
          <BikeSVG className="w-32 text-foreground" />
        </motion.div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <ArrowDown className="w-5 h-5 text-primary/50 mx-auto animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
