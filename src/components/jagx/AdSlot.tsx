import { useEffect, useRef, useState } from "react";

export const ADSENSE_CLIENT = "ca-pub-6037723607677223";

type AdSlotProps = {
  /** AdSense data-ad-slot id. Leave empty to render the reserved placeholder frame. */
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  layoutKey?: string;
  /** Only load the unit once it scrolls near the viewport. */
  lazy?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Configurable AdSense unit. Reserves layout space up-front (no CLS),
 * loads lazily by default and degrades to a branded placeholder while a
 * slot id has not been created in the AdSense dashboard yet.
 */
export function AdSlot({
  slot,
  format = "auto",
  layoutKey,
  lazy = true,
  label = "Advertisement",
  className = "",
  style,
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (visible || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !slot || pushed.current) return;
    pushed.current = true;
    try {
      // @ts-expect-error injected by the AdSense script
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker or script not loaded — placeholder stays */
    }
  }, [visible, slot]);

  return (
    <div ref={ref} className={`w-full ${className}`}>
      <div className="mb-1 text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">{label}</div>
      {visible && slot ? (
        <ins
          className="adsbygoogle block"
          style={{ display: "block", ...style }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout-key={layoutKey}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          style={style}
          className="flex min-h-[90px] w-full items-center justify-center rounded-2xl border border-dashed border-gold/25 bg-card/40 text-[11px] text-muted-foreground"
        >
          JRILICENSE ad space
        </div>
      )}
    </div>
  );
}
