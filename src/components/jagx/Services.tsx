import { motion } from "framer-motion";
import { Bot, Smartphone, Gem, Shirt, Globe, Sparkles } from "lucide-react";
import { VideoBackdrop } from "@/components/jagx/VideoBackdrop";

const services = [
  { icon: Bot, title: "Business Automation", desc: "AI workflows, CRM pipelines, and ops automation that scales while you sleep.", color: "from-gold/30 to-accent/20" },
  { icon: Smartphone, title: "JagX Mobile Phones", desc: "Custom JagX-branded smartphones with proprietary JagX OS and JRI-certified hardware.", color: "from-neon/30 to-gold/20" },
  { icon: Globe, title: "Website Creation", desc: "World-class 3D animated websites, e-commerce, SaaS platforms and PWAs.", color: "from-accent/30 to-neon/20" },
  { icon: Gem, title: "Bespoke Jewelry", desc: "Hand-crafted JagX jewelry — gold, diamonds, signature pieces, custom commissions.", color: "from-gold-soft/30 to-gold/20" },
  { icon: Shirt, title: "Clothing Brand", desc: "Premium JagX apparel: streetwear, formalwear, limited drops and brand collabs.", color: "from-accent/30 to-gold/20" },
  { icon: Sparkles, title: "Brand & Identity", desc: "Logos, brand systems, motion design and full creative direction.", color: "from-neon/30 to-accent/20" },
];

export function Services() {
  return (
    <section id="services" className="relative py-32 px-6 overflow-hidden">
      <VideoBackdrop variant="robot" opacity={0.18} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">WHAT WE DO</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            One brand. <span className="text-gradient-gold">Six worlds.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">JagX is a multi-discipline studio shipping pixel-perfect product across digital and physical.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative glass rounded-3xl p-8 overflow-hidden hover:border-gold/40 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-glow mb-6 group-hover:rotate-6 transition-transform">
                  <s.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-6 text-xs text-gold font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">EXPLORE →</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
