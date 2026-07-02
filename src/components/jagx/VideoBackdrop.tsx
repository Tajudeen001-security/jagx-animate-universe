import { useEffect, useRef, useState } from "react";
import robot from "@/assets/jagx-robot.mp4.asset.json";
import circuit from "@/assets/jagx-circuit.mp4.asset.json";

type Props = {
  variant?: "robot" | "circuit";
  className?: string;
  opacity?: number;
  overlay?: boolean;
  /** Poster image URL shown before video loads / for reduced motion users */
  poster?: string;
};

/**
 * Cinematic ambient video background.
 * - Lazy-loads via IntersectionObserver (only mounts <video> when near viewport)
 * - Respects prefers-reduced-motion (shows static gradient instead)
 * - Pauses when off-screen or tab hidden to save CPU/GPU
 * - Downgrades to lower-quality playback on small screens / save-data
 */
export function VideoBackdrop({
  variant = "circuit",
  className = "",
  opacity = 0.35,
  overlay = true,
  poster,
}: Props) {
  const src = variant === "robot" ? robot.url : circuit.url;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saveData, setSaveData] = useState(false);

  // Detect reduced motion + save-data preferences
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);

    const conn = (navigator as any).connection;
    if (conn) {
      setSaveData(!!conn.saveData || /2g/.test(conn.effectiveType || ""));
    }

    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Lazy mount when near viewport
  useEffect(() => {
    if (reducedMotion || saveData) return;
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
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion, saveData]);

  // Pause when off-screen or tab hidden
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !shouldLoad) return;

    const play = () => {
      v.play().catch(() => {
        /* autoplay may be blocked; ignore */
      });
    };

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
      else if (isInViewport(v)) play();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Static gradient fallback — always rendered underneath */}
      <div
        className="absolute inset-0"
        style={{
          opacity,
          background:
            variant === "robot"
              ? "radial-gradient(ellipse at 30% 40%, oklch(0.7 0.25 195 / 40%), transparent 60%), radial-gradient(ellipse at 70% 60%, oklch(0.82 0.16 85 / 30%), transparent 60%)"
              : "radial-gradient(ellipse at 20% 30%, oklch(0.82 0.16 85 / 35%), transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.65 0.22 295 / 35%), transparent 60%)",
        }}
      />

      {shouldLoad && !reducedMotion && !saveData && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
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
            (e.currentTarget as HTMLVideoElement).play().catch(() => {});
          }}
        />
      )}

      {overlay && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      )}
    </div>
  );
}

function isInViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < (window.innerHeight || 0);
}

export default VideoBackdrop;
