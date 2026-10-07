import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const FloatingContactButtons = () => {
  const shareLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = `https://wa.me/919886919869?text=I%20need%20help!%20My%20location:%20https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
          window.open(url, "_blank");
        },
        () => toast.error("Unable to detect location.")
      );
    }
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <button
        onClick={shareLocation}
        className="w-12 h-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 active:scale-95 transition-transform"
        aria-label="Share location"
        title="Share your location"
      >
        <MapPin className="w-5 h-5" />
      </button>
      <a
        href="tel:+919886919869"
        className="w-12 h-12 rounded-full bg-accent/90 text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/30 hover:scale-110 active:scale-95 transition-transform"
        aria-label="Call now"
        title="Call now"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/919886919869?text=Hi%2C%20I%20need%20vehicle%20repair%20assistance"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#25D366] text-white h-12 px-5 rounded-full shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
        <span className="text-sm font-semibold hidden sm:inline">Chat with Us</span>
      </a>
    </motion.div>
  );
};

export default FloatingContactButtons;
