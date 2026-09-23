import { motion } from "framer-motion";
import { Smartphone, MapPin, Wrench } from "lucide-react";

const steps = [
  { icon: Smartphone, title: "Book Service Online", desc: "Select your vehicle type and describe the issue in seconds.", color: "primary" },
  { icon: MapPin, title: "Mechanic Travels To You", desc: "A certified mechanic is dispatched to your exact location.", color: "accent" },
  { icon: Wrench, title: "Vehicle Fixed On The Spot", desc: "Expert repair at your doorstep — no towing needed.", color: "primary" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      {/* Animated road background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute w-full h-full opacity-[0.03]" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <motion.path
            d="M-50 200 Q150 100 300 200 T600 180 T900 220 T1250 200"
            stroke="currentColor"
            fill="none"
            strokeWidth="60"
            strokeLinecap="round"
            className="text-foreground"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          {/* Dashed center line */}
          <motion.path
            d="M-50 200 Q150 100 300 200 T600 180 T900 220 T1250 200"
            stroke="hsl(var(--primary))"
            fill="none"
            strokeWidth="2"
            strokeDasharray="12 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.3 }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeOut" }}
          />
        </svg>
      </div>

      <div className="container mx-auto relative z-10">
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
            Simple Process
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">How Doorstep Service Works</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Book a mechanic near you in Bangalore — three simple steps.</p>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0">
          {/* Connecting line with animated fill */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-border/30 rounded-full">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))" }}
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </div>

          {/* Mobile vertical line */}
          <div className="md:hidden absolute top-10 bottom-10 left-7 w-[2px] bg-border/30">
            <motion.div
              className="w-full"
              style={{ background: "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ height: "0%" }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.3 }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="flex-1 flex flex-col md:items-center md:text-center px-4 relative z-10 pl-16 md:pl-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 absolute md:relative left-0 md:left-auto ${
                  step.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'
                }`}
                style={{ boxShadow: `0 0 24px -8px hsl(var(--${step.color}) / 0.3)` }}
                whileHover={{ scale: 1.15, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className={`w-6 h-6 ${step.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
              </motion.div>
              <span className={`text-xs mb-2 uppercase tracking-widest font-medium ${step.color === 'accent' ? 'text-accent/60' : 'text-primary/60'}`}>Step {i + 1}</span>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[240px]">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
