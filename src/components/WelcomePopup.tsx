import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MapPin, MessageCircle, AlertTriangle } from "lucide-react";

const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        const msg = encodeURIComponent(
          `🚨 I need roadside help!\n📍 Location: https://maps.google.com/?q=${latitude},${longitude}`
        );
        window.open(`https://wa.me/919886919869?text=${msg}`, "_blank");
      }, () => {
        window.open("https://wa.me/919886919869?text=I%20need%20roadside%20help!", "_blank");
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md glass-card p-0 overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Hazard stripe top */}
            <div className="h-2 w-full" style={{
              background: "repeating-linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 10px, hsl(var(--background)) 10px, hsl(var(--background)) 20px)"
            }} />

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 pt-8 text-center">
              {/* Pulsing icon */}
              <div className="relative mx-auto w-16 h-16 mb-5">
                <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
                <div className="relative w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-3">
                Stuck in the Middle of the Road?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Don't worry. Our roadside mechanics will reach your location quickly and fix your car or bike on the spot.
              </p>

              {/* Get Help Now button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById("book-now")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3.5 rounded-full font-semibold text-base mb-4 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25"
              >
                🔧 Get Help Now
              </button>

              {/* Call & WhatsApp row */}
              <div className="flex gap-3 mb-4">
                <a
                  href="tel:+919886919869"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  Call Now
                </a>
                <a
                  href="https://wa.me/919886919869"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-medium text-sm hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>

              {/* Share location */}
              <button
                onClick={shareLocation}
                className="flex items-center justify-center gap-2 mx-auto text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Share your location for fastest response
              </button>
            </div>

            {/* Hazard stripe bottom */}
            <div className="h-2 w-full" style={{
              background: "repeating-linear-gradient(135deg, hsl(var(--accent)), hsl(var(--accent)) 10px, hsl(var(--background)) 10px, hsl(var(--background)) 20px)"
            }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomePopup;
