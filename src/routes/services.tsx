import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/jagx/Services";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      path: "/services",
      title: "JagX Services — Automation, Websites, Phones, Jewelry & Clothing",
      description:
        "Everything JagX builds under the JRILICENSE flag: AI business automation, 3D animated website creation, JagX-branded smartphones, bespoke jewelry, premium clothing and full brand identity.",
      keywords:
        "JagX services, business automation, AI workflows, website creation, JagX phones, bespoke jewelry, clothing brand, brand identity",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="WHAT WE DO"
      title={<>JagX <span className="text-gradient-gold">Services</span></>}
      intro="Six disciplines, one studio: AI automation, world-class animated websites, JagX phones, jewelry, clothing and brand identity — all JRI licensed."
    >
      <Services />
    </PageShell>
  ),
});
