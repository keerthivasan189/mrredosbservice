import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, MapPin, Shield, Car, Bike } from "lucide-react";

const stats = [
  { icon: Clock, value: 30, suffix: "min", label: "Avg. Response Time", color: "text-primary" },
  { icon: Users, value: 500, suffix: "+", label: "Expert Mechanics", color: "text-accent" },
  { icon: MapPin, value: 50, suffix: "+", label: "Service Locations", color: "text-primary" },
  { icon: Shield, value: 99, suffix: "%", label: "Customer Satisfaction", color: "text-accent" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

const StatsSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Decorative road line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Faint vehicle silhouettes */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-10 opacity-[0.03]">
        <Car className="w-40 h-40 text-foreground" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -right-10 opacity-[0.03]">
        <Bike className="w-32 h-32 text-foreground" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:glow-primary transition-shadow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </motion.div>
              <div className="font-display text-4xl sm:text-5xl font-bold text-gradient tracking-tighter mb-2">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </section>
  );
};

export default StatsSection;
