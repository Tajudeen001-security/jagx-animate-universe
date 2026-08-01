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
  signals: { key: string; label: string; ok: boolean; detail: string; category: "ai" | "security" | "trust" | "media" }[];
  headers: Record<string, string>;
  meta: { title?: string; description?: string; generator?: string; wordCount: number };
  videoChecks: VideoCheck[];
  error?: string;
};

export type VideoCheck = {
  name: string;
  url: string;
  status: number | null;
  ok: boolean;
  contentType: string | null;
  contentLength: number | null;
  acceptRanges: string | null;
  supportsRange: boolean;
  cacheControl: string | null;
  error?: string;
};

// Backdrop videos used across the site — verified on every scan.
const BACKDROP_VIDEOS: { name: string; url: string }[] = [
  { name: "jagx-robot.mp4",   url: "https://storage.lovable.dev/a/v1/62c87693-4bf9-4f19-af7a-45464c164743/8ac20465-b60d-4a59-ae82-72c71636bf77/jagx-robot.mp4" },
  { name: "jagx-circuit.mp4", url: "https://storage.lovable.dev/a/v1/62c87693-4bf9-4f19-af7a-45464c164743/0a8ab630-9653-4069-ba74-47462b39d267/jagx-circuit.mp4" },
  { name: "jagx-jars.mp4",    url: "https://storage.lovable.dev/a/v1/62c87693-4bf9-4f19-af7a-45464c164743/4c006815-8a89-4a62-8436-28a2a9628590/jagx-jars.mp4" },
  { name: "jagx-android.mp4", url: "https://storage.lovable.dev/a/v1/62c87693-4bf9-4f19-af7a-45464c164743/c5ec3418-d587-44e2-a8c6-70c65ebb4028/jagx-android.mp4" },
];

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

async function verifyVideo(v: { name: string; url: string }): Promise<VideoCheck> {
  try {
    // Try HEAD first
    let res = await fetch(v.url, { method: "HEAD", signal: AbortSignal.timeout(8000) });
    // Some CDNs reject HEAD — fall back to a tiny ranged GET.
    let rangeSupported = (res.headers.get("accept-ranges") || "").toLowerCase().includes("bytes");
    if (!res.ok || !res.headers.get("content-type")) {
      const r = await fetch(v.url, {
        method: "GET",
        headers: { Range: "bytes=0-1" },
        signal: AbortSignal.timeout(8000),
      });
      // Reading a tiny slice is enough; discard body.
      try { await r.arrayBuffer(); } catch {}
      res = r;
      rangeSupported = r.status === 206 || rangeSupported;
    } else {
      // Confirm range support with a tiny probe.
      try {
        const probe = await fetch(v.url, { method: "GET", headers: { Range: "bytes=0-1" }, signal: AbortSignal.timeout(5000) });
        try { await probe.arrayBuffer(); } catch {}
        rangeSupported = rangeSupported || probe.status === 206;
      } catch {}
    }
    const ct = res.headers.get("content-type");
    const cl = res.headers.get("content-length");
    return {
      name: v.name,
      url: v.url,
      status: res.status,
      ok: res.ok || res.status === 206,
      contentType: ct,
      contentLength: cl ? Number(cl) : null,
      acceptRanges: res.headers.get("accept-ranges"),
      supportsRange: rangeSupported,
      cacheControl: res.headers.get("cache-control"),
    };
  } catch (e: any) {
    return {
      name: v.name, url: v.url, status: null, ok: false,
      contentType: null, contentLength: null, acceptRanges: null,
      supportsRange: false, cacheControl: null,
      error: e?.message || "Request failed",
    };
  }
}

