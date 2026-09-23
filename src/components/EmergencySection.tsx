import { motion } from "framer-motion";
import { AlertTriangle, Phone, MessageCircle, Navigation } from "lucide-react";

const EmergencySection = () => {
  const scrollToBooking = () => {
    document.getElementById("book-now")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Pulsing red background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, hsl(var(--destructive)), transparent 60%)",
            animation: "pulse-ring 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Hazard stripes top */}
      <div className="absolute top-0 left-0 right-0 h-2 overflow-hidden">
        <div
          className="h-full w-[200%]"
          style={{
            background: "repeating-linear-gradient(135deg, hsl(var(--accent)) 0, hsl(var(--accent)) 10px, transparent 10px, transparent 20px)",
            animation: "road-dash 1s linear infinite",
          }}
        />
      </div>

      <div className="container mx-auto relative z-10 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse-ring" />
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </motion.div>

        <motion.h2
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Stuck on the Road in Bangalore?
        </motion.h2>

        <motion.p
          className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Don't worry — Mr Red OSB Service provides 24/7 emergency roadside assistance for bikes, cars & electric bikes near HSR Layout, Sarjapur Road & Bommanahalli. Our mobile mechanics reach you fast.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button
            onClick={scrollToBooking}
            className="relative group bg-destructive text-destructive-foreground px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg shadow-destructive/30"
          >
            <span className="relative z-10 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Get Help Now
            </span>
            <div className="absolute inset-0 rounded-full bg-destructive opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </button>

          <a
            href="tel:+919886919869"
            className="flex items-center gap-2 glass-card px-6 py-4 rounded-full text-foreground font-medium hover:scale-[1.02] transition-transform"
          >
            <Phone className="w-5 h-5 text-primary" />
            Call Now
          </a>

          <a
            href="https://wa.me/919886919869?text=Emergency!%20I%20need%20roadside%20assistance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 glass-card px-6 py-4 rounded-full text-foreground font-medium hover:scale-[1.02] transition-transform"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            WhatsApp
          </a>
        </motion.div>

        {/* Floating quick actions */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Navigation className="w-4 h-4" />
          <span>Share your location for fastest response</span>
        </motion.div>
      </div>

      {/* Hazard stripes bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
        <div
          className="h-full w-[200%]"
          style={{
            background: "repeating-linear-gradient(135deg, hsl(var(--accent)) 0, hsl(var(--accent)) 10px, transparent 10px, transparent 20px)",
            animation: "road-dash 1s linear infinite",
          }}
        />
      </div>
    </section>
  );
};

export default EmergencySection;
