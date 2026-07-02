import { motion } from "framer-motion";
import { Gauge, Zap } from "lucide-react";
import { useCMS } from "@/lib/cms-store";
import { VideoBackdrop } from "@/components/jagx/VideoBackdrop";

export function Cars() {
  const { data } = useCMS();
  return (
    <section id="cars" className="relative py-32 px-6 overflow-hidden">
      <VideoBackdrop variant="android" opacity={0.18} />
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">JAGX MOTORS</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Drive the <span className="text-gradient-primary">JagX</span> badge
          </h2>
          <p className="mt-4 text-muted-foreground">Performance, hybrid and electric — every JagX vehicle wears the JRI flag of excellence.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {data.cars.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative glass rounded-3xl overflow-hidden"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-background via-secondary to-card overflow-hidden">
                {/* Road lines */}
                <div className="absolute bottom-0 inset-x-0 h-1/2 [background-image:linear-gradient(to_top,oklch(0.18_0.03_270),transparent)]" />
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-8 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                />
                {/* Car silhouette */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 w-3/4"
                >
                  <svg viewBox="0 0 300 90" className="w-full">
                    <defs>
                      <linearGradient id={`cg${i}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="oklch(0.82 0.16 85)" />
                        <stop offset="1" stopColor="oklch(0.7 0.25 195)" />
                      </linearGradient>
                    </defs>
                    <path d="M10 60 Q 30 30 80 25 L 180 22 Q 230 22 260 45 L 285 50 Q 290 55 285 65 L 270 70 Q 260 80 245 70 L 65 70 Q 50 80 35 70 L 20 68 Q 10 65 10 60 Z" fill={`url(#cg${i})`} />
                    <circle cx="70" cy="72" r="14" fill="oklch(0.12 0.02 270)" stroke="oklch(0.82 0.16 85)" strokeWidth="2" />
                    <circle cx="240" cy="72" r="14" fill="oklch(0.12 0.02 270)" stroke="oklch(0.82 0.16 85)" strokeWidth="2" />
                    <path d="M85 30 L 175 28 L 200 45 L 80 47 Z" fill="oklch(0.7 0.25 195 / 50%)" />
                  </svg>
                </motion.div>
                <div className="absolute top-3 left-3 text-[10px] px-2 py-1 bg-gold/90 text-primary-foreground rounded-full font-bold tracking-wider">{c.tag}</div>
                <div className="absolute top-3 right-3 flex items-center gap-1 glass px-2 py-1 rounded-full">
                  <span className="text-[9px] font-black text-gold">J</span>
                  <span className="text-[9px] text-muted-foreground">JRI ✓</span>
                </div>
              </div>
              <div className="p-6 flex items-end justify-between flex-wrap gap-3">
                <div>
                  <div className="text-2xl font-black">{c.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                    <Gauge className="w-3.5 h-3.5 text-gold" /> {c.spec}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="text-xl font-black text-gradient-gold">{c.price}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
