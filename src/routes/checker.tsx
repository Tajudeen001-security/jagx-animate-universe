import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Bot, CheckCircle2, Download, FileJson, FileText, Loader2, Lock, Radar, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Navbar } from "@/components/jagx/Navbar";
import { Footer } from "@/components/jagx/Footer";
import { CMSProvider } from "@/lib/cms-store";
import { runCheck, type CheckReport } from "@/lib/checker.functions";

export const Route = createFileRoute("/checker")({
  head: () => ({
    meta: [
      { title: "JagX Website AI & Security Checker" },
      { name: "description", content: "Run a real front-end scan for AI-generated patterns, security headers and trust signals. Export as PDF or JSON." },
      { property: "og:title", content: "JagX Website AI & Security Checker" },
      { property: "og:description", content: "Scan any website for AI patterns, security hygiene and trust signals. Downloadable PDF & JSON reports." },
    ],
  }),
  component: () => (
    <CMSProvider>
      <CheckerPage />
    </CMSProvider>
  ),
});

function CheckerPage() {
  const check = useServerFn(runCheck);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CheckReport | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const analyze = async () => {
    setErr(null); setReport(null);
    let target = url.trim();
    if (!target) return;
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;
    try {
      new URL(target);
    } catch { setErr("Enter a valid URL"); return; }
    setLoading(true);
    try {
      const r = await check({ data: { url: target } });
      setReport(r);
      if (r.error) setErr(r.error);
    } catch (e: any) {
      setErr(e?.message || "Scan failed");
    } finally { setLoading(false); }
  };

  const downloadJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    triggerDownload(blob, `jagx-report-${safeName(report.url)}.json`);
  };

  const downloadPDF = async () => {
    if (!report) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    let y = 50;
    doc.setFillColor(15, 15, 20); doc.rect(0, 0, w, 80, "F");
    doc.setTextColor(212, 175, 55); doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("JagX Website Risk Report", 40, 50);
    doc.setFontSize(10); doc.setTextColor(200); doc.setFont("helvetica", "normal");
    doc.text(`Generated ${new Date(report.fetchedAt).toLocaleString()}  •  JagX × JRI`, 40, 68);
    y = 110;

    const line = (label: string, value: string) => {
      if (y > 780) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(80);
      doc.text(label, 40, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(20);
      const wrapped = doc.splitTextToSize(value, w - 180);
      doc.text(wrapped, 160, y);
      y += Math.max(14, wrapped.length * 12) + 2;
    };

    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0);
    doc.text("SCAN METADATA", 40, y); y += 16;
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

    const scoreLine = (label: string, val: number, invert = false) => {
      const good = invert ? val < 40 : val > 70;
      doc.setFont("helvetica", "bold"); doc.setFontSize(12);
      doc.setTextColor(good ? 20 : 180, good ? 130 : 40, 40);
      doc.text(`${label}: ${val}/100`, 40, y); y += 18;
    };
    doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0);
    doc.text("SCORES", 40, y); y += 16;
    scoreLine("AI-generated likelihood", report.aiScore, true);
    scoreLine("Security score", report.securityScore);
    scoreLine("Trust score", report.trustScore);
    y += 8;

    const catTitle: Record<string, string> = {
      security: "SECURITY SIGNALS",
      ai: "AI-GENERATION SIGNALS",
      trust: "TRUST SIGNALS",
    };
    (["security", "ai", "trust"] as const).forEach((cat) => {
      if (y > 760) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0);
      doc.text(catTitle[cat], 40, y); y += 16;
      report.signals.filter((s) => s.category === cat).forEach((s) => {
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

    // Response headers dump
    const headerEntries = Object.entries(report.headers);
    if (headerEntries.length) {
      if (y > 700) { doc.addPage(); y = 50; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(0);
      doc.text("RESPONSE HEADERS", 40, y); y += 16;
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

    // Footer on last page
    doc.setFont("helvetica", "italic"); doc.setFontSize(8); doc.setTextColor(120);
    doc.text("Generated by JagX Shield • jagx-animate-universe.lovable.app", 40, 820);


    doc.save(`jagx-report-${safeName(report.url)}.pdf`);
  };

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
              Live scan of any public URL — AI-generation signals, security headers, trust score. Export as PDF or JSON.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder="example.com or https://example.com"
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

            {report && !report.error && (
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={downloadPDF} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20">
                  <FileText className="h-4 w-4" /> Download PDF
                </button>
                <button onClick={downloadJSON} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-muted">
                  <FileJson className="h-4 w-4" /> Download JSON
                </button>
              </div>
            )}
          </div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative">
            <div className="absolute inset-6 bg-gold/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] glass p-6">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-gold" /><span className="font-black">JagX Shield Lab</span></div>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-xs text-gold">{report ? "SCAN COMPLETE" : "SAFE MODE"}</span>
              </div>

              {!report && (
                <div className="mt-8 grid gap-4 text-sm text-muted-foreground">
                  <Card icon={Bot} title="AI-generation signals" body="Cliché phrases, missing author/portfolio, generic stock imagery, dash-heavy prose." />
                  <Card icon={ShieldCheck} title="Security headers" body="HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer / Permissions Policy." />
                  <Card icon={CheckCircle2} title="Trust score" body="Title, description, contact, content depth, social preview tags." />
                </div>
              )}

              {report && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Score label="AI risk" value={report.aiScore} invert />
                    <Score label="Security" value={report.securityScore} />
                    <Score label="Trust" value={report.trustScore} />
                  </div>
                  <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
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
            </div>
          </motion.div>
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

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click();
  a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeName(u: string) {
  return u.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "site";
}
