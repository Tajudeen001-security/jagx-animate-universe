import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CheckReport = {
  url: string;
  fetchedAt: string;
  status: number | null;
  finalUrl: string;
  https: boolean;
  aiScore: number; // 0-100 (higher = more likely AI-generated)
  securityScore: number; // 0-100 (higher = better)
  trustScore: number; // 0-100
  signals: { key: string; label: string; ok: boolean; detail: string; category: "ai" | "security" | "trust" }[];
  headers: Record<string, string>;
  meta: { title?: string; description?: string; generator?: string; wordCount: number };
  error?: string;
};

const AI_PHRASES = [
  "in today's fast-paced world",
  "in the ever-evolving",
  "unlock the power",
  "revolutionize the way",
  "seamlessly integrate",
  "cutting-edge",
  "harness the power",
  "delve into",
  "in conclusion",
  "it is important to note",
  "leveraging",
  "elevate your",
  "empower your",
];

export const runCheck = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }): Promise<CheckReport> => {
    const started = new Date().toISOString();
    const signals: CheckReport["signals"] = [];
    let status: number | null = null;
    let finalUrl = data.url;
    let html = "";
    const headers: Record<string, string> = {};

    try {
      const res = await fetch(data.url, {
        redirect: "follow",
        headers: { "User-Agent": "JagX-Checker/1.0 (+https://jagx-animate-universe.lovable.app)" },
        signal: AbortSignal.timeout(12000),
      });
      status = res.status;
      finalUrl = res.url;
      res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
      html = await res.text();
    } catch (e: any) {
      return {
        url: data.url, fetchedAt: started, status: null, finalUrl: data.url,
        https: data.url.startsWith("https://"),
        aiScore: 0, securityScore: 0, trustScore: 0,
        signals: [], headers: {}, meta: { wordCount: 0 },
        error: e?.message || "Failed to fetch site",
      };
    }

    const https = finalUrl.startsWith("https://");
    const lower = html.toLowerCase();
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim();
    const description = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i.exec(html)?.[1];
    const generator = /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i.exec(html)?.[1];

    // AI signals
    const phraseHits = AI_PHRASES.filter((p) => lower.includes(p));
    const emojiHeadings = (html.match(/<h[1-3][^>]*>[^<]*[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []).length;
    const hasAuthor = /rel=["']author["']|itemprop=["']author["']|name=["']author["']/i.test(html);
    const hasPortfolio = /portfolio|case stud|testimonial|client/i.test(lower);
    const hasContact = /mailto:|tel:|whatsapp|contact/i.test(lower);
    const dashCount = (text.match(/—/g) || []).length;
    const genericStock = /unsplash\.com|pexels\.com|pixabay\.com/i.test(html);

    let aiScore = 0;
    aiScore += phraseHits.length * 12;
    aiScore += emojiHeadings * 6;
    aiScore += dashCount > 6 ? 10 : 0;
    aiScore += !hasAuthor ? 15 : 0;
    aiScore += !hasPortfolio ? 15 : 0;
    aiScore += genericStock ? 10 : 0;
    aiScore = Math.min(100, aiScore);

    signals.push(
      { key: "ai_phrases", label: "AI cliché phrases", ok: phraseHits.length === 0, detail: phraseHits.length ? `Found: ${phraseHits.slice(0,3).join(", ")}` : "No common AI clichés detected", category: "ai" },
      { key: "author", label: "Named author / brand proof", ok: hasAuthor, detail: hasAuthor ? "Author metadata present" : "No author or byline metadata", category: "ai" },
      { key: "portfolio", label: "Real work / testimonials", ok: hasPortfolio, detail: hasPortfolio ? "Portfolio / testimonial words present" : "No portfolio or testimonials", category: "ai" },
      { key: "stock", label: "Original imagery", ok: !genericStock, detail: genericStock ? "Generic stock image hosts detected" : "No generic stock hosts", category: "ai" },
    );

    // Security signals
    const h = (n: string) => headers[n];
    const secChecks = [
      { key: "https", label: "HTTPS", ok: https, detail: https ? "Served over HTTPS" : "Not using HTTPS — vulnerable to MITM" },
      { key: "hsts", label: "Strict-Transport-Security", ok: !!h("strict-transport-security"), detail: h("strict-transport-security") || "Missing HSTS — attacker can downgrade to HTTP" },
      { key: "csp", label: "Content-Security-Policy", ok: !!h("content-security-policy"), detail: h("content-security-policy") ? "CSP present" : "Missing CSP — XSS risk from injected scripts" },
      { key: "xfo", label: "X-Frame-Options / frame-ancestors", ok: !!(h("x-frame-options") || /frame-ancestors/i.test(h("content-security-policy") || "")), detail: "Prevents clickjacking via iframes" },
      { key: "xcto", label: "X-Content-Type-Options", ok: h("x-content-type-options") === "nosniff", detail: "Blocks MIME sniffing attacks" },
      { key: "ref", label: "Referrer-Policy", ok: !!h("referrer-policy"), detail: "Controls referrer leakage" },
      { key: "perm", label: "Permissions-Policy", ok: !!h("permissions-policy"), detail: "Limits camera/mic/geo access" },
      { key: "server", label: "Server banner hidden", ok: !h("server") || !/\d/.test(h("server") || ""), detail: h("server") ? `Server header exposes: ${h("server")}` : "No detailed server banner" },
      { key: "gen", label: "Generator not exposed", ok: !generator, detail: generator ? `Generator: ${generator} — reveals CMS/version` : "No generator meta" },
      { key: "mixed", label: "No mixed content", ok: !(https && /src=["']http:\/\//i.test(html)), detail: "Mixed content breaks HTTPS guarantees" },
    ];
    secChecks.forEach((c) => signals.push({ ...c, category: "security" }));
    const securityScore = Math.round((secChecks.filter((c) => c.ok).length / secChecks.length) * 100);

    // Trust signals
    const trustChecks = [
      { key: "title", label: "Page title", ok: !!title && title.length > 5, detail: title || "Missing <title>" },
      { key: "desc", label: "Meta description", ok: !!description && description.length > 30, detail: description || "Missing meta description" },
      { key: "contact", label: "Contact method", ok: hasContact, detail: hasContact ? "Contact link found" : "No contact / email / phone" },
      { key: "words", label: "Substantial content", ok: wordCount > 200, detail: `${wordCount} words on page` },
      { key: "og", label: "Social preview (OG tags)", ok: /property=["']og:(title|image)["']/i.test(html), detail: "OpenGraph tags help sharing" },
    ];
    trustChecks.forEach((c) => signals.push({ ...c, category: "trust" }));
    const trustScore = Math.round((trustChecks.filter((c) => c.ok).length / trustChecks.length) * 100);

    return {
      url: data.url, fetchedAt: started, status, finalUrl, https,
      aiScore, securityScore, trustScore,
      signals, headers, meta: { title, description, generator, wordCount },
    };
  });