export const runCheck = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ url: z.string().url() }).parse(d))
  .handler(async ({ data }): Promise<CheckReport> => {
    const started = new Date().toISOString();
    const signals: CheckReport["signals"] = [];
    let status: number | null = null;
    let finalUrl = data.url;
    let html = "";
    const headers: Record<string, string> = {};

    // Run video checks in parallel with the page fetch.
    const videoChecksPromise = Promise.all(BACKDROP_VIDEOS.map(verifyVideo));

    try {
      const res = await fetch(data.url, {
        redirect: "follow",
        headers: { "User-Agent": "JRILICENSE-Checker/1.0 (+https://jagx-animate-universe.lovable.app)" },
        signal: AbortSignal.timeout(12000),
      });
      status = res.status;
      finalUrl = res.url;
      res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
      html = await res.text();
    } catch (e: any) {
      const videoChecks = await videoChecksPromise;
      return {
        url: data.url, fetchedAt: started, status: null, finalUrl: data.url,
        https: data.url.startsWith("https://"),
        aiScore: 0, securityScore: 0, trustScore: 0,
        signals: [], headers: {}, meta: { wordCount: 0 },
        videoChecks,
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

    const trustChecks = [
      { key: "title", label: "Page title", ok: !!title && title.length > 5, detail: title || "Missing <title>" },
      { key: "desc", label: "Meta description", ok: !!description && description.length > 30, detail: description || "Missing meta description" },
      { key: "contact", label: "Contact method", ok: hasContact, detail: hasContact ? "Contact link found" : "No contact / email / phone" },
      { key: "words", label: "Substantial content", ok: wordCount > 200, detail: `${wordCount} words on page` },
      { key: "og", label: "Social preview (OG tags)", ok: /property=["']og:(title|image)["']/i.test(html), detail: "OpenGraph tags help sharing" },
    ];
    trustChecks.forEach((c) => signals.push({ ...c, category: "trust" }));
    const trustScore = Math.round((trustChecks.filter((c) => c.ok).length / trustChecks.length) * 100);

    const videoChecks = await videoChecksPromise;
    videoChecks.forEach((v) => {
      signals.push({
        key: `video_${v.name}`,
        label: `Backdrop video: ${v.name}`,
        ok: v.ok,
        detail: v.ok
          ? `HTTP ${v.status} • ${v.contentType || "?"} • ${v.contentLength ? (v.contentLength / 1024 / 1024).toFixed(2) + " MB" : "size ?"} • range: ${v.supportsRange ? "yes" : "no"}`
          : v.error || `HTTP ${v.status ?? "n/a"}`,
        category: "media",
      });
    });

    return {
      url: data.url, fetchedAt: started, status, finalUrl, https,
      aiScore, securityScore, trustScore,
      signals, headers, meta: { title, description, generator, wordCount },
      videoChecks,
    };
  });

// ---------------- SOCIAL CHECKER ----------------

export type SocialPlatform = "youtube" | "tiktok" | "instagram" | "x" | "facebook";

export type CalendarEntry = {
  date: string;      // YYYY-MM-DD
  day: string;       // Mon..Sun
  time: string;      // HH:MM
  idea: string;
  format: string;    // e.g. Short, Reel, Carousel, Thread
  hashtags: string[];
  cta: string;
};

export type SocialReport = {
  platform: SocialPlatform;
  handle: string;
  profileUrl: string;
  fetchedAt: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  followers?: number;
  following?: number;
  videos?: number;
  totalLikes?: number;
  avgViews?: number;
  verified?: boolean;
  rawSample: { key: string; value: string }[];
  advice: {
    summary: string;
    whatTheyDoWell: string[];
    mistakes: string[];
    contentToPost: string[];
    bestPostingTimes: { day: string; time: string; reason: string }[];
    growthPlan: string[];
    adsStrategy: string[];       // how to get AdSense/ads approved fast + earn more in 30d
    adsPlacements: string[];     // where to place ad units on the site
  };
  calendar: CalendarEntry[];      // 30-day posting plan
  error?: string;
};

function detectPlatform(input: string): { platform: SocialPlatform; handle: string; url: string } | null {
  const s = input.trim();
  // Full URL
  try {
    const u = new URL(s.startsWith("http") ? s : "https://" + s);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/+$/, "");
    if (host.includes("youtube.com") || host === "youtu.be") {
      const handle = path.startsWith("/@") ? path.slice(1) : path.split("/").filter(Boolean).pop() || "";
      return { platform: "youtube", handle, url: `https://www.youtube.com/${handle.startsWith("@") ? handle : "@" + handle.replace(/^@/, "")}` };
    }
    if (host.includes("tiktok.com")) {
      const handle = (path.match(/@([^/]+)/)?.[1]) || path.split("/").filter(Boolean).pop() || "";
      return { platform: "tiktok", handle: "@" + handle.replace(/^@/, ""), url: `https://www.tiktok.com/@${handle.replace(/^@/, "")}` };
    }
    if (host.includes("instagram.com")) {
      const handle = path.split("/").filter(Boolean)[0] || "";
      return { platform: "instagram", handle: "@" + handle.replace(/^@/, ""), url: `https://www.instagram.com/${handle.replace(/^@/, "")}/` };
    }
    if (host === "x.com" || host === "twitter.com" || host.endsWith(".x.com") || host.endsWith(".twitter.com")) {
      const handle = path.split("/").filter(Boolean)[0] || "";
      const clean = handle.replace(/^@/, "");
      return { platform: "x", handle: "@" + clean, url: `https://x.com/${clean}` };
    }
    if (host.includes("facebook.com") || host === "fb.com" || host.endsWith(".fb.com")) {
      const handle = path.split("/").filter(Boolean)[0] || "";
      const clean = handle.replace(/^@/, "");
      return { platform: "facebook", handle: clean, url: `https://www.facebook.com/${clean}` };
    }
  } catch {}
  // Bare handle — default to youtube
  const bare = s.replace(/^@/, "");
  return { platform: "youtube", handle: "@" + bare, url: `https://www.youtube.com/@${bare}` };
}

function numberFromHumanish(v?: string | null): number | undefined {
  if (!v) return undefined;
  const m = v.replace(/[, ]/g, "").match(/([\d.]+)\s*([kmb]?)/i);
  if (!m) return undefined;
  const n = parseFloat(m[1]);
  const suf = m[2].toLowerCase();
  return Math.round(n * (suf === "b" ? 1e9 : suf === "m" ? 1e6 : suf === "k" ? 1e3 : 1));
}

async function scrapeYouTube(profileUrl: string, handle: string): Promise<Partial<SocialReport> & { rawSample: SocialReport["rawSample"] }> {
  const res = await fetch(profileUrl + "/about", {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JRILICENSE/1.0)" },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();
  const raw: { key: string; value: string }[] = [];
  const push = (k: string, v?: string | null) => v && raw.push({ key: k, value: v });

  const name = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1];
  const desc = /<meta property="og:description" content="([^"]+)"/i.exec(html)?.[1];
  const avatar = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1];
  const subs = /"subscriberCountText":\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"/i.exec(html)?.[1]
    || /([\d.,]+[KMB]?)\s+subscribers?/i.exec(html)?.[1];
  const videos = /"videosCountText".*?"simpleText":"([\d.,]+)"/i.exec(html)?.[1]
    || /([\d.,]+)\s+videos?/i.exec(html)?.[1];
  const views = /([\d.,]+)\s+views?/i.exec(html)?.[1];
  const joined = /Joined\s+([A-Za-z]+\s+\d+,\s+\d{4})/i.exec(html)?.[1];

  push("og:title", name); push("og:description", desc); push("og:image", avatar);
  push("subscribers (raw)", subs); push("videos (raw)", videos);
  push("total views (raw)", views); push("joined", joined);

  const followers = numberFromHumanish(subs);
  const videoCount = numberFromHumanish(videos);
  const totalViews = numberFromHumanish(views);
  const avgViews = followers && videoCount ? Math.round((totalViews || followers * 0.1) / Math.max(1, videoCount)) : undefined;

  return {
    displayName: name, bio: desc, avatar,
    followers, videos: videoCount, avgViews,
    rawSample: raw,
  };
}

