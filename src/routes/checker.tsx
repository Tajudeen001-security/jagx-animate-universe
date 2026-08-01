import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Bot, CheckCircle2, Download, FileJson, FileText, Film, Loader2, Lock, Radar, ShieldCheck, Sparkles, Users, Video, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/jagx/Navbar";
import { Footer } from "@/components/jagx/Footer";
import { CMSProvider } from "@/lib/cms-store";
import { AdSlot } from "@/components/jagx/AdSlot";
import { runCheck, runSocialCheck, type CheckReport, type SocialReport } from "@/lib/checker.functions";

/**
 * Paste the data-ad-slot IDs from your AdSense dashboard here.
 * Empty string = reserved placeholder (no ad request, no policy risk).
 */
const AD_SLOTS = {
  header: "",
  sidebar: "",
  results: "",
};


export const Route = createFileRoute("/checker")({
  head: () => ({
    meta: [
      { title: "JRILICENSE Website & Social AI Checker" },
      { name: "description", content: "Scan any website or social account. AI-generation signals, security headers, video health, growth advice & posting times. Export PDF or JSON." },
      { property: "og:title", content: "JRILICENSE Website & Social AI Checker" },
      { property: "og:description", content: "AI-powered scanner for websites and YouTube/TikTok/Instagram accounts. Full downloadable report." },
    ],
  }),
  component: () => (
    <CMSProvider>
      <CheckerPage />
    </CMSProvider>
  ),
});

type Mode = "website" | "social";

