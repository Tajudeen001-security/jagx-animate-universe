import { motion } from "framer-motion";

const products = [
  { name: "JagX Pulse X1", category: "Mobile · JRI Certified", price: "₦450,000", tag: "FLAGSHIP" },
  { name: "JagX Aurum Chain", category: "Jewelry · 18K Gold", price: "₦320,000", tag: "LIMITED" },
  { name: "JagX Apex Hoodie", category: "Clothing · Premium Drop", price: "₦45,000", tag: "NEW" },
  { name: "JagX FlowOps", category: "Automation Suite", price: "From ₦150,000", tag: "B2B" },
];

export function Products() {
  return (
    <section id="products" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12 flex-wrap gap-4"
        >
          <div>
            <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">FEATURED</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Signature <span className="text-gradient-primary">JagX</span> drops
            </h2>
          </div>
          <a href="#contact" className="text-sm text-gold hover:underline">Request catalog →</a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, rotateX: 5 }}
              className="group relative glass rounded-3xl overflow-hidden perspective-1000"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-gradient-to-br from-secondary to-background">
                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_50%_50%,oklch(0.82_0.16_85/30%),transparent_60%)]" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-10 rounded-full border border-gold/20"
                />
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-16 rounded-full border border-accent/20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-gold shadow-glow flex items-center justify-center text-2xl font-black text-primary-foreground group-hover:scale-110 transition-transform">
                    J
                  </div>
                </div>
                <div className="absolute top-4 left-4 text-[10px] px-2 py-1 bg-gold/90 text-primary-foreground rounded-full font-bold tracking-wider">{p.tag}</div>
              </div>
              <div className="p-5">
                <div className="text-xs text-muted-foreground">{p.category}</div>
                <div className="mt-1 font-bold text-lg">{p.name}</div>
                <div className="mt-2 text-gold font-black">{p.price}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