async function scrapeTikTok(profileUrl: string): Promise<Partial<SocialReport> & { rawSample: SocialReport["rawSample"] }> {
  const res = await fetch(profileUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JRILICENSE/1.0)" },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();
  const raw: { key: string; value: string }[] = [];
  const push = (k: string, v?: string | null) => v && raw.push({ key: k, value: v });

  const name = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1];
  const desc = /<meta name="description" content="([^"]+)"/i.exec(html)?.[1];
  const avatar = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1];

  // TikTok embeds a SIGI_STATE JSON blob
  const followerMatch = /"followerCount":(\d+)/.exec(html);
  const followingMatch = /"followingCount":(\d+)/.exec(html);
  const heartMatch = /"heartCount":(\d+)/.exec(html);
  const videoMatch = /"videoCount":(\d+)/.exec(html);
  const verified = /"verified":true/.test(html);

  push("og:title", name); push("og:description", desc); push("og:image", avatar);
  push("followerCount", followerMatch?.[1]); push("followingCount", followingMatch?.[1]);
  push("heartCount", heartMatch?.[1]); push("videoCount", videoMatch?.[1]);
  push("verified", String(verified));

  const followers = followerMatch ? Number(followerMatch[1]) : undefined;
  const following = followingMatch ? Number(followingMatch[1]) : undefined;
  const totalLikes = heartMatch ? Number(heartMatch[1]) : undefined;
  const videos = videoMatch ? Number(videoMatch[1]) : undefined;
  const avgViews = followers && videos ? Math.round(followers * 0.15) : undefined;

  return { displayName: name, bio: desc, avatar, followers, following, totalLikes, videos, avgViews, verified, rawSample: raw };
}

