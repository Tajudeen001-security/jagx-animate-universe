import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { useCMS } from "@/lib/cms-store";

const links = [
  { href: "#services", label: "Services" },
  { href: "#phones", label: "Phones" },
  { href: "#cars", label: "Cars" },
  { href: "#estate", label: "Estate" },
  { href: "#websites", label: "Websites" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { data } = useCMS();
  const wa = `https://wa.me/${data.whatsapp}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-elegant" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 group"
        >
          <div className="relative w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow-glow animate-glow-pulse">
            <span className="font-black text-primary-foreground text-lg">J</span>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold animate-float" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-black text-xl tracking-tight text-gradient-gold">JagX</span>
            <span className="text-[9px] text-muted-foreground tracking-[0.2em]">× JRI LICENSED</span>
          </div>
        </motion.a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="text-sm text-foreground/80 hover:text-gold transition-colors relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-gold group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </nav>

        <a
          href={wa}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center px-5 py-2.5 bg-gradient-gold text-primary-foreground rounded-full text-sm font-semibold shadow-glow hover:scale-105 transition-transform"
        >
          Hire JagX
        </a>

        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-t border-border"
        >
          <div className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-foreground/80 hover:text-gold">
                {l.label}
              </a>
            ))}
            <a href={wa} target="_blank" rel="noreferrer" className="px-5 py-3 bg-gradient-gold text-primary-foreground rounded-full text-center font-semibold">
              Hire JagX
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
