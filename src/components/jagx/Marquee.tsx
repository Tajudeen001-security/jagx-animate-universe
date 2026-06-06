export function Marquee() {
  const items = ["AUTOMATION", "MOBILE PHONES", "JEWELRY", "CLOTHING", "WEBSITES", "JRI LICENSED", "WORLD-CLASS UI/UX", "3D DESIGN"];
  return (
    <div className="relative py-8 border-y border-border overflow-hidden glass">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-8 mx-8">
            <span className="text-4xl md:text-6xl font-black text-foreground/10 tracking-tighter hover:text-gradient-gold transition-all">{t}</span>
            <span className="w-3 h-3 bg-gradient-gold rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
