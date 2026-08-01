import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/jagx/Navbar";
import { Hero } from "@/components/jagx/Hero";
import { Marquee } from "@/components/jagx/Marquee";
import { Services } from "@/components/jagx/Services";
import { Phones } from "@/components/jagx/Phones";
import { Cars } from "@/components/jagx/Cars";
import { Estate } from "@/components/jagx/Estate";
import { Websites } from "@/components/jagx/Websites";
import { Products } from "@/components/jagx/Products";
import { Pricing } from "@/components/jagx/Pricing";
import { About } from "@/components/jagx/About";
import { Contact } from "@/components/jagx/Contact";
import { Footer } from "@/components/jagx/Footer";
import { AppPromo } from "@/components/jagx/AppDownload";
import { FAQ, FAQ_ITEMS } from "@/components/jagx/FAQ";

import { CMSProvider, useCMS } from "@/lib/cms-store";
import ogImage from "@/assets/og-jagx.jpg";

const SITE_URL = "https://jagx-animate-universe.lovable.app";

const TITLE = "JagX × JRI — Phones, Cars, Estate, Jewelry, Clothing, Websites & Automation";
const DESC = "JagX is a JRI-licensed studio building world-class 3D animated websites, business automation, JagX mobile phones, cars, real estate, bespoke jewelry and premium clothing.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "JagX, JRI, JagX phones, JagX cars, JagX estate, JagX jewelry, JagX clothing, website creation Nigeria, business automation, web design Lagos" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1280" },
      { property: "og:image:height", content: "672" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: "/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "JagX",
          alternateName: ["JagX World Studio", "JagX Business Group", "JagX × JRI"],
          description: DESC,
          url: SITE_URL + "/",
          logo: ogImage,
          sameAs: [],
          contactPoint: [{
            "@type": "ContactPoint",
            telephone: "+2349160654415",
            contactType: "customer service",
            areaServed: "Worldwide",
            availableLanguage: ["English"],
          }],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "JagX World Studio",
          alternateName: "JagX",
          url: SITE_URL + "/",
          inLanguage: "en",
          publisher: { "@type": "Organization", name: "JagX" },
          potentialAction: {
            "@type": "SearchAction",
            target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: () => (
    <CMSProvider>
      <Index />
    </CMSProvider>
  ),
});

function Index() {
  const { data } = useCMS();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Phones />
        <Cars />
        <Estate />
        <Websites />
        <Products />
        <Pricing />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      <a
        href={`https://wa.me/${data.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow animate-glow-pulse hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-primary-foreground"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
      </a>
    </div>
  );
}
