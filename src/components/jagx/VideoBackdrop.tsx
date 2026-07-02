import { useEffect, useRef, useState } from "react";
import robot from "@/assets/jagx-robot.mp4.asset.json";
import circuit from "@/assets/jagx-circuit.mp4.asset.json";
import jars from "@/assets/jagx-jars.mp4.asset.json";
import android from "@/assets/jagx-android.mp4.asset.json";

export type BackdropVariant = "robot" | "circuit" | "jars" | "android";

type Source = { src: string; type: string; media?: string };

const VARIANTS: Record<BackdropVariant, Source[]> = {
  // Order matters: browser picks the FIRST matching <source>.
  // We use `media` queries so small screens pick the lighter clip,
  // and desktops fall through to the higher-fidelity one.
  circuit: [
    { src: circuit.url, type: "video/mp4", media: "(min-width: 768px)" },
    { src: circuit.url, type: "video/mp4" },
  ],
  robot: [
    { src: robot.url, type: "video/mp4", media: "(min-width: 768px)" },
    { src: jars.url, type: "video/mp4" }, // lighter clip on mobile
  ],
  jars: [
    { src: jars.url, type: "video/mp4", media: "(min-width: 768px)" },
    { src: jars.url, type: "video/mp4" },
  ],
  android: [
    { src: android.url, type: "video/mp4", media: "(min-width: 768px)" },
    { src: android.url, type: "video/mp4" },
  ],
};

type Props = {
  variant?: BackdropVariant;
  className?: string;
  opacity?: number;
  overlay?: boolean;
  /** "auto" starts eager, "lazy" defers until near viewport */
  loading?: "auto" | "lazy";
  poster?: string;
};

/**
 * Cinematic ambient video background.
 * - Multi-source <video> with (min-width) media queries for responsive quality
 * - Lazy IntersectionObserver mount (skippable via loading="auto")
 * - Pauses when off-screen or tab hidden
 * - Respects prefers-reduced-motion + Save-Data (static gradient fallback)
 */
export function VideoBackdrop({
  variant = "circuit",
  className = "",
  opacity = 0.35,
  overlay = true,
  loading = "lazy",
  poster,
}: Props) {
  const sources = VARIANTS[variant];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(loading === "auto");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    const conn = (navigator as any).connection;
    if (conn) setSaveData(!!conn.saveData || /2g/.test(conn.effectiveType || ""));
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (shouldLoad || reducedMotion || saveData) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldLoad, reducedMotion, saveData]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoad) return;
    const play = () => v.play().catch(() => {});
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) play();
          else v.pause();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(v);
    const onVis = () => {
      if (document.hidden) v.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [shouldLoad]);

  const gradient =
    variant === "robot" || variant === "android"
      ? "radial-gradient(ellipse at 30% 40%, oklch(0.7 0.25 195 / 40%), transparent 60%), radial-gradient(ellipse at 70% 60%, oklch(0.82 0.16 85 / 30%), transparent 60%)"
      : variant === "jars"
        ? "radial-gradient(ellipse at 50% 50%, oklch(0.65 0.22 295 / 35%), transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.82 0.16 85 / 30%), transparent 60%)"
        : "radial-gradient(ellipse at 20% 30%, oklch(0.82 0.16 85 / 35%), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.65 0.22 295 / 35%), transparent 60%)";

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0" style={{ opacity, background: gradient }} />

      {shouldLoad && !reducedMotion && !saveData && (
        <video
          key={retryKey}
          ref={videoRef}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={loading === "auto" ? "auto" : "metadata"}
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity,
            filter: "saturate(1.1) contrast(1.05)",
            transform: "translateZ(0) scale(1.05)",
            willChange: "transform, opacity",
          }}
          onCanPlay={(e) => {
            retryCountRef.current = 0;
            (e.currentTarget as HTMLVideoElement).play().catch(() => {});
          }}
          onError={() => scheduleRetry(retryCountRef, retryTimerRef, setRetryKey)}
          onStalled={() => scheduleRetry(retryCountRef, retryTimerRef, setRetryKey, 1)}
        >
          {sources.map((s, i) => (
            <source key={i} src={cacheBust(s.src, retryKey)} type={s.type} media={s.media} />
          ))}
        </video>
      )}

      {overlay && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      )}
    </div>
  );
}

const MAX_RETRIES = 4;

function scheduleRetry(
  countRef: React.MutableRefObject<number>,
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
  setKey: React.Dispatch<React.SetStateAction<number>>,
  min = 0,
) {
  if (timerRef.current) return; // one pending retry at a time
  const attempt = Math.max(countRef.current, min);
  if (attempt >= MAX_RETRIES) return;
  // Exponential backoff with jitter: 400ms, 800ms, 1600ms, 3200ms (+/-25%)
  const base = 400 * 2 ** attempt;
  const jitter = base * (0.75 + Math.random() * 0.5);
  const delay = Math.min(jitter, 6000);
  timerRef.current = setTimeout(() => {
    timerRef.current = null;
    countRef.current = attempt + 1;
    setKey((k) => k + 1); // remounts <video> and re-fetches sources
  }, delay);
}

function cacheBust(url: string, key: number) {
  if (key === 0) return url;
  return url + (url.includes("?") ? "&" : "?") + "r=" + key;
}

export default VideoBackdrop;
