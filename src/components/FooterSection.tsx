import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import logo from "@/assets/mr-red-logo-transparent.png";

const FooterSection = () => {
  return (
    <footer className="border-t border-border/30 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mr Red OSB Service" className="brand-logo h-auto w-full max-w-[12rem]" />
            </a>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
              Mr Red OSB Service — Bangalore's trusted doorstep bike, car & electric bike repair center near HSR Layout, Sarjapur Road & Bommanahalli. Available 24/7 for emergency roadside assistance & EV battery service. We serve customers within a 5–10 km radius in Bangalore.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="tel:+919886919869" className="flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors">
                <Phone className="w-4 h-4" />
                +91 98869 19869
              </a>
              <a href="https://www.instagram.com/mrredosbservice?igsh=eGkxczltc3NxOGh5&utm_source=qr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-pink-500/10 text-pink-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-pink-500/20 transition-colors">
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a href="https://www.facebook.com/share/17sUH3wmx5/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-500/20 transition-colors">
                <Facebook className="w-4 h-4" />
                Facebook
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Roadside Assistance</li>
              <li>Car Repair</li>
              <li>Bike Repair</li>
              <li>Electric Bike Service</li>
              <li>EV Battery & Motor Service</li>
              <li>Battery Jump Start</li>
              <li>Engine Diagnosis</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                mrredosbservice@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                +91 98869 19869
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/QJCsnfeVUYQs7RYR9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <MapPin className="w-4 h-4 text-primary" />
                  View Shop on Map
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 Mr Red OSB Service. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