function CheckerPage() {
  const check = useServerFn(runCheck);
  const socialCheck = useServerFn(runSocialCheck);
  const [mode, setMode] = useState<Mode>("website");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CheckReport | null>(null);
  const [social, setSocial] = useState<SocialReport | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const analyze = async () => {
    setErr(null); setReport(null); setSocial(null);
    let target = url.trim();
    if (!target) return;
    setLoading(true);
    try {
      if (mode === "website") {
        if (!/^https?:\/\//i.test(target)) target = "https://" + target;
        try { new URL(target); } catch { setErr("Enter a valid URL"); setLoading(false); return; }
        const r = await check({ data: { url: target } });
        setReport(r);
        if (r.error) setErr(r.error);
      } else {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        const r = await socialCheck({ data: { input: target, timezone: tz } });

        setSocial(r);
        if (r.error) setErr(r.error);
      }
    } catch (e: any) {
      setErr(e?.message || "Scan failed");
    } finally { setLoading(false); }
  };

  const downloadJSON = () => {
    const payload = mode === "website" ? report : social;
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const name = mode === "website" && report ? safeName(report.url) : social?.handle.replace(/[^\w]+/g, "-") || "report";
    triggerDownload(blob, `jrilicense-${mode}-${name}.json`);
  };

  const downloadCalendar = () => {
    if (!social || !social.calendar.length) return;
    const tz = social.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const rows = [
      ["#", "Date", "Day", "Time", "Time zone", "Platform", "Format", "Idea", "Hashtags", "CTA"],
      ...social.calendar.slice(0, 30).map((e, i) => [
        String(i + 1), e.date, e.day, e.time, tz, social.platform, e.format, e.idea, e.hashtags.join(" "), e.cta,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, `jrilicense-30day-calendar-${social.handle.replace(/[^\w]+/g, "-")}.csv`);
  };


  const downloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 15, 20); doc.rect(0, 0, w, 80, "F");
    doc.setTextColor(212, 175, 55); doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text(mode === "website" ? "JRILICENSE Website Risk Report" : "JRILICENSE Social Growth Report", 40, 50);
    doc.setFontSize(10); doc.setTextColor(200); doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date().toLocaleString()}  •  JRILICENSE`, 40, 68);
    let y = 110;

    const line = (label: string, value: string) => {
      if (y > 780) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(80);
      doc.text(label, 40, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(20);
      const wrapped = doc.splitTextToSize(value, w - 200);
      doc.text(wrapped, 180, y);
      y += Math.max(14, wrapped.length * 12) + 2;
    };
    const heading = (t: string) => {
      if (y > 760) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0);
      doc.text(t, 40, y); y += 16;
    };
    const bullet = (s: string) => {
      if (y > 790) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(30);
      const lines = doc.splitTextToSize("• " + s, w - 80);
      doc.text(lines, 48, y);
      y += lines.length * 12 + 2;
    };

    if (mode === "website" && report) {
      heading("SCAN METADATA");
      line("Scanned URL:", report.url);
      line("Resolved URL:", report.finalUrl);
      line("HTTP status:", String(report.status ?? "n/a"));
      line("HTTPS:", report.https ? "Yes" : "No");
      line("Page title:", report.meta.title || "—");
      line("Meta description:", report.meta.description || "—");
      line("Generator:", report.meta.generator || "—");
      line("Word count:", String(report.meta.wordCount));
      line("Timestamp (UTC):", report.fetchedAt);
      y += 8;

      heading("SCORES");
      const scoreLine = (label: string, val: number, invert = false) => {
        const good = invert ? val < 40 : val > 70;
        doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.setTextColor(good ? 20 : 180, good ? 130 : 40, 40);
        doc.text(`${label}: ${val}/100`, 40, y); y += 18;
      };
      scoreLine("AI-generated likelihood", report.aiScore, true);
      scoreLine("Security score", report.securityScore);
      scoreLine("Trust score", report.trustScore);
      y += 8;

      const catTitle: Record<string, string> = {
        security: "SECURITY SIGNALS",
        ai: "AI-GENERATION SIGNALS",
        trust: "TRUST SIGNALS",
        media: "BACKDROP VIDEO HEALTH",
      };
      (["security", "ai", "trust", "media"] as const).forEach((cat) => {
        const items = report.signals.filter((s) => s.category === cat);
        if (!items.length) return;
        heading(catTitle[cat]);
        items.forEach((s) => {
          if (y > 780) { doc.addPage(); y = 50; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(10);
          doc.setTextColor(s.ok ? 30 : 180, s.ok ? 130 : 40, 40);
          doc.text(`${s.ok ? "PASS" : "FAIL"}  ${s.label}`, 48, y);
          doc.setFont("helvetica", "normal"); doc.setTextColor(60);
          const lines = doc.splitTextToSize(s.detail, w - 100);
          doc.text(lines, 80, y + 12);
          y += 14 + lines.length * 12;
        });
        y += 10;
      });

      // Video URL table
      if (report.videoChecks?.length) {
        heading("BACKDROP VIDEO URLs (RAW)");
        report.videoChecks.forEach((v) => {
          if (y > 720) { doc.addPage(); y = 50; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0);
          doc.text(v.name, 48, y); y += 12;
          line("URL:", v.url);
          line("Status:", String(v.status ?? "n/a"));
          line("Content-Type:", v.contentType || "—");
          line("Content-Length:", v.contentLength ? `${(v.contentLength / 1024 / 1024).toFixed(2)} MB (${v.contentLength} bytes)` : "—");
          line("Accept-Ranges:", v.acceptRanges || "—");
          line("Range support:", v.supportsRange ? "Yes (206 verified)" : "No");
          line("Cache-Control:", v.cacheControl || "—");
          if (v.error) line("Error:", v.error);
          y += 6;
        });
      }

      const headerEntries = Object.entries(report.headers);
      if (headerEntries.length) {
        heading("RESPONSE HEADERS");
        headerEntries.forEach(([k, v]) => {
          if (y > 790) { doc.addPage(); y = 50; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(80);
          doc.text(k, 48, y);
          doc.setFont("helvetica", "normal"); doc.setTextColor(40);
          const lines = doc.splitTextToSize(String(v), w - 220);
          doc.text(lines, 200, y);
          y += Math.max(12, lines.length * 10) + 2;
        });
      }
      doc.save(`jrilicense-website-${safeName(report.url)}.pdf`);
    } else if (mode === "social" && social) {
      heading("ACCOUNT");
      line("Platform:", social.platform.toUpperCase());
      line("Handle:", social.handle);
      line("Profile URL:", social.profileUrl);
      line("Display name:", social.displayName || "—");
      line("Bio:", social.bio || "—");
      line("Verified:", social.verified ? "Yes" : "No");
      line("Scanned at:", social.fetchedAt);
      y += 4;

      heading("METRICS");
      line("Followers/Subscribers:", social.followers?.toLocaleString() || "—");
      line("Following:", social.following?.toLocaleString() || "—");
      line("Videos/Posts:", social.videos?.toLocaleString() || "—");
      line("Total likes:", social.totalLikes?.toLocaleString() || "—");
      line("Estimated avg views:", social.avgViews?.toLocaleString() || "—");
      y += 4;

      heading("WHAT THE ACCOUNT IS ABOUT");
      doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(20);
      const sum = doc.splitTextToSize(social.advice.summary || "—", w - 80);
      doc.text(sum, 48, y); y += sum.length * 14 + 8;

      heading("WHAT THEY DO WELL");
      social.advice.whatTheyDoWell.forEach(bullet);
      y += 4;

      heading("WHAT THEY POST WRONG (FIX THESE)");
      social.advice.mistakes.forEach(bullet);
      y += 4;

      heading("CONTENT THAT WILL GROW THE ACCOUNT");
      social.advice.contentToPost.forEach(bullet);
      y += 4;

      heading("BEST TIMES TO POST");
      social.advice.bestPostingTimes.forEach((t) => bullet(`${t.day} @ ${t.time} — ${t.reason}`));
      y += 4;

      heading("30-DAY GROWTH PLAN");
      social.advice.growthPlan.forEach(bullet);
      y += 4;

      heading("ADSENSE — EARN MORE IN 30 DAYS");
      social.advice.adsStrategy.forEach(bullet);
      y += 4;

      heading("WHERE TO PLACE ADS ON THE SITE");
      social.advice.adsPlacements.forEach(bullet);
      y += 4;

      if (social.calendar.length) {
        heading("30-DAY POSTING CALENDAR");
        social.calendar.forEach((c) => {
          if (y > 770) { doc.addPage(); y = 50; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(0);
          doc.text(`${c.date} (${c.day}) @ ${c.time} — ${c.format}`, 48, y); y += 12;
          doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(40);
          const idea = doc.splitTextToSize(`Idea: ${c.idea}`, w - 100);
          doc.text(idea, 60, y); y += idea.length * 11;
          const tags = doc.splitTextToSize(`Tags: ${c.hashtags.join(" ")}`, w - 100);
          doc.text(tags, 60, y); y += tags.length * 11;
          const cta = doc.splitTextToSize(`CTA: ${c.cta}`, w - 100);
          doc.text(cta, 60, y); y += cta.length * 11 + 4;
        });
      }

      if (social.rawSample.length) {
        heading("RAW EXTRACTED VALUES");
        social.rawSample.forEach((r) => line(r.key + ":", r.value));
      }
      doc.save(`jrilicense-social-${social.handle.replace(/[^\w]+/g, "-")}.pdf`);
    }
  };

  const hasResult = (mode === "website" && report) || (mode === "social" && social);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="px-6 pb-24 pt-32">
        {/* Header leaderboard — above the fold, loads immediately */}
        <div className="mx-auto mb-8 max-w-7xl">
          <AdSlot slot={AD_SLOTS.header} lazy={false} format="horizontal" style={{ minHeight: 90 }} label="Sponsored" />
        </div>
        <section className="mx-auto max-w-7xl">

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs tracking-widest text-gold">
                <Radar className="h-4 w-4" /> JRILICENSE INTELLIGENCE
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
                AI, security & <span className="text-gradient-gold">social growth</span> scanner
              </motion.h1>
              <p className="mt-5 max-w-xl text-muted-foreground">
                Scan any website or social account (YouTube, TikTok, Instagram). Get AI-generated growth advice, best posting times, and a full PDF or JSON report.
              </p>

              {/* Mode toggle */}
              <div className="mt-8 inline-flex rounded-2xl border border-border bg-card p-1">
                <button onClick={() => { setMode("website"); setReport(null); setSocial(null); setErr(null); }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "website" ? "bg-gradient-gold text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
                  <ShieldCheck className="h-4 w-4" /> Website
                </button>
                <button onClick={() => { setMode("social"); setReport(null); setSocial(null); setErr(null); }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${mode === "social" ? "bg-gradient-gold text-primary-foreground shadow-glow" : "text-muted-foreground"}`}>
                  <Users className="h-4 w-4" /> Social Account
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && analyze()}
                  placeholder={mode === "website" ? "example.com or https://example.com" : "@handle, youtube.com/@channel, tiktok.com/@user, instagram.com/user, x.com/user, facebook.com/page"}
                  className="min-h-14 flex-1 rounded-2xl border border-border bg-card px-5 text-sm outline-none ring-gold/30 transition focus:ring-4"
                />
                <button
                  onClick={analyze}
                  disabled={loading}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-gold px-7 font-bold text-primary-foreground shadow-glow disabled:opacity-60"
                >
                  {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Scanning</> : "Analyze"}
                </button>
              </div>
              {err && <p className="mt-4 text-sm text-destructive">{err}</p>}

              {hasResult && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={downloadPDF} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20">
                    <FileText className="h-4 w-4" /> Download PDF
                  </button>
                  <button onClick={downloadJSON} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
                    <FileJson className="h-4 w-4" /> Download JSON
                  </button>
                  {mode === "social" && social && social.calendar.length > 0 && (
                    <button onClick={downloadCalendar} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20">
                      <Download className="h-4 w-4" /> 30-Day Calendar (CSV)
                    </button>
                  )}
                </div>
              )}

              {/* Sidebar / in-column unit */}
              <div className="mt-10">
                <AdSlot slot={AD_SLOTS.sidebar} format="vertical" style={{ minHeight: 250 }} label="Sponsored" />
              </div>
            </div>


            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="absolute inset-6 bg-gold/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] glass p-6">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-gold" /><span className="font-black">JRILICENSE Shield Lab</span></div>
                  <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">{hasResult ? "SCAN COMPLETE" : "SAFE MODE"}</span>
                </div>

                {!hasResult && mode === "website" && (
                  <div className="mt-8 grid gap-4 text-sm text-muted-foreground">
                    <Card icon={Bot} title="AI-generation signals" body="Cliché phrases, missing author/portfolio, generic stock imagery." />
                    <Card icon={ShieldCheck} title="Security headers" body="HSTS, CSP, XFO, Referrer / Permissions Policy." />
                    <Card icon={Film} title="Backdrop video health" body="HEAD requests, status, MIME type & range support for every backdrop video." />
                  </div>
                )}

                {!hasResult && mode === "social" && (
                  <div className="mt-8 grid gap-4 text-sm text-muted-foreground">
                    <Card icon={Users} title="Followers, videos, avg views" body="Scraped from public profile pages." />
                    <Card icon={Sparkles} title="AI-generated growth advice" body="What the account is about, what they post wrong, and what to post instead." />
                    <Card icon={Video} title="Best posting times" body="Per-day posting slots optimised for the detected platform." />
                  </div>
                )}

                {report && mode === "website" && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <Score label="AI risk" value={report.aiScore} invert />
                      <Score label="Security" value={report.securityScore} />
                      <Score label="Trust" value={report.trustScore} />
                    </div>
                    <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
                      {report.signals.map((s) => (
                        <div key={s.key} className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3">
                          {s.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" /> : <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />}
                          <div className="min-w-0">
                            <div className="text-sm font-bold">{s.label} <span className="ml-1 text-[10px] uppercase tracking-widest text-muted-foreground">{s.category}</span></div>
                            <div className="mt-0.5 break-words text-xs text-muted-foreground">{s.detail}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {social && mode === "social" && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card/60 p-4">
                      {social.avatar && <img src={social.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />}
                      <div className="min-w-0">
                        <div className="truncate font-black">{social.displayName || social.handle}</div>
                        <div className="text-xs uppercase tracking-widest text-gold">{social.platform} • {social.handle}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <Metric label="Followers" value={fmt(social.followers)} />
                      <Metric label="Videos" value={fmt(social.videos)} />
                      <Metric label="Avg views" value={fmt(social.avgViews)} />
                    </div>
                    <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                      {social.advice.summary && (
                        <Section title="About this account">{social.advice.summary}</Section>
                      )}
                      {social.advice.mistakes.length > 0 && (
                        <Section title="What they're posting wrong" tone="bad">
                          <ul className="list-disc pl-5 space-y-1 text-sm">{social.advice.mistakes.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        </Section>
                      )}
                      {social.advice.contentToPost.length > 0 && (
                        <Section title="Post this to grow" tone="good">
                          <ul className="list-disc pl-5 space-y-1 text-sm">{social.advice.contentToPost.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        </Section>
                      )}
                      {social.advice.bestPostingTimes.length > 0 && (
                        <Section title="Best times to post">
                          <div className="grid gap-1 text-sm">
                            {social.advice.bestPostingTimes.map((t, i) => (
                              <div key={i} className="flex items-baseline justify-between gap-3">
                                <span className="font-bold text-gold">{t.day} @ {t.time}</span>
                                <span className="text-xs text-muted-foreground">{t.reason}</span>
                              </div>
                            ))}
                          </div>
                        </Section>
                      )}
                      {social.advice.growthPlan.length > 0 && (
                        <Section title="30-day growth plan">
                          <ol className="list-decimal pl-5 space-y-1 text-sm">{social.advice.growthPlan.map((m, i) => <li key={i}>{m}</li>)}</ol>
                        </Section>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Card({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4">
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 text-gold" />
        <div><div className="font-bold text-foreground">{title}</div><p className="mt-1 text-sm text-muted-foreground">{body}</p></div>
      </div>
    </div>
  );
}

function Score({ label, value, invert = false }: { label: string; value: number; invert?: boolean }) {
  const good = invert ? value < 40 : value > 70;
  const warn = invert ? value < 70 : value > 40;
  const tone = good ? "text-gold" : warn ? "text-neon" : "text-destructive";
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 text-center">
      <div className={`text-3xl font-black ${tone}`}>{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4 text-center">
      <div className="text-2xl font-black text-gold">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Section({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "good" | "bad" }) {
  const border = tone === "bad" ? "border-destructive/40" : tone === "good" ? "border-gold/40" : "border-border";
  return (
    <div className={`rounded-2xl border ${border} bg-card/60 p-4`}>
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">{title}</div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function fmt(n?: number) {
  if (n === undefined || n === null || isNaN(n)) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeName(u: string) {
  return u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "site";
}
