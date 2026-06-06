import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useCMS } from "@/lib/cms-store";

export function Websites() {
  const { data } = useCMS();
  return (
    <section id="websites" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">SELECTED WORK</div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight">
            Websites we've <span className="text-gradient-primary">shipped</span>
          </h2>
          <p className="mt-4 text-muted-foreground">From SaaS dashboards to 3D showrooms — every pixel hand-crafted by JagX.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.websites.map((w, i) => (
            <motion.a
              key={w.id}
              href={w.url ?? "#contact"}
              target={w.url ? "_blank" : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="group glass rounded-3xl overflow-hidden block"
            >
              <div className="relative aspect-video bg-gradient-to-br from-secondary to-background overflow-hidden">
                {/* Browser chrome */}
                <div className="absolute top-0 inset-x-0 h-7 bg-card/60 border-b border-border flex items-center gap-1.5 px-3">
                  <span className="w-2 h-2 rounded-full bg-destructive/70" />
                  <span className="w-2 h-2 rounded-full bg-gold/70" />
                  <span className="w-2 h-2 rounded-full bg-neon/70" />
                </div>
                {/* Fake UI */}
                <div className="absolute inset-x-0 top-7 bottom-0 p-3">
                  <div className="h-3 w-1/3 bg-gold/30 rounded mb-2" />
                  <div className="h-2 w-1/2 bg-muted rounded mb-3" />
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((k) => (
                      <motion.div
                        key={k}
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 2 + k * 0.4, repeat: Infinity }}
                        className="aspect-square rounded-md bg-gradient-to-br from-gold/30 to-accent/30 border border-gold/20"
                      />
                    ))}
                  </div>
                  <div className="mt-3 h-2 w-2/3 bg-muted rounded" />
                  <div className="mt-1 h-2 w-1/2 bg-muted rounded" />
                </div>
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity [background-image:linear-gradient(115deg,transparent_40%,oklch(1_0_0/8%)_50%,transparent_60%)] animate-shimmer" />
                <div className="absolute top-9 right-3 text-[10px] px-2 py-0.5 bg-gold/90 text-primary-foreground rounded-full font-bold tracking-wider">{w.tag}</div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold">{w.name}</div>
                  <div className="text-xs text-muted-foreground">{w.category}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
