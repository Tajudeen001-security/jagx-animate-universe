import { motion } from "framer-motion";
import { ShieldCheck, Award, Globe2, Rocket } from "lucide-react";

const stats = [
  { icon: ShieldCheck, label: "JRI Licensed", value: "Certified" },
  { icon: Award, label: "Projects Delivered", value: "150+" },
  { icon: Globe2, label: "Countries Served", value: "12" },
  { icon: Rocket, label: "Avg. Launch Time", value: "14 Days" },
];

export function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">ABOUT JAGX</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            A studio built on <span className="text-gradient-gold">craft</span>, certified by <span className="text-gradient-primary">JRI</span>.
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            JagX is a multi-discipline creative house operating at the intersection of technology,
            fashion and luxury goods. Every product we ship — from mobile phones to gold chains —
            carries the JRI license: a guarantee of authenticity, quality, and global standard.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We don't just make things. We build worlds.
          </p>

          <div className="mt-8 flex items-center gap-4 p-4 glass rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-glow">
              <ShieldCheck className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground tracking-widest">JRI LICENSE · ACTIVE</div>
              <div className="font-bold text-gold">JagX × Jewelry & Retail International</div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="glass rounded-3xl p-6 aspect-square flex flex-col justify-between hover:border-gold/40 transition-all"
            >
              <s.icon className="w-8 h-8 text-gold" />
              <div>
                <div className="text-3xl font-black text-gradient-gold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
