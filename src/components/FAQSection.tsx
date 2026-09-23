import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Which is the best bike service near me in Bangalore?",
    answer:
      "Mr Red OSB Service is one of the top-rated bike service centers in Bangalore, located near HSR Layout. We offer doorstep bike repair, emergency breakdown assistance, and same-day service across Sarjapur Road, Bommanahalli, Koramangala, BTM Layout, and Electronic City.",
  },
  {
    question: "Where is Mr Red OSB Service located?",
    answer:
      "We are located near HSR Layout, Bangalore. Mr Red OSB Service serves customers within a 5–10 km radius including HSR Layout, Sarjapur Road, Bommanahalli, Koramangala, BTM Layout, and Electronic City.",
  },
  {
    question: "How much does bike service cost in Bangalore?",
    answer:
      "Bike service at Mr Red OSB Service starts at very affordable rates. We offer competitive pricing for basic servicing, puncture repair, battery replacement, engine diagnostics, and more. Contact us for a free estimate!",
  },
  {
    question: "Do you provide same-day car service?",
    answer:
      "Yes! Mr Red OSB Service provides same-day car and bike service in Bangalore. Our mobile mechanics can reach your location within 30 minutes for emergency repairs near HSR Layout, Sarjapur Road, and Bommanahalli.",
  },
  {
    question: "What areas do you serve in Bangalore?",
    answer:
      "We serve HSR Layout, Sarjapur Road, Bommanahalli, Koramangala, BTM Layout, Electronic City, Marathahalli, Whitefield, and surrounding areas within a 5–10 km radius. Our roadside assistance covers all major roads in Bangalore.",
  },
  {
    question: "Do you offer doorstep bike and car repair?",
    answer:
      "Absolutely! Mr Red OSB Service specializes in doorstep bike and car repair in Bangalore. Our trained mechanics come to your location with all necessary tools and parts — no need to visit a workshop.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding relative overflow-hidden">
      <div className="container mx-auto relative z-10 max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-primary mb-4 font-medium">
            Got Questions?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Everything you need to know about bike & car service in Bangalore by Mr Red OSB Service.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display text-sm sm:text-base font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