async function scrapeInstagram(profileUrl: string): Promise<Partial<SocialReport> & { rawSample: SocialReport["rawSample"] }> {
  const res = await fetch(profileUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JRILICENSE/1.0)" },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();
  const raw: { key: string; value: string }[] = [];
  const push = (k: string, v?: string | null) => v && raw.push({ key: k, value: v });

  const name = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1];
  const desc = /<meta property="og:description" content="([^"]+)"/i.exec(html)?.[1];
  const avatar = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1];

  // Instagram meta description usually reads: "1.2M Followers, 234 Following, 567 Posts — See ..."
  const md = desc || "";
  const followers = numberFromHumanish(md.match(/([\d.,KMB]+)\s+Followers/i)?.[1]);
  const following = numberFromHumanish(md.match(/([\d.,KMB]+)\s+Following/i)?.[1]);
  const posts = numberFromHumanish(md.match(/([\d.,KMB]+)\s+Posts?/i)?.[1]);

  push("og:title", name); push("og:description", desc); push("og:image", avatar);
  push("followers (parsed)", followers?.toString()); push("following (parsed)", following?.toString()); push("posts (parsed)", posts?.toString());

  return {
    displayName: name, bio: desc, avatar,
    followers, following, videos: posts,
    avgViews: followers ? Math.round(followers * 0.08) : undefined,
    rawSample: raw,
  };
}

async function scrapeX(profileUrl: string): Promise<Partial<SocialReport> & { rawSample: SocialReport["rawSample"] }> {
  const res = await fetch(profileUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JRILICENSE/1.0)" },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();
  const raw: { key: string; value: string }[] = [];
  const push = (k: string, v?: string | null) => v && raw.push({ key: k, value: v });

  const name = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1];
  const desc = /<meta (?:property|name)="(?:og:description|description)" content="([^"]+)"/i.exec(html)?.[1];
  const avatar = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1];

  const followers = numberFromHumanish(/([\d.,KMB]+)\s+Followers/i.exec(desc || html)?.[1]);
  const following = numberFromHumanish(/([\d.,KMB]+)\s+Following/i.exec(desc || html)?.[1]);
  const posts = numberFromHumanish(/([\d.,KMB]+)\s+(?:Posts|Tweets)/i.exec(desc || html)?.[1]);
  const verified = /verified.*?true|"verified_type"/i.test(html);

  push("og:title", name); push("og:description", desc); push("og:image", avatar);
  push("followers (parsed)", followers?.toString());
  push("following (parsed)", following?.toString());
  push("posts (parsed)", posts?.toString());

  return {
    displayName: name, bio: desc, avatar,
    followers, following, videos: posts,
    avgViews: followers ? Math.round(followers * 0.05) : undefined,
    verified, rawSample: raw,
  };
}

