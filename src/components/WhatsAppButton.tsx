import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/919886919869?text=Hi%2C%20I%20need%20vehicle%20repair%20assistance"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-transform"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-5 h-5" />
    <span className="text-sm font-semibold hidden sm:inline">Chat with Us</span>
  </motion.a>
);

export default WhatsAppButton;
