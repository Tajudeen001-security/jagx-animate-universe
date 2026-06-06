import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 bg-gradient-gold rounded-xl flex items-center justify-center shadow-glow">
              <span className="font-black text-primary-foreground text-lg">J</span>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-gold animate-float" />
            </div>
            <div>
              <div className="font-black text-xl text-gradient-gold">JagX</div>
              <div className="text-[9px] text-muted-foreground tracking-[0.2em]">× JRI LICENSED</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            JagX builds world-class digital products, JRI-certified mobile phones, fine jewelry,
            premium clothing and business automation.
          </p>
        </div>

        <div>
          <div className="text-sm font-bold text-gold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#about" className="hover:text-gold">About</a></li>
            <li><a href="#services" className="hover:text-gold">Services</a></li>
            <li><a href="#pricing" className="hover:text-gold">Pricing</a></li>
            <li><a href="#contact" className="hover:text-gold">Contact</a></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-bold text-gold mb-3">Reach Out</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="https://wa.me/2349160654415" target="_blank" rel="noreferrer" className="hover:text-gold">WhatsApp</a></li>
            <li><a href="mailto:gbadamositajudeenwan@gmail.com" className="hover:text-gold break-all">Email</a></li>
            <li><a href="tel:+2349160654415" className="hover:text-gold">+234 916 065 4415</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground max-w-7xl mx-auto">
        <div>© {new Date().getFullYear()} JagX Business Group. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold animate-glow-pulse" />
          JRI Licensed · Built with craft in Nigeria
        </div>
      </div>
    </footer>
  );
}
