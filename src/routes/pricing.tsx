import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/jagx/Pricing";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/pricing")({
  head: () =>
    pageHead({
      path: "/pricing",
      title: "JagX Pricing — Website, Automation & Branding Packages",
      description:
        "Transparent JagX pricing for website creation, business automation and branding packages — what each tier includes, timelines and how to start on WhatsApp.",
      keywords: "JagX pricing, website price, web design cost, automation packages, branding price",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="PACKAGES"
      title={<>JagX <span className="text-gradient-gold">Pricing</span></>}
      intro="Clear packages for websites, automation and branding — pick a tier, see exactly what ships, and start the build on WhatsApp."
    >
      <Pricing />
    </PageShell>
  ),
});
