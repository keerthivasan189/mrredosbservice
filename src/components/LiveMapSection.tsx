import { motion } from "framer-motion";
import { MapPin, Users, Zap, Car, Bike } from "lucide-react";

const mechanics = [
  { x: 25, y: 35, name: "Rajesh K.", type: "car" },
  { x: 55, y: 45, name: "Amit S.", type: "bike" },
  { x: 70, y: 28, name: "Priya M.", type: "car" },
  { x: 40, y: 65, name: "Vikram R.", type: "bike" },
  { x: 60, y: 72, name: "Sunil D.", type: "car" },
];

const LiveMapSection = () => {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="inline-block text-xs uppercase tracking-[0.3em] text-accent mb-4 font-medium"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Real-Time Tracking
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Live Service Map</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Real-time mechanic locations across the city.</p>
        </motion.div>

        <motion.div
          className="relative glass-card rounded-2xl overflow-hidden h-[400px] md:h-[500px]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-background">
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }} />

            {/* Road lines */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path d="M 10 50 Q 30 30, 50 50 T 90 40" stroke="hsl(var(--foreground))" fill="none" strokeWidth="0.3"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} />
              <motion.path d="M 20 20 Q 40 60, 60 30 T 85 70" stroke="hsl(var(--foreground))" fill="none" strokeWidth="0.3"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.3 }} />
              <motion.path d="M 5 70 Q 35 50, 50 70 T 95 60" stroke="hsl(var(--foreground))" fill="none" strokeWidth="0.2"
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.6 }} />
            </svg>

            {/* Mechanic pins with vehicle icons */}
            {mechanics.map((m, i) => (
              <motion.div
                key={i}
                className="absolute group cursor-pointer"
                style={{ left: `${m.x}%`, top: `${m.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  {/* Pulse */}
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary/30 animate-pulse-ring -translate-x-[2px] -translate-y-[2px]" />
                  {/* Dot */}
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent relative z-10 flex items-center justify-center">
                    {m.type === "bike" ? (
                      <Bike className="w-2 h-2 text-primary-foreground" />
                    ) : (
                      <Car className="w-2 h-2 text-primary-foreground" />
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass-card px-2 py-1 rounded text-[10px] text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.name}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info panel */}
          <div className="absolute top-4 left-4 glass-card p-4 rounded-xl max-w-[220px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Live Tracking</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>{mechanics.length} Mechanics Active</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-accent" />
                <span>Avg. 12 min ETA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Citywide Coverage</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 glass-card p-3 rounded-xl">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Car className="w-3 h-3 text-primary" /> Car</span>
              <span className="flex items-center gap-1"><Bike className="w-3 h-3 text-accent" /> Bike</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMapSection;