async function scrapeFacebook(profileUrl: string): Promise<Partial<SocialReport> & { rawSample: SocialReport["rawSample"] }> {
  const res = await fetch(profileUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JRILICENSE/1.0)" },
    signal: AbortSignal.timeout(12000),
  });
  const html = await res.text();
  const raw: { key: string; value: string }[] = [];
  const push = (k: string, v?: string | null) => v && raw.push({ key: k, value: v });

  const name = /<meta property="og:title" content="([^"]+)"/i.exec(html)?.[1];
  const desc = /<meta (?:property|name)="(?:og:description|description)" content="([^"]+)"/i.exec(html)?.[1];
  const avatar = /<meta property="og:image" content="([^"]+)"/i.exec(html)?.[1];

  const followers = numberFromHumanish(/([\d.,KMB]+)\s+followers/i.exec(desc || html)?.[1])
    ?? numberFromHumanish(/([\d.,KMB]+)\s+likes/i.exec(desc || html)?.[1]);
  const following = numberFromHumanish(/([\d.,KMB]+)\s+following/i.exec(desc || html)?.[1]);
  const verified = /verified/i.test(desc || "");

  push("og:title", name); push("og:description", desc); push("og:image", avatar);
  push("followers (parsed)", followers?.toString());
  push("following (parsed)", following?.toString());

  return {
    displayName: name, bio: desc, avatar,
    followers, following,
    avgViews: followers ? Math.round(followers * 0.04) : undefined,
    verified, rawSample: raw,
  };
}

async function generateAdvice(profile: Partial<SocialReport> & { platform: SocialPlatform; handle: string }): Promise<SocialReport["advice"]> {
  const key = process.env.LOVABLE_API_KEY;
  const fallback: SocialReport["advice"] = {
    summary: `Analysis for ${profile.handle} on ${profile.platform}.`,
    whatTheyDoWell: ["Consistent presence detected"],
    mistakes: ["Unable to run AI advice engine — check API key"],
    contentToPost: [
      "Post 3–5 short-form videos per week with hook in first 2 seconds",
      "Add clear call-to-action in every caption",
      "Reply to top comments within the first hour",
      "Batch 5 tutorials on your top-searched topic",
      "One personal story per week to build trust",
    ],
    bestPostingTimes: [
      { day: "Tue", time: "18:00", reason: "Peak evening engagement window" },
      { day: "Wed", time: "12:30", reason: "Lunch scroll" },
      { day: "Thu", time: "20:00", reason: "Prime scroll window" },
      { day: "Fri", time: "19:00", reason: "Weekend warm-up traffic" },
      { day: "Sat", time: "11:00", reason: "Weekend browsing peak" },
      { day: "Sun", time: "21:00", reason: "Pre-week planning scroll" },
    ],
    growthPlan: ["Nail one niche", "Post consistently 5×/week", "Reply to every comment for 30 days"],
    adsStrategy: [
      "Apply for Google AdSense with 15+ original long-form pages of content before submission",
      "Add a real Privacy Policy, About, and Contact page — AdSense rejects sites missing these",
      "Drive traffic from short-form video CTAs to specific site URLs so RPM climbs above $3",
      "Enable Auto Ads AND place 2–3 manual units above the fold for higher CTR",
      "Layer affiliate links (Amazon, Impact, PartnerStack) alongside AdSense to double revenue per visitor",
      "Publish 1 SEO-targeted article every 2 days for 30 days — long-tail keywords convert fastest",
    ],
    adsPlacements: [
      "In-article ad after the first paragraph (highest RPM)",
      "Sticky sidebar ad on desktop, sticky bottom-banner on mobile",
      "Between hero and first content section on the homepage",
      "Below the fold on /checker results (users are engaged and reading)",
      "In-feed ad every 4 items on any listing or grid",
      "End-of-article native ad unit for repeat impressions",
    ],
  };
  if (!key) return fallback;

  const prompt = `You are a senior social-media strategist and AdSense monetisation expert. Analyse this ${profile.platform} account and return advice as strict JSON.

Handle: ${profile.handle}
Display name: ${profile.displayName || "unknown"}
Bio: ${profile.bio || "unknown"}
Followers: ${profile.followers ?? "unknown"}
Following: ${profile.following ?? "unknown"}
Videos/Posts: ${profile.videos ?? "unknown"}
Total likes: ${profile.totalLikes ?? "unknown"}
Estimated avg views: ${profile.avgViews ?? "unknown"}
Verified: ${profile.verified ?? "unknown"}

Return ONLY JSON matching:
{
 "summary": string (2-3 sentences on what the account is about and its stage),
 "whatTheyDoWell": string[] (3-5 items),
 "mistakes": string[] (3-6 concrete things they're posting wrong or missing),
 "contentToPost": string[] (8-12 concrete video/post ideas tailored to this niche that will grow the account — specific hooks, not vague topics),
 "bestPostingTimes": [{"day":"Mon-Sun","time":"HH:MM local","reason":"why"}] (6-7 slots covering the week, optimised for ${profile.platform}),
 "growthPlan": string[] (4-6 sequenced tactics for the next 30 days),
 "adsStrategy": string[] (5-7 specific tactics to earn MORE Google AdSense revenue within 30 days — include getting approved fast, RPM optimisation, traffic funnels, and complementary networks),
 "adsPlacements": string[] (5-7 exact site placements for ad units — location + why it converts, e.g. 'in-article after first paragraph — highest engaged-reader RPM')
}`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "raw",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a concise social-media growth and AdSense monetisation strategist. Reply with valid JSON only." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return fallback;
    const j = await res.json();
    const text: string = j?.choices?.[0]?.message?.content || "";
    const cleaned = text.replace(/^```json\s*|```\s*$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: String(parsed.summary || fallback.summary),
      whatTheyDoWell: Array.isArray(parsed.whatTheyDoWell) ? parsed.whatTheyDoWell.map(String) : fallback.whatTheyDoWell,
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes.map(String) : fallback.mistakes,
      contentToPost: Array.isArray(parsed.contentToPost) ? parsed.contentToPost.map(String) : fallback.contentToPost,
      bestPostingTimes: Array.isArray(parsed.bestPostingTimes)
        ? parsed.bestPostingTimes.map((s: any) => ({ day: String(s.day), time: String(s.time), reason: String(s.reason || "") }))
        : fallback.bestPostingTimes,
      growthPlan: Array.isArray(parsed.growthPlan) ? parsed.growthPlan.map(String) : fallback.growthPlan,
      adsStrategy: Array.isArray(parsed.adsStrategy) ? parsed.adsStrategy.map(String) : fallback.adsStrategy,
      adsPlacements: Array.isArray(parsed.adsPlacements) ? parsed.adsPlacements.map(String) : fallback.adsPlacements,
    };
  } catch {
    return fallback;
  }
}

