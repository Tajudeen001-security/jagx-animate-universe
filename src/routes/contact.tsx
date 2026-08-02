import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/jagx/Contact";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      path: "/contact",
      title: "Contact JagX — WhatsApp +234 916 065 4415 & Email",
      description:
        "Talk to JagX directly: WhatsApp +2349160654415 or email gbadamositajudeenwan@gmail.com for websites, automation, phones, estate, jewelry and clothing enquiries.",
      keywords: "contact JagX, JagX WhatsApp, JagX email, hire JagX, JRILICENSE contact",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="GET IN TOUCH"
      title={<>Contact <span className="text-gradient-gold">JagX</span></>}
      intro="Message us on WhatsApp at +234 916 065 4415 or email gbadamositajudeenwan@gmail.com — we reply fast and quote the same day."
    >
      <Contact />
    </PageShell>
  ),
});
