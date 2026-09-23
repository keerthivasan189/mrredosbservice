import { useState, useEffect, useRef, MouseEvent as ReactMouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Send, MapPin, Navigation, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import slide1 from "@/assets/slide1.jpg";
import slide2 from "@/assets/slide2.jpg";
import slide3 from "@/assets/slide3.jpg";

const SHOP_MAP_URL = "https://maps.app.goo.gl/QJCsnfeVUYQs7RYR9";
const slides = [slide1, slide2, slide3];

const BackgroundSlideshow = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={slides[current]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover brightness-110 saturate-110"
          style={{ opacity: 0.25 }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.25, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Vibrant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/50 to-transparent" />
    </div>
  );
};

const FloatingParticle = ({ delay, x, y }: { delay: number; x: string; y: string }) => (
  <motion.div
    className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -20, 0],
      opacity: [0.2, 0.6, 0.2],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const BookingSection = () => {
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "", issue: "", location: "" });
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 20 });
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.vehicle || !form.issue) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);

    const message = [
      `🔧 *New Service Request*`,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      `🚗 Vehicle: ${form.vehicle}`,
      `⚠️ Issue: ${form.issue}`,
      form.location ? `📍 Location: ${form.location}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = `https://wa.me/919886919869?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setLoading(false);
      window.open(waUrl, "_blank");
      toast.success("Opening WhatsApp — our team will respond immediately!");
      setForm({ name: "", phone: "", vehicle: "", issue: "", location: "" });
    }, 800);
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((f) => ({ ...f, location: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }));
          toast.success("Location detected!");
        },
        () => toast.error("Unable to detect location.")
      );
    }
  };

  const inputClass =
    "w-full bg-card/80 backdrop-blur-sm h-14 px-4 rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-card border border-primary/20 hover:border-primary/40 transition-all text-sm shadow-sm";

  return (
    <section id="book-now" className="section-padding relative overflow-hidden">
      {/* Floating particles */}
      <FloatingParticle delay={0} x="10%" y="20%" />
      <FloatingParticle delay={0.5} x="85%" y="15%" />
      <FloatingParticle delay={1} x="20%" y="70%" />
      <FloatingParticle delay={1.5} x="75%" y="80%" />
      <FloatingParticle delay={2} x="50%" y="10%" />
      <FloatingParticle delay={0.8} x="90%" y="50%" />
      <FloatingParticle delay={1.2} x="5%" y="45%" />

      <div className="container mx-auto max-w-2xl relative">
        {/* Background slideshow */}
        <div className="absolute -inset-8 sm:-inset-12 z-0">
          <BackgroundSlideshow />
        </div>

        <motion.div
          className="text-center mb-10 relative z-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5"
            animate={{ boxShadow: ["0 0 0px hsl(var(--primary)/0)", "0 0 20px hsl(var(--primary)/0.15)", "0 0 0px hsl(var(--primary)/0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Quick Booking</span>
          </motion.div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
              Book a Mechanic
            </span>
          </h2>
          <p className="text-muted-foreground">Fill in your details and we'll dispatch a mechanic immediately.</p>
        </motion.div>

        {/* 3D Interactive Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10"
          style={{
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="relative p-6 sm:p-8 rounded-3xl space-y-4 border border-primary/20 bg-card/70 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden"
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Dynamic glow that follows cursor */}
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-60"
              style={{
                background: useTransform(
                  [glowX, glowY],
                  ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, hsl(var(--primary) / 0.15), transparent 50%)`
                ),
              }}
            />

            {/* Top accent bar */}
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                maxLength={100}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                maxLength={15}
              />
            </div>

            <input
              type="text"
              placeholder="Vehicle Type (e.g., Honda City, RE Classic 350) *"
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              className={`relative z-10 ${inputClass}`}
              maxLength={100}
            />

            <textarea
              placeholder="Describe the issue *"
              value={form.issue}
              onChange={(e) => setForm({ ...form, issue: e.target.value })}
              className={`relative z-10 ${inputClass} h-28 py-4 resize-none`}
              maxLength={500}
            />

            <div className="relative z-10">
              <input
                type="text"
                placeholder="Your Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className={`${inputClass} pr-12`}
                maxLength={200}
              />
              <button
                type="button"
                onClick={detectLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-accent transition-colors hover:scale-110 active:scale-90"
                title="Detect my location"
              >
                <MapPin className="w-5 h-5" />
              </button>
            </div>

            {/* Submit button with gradient and glow */}
            <motion.button
              type="submit"
              disabled={loading}
              className="relative z-10 w-full h-14 font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 overflow-hidden group text-primary-foreground"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-shimmer rounded-xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_auto] animate-shimmer rounded-xl" />

              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Request Mechanic
                  </>
                )}
              </span>
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Shop location link */}
        <motion.div
          className="text-center mt-6 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href={SHOP_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <Navigation className="w-4 h-4 group-hover:text-primary transition-colors" />
            Visit our shop location
            <ExternalLink className="w-3 h-3 opacity-50" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;
