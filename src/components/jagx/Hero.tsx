import { motion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { usePointerDepth } from "@/hooks/use-pointer-depth";
import { VideoBackdrop } from "@/components/jagx/VideoBackdrop";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      {/* Cinematic ambient video */}
      <VideoBackdrop variant="circuit" opacity={0.28} />

      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gold/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-neon/20 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: "6s" }} />
      </div>

      {/* Grid backdrop */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:50px_50px]" />


      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium tracking-wider text-muted-foreground">
              JRI LICENSED · JAGX BUSINESS GROUP
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight"
          >
            Building the{" "}
            <span className="text-gradient-gold animate-gradient">future</span>{" "}
            of digital{" "}
            <span className="relative inline-block">
              <span className="text-gradient-primary animate-gradient">commerce</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.2 }}
                  d="M2 9 Q 100 -3 198 7"
                  stroke="url(#g)" strokeWidth="3" strokeLinecap="round" fill="none"
                />
                <defs>
                  <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(0.82 0.16 85)" />
                    <stop offset="1" stopColor="oklch(0.7 0.25 195)" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            From automation pipelines to JagX-branded mobile phones, bespoke jewelry,
            premium clothing and world-class websites — one studio, infinite craft.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a href="#services" className="group inline-flex items-center gap-2 px-7 py-4 bg-gradient-gold rounded-full text-primary-foreground font-semibold shadow-glow hover:scale-105 transition-transform">
              Explore Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#products" className="group inline-flex items-center gap-2 px-7 py-4 glass rounded-full text-foreground font-semibold hover:border-gold/40 transition-colors">
              <Play className="w-4 h-4" />
              See Our Work
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { k: "150+", v: "Projects" },
              { k: "98%", v: "Satisfaction" },
              { k: "24/7", v: "Support" },
            ].map((s) => (
              <div key={s.v}>
                <div className="text-3xl font-black text-gradient-gold">{s.k}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D phone */}
        <Phone3D />
      </div>
    </section>
  );
}

function Phone3D() {
  const depth = usePointerDepth({ maxRotate: 13, lift: 8, perspective: 1400 });
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="relative perspective-1000 flex justify-center"
    >
      <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-glow-pulse" />

      <motion.div
        animate={{ rotateY: [0, 8, 0, -8, 0], rotateX: [0, -4, 0, 4, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ref={depth.ref}
        style={depth.style}
        {...depth.handlers}
        className="relative preserve-3d"
      >
        <div className="relative w-[280px] h-[560px] rounded-[3rem] bg-gradient-to-br from-secondary via-card to-background border border-gold/30 shadow-elegant p-3">
          <motion.div style={depth.glareStyle} className="pointer-events-none absolute inset-0 rounded-[3rem] opacity-70" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-full z-20" />
          <div className="w-full h-full rounded-[2.4rem] overflow-hidden relative bg-gradient-to-b from-background to-card">
            {/* Phone screen content */}
            <div className="absolute inset-0 [background-image:radial-gradient(circle_at_30%_20%,oklch(0.82_0.16_85/30%),transparent_50%),radial-gradient(circle_at_70%_80%,oklch(0.7_0.25_195/30%),transparent_50%)]" />
            <div className="relative p-6 pt-14 flex flex-col h-full">
              <div className="text-xs text-muted-foreground tracking-widest">JAGX OS · v2.0</div>
              <div className="mt-2 text-2xl font-black text-gradient-gold">Hello, World</div>
              <div className="mt-8 grid grid-cols-3 gap-3 depth-layer">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
                    className="aspect-square rounded-xl bg-gradient-to-br from-gold/30 to-accent/30 border border-gold/20"
                  />
                ))}
              </div>
              <div className="mt-auto glass rounded-2xl p-4">
                <div className="text-[10px] text-muted-foreground">POWERED BY</div>
                <div className="text-sm font-bold text-gradient-gold">JagX × JRI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating badge */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -left-8 top-20 glass rounded-2xl p-3 shadow-glow"
        >
          <div className="text-[10px] text-muted-foreground">JRI</div>
          <div className="text-xs font-bold text-gold">✓ Licensed</div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -right-6 bottom-32 glass rounded-2xl p-3 shadow-neon"
        >
          <div className="text-[10px] text-muted-foreground">5★</div>
          <div className="text-xs font-bold text-neon">Premium</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
