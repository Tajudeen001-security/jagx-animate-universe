import { createFileRoute, Link } from "@tanstack/react-router";
import { useCMS, type CMSData } from "@/lib/cms-store";
import { ArrowLeft, Save, RotateCcw, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "JagX Admin — Content Editor" },
      { name: "description", content: "JagX content editor for products, pricing, estate, cars, phones and contact." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] tracking-widest text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:border-gold outline-none"
      />
    </label>
  );
}

function Section<T extends { id: string }>({
  title,
  items,
  setItems,
  factory,
  render,
}: {
  title: string;
  items: T[];
  setItems: (next: T[]) => void;
  factory: () => T;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gold">{title}</h2>
        <button
          onClick={() => setItems([...items, factory()])}
          className="inline-flex items-center gap-1 text-xs px-3 py-1.5 bg-gradient-gold text-primary-foreground rounded-full font-semibold"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="grid gap-4">
        {items.map((it, idx) => (
          <div key={it.id} className="border border-border rounded-xl p-4 relative">
            <button
              onClick={() => setItems(items.filter((_, i) => i !== idx))}
              className="absolute top-3 right-3 text-muted-foreground hover:text-destructive"
              aria-label="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {render(it, (patch) => setItems(items.map((x, i) => (i === idx ? { ...x, ...patch } : x))))}
          </div>
        ))}
      </div>
    </section>
  );
}

function AdminPage() {
  const { data, update, reset } = useCMS();

  const set = <K extends keyof CMSData>(k: K, v: CMSData[K]) => update({ [k]: v } as Partial<CMSData>);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
          <div className="flex gap-2">
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs px-3 py-2 border border-border rounded-full hover:border-destructive hover:text-destructive">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <span className="inline-flex items-center gap-1 text-xs px-3 py-2 bg-gradient-gold text-primary-foreground rounded-full font-semibold">
              <Save className="w-3 h-3" /> Auto-saved
            </span>
          </div>
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-2 text-gradient-gold">JagX Content Editor</h1>
        <p className="text-sm text-muted-foreground mb-10">Edit content live — saved to this browser. No code changes needed.</p>

        <div className="grid gap-6">
          <section className="glass rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gold mb-4">Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="WhatsApp (digits only, with country code)" value={data.whatsapp} onChange={(v) => update({ whatsapp: v.replace(/\D/g, "") })} />
              <Field label="Email" value={data.email} onChange={(v) => update({ email: v })} />
            </div>
          </section>

          <Section
            title="Pricing tiers"
            items={data.tiers}
            setItems={(v) => set("tiers", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "New Tier", price: "₦0", desc: "", features: [] })}
            render={(t, u) => (
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Name" value={t.name} onChange={(v) => u({ name: v })} />
                <Field label="Price" value={t.price} onChange={(v) => u({ price: v })} />
                <Field label="Description" value={t.desc} onChange={(v) => u({ desc: v })} />
                <label className="md:col-span-3 block">
                  <span className="text-[10px] tracking-widest text-muted-foreground">Features (one per line)</span>
                  <textarea
                    value={t.features.join("\n")}
                    onChange={(e) => u({ features: e.target.value.split("\n").filter(Boolean) })}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:border-gold outline-none"
                  />
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={!!t.popular} onChange={(e) => u({ popular: e.target.checked })} /> Mark as Most Popular
                </label>
              </div>
            )}
          />

          <Section
            title="Products"
            items={data.products}
            setItems={(v) => set("products", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "New Product", category: "", price: "₦0", tag: "NEW" })}
            render={(p, u) => (
              <div className="grid md:grid-cols-4 gap-3">
                <Field label="Name" value={p.name} onChange={(v) => u({ name: v })} />
                <Field label="Category" value={p.category} onChange={(v) => u({ category: v })} />
                <Field label="Price" value={p.price} onChange={(v) => u({ price: v })} />
                <Field label="Tag" value={p.tag} onChange={(v) => u({ tag: v })} />
              </div>
            )}
          />

          <Section
            title="Estate"
            items={data.estates}
            setItems={(v) => set("estates", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "New Estate", location: "", price: "₦0", beds: 3, baths: 3, tag: "NEW" })}
            render={(e, u) => (
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="Name" value={e.name} onChange={(v) => u({ name: v })} />
                <Field label="Location" value={e.location} onChange={(v) => u({ location: v })} />
                <Field label="Price" value={e.price} onChange={(v) => u({ price: v })} />
                <Field label="Beds" type="number" value={e.beds} onChange={(v) => u({ beds: Number(v) || 0 })} />
                <Field label="Baths" type="number" value={e.baths} onChange={(v) => u({ baths: Number(v) || 0 })} />
                <Field label="Tag" value={e.tag} onChange={(v) => u({ tag: v })} />
              </div>
            )}
          />

          <Section
            title="Cars"
            items={data.cars}
            setItems={(v) => set("cars", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "New Car", spec: "", price: "₦0", tag: "NEW" })}
            render={(c, u) => (
              <div className="grid md:grid-cols-4 gap-3">
                <Field label="Name" value={c.name} onChange={(v) => u({ name: v })} />
                <Field label="Spec" value={c.spec} onChange={(v) => u({ spec: v })} />
                <Field label="Price" value={c.price} onChange={(v) => u({ price: v })} />
                <Field label="Tag" value={c.tag} onChange={(v) => u({ tag: v })} />
              </div>
            )}
          />

          <Section
            title="Phones"
            items={data.phones}
            setItems={(v) => set("phones", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "JagX Phone", tagline: "", price: "₦0", color: "from-gold to-accent" })}
            render={(p, u) => (
              <div className="grid md:grid-cols-4 gap-3">
                <Field label="Name" value={p.name} onChange={(v) => u({ name: v })} />
                <Field label="Tagline" value={p.tagline} onChange={(v) => u({ tagline: v })} />
                <Field label="Price" value={p.price} onChange={(v) => u({ price: v })} />
                <Field label="Color (tailwind gradient e.g. from-gold to-accent)" value={p.color} onChange={(v) => u({ color: v })} />
              </div>
            )}
          />

          <Section
            title="Websites portfolio"
            items={data.websites}
            setItems={(v) => set("websites", v)}
            factory={() => ({ id: crypto.randomUUID(), name: "New Site", category: "", tag: "NEW", url: "" })}
            render={(w, u) => (
              <div className="grid md:grid-cols-4 gap-3">
                <Field label="Name" value={w.name} onChange={(v) => u({ name: v })} />
                <Field label="Category" value={w.category} onChange={(v) => u({ category: v })} />
                <Field label="Tag" value={w.tag} onChange={(v) => u({ tag: v })} />
                <Field label="URL (optional)" value={w.url ?? ""} onChange={(v) => u({ url: v })} />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
