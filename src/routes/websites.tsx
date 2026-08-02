import { createFileRoute } from "@tanstack/react-router";
import { Websites } from "@/components/jagx/Websites";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/websites")({
  head: () =>
    pageHead({
      path: "/websites",
      title: "JagX Website Creation — 3D Animated Sites, Stores & Web Apps",
      description:
        "JagX builds world-class 3D animated websites, e-commerce stores, SaaS dashboards and PWAs — motion-first design, fast SSR builds and SEO baked in.",
      keywords:
        "website creation, 3D animated website, web design Lagos, ecommerce development, SaaS website, JagX websites",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="WEB STUDIO"
      title={<>JagX <span className="text-gradient-gold">Websites</span></>}
      intro="Motion-first 3D animated websites, storefronts, SaaS dashboards and PWAs — engineered for speed, SEO and conversion."
    >
      <Websites />
    </PageShell>
  ),
});
