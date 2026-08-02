import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Navbar } from "@/components/jagx/Navbar";
import { Footer } from "@/components/jagx/Footer";
import { CMSProvider } from "@/lib/cms-store";
import { AppPromo, ApkVerifyCard } from "@/components/jagx/AppDownload";
import { APK_MANIFEST, APK_SAFETY_NOTES, APK_DOWNLOAD_URL } from "@/lib/apk-manifest";
import ogImage from "@/assets/og-jagx.jpg";

const SITE_URL = "https://jagx-animate-universe.lovable.app";
const PAGE_URL = `${SITE_URL}/app`;
const OG = SITE_URL + ogImage;

const TITLE = "JagX Connect APK — Download the JagX × JRILICENSE Android App";
const DESC = `Download JagX Connect v${APK_MANIFEST.version} (${APK_MANIFEST.sizeMB} MB signed Android APK) by JagX and JRILICENSE. Verified SHA-256 checksum, install safety notes and one-tap access to JagX phones, cars, estate and the AI checker.`;

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "JagX Connect APK, JagX app download, JRILICENSE app, JagX Android app, signed APK, SHA-256 checksum" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "product" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
      { name: "twitter:image", content: OG },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MobileApplication",
          name: APK_MANIFEST.name,
          alternateName: "JagX Connect APK",
          operatingSystem: `Android ${APK_MANIFEST.minAndroid}+`,
          applicationCategory: "BusinessApplication",
          softwareVersion: APK_MANIFEST.version,
          fileSize: `${APK_MANIFEST.sizeMB} MB`,
          downloadUrl: SITE_URL + APK_DOWNLOAD_URL,
          installUrl: PAGE_URL,
          datePublished: APK_MANIFEST.releasedAt,
          description: DESC,
          image: OG,
          url: PAGE_URL,
          author: { "@type": "Organization", name: "JagX Business Group" },
          publisher: { "@type": "Organization", name: "JRILICENSE" },
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: APK_MANIFEST.rating,
            ratingCount: APK_MANIFEST.ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "JRILICENSE", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "JagX Connect App", item: PAGE_URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is the JagX Connect APK safe to install?",
              acceptedAnswer: { "@type": "Answer", text: APK_SAFETY_NOTES.join(" ") },
            },
            {
              "@type": "Question",
              name: "How do I verify the JagX Connect download?",
              acceptedAnswer: { "@type": "Answer", text: `Compare the SHA-256 checksum of your downloaded file with ${APK_MANIFEST.sha256}. If it matches, the build is authentic.` },
            },
            {
              "@type": "Question",
              name: "What Android version does JagX Connect need?",
              acceptedAnswer: { "@type": "Answer", text: `JagX Connect v${APK_MANIFEST.version} requires Android ${APK_MANIFEST.minAndroid} or newer and is ${APK_MANIFEST.sizeMB} MB.` },
            },
          ],
        }),
      },
    ],
  }),
  component: () => (
    <CMSProvider>
      <AppPage />
    </CMSProvider>
  ),
});

function AppPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24">
        <section className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl"
          >
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">
              Download <span className="text-gradient-gold">JagX Connect</span>
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">{DESC}</p>
          </motion.div>
        </section>

        <AppPromo />

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">Version manifest &amp; install safety</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Every JagX Connect release ships with its exact file size and SHA-256 checksum so you can prove the
              file you installed is the file we signed.
            </p>
            <ApkVerifyCard className="mt-6" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
