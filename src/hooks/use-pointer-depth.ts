import { useEffect, useRef, type PointerEvent } from "react";
import { useMotionValue, useSpring, useTransform, type MotionStyle } from "framer-motion";

type PointerDepthOptions = {
  maxRotate?: number;
  lift?: number;
  perspective?: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function usePointerDepth({ maxRotate = 10, lift = 10, perspective = 1200 }: PointerDepthOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [maxRotate, -maxRotate]), { stiffness: 180, damping: 20, mass: 0.5 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-maxRotate, maxRotate]), { stiffness: 180, damping: 20, mass: 0.5 });
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-lift, lift]), { stiffness: 170, damping: 22 });
  const glareX = useSpring(useTransform(px, [-0.5, 0.5], [15, 85]), { stiffness: 120, damping: 18 });
  const glareY = useSpring(useTransform(py, [-0.5, 0.5], [15, 85]), { stiffness: 120, damping: 18 });

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma == null && event.beta == null) return;
      px.set(clamp((event.gamma ?? 0) / 55, -0.5, 0.5));
      py.set(clamp(((event.beta ?? 45) - 45) / 70, -0.5, 0.5));
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => window.removeEventListener("deviceorientation", onOrientation, true);
  }, [px, py]);

  const style: MotionStyle = {
    rotateX,
    rotateY,
    y,
    transformPerspective: perspective,
    transformStyle: "preserve-3d",
  };

  return {
    ref,
    style,
    glareStyle: {
      background: useTransform([glareX, glareY], ([x, gy]) => `radial-gradient(circle at ${x}% ${gy}%, oklch(1 0 0 / 24%), transparent 34%)`),
    } satisfies MotionStyle,
    handlers: {
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      },
      onPointerLeave: () => {
        px.set(0);
        py.set(0);
      },
    },
  };
}