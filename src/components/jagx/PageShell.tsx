import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/jagx/Navbar";
import { Footer } from "@/components/jagx/Footer";
import { CMSProvider } from "@/lib/cms-store";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children: ReactNode;
}) {
  return (
    <CMSProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-28">
          <section className="px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-7xl"
            >
              <div className="inline-block px-4 py-1.5 glass rounded-full mb-4 text-xs tracking-widest text-gold">
                {eyebrow}
              </div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
              <p className="mt-4 max-w-2xl text-muted-foreground">{intro}</p>
            </motion.div>
          </section>
          {children}
        </main>
        <Footer />
      </div>
    </CMSProvider>
  );
}

const SITE_URL = "https://jagx-animate-universe.lovable.app";

export function pageHead({
  path,
  title,
  description,
  keywords,
  image,
}: {
  path: string;
  title: string;
  description: string;
  keywords: string;
  image: string;
}) {
  const url = SITE_URL + path;
  const og = SITE_URL + image;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: og },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: og },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "JRILICENSE", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: title.split("—")[0].trim(), item: url },
          ],
        }),
      },
    ],
  };
}
