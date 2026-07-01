import robot from "@/assets/jagx-robot.mp4.asset.json";
import circuit from "@/assets/jagx-circuit.mp4.asset.json";

type Props = {
  variant?: "robot" | "circuit";
  className?: string;
  opacity?: number;
  overlay?: boolean;
};

/**
 * Cinematic ambient video background. Autoplays muted + looped, GPU-accelerated,
 * and always sits behind content (pointer-events disabled).
 */
export function VideoBackdrop({ variant = "circuit", className = "", opacity = 0.35, overlay = true }: Props) {
  const src = variant === "robot" ? robot.url : circuit.url;
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        style={{ opacity, filter: "saturate(1.1) contrast(1.05)", transform: "scale(1.05)" }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      )}
    </div>
  );
}

export default VideoBackdrop;
