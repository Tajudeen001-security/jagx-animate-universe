import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCMS } from "@/lib/cms-store";

export function Pricing() {
  const { data } = useCMS();
  const wa = `https://wa.me/${data.whatsapp}`;
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">WEBSITE PRICING</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Pick your <span className="text-gradient-gold">power level</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Transparent pricing. No surprises. Custom quotes for jewelry, clothing, automation, mobile phones, cars and estate.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.tiers.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl p-8 ${t.popular ? "bg-gradient-gold text-primary-foreground shadow-glow scale-105" : "glass"}`}
            >
              {t.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-background text-gold text-xs font-bold rounded-full border border-gold/40">
                  MOST POPULAR
                </div>
              )}
              <div className={`text-sm ${t.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.name}</div>
              <div className="mt-3 text-4xl font-black">{t.price}</div>
              <div className={`mt-2 text-sm ${t.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{t.desc}</div>

              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${t.popular ? "text-primary-foreground" : "text-gold"}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className={`mt-8 block text-center py-3.5 rounded-full font-semibold transition-all ${
                  t.popular
                    ? "bg-background text-gold hover:scale-105"
                    : "bg-gradient-gold text-primary-foreground hover:scale-105 shadow-glow"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
