import { motion } from "framer-motion";
import { useCMS } from "@/lib/cms-store";

export function Phones() {
  const { data } = useCMS();
  return (
    <section id="phones" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">JAGX PHONES</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            The JagX <span className="text-gradient-gold">lineup</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Four phones. One JRI-certified OS. Engineered in-house by JagX.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {data.phones.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 60, rotateY: -20 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              whileHover={{ y: -14, rotateY: 8, rotateX: -4 }}
              className="group perspective-1000"
            >
              <div className="relative preserve-3d">
                <div className="absolute inset-0 blur-3xl rounded-full bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity"
                     style={{ background: "var(--gradient-gold)" }} />
                <div className={`relative mx-auto w-[140px] h-[280px] sm:w-[170px] sm:h-[340px] rounded-[2.2rem] bg-gradient-to-br ${p.color} p-1 shadow-elegant`}>
                  <div className="w-full h-full rounded-[2rem] bg-background relative overflow-hidden">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-background rounded-full border border-border z-10" />
                    <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_30%,oklch(0.82_0.16_85/40%),transparent_50%),radial-gradient(circle_at_70%_70%,oklch(0.7_0.25_195/40%),transparent_50%)]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="w-14 h-14 rounded-full border-2 border-dashed border-gold/60 flex items-center justify-center mb-3"
                      >
                        <span className="font-black text-gradient-gold text-2xl">J</span>
                      </motion.div>
                      <div className="text-[10px] tracking-widest text-muted-foreground">JagX OS · v2.0</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="font-bold">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.tagline}</div>
                <div className="mt-2 text-gold font-black">{p.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
