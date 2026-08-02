import { createFileRoute } from "@tanstack/react-router";
import { Estate } from "@/components/jagx/Estate";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/estate")({
  head: () =>
    pageHead({
      path: "/estate",
      title: "JagX Estate — Property Development & Estate Management",
      description:
        "JagX Estate handles luxury property development, smart-home estates and full estate management — listings, facilities, tenancy and investment options under JRILICENSE.",
      keywords: "JagX estate, estate management, luxury property, smart estate, real estate Nigeria",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="PROPERTY"
      title={<>JagX <span className="text-gradient-gold">Estate</span></>}
      intro="Luxury developments and full estate management — smart-home estates, facilities, tenancy and investment options handled end to end."
    >
      <Estate />
    </PageShell>
  ),
});