const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FORMATS: Record<SocialPlatform, string[]> = {
  youtube:   ["Short (< 60s)", "Long-form (8–12min)", "Community post", "Live stream", "Tutorial"],
  tiktok:    ["Short video", "Storytime", "Duet/Stitch", "Trend remix", "Carousel"],
  instagram: ["Reel", "Carousel", "Story", "Photo post", "Live"],
  x:         ["Thread", "Single post", "Quote reply", "Poll", "Long video"],
  facebook:  ["Reel", "Photo post", "Link share", "Live", "Group post"],
};

function normalizeDay(day: string): number {
  const d = day.slice(0, 3).toLowerCase();
  const map: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
  return map[d] ?? 2;
}

function tzParts(date: Date, timeZone: string) {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
    });
    const parts = fmt.formatToParts(date);
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
    return { date: `${get("year")}-${get("month")}-${get("day")}`, day: get("weekday") };
  } catch {
    return { date: date.toISOString().slice(0, 10), day: DAY_ORDER[date.getUTCDay()] };
  }
}

/** Always returns exactly 30 rows — one per day, in the viewer's own time zone. */
function buildCalendar(
  platform: SocialPlatform,
  ideas: string[],
  slots: { day: string; time: string; reason: string }[],
  handle: string,
  timeZone = "UTC",
): CalendarEntry[] {
  const start = new Date();
  const useIdeas = ideas.length ? ideas : ["Value post", "Storytime", "Behind the scenes", "Tutorial", "Trend remix", "Q&A"];
  const useSlots = slots.length ? slots : [
    { day: "Mon", time: "18:00", reason: "Evening scroll" },
    { day: "Wed", time: "12:30", reason: "Lunch peak" },
    { day: "Fri", time: "19:00", reason: "Weekend warm-up" },
    { day: "Sat", time: "11:00", reason: "Weekend peak" },
  ];
  const formats = FORMATS[platform];
  const hashtagBase = platform === "youtube"
    ? ["#Shorts", "#YouTube"]
    : platform === "tiktok"
    ? ["#fyp", "#foryou"]
    : platform === "instagram"
    ? ["#reels", "#explore"]
    : platform === "x"
    ? ["#BuildInPublic"]
    : ["#Facebook"];
  const cleanHandle = handle.replace(/^@/, "");

  // One slot per weekday: prefer an AI slot for that day, otherwise cycle the list.
  const timeForDay = (dow: number, i: number) =>
    useSlots.find((s) => normalizeDay(s.day) === dow) ?? useSlots[i % useSlots.length];

  const out: CalendarEntry[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const { date: dateStr, day } = tzParts(date, timeZone);
    const slot = timeForDay(normalizeDay(day), i);
    // Consistent, non-repeating rotation of ideas and formats across all 30 days.
    const idea = useIdeas[i % useIdeas.length];
    const format = formats[i % formats.length];
    out.push({
      date: dateStr,
      day,
      time: slot.time,
      idea: `Day ${i + 1}: ${idea}`,
      format,
      hashtags: [...hashtagBase, `#${cleanHandle}`],
      cta: "Pin comment with link to your best offer + reply to first 10 comments in 60 min.",
    });
  }
  return out;
}


