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
      className="fixed bottom-24 right-6 z-50 flex flex-col gap-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
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
    </motion.div>
  );
};

export default FloatingContactButtons;
