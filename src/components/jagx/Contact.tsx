import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">GET IN TOUCH</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Let's build something <span className="text-gradient-gold">legendary</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Reach out — we usually reply within an hour.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.a
            href="https://wa.me/2349160654415"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative glass rounded-3xl p-8 overflow-hidden hover:border-gold/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow mb-6 group-hover:rotate-6 transition-transform">
                <MessageCircle className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground tracking-widest">WHATSAPP · INSTANT</div>
              <div className="mt-2 text-2xl font-black text-gradient-gold">+234 916 065 4415</div>
              <div className="mt-2 text-sm text-muted-foreground">Tap to chat with JagX now →</div>
            </div>
          </motion.a>

          <motion.a
            href="mailto:gbadamositajudeenwan@gmail.com"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="group relative glass rounded-3xl p-8 overflow-hidden hover:border-gold/40 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-neon/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-neon mb-6 group-hover:rotate-6 transition-transform">
                <Mail className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground tracking-widest">EMAIL · DETAILED</div>
              <div className="mt-2 text-xl md:text-2xl font-black text-gradient-primary break-all">gbadamositajudeenwan@gmail.com</div>
              <div className="mt-2 text-sm text-muted-foreground">For proposals & briefs →</div>
            </div>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 grid md:grid-cols-2 gap-6"
        >
          <div className="glass rounded-3xl p-6 flex items-center gap-4">
            <Phone className="w-5 h-5 text-gold" />
            <div>
              <div className="text-xs text-muted-foreground">Call direct</div>
              <a href="tel:+2349160654415" className="font-bold hover:text-gold">+234 916 065 4415</a>
            </div>
          </div>
          <div className="glass rounded-3xl p-6 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-gold" />
            <div>
              <div className="text-xs text-muted-foreground">Based in</div>
              <div className="font-bold">Nigeria · Serving Worldwide</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