export const runSocialCheck = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ input: z.string().min(2), timezone: z.string().min(1).max(64).optional() }).parse(d),
  )
  .handler(async ({ data }): Promise<SocialReport> => {
    const started = new Date().toISOString();
    const timezone = data.timezone && isValidTimeZone(data.timezone) ? data.timezone : "UTC";
    const detected = detectPlatform(data.input);
    const emptyAdvice = { summary: "", whatTheyDoWell: [], mistakes: [], contentToPost: [], bestPostingTimes: [], growthPlan: [], adsStrategy: [], adsPlacements: [] };
    if (!detected) {
      return {
        platform: "youtube", handle: data.input, profileUrl: "", fetchedAt: started, timezone,
        rawSample: [], advice: emptyAdvice, calendar: [],
        error: "Could not detect platform. Paste a full profile URL, e.g. https://x.com/username or https://www.facebook.com/pagename.",
      };
    }
    if (!detected.handle || /^[@\s]*$/.test(detected.handle)) {
      return {
        platform: detected.platform, handle: detected.handle, profileUrl: detected.url, fetchedAt: started, timezone,
        rawSample: [], advice: emptyAdvice, calendar: [],
        error: `That ${detected.platform.toUpperCase()} link has no profile name in it. Use the profile URL itself (e.g. https://x.com/username), not the homepage or a post link.`,
      };
    }
    try {
      let scraped: Partial<SocialReport> & { rawSample: SocialReport["rawSample"] };
      if (detected.platform === "youtube")        scraped = await scrapeYouTube(detected.url, detected.handle);
      else if (detected.platform === "tiktok")    scraped = await scrapeTikTok(detected.url);
      else if (detected.platform === "instagram") scraped = await scrapeInstagram(detected.url);
      else if (detected.platform === "x")         scraped = await scrapeX(detected.url);
      else                                        scraped = await scrapeFacebook(detected.url);

      const advice = await generateAdvice({ ...scraped, platform: detected.platform, handle: detected.handle });
      const calendar = buildCalendar(detected.platform, advice.contentToPost, advice.bestPostingTimes, detected.handle, timezone);

      return {
        platform: detected.platform,
        handle: detected.handle,
        profileUrl: detected.url,
        fetchedAt: started,
        timezone,
        ...scraped,
        advice,
        calendar,
      };

    } catch (e: any) {
      return {
        platform: detected.platform, handle: detected.handle, profileUrl: detected.url, fetchedAt: started,
        rawSample: [], advice: emptyAdvice, calendar: [],
        error: e?.message || "Failed to fetch profile — the platform may be blocking anonymous access.",
      };
    }
  });

