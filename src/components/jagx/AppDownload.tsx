import { motion } from "framer-motion";
import { Download, Smartphone, Star, ShieldCheck, Sparkles, Fingerprint, Copy, Check } from "lucide-react";
import { useState } from "react";
import { APK_DOWNLOAD_URL, APK_MANIFEST, APK_SAFETY_NOTES } from "@/lib/apk-manifest";

export const APK_URL = APK_DOWNLOAD_URL;
export const APK_SIZE_MB = APK_MANIFEST.sizeMB;
export const APP_NAME = APK_MANIFEST.name;
export const APP_VERSION = APK_MANIFEST.version;
export const APP_RATING = APK_MANIFEST.rating;
export const APP_RATING_COUNT = APK_MANIFEST.ratingCount;


/** Small CTA used in the navbar / footer / anywhere. */
export function AppDownloadButton({ className = "", label = "Get JagX Connect APK" }: { className?: string; label?: string }) {
  return (
    <a
      href={APK_URL}
      download="JagX-Connect.apk"
      className={`inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20 ${className}`}
    >
      <Download className="h-4 w-4" /> {label}
    </a>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(value) ? "fill-gold text-gold" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

/** Full announcement + rating section for the landing page. */
export function AppPromo() {
  return (
    <section id="app" className="relative px-6 py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs tracking-widest text-gold">
            <Sparkles className="h-4 w-4" /> NEW RELEASE
          </div>
          <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-gradient-gold">JagX Connect</span> app is out
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            JagX Connect by JagX and JRILICENSE puts the whole JagX world in your pocket — browse JagX phones,
            cars, estate listings, jewelry and clothing drops, request websites and automation, run the AI &
            security checker, and reach the team on WhatsApp in one tap. Signed Android APK, {APK_SIZE_MB} MB,
            version {APP_VERSION}.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Stars value={APP_RATING} />
            <span className="text-sm font-bold text-gold">{APP_RATING.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              from {APP_RATING_COUNT.toLocaleString()} JagX users
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              href={APK_URL}
              download="JagX-Connect.apk"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 font-bold text-primary-foreground shadow-glow"
            >
              <Download className="h-5 w-5" /> Download APK ({APK_SIZE_MB} MB)
            </motion.a>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold" /> Signed &amp; JRI-licensed build
            </div>
          </div>

          <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "One-tap WhatsApp & email to JagX",
              "Browse JagX phones, cars & estate",
              "Run the AI / security checker on the go",
              "Instant alerts on new JagX drops",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ApkVerifyCard />
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -18 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-sm"
          style={{ perspective: 1200 }}
        >
          <div className="absolute inset-8 bg-gold/25 blur-3xl" />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[2.5rem] border border-gold/30 glass p-5 shadow-elegant"
          >
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-border" />
            <div className="rounded-[2rem] border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-gold shadow-glow">
                <Smartphone className="h-9 w-9 text-primary-foreground" />
              </div>
              <div className="mt-4 text-xl font-black">{APP_NAME}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                by JagX × JRILICENSE
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Stars value={APP_RATING} />
                <span className="text-sm font-bold text-gold">{APP_RATING.toFixed(1)}</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                <div><div className="text-base font-black text-foreground">{APK_SIZE_MB}MB</div>Size</div>
                <div><div className="text-base font-black text-foreground">v{APP_VERSION}</div>Version</div>
                <div><div className="text-base font-black text-foreground">8.0+</div>Android</div>
              </div>
              <a
                href={APK_URL}
                download="JagX-Connect.apk"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold py-3 font-bold text-primary-foreground shadow-glow"
              >
                <Download className="h-4 w-4" /> Install now
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/** Version manifest: size, SHA-256 checksum and install-safety notes. */
export function ApkVerifyCard({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(APK_MANIFEST.sha256);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <div className={`rounded-2xl border border-gold/25 glass p-5 ${className}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
        <Fingerprint className="h-4 w-4" /> Verify this download
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">File</dt>
          <dd className="font-semibold">{APK_MANIFEST.fileName}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">Size</dt>
          <dd className="font-semibold">{APK_MANIFEST.sizeMB} MB ({APK_MANIFEST.sizeBytes.toLocaleString()} bytes)</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">Version</dt>
          <dd className="font-semibold">v{APK_MANIFEST.version} (code {APK_MANIFEST.versionCode})</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">Package</dt>
          <dd className="font-semibold">{APK_MANIFEST.package}</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">Requires</dt>
          <dd className="font-semibold">Android {APK_MANIFEST.minAndroid}+</dd>
        </div>
        <div className="flex justify-between gap-3 border-b border-border/60 py-1">
          <dt className="text-muted-foreground">Publisher</dt>
          <dd className="font-semibold">{APK_MANIFEST.publisher}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">SHA-256 checksum</div>
        <div className="mt-2 flex items-start gap-2">
          <code className="flex-1 break-all rounded-lg border border-border bg-card px-3 py-2 text-[11px] leading-relaxed text-foreground">
            {APK_MANIFEST.sha256}
          </code>
          <button
            type="button"
            onClick={copy}
            aria-label="Copy SHA-256 checksum"
            className="mt-0.5 inline-flex items-center gap-1 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold transition hover:bg-gold/20"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">MD5: {APK_MANIFEST.md5}</div>
      </div>

      <ul className="mt-5 grid gap-2 text-xs text-muted-foreground">
        {APK_SAFETY_NOTES.map((n) => (
          <li key={n} className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gold" />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
