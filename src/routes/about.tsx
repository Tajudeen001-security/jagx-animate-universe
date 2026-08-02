import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/jagx/About";
import { FAQ } from "@/components/jagx/FAQ";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      title: "About JagX — The JRILICENSE Studio Behind JagX Business Group",
      description:
        "Who JagX is: a JRI-licensed studio building digital and physical product — automation, websites, phones, cars, estate, jewelry and clothing. Our story, standards and FAQs.",
      keywords: "about JagX, JRILICENSE, JagX Business Group, JagX World Studio, JagX story",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="THE STUDIO"
      title={<>About <span className="text-gradient-gold">JagX</span></>}
      intro="JagX Business Group operates under the JRILICENSE flag, shipping digital and physical product to one standard — here is how we work, and the answers people ask most."
    >
      <About />
      <FAQ />
    </PageShell>
  ),
});
