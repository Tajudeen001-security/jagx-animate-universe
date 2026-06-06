import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Product = { id: string; name: string; category: string; price: string; tag: string };
export type Tier = { id: string; name: string; price: string; desc: string; features: string[]; popular?: boolean };
export type Estate = { id: string; name: string; location: string; price: string; beds: number; baths: number; tag: string };
export type Car = { id: string; name: string; spec: string; price: string; tag: string };
export type Phone = { id: string; name: string; tagline: string; price: string; color: string };
export type WebsiteCase = { id: string; name: string; category: string; url?: string; tag: string };

export type CMSData = {
  whatsapp: string;
  email: string;
  products: Product[];
  tiers: Tier[];
  estates: Estate[];
  cars: Car[];
  phones: Phone[];
  websites: WebsiteCase[];
};

const DEFAULTS: CMSData = {
  whatsapp: "2349160654415",
  email: "gbadamositajudeenwan@gmail.com",
  products: [
    { id: "p1", name: "JagX Pulse X1", category: "Mobile · JRI Certified", price: "₦450,000", tag: "FLAGSHIP" },
    { id: "p2", name: "JagX Aurum Chain", category: "Jewelry · 18K Gold", price: "₦320,000", tag: "LIMITED" },
    { id: "p3", name: "JagX Apex Hoodie", category: "Clothing · Premium Drop", price: "₦45,000", tag: "NEW" },
    { id: "p4", name: "JagX FlowOps", category: "Automation Suite", price: "From ₦150,000", tag: "B2B" },
  ],
  tiers: [
    { id: "t1", name: "Starter Site", price: "₦150,000", desc: "Perfect for personal brands & small businesses", features: ["Up to 5 pages", "Mobile responsive", "Contact form", "Basic SEO", "1 month support"] },
    { id: "t2", name: "Business Pro", price: "₦450,000", desc: "For growing brands that need power & polish", features: ["Up to 15 pages", "CMS / blog", "Animated UI/UX", "E-commerce ready", "WhatsApp integration", "3 months support"], popular: true },
    { id: "t3", name: "World Class", price: "₦1,200,000+", desc: "Full 3D animated flagship experiences", features: ["Unlimited pages", "Custom 3D animations", "Advanced automation", "AI integrations", "Custom backend", "1 year support"] },
  ],
  estates: [
    { id: "e1", name: "JagX Aurum Towers", location: "Lekki, Lagos", price: "₦480,000,000", beds: 5, baths: 6, tag: "FLAGSHIP" },
    { id: "e2", name: "Pulse Heights Penthouse", location: "Banana Island", price: "₦1.2B", beds: 6, baths: 7, tag: "ULTRA" },
    { id: "e3", name: "Neon Court Villas", location: "Abuja", price: "₦220,000,000", beds: 4, baths: 5, tag: "NEW" },
    { id: "e4", name: "JagX Smart Estate", location: "Ibeju", price: "From ₦65,000,000", beds: 3, baths: 4, tag: "OFF-PLAN" },
  ],
  cars: [
    { id: "c1", name: "JagX Velox GT", spec: "V8 · 620 HP · AWD", price: "₦95,000,000", tag: "FLAGSHIP" },
    { id: "c2", name: "JagX Aurum SUV", spec: "Hybrid · 7-seat · Smart Cabin", price: "₦62,000,000", tag: "FAMILY" },
    { id: "c3", name: "JagX Pulse EV", spec: "Electric · 480 km range", price: "₦48,000,000", tag: "ELECTRIC" },
    { id: "c4", name: "JagX Apex Coupe", spec: "Turbo I6 · 450 HP", price: "₦55,000,000", tag: "SPORT" },
  ],
  phones: [
    { id: "ph1", name: "JagX Pulse X1", tagline: "Flagship · 6.7\" OLED · 200MP", price: "₦450,000", color: "from-gold to-accent" },
    { id: "ph2", name: "JagX Pulse Lite", tagline: "Daily Driver · 6.4\" · 108MP", price: "₦220,000", color: "from-neon to-accent" },
    { id: "ph3", name: "JagX Aurum Fold", tagline: "Foldable · Dual Display", price: "₦780,000", color: "from-gold-soft to-gold" },
    { id: "ph4", name: "JagX Pulse Mini", tagline: "Compact · 5.8\" · Pure JagX OS", price: "₦180,000", color: "from-accent to-neon" },
  ],
  websites: [
    { id: "w1", name: "Aurum Finance", category: "FinTech Dashboard", tag: "SaaS" },
    { id: "w2", name: "Pulse Commerce", category: "E-commerce Platform", tag: "STORE" },
    { id: "w3", name: "Velox Motors", category: "Auto Showroom 3D", tag: "3D" },
    { id: "w4", name: "Estate Vault", category: "Real Estate Portal", tag: "PORTAL" },
    { id: "w5", name: "Aurum Studio", category: "Agency Portfolio", tag: "BRAND" },
    { id: "w6", name: "JagX Cloud Ops", category: "Automation Console", tag: "B2B" },
  ],
};

const KEY = "jagx-cms-v1";

const Ctx = createContext<{
  data: CMSData;
  update: (patch: Partial<CMSData>) => void;
  reset: () => void;
} | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CMSData>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  }, [data, loaded]);

  return (
    <Ctx.Provider value={{
      data,
      update: (patch) => setData((d) => ({ ...d, ...patch })),
      reset: () => setData(DEFAULTS),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCMS() {
  const v = useContext(Ctx);
  if (!v) return { data: DEFAULTS, update: () => {}, reset: () => {} };
  return v;
}
