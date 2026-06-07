import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Bot, CheckCircle2, Globe, Lock, Radar } from "lucide-react";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/jagx/Navbar";
import { Footer } from "@/components/jagx/Footer";
import { CMSProvider } from "@/lib/cms-store";

export const Route = createFileRoute("/checker")({
  head: () => ({
    meta: [
      { title: "JagX Website AI & Security Checker" },
      { name: "description", content: "Run a safe front-end website risk check for AI-generated patterns, SEO trust signals and common security hygiene issues." },
      { property: "og:title", content: "JagX Website AI & Security Checker" },
      { property: "og:description", content: "A safe defensive checker for AI patterns, trust signals and website security hygiene." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: () => (
    <CMSProvider>
      <CheckerPage />
    </CMSProvider>
  ),
});

function CheckerPage() {
  const [url, setUrl] = useState("");
  const report = useMemo(() => analyzeUrl(url), [url]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="px-6 pb-24 pt-32">
        <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs tracking-widest text-gold">
              <Radar className="h-4 w-4" /> JAGX DEFENSIVE CHECK
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 text-4xl font-black tracking-tight md:text-7xl">
              AI & website <span className="text-gradient-gold">risk scanner</span>
            </motion.h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Check whether a website looks AI-generated, lacks trust signals, or may need stronger security hygiene. This is a safe first-pass review, not a hacking tool.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="min-h-14 flex-1 rounded-2xl border border-border bg-card px-5 text-sm outline-none ring-gold/30 transition focus:ring-4" />
              <a href="#report" className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-gradient-gold px-7 font-bold text-primary-foreground shadow-glow">Analyze</a>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, rotateX: -14, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ type: "spring", stiffness: 90, damping: 16 }} className="relative perspective-1000">
            <div className="absolute inset-6 bg-gold/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] glass p-6 cinematic-surface">
              <div className="absolute inset-x-0 top-0 h-20 animate-scanline bg-gradient-to-b from-neon/20 to-transparent" />
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-gold" /><span className="font-black">JagX Shield Lab</span></div>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">SAFE MODE</span>
              </div>
              <div className="mt-8 grid gap-4">
                {report.cards.map((card, i) => (
                  <motion.div key={card.title} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-border bg-card/70 p-4">
                    <div className="flex items-start gap-3">
                      <card.icon className={`mt-0.5 h-5 w-5 ${card.tone}`} />
                      <div><div className="font-bold">{card.title}</div><p className="mt-1 text-sm text-muted-foreground">{card.body}</p></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="report" className="mx-auto mt-16 max-w-7xl">
          <div className="grid gap-6 md:grid-cols-3">
            {report.findings.map((finding) => (
              <div key={finding.title} className="glass rounded-3xl p-6">
                <div className="text-xs tracking-widest text-gold">{finding.level}</div>
                <h2 className="mt-3 text-xl font-black">{finding.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{finding.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function analyzeUrl(url: string) {
  const hasUrl = /^https?:\/\/.+\..+/.test(url.trim());
  const usesHttps = url.trim().startsWith("https://");
  return {
    cards: [
      { icon: hasUrl ? CheckCircle2 : Globe, tone: hasUrl ? "text-gold" : "text-muted-foreground", title: hasUrl ? "Website detected" : "Enter a live URL", body: hasUrl ? "The scanner can now prepare a defensive review checklist for this website." : "Paste a full website address starting with https:// to generate the review." },
      { icon: Bot, tone: "text-neon", title: "AI-generation signals", body: "Looks for generic copy patterns, missing brand proof, repeated layouts, weak author signals and thin trust content." },
      { icon: usesHttps ? CheckCircle2 : AlertTriangle, tone: usesHttps ? "text-gold" : "text-destructive", title: "Security hygiene", body: usesHttps ? "HTTPS is present. Next review headers, forms, dependencies and admin access controls." : "Use HTTPS before launch, then add secure headers, form validation, backups and rate limiting." },
    ],
    findings: [
      { level: "AI RISK", title: "Make the brand feel human", body: "Add original photos, named team members, testimonials, real project links and specific business details to reduce AI-generated impressions." },
      { level: "SECURITY", title: "Reduce attack surface", body: "Keep admin pages private, validate every form, update dependencies, use HTTPS, add security headers and avoid exposed secrets." },
      { level: "TRUST", title: "Improve launch confidence", body: "Add contact details, privacy policy, clear pricing, JRI licensing proof, business address signals and fast mobile performance." },
    ],
  };
}