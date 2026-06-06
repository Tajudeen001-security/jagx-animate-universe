import { motion } from "framer-motion";
import { Bed, Bath, MapPin, Building2 } from "lucide-react";
import { useCMS } from "@/lib/cms-store";

export function Estate() {
  const { data } = useCMS();
  return (
    <section id="estate" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">JAGX ESTATE</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Live in <span className="text-gradient-gold">JagX luxury</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Smart homes, towers, off-plan villas — all JRI-certified for excellence.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.estates.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 40, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -10, rotateY: 4 }}
              className="group glass rounded-3xl overflow-hidden perspective-1000"
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary via-card to-background overflow-hidden">
                <div className="absolute inset-0 [background-image:linear-gradient(115deg,transparent_40%,oklch(0.82_0.16_85/15%)_50%,transparent_60%)] animate-shimmer" />
                {/* Building silhouette */}
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
                    className="flex items-end gap-1"
                  >
                    {[60, 90, 75, 110, 80, 65].map((h, k) => (
                      <div key={k} className="w-4 bg-gradient-to-t from-gold/60 to-gold/20 rounded-t-md" style={{ height: h }}>
                        <div className="grid grid-cols-2 gap-px p-1">
                          {Array.from({ length: Math.floor(h / 18) }).map((_, j) => (
                            <div key={j} className="w-1 h-1 bg-neon/80 rounded-sm animate-glow-pulse" style={{ animationDelay: `${j * 0.2}s` }} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
                <div className="absolute top-3 left-3 text-[10px] px-2 py-1 bg-gold/90 text-primary-foreground rounded-full font-bold tracking-wider">{e.tag}</div>
                <Building2 className="absolute top-3 right-3 w-5 h-5 text-gold/60" />
              </div>
              <div className="p-5">
                <div className="font-bold text-lg">{e.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><MapPin className="w-3 h-3" /> {e.location}</div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-gold" /> {e.beds}</span>
                  <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-gold" /> {e.baths}</span>
                </div>
                <div className="mt-3 text-gold font-black">{e.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
