import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQ_ITEMS = [
  {
    q: "What is JagX World Studio?",
    a: "JagX (also known as JagX World Studio) is a JRI-licensed business group building world-class 3D animated websites, business automation, JagX-branded mobile phones, cars, real estate, bespoke jewelry and premium clothing.",
  },
  {
    q: "How much does a JagX website cost?",
    a: "JagX websites start from ₦150,000 for a Starter site, ₦450,000 for a Growth build, and custom Enterprise pricing for 3D flagship experiences. Every tier includes SEO, animation and mobile optimisation.",
  },
  {
    q: "How do I contact JagX?",
    a: "Reach JagX instantly on WhatsApp at +234 916 065 4415 or by email at gbadamositajudeenwan@gmail.com. Our team responds within a few hours, 7 days a week.",
  },
  {
    q: "Does JagX ship JagX-branded phones and cars worldwide?",
    a: "Yes. JagX phones, JagX motors, jewelry and clothing ship globally with JRI-certified logistics and insured delivery.",
  },
  {
    q: "What is the JRI license?",
    a: "JRI (JagX Regulatory & Integrity) is JagX's internal certification standard covering build quality, security, and craftsmanship across every product and website we deliver.",
  },
  {
    q: "Can JagX handle end-to-end business automation?",
    a: "Absolutely. We design AI workflows, CRM pipelines, WhatsApp/email automation and dashboards that scale with your operations.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 text-xs tracking-widest text-gold">FAQ</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">Questions, <span className="text-gradient-gold">answered</span></h2>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="rounded-2xl border border-border bg-card/70 glass overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-bold">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                  <p className="px-6 pb-5 text-muted-foreground">{item.a}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
