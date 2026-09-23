import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/mr-red-logo-transparent.png";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Reviews", href: "/reviews" },
  { label: "Book Now", href: "/book-now" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Mr Red OSB Service" className="brand-logo h-10 sm:h-12 w-auto max-w-[11rem]" />
        </Link>

        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-xs lg:text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          <a href="tel:+919886919869" className="flex items-center gap-1.5 text-xs lg:text-sm text-accent font-medium whitespace-nowrap">
            <Phone className="w-3.5 h-3.5" />
            Emergency
          </a>
          <Link
            to="/book-now"
            className="bg-primary text-primary-foreground px-3 lg:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium hover:scale-[0.98] transition-transform whitespace-nowrap"
          >
            Book Mechanic
          </Link>
          <button
            onClick={() => navigate("/login")}
            className="relative group px-3 lg:px-5 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold text-primary-foreground overflow-hidden active:scale-[0.92] hover:scale-[1.04] transition-all duration-200 shadow-lg shadow-accent/30 hover:shadow-accent/50 whitespace-nowrap"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent bg-[length:300%_100%] animate-shimmer rounded-full" />
            <span className="absolute inset-0 rounded-full opacity-0 group-active:opacity-30 bg-white transition-opacity duration-150" />
            <span className="relative z-10">Sign In</span>
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="relative group px-5 py-2 rounded-full text-xs font-bold text-primary-foreground overflow-hidden active:scale-[0.92] hover:scale-[1.04] transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:300%_100%] animate-shimmer rounded-full" />
            <span className="absolute inset-0 rounded-full opacity-0 group-active:opacity-30 bg-white transition-opacity duration-150" />
            <span className="relative z-10 flex items-center gap-1.5 tracking-wide">Sign In</span>
          </button>
          <button className="text-foreground active:scale-[0.9] transition-transform" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden glass-card border-t border-border/30"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-left text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/book-now"
                onClick={() => setOpen(false)}
                className="bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-medium mt-2 text-center"
              >
                Book Mechanic
              </Link>
              <button
                onClick={() => { setOpen(false); navigate("/login"); }}
                className="border border-border text-foreground px-5 py-3 rounded-full text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
