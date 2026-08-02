import { createFileRoute } from "@tanstack/react-router";
import { Products } from "@/components/jagx/Products";
import { PageShell, pageHead } from "@/components/jagx/PageShell";
import ogImage from "@/assets/og-jagx.jpg";

export const Route = createFileRoute("/products")({
  head: () =>
    pageHead({
      path: "/products",
      title: "JagX Products — Jewelry, Clothing & Signature Drops",
      description:
        "Shop the JagX product world: hand-crafted gold and diamond jewelry, premium streetwear and formalwear, and limited JagX × JRILICENSE drops.",
      keywords: "JagX products, JagX jewelry, JagX clothing, luxury streetwear, gold jewelry, limited drops",
      image: ogImage,
    }),
  component: () => (
    <PageShell
      eyebrow="THE STORE"
      title={<>JagX <span className="text-gradient-gold">Products</span></>}
      intro="Hand-crafted jewelry, premium clothing and limited JagX × JRILICENSE drops — every piece made to the same standard as our digital work."
    >
      <Products />
    </PageShell>
  ),
});
