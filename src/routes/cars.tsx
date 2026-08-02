import { createFileRoute } from "@tanstack/react-router";
import { Cars } from "@/components/jagx/Cars";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/cars")({
  head: () =>
    pageHead({
      path: "/cars",
      title: "JagX Cars — JagX-Badged Vehicles by JRILICENSE",
      description:
        "The JagX motor line: coupes, SUVs and concept builds carrying the JagX badge, JRI-licensed engineering and animated 3D walkarounds of each model.",
      keywords: "JagX cars, JagX vehicles, JagX SUV, JagX coupe, JRI licensed cars",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="MOTORS"
      title={<>JagX <span className="text-gradient-gold">Cars</span></>}
      intro="Every car in the JagX line-up carries the JagX badge and JRI-licensed engineering — explore the models with animated 3D walkarounds."
    >
      <Cars />
    </PageShell>
  ),
});
