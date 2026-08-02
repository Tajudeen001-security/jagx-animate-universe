import { createFileRoute } from "@tanstack/react-router";
import { Phones } from "@/components/jagx/Phones";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/phones")({
  head: () =>
    pageHead({
      path: "/phones",
      title: "JagX Phones — JagX-Branded Smartphones by JRILICENSE",
      description:
        "Explore the JagX smartphone line-up: JRI-certified hardware, JagX OS, gold-glass finishes and flagship cameras. See specs, designs and how to order a JagX phone.",
      keywords: "JagX phones, JagX smartphone, JagX OS, JRI certified phone, buy JagX phone",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="HARDWARE"
      title={<>JagX <span className="text-gradient-gold">Phones</span></>}
      intro="JagX-branded smartphones engineered with JRI-certified hardware and JagX OS — flagship cameras, gold-glass bodies and animated 3D showcases of every model."
    >
      <Phones />
    </PageShell>
  ),
});
