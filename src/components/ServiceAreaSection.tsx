import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const areas = [
  "HSR Layout",
  "Sarjapur Road",
  "Bommanahalli",
  "Koramangala",
  "BTM Layout",
  "Electronic City",
  "Marathahalli",
  "Whitefield",
  "JP Nagar",
  "Jayanagar",
];

const ServiceAreaSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container mx-auto relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-accent mb-4 font-medium">
            Service Coverage
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Areas We Serve in Bangalore
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-10">
            Mr Red OSB Service provides fast doorstep bike & car repair within a 5–10 km radius across Bangalore.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {areas.map((area, i) => (
            <motion.span
              key={area}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-card text-sm text-foreground font-medium border border-border/30 hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {area}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-border/30 shadow-lg"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d77.6446!3d12.9121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzQzLjYiTiA3N8KwMzgnNDAuNiJF!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mr Red OSB Service location near HSR Layout Bangalore"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceAreaSection;
