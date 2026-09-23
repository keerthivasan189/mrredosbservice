import { motion } from "framer-motion";
import { Star, Quote, Car, Bike } from "lucide-react";

const reviews = [
  { name: "Ananya R.", rating: 5, text: "They arrived in 20 minutes and fixed my flat tyre in no time. Incredible service!", vehicle: "Honda City", type: "car" },
  { name: "Karthik S.", rating: 5, text: "My bike broke down on the highway. One call and the mechanic was there. Lifesaver!", vehicle: "Royal Enfield", type: "bike" },
  { name: "Meera P.", rating: 5, text: "Professional, fast, and affordable. The engine diagnosis saved me a trip to the workshop.", vehicle: "Maruti Swift", type: "car" },
  { name: "Rohit V.", rating: 4, text: "Battery died at midnight. They jumpstarted it within 30 minutes. Highly recommended.", vehicle: "Hyundai Creta", type: "car" },
];

const ReviewsSection = () => {
  return (
    <section id="reviews" className="section-padding relative overflow-hidden">
      {/* Decorative tyre marks */}
      <div className="absolute top-10 right-10 opacity-[0.03] rotate-12">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="20" fill="none" className="text-foreground" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="100" y1="10" x2="100" y2="40" stroke="currentColor" strokeWidth="4" className="text-foreground"
              transform={`rotate(${i * 30} 100 100)`} />
          ))}
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
            className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Testimonials
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">Customer Reviews</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Trusted by hundreds of bike & car owners in Bangalore.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              className="glass-card-hover p-6 group relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              {/* Vehicle type icon */}
              <div className="absolute top-4 right-4 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
                {review.type === "bike" ? (
                  <Bike className="w-12 h-12 text-foreground" />
                ) : (
                  <Car className="w-12 h-12 text-foreground" />
                )}
              </div>

              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-foreground mb-4 leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${j < review.rating ? "text-accent fill-accent" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{review.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {review.type === "bike" ? <Bike className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                  {review.vehicle}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
