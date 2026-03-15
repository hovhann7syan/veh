import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[90vh]">

          {/* LEFT — DARK */}
          <div className="bg-[#0D0D0D] text-white flex flex-col justify-between px-8 md:px-14 py-16 md:py-24 min-h-[70vw] md:min-h-0 border-b md:border-b-0 md:border-r border-black order-1">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-8">VEH / About</p>
              <h1 className="font-black uppercase leading-[0.85] tracking-tighter mb-10"
                style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}>
                ՎԵՀ
              </h1>
              <div className="flex flex-col gap-2 mb-10">
                {["Noble", "Elevated", "Proud"].map((word, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[9px] uppercase tracking-widest text-white/20">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-lg md:text-xl font-black uppercase tracking-widest text-white/70">{word}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/30 leading-relaxed max-w-xs">
                The name VEH comes from the Armenian word «Վեհ» — meaning noble, elevated, and proud. This idea lies at the core of the brand.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-1">Origin</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Yerevan, Armenia</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-1">Est.</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">2024</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col justify-center px-8 md:px-14 py-16 md:py-24 order-2">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-8">What is VEH</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.05] mb-10">
              A FORM OF<br/>
              QUIET PRIDE.<br/>
              <span className="text-gray-200">CALM. CONFIDENT.</span><br/>
              INTENTIONAL.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              VEH represents a form of quiet pride — a calm and confident presence that does not need to prove itself. The brand is built around the philosophy of silent strength. Not loud. Not performative. But deeply intentional.
            </p>
          </div>

        </div>
      </section>

      {/* ── PHILOSOPHY ────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] text-white border-b border-black px-8 md:px-14 py-20 md:py-32">
        <div className="max-w-4xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-10">Philosophy</p>
          <h2 className="font-black uppercase leading-[0.88] tracking-tighter mb-16"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
            SILENT<br/>
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>STRENGTH.</span><br/>
            NOT LOUD.<br/>
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>NOT PERFORMATIVE.</span><br/>
            DEEPLY INTENTIONAL.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/10">
            {[
              {
                num: "01",
                title: "Precision",
                desc: "Each piece reflects a design language defined by precision, restraint, and clarity. Clean forms, structured silhouettes, strong typography."
              },
              {
                num: "02",
                title: "Depth",
                desc: "VEH exists at the intersection of minimal streetwear, underground culture, and architectural minimalism. Timeless, not trendy."
              },
              {
                num: "03",
                title: "Intention",
                desc: "Limited releases, created for those who value depth, aesthetics, and individuality. Every detail is deliberate."
              },
            ].map(item => (
              <div key={item.num}>
                <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">{item.num}</span>
                <h3 className="text-base font-black uppercase tracking-tight mt-2 mb-3 text-white/80">{item.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE NAME ──────────────────────────────────────────────────────── */}
      <section className="border-b border-black">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="px-8 md:px-14 py-16 md:py-24 border-b md:border-b-0 md:border-r border-black">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-8">The Name</p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-8">
              ARMENIAN SPIRIT.<br/>
              <span className="text-gray-200">NOT ARMENIAN</span><br/>
              FOLKLORE.
            </h2>
            <div className="flex flex-col gap-5 text-sm text-gray-500 leading-relaxed max-w-sm">
              <p>
                Although VEH was born in Armenia, the brand is not built on traditional ethnic symbolism. Rather, it carries the spirit behind the word "Վեհ" — dignity, inner strength, and silent pride.
              </p>
              <p>
                This is Armenian spirit expressed through design — not through folk patterns or flags, but through the quiet confidence that defines the culture at its deepest level.
              </p>
            </div>
          </div>

          {/* FACTS */}
          <div className="bg-[#F4F4F4] px-8 md:px-14 py-16 md:py-24">
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-10">The Word «Վեհ»</p>
            <div className="flex flex-col gap-0">
              {[
                { arm: "Վեհ",        en: "Noble" },
                { arm: "Վեհ",        en: "Elevated" },
                { arm: "Վեհ",        en: "Proud" },
                { arm: "Վեհ",        en: "Silent Strength" },
                { arm: "Վեհ",        en: "Inner Dignity" },
                { arm: "Վեհ",        en: "Quiet Pride" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-200">
                  <span className="text-lg font-black text-gray-300">{item.arm}</span>
                  <span className="text-[11px] uppercase tracking-[0.3em] font-bold">{item.en}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESIGN LANGUAGE ───────────────────────────────────────────────── */}
      <section className="border-b border-black px-8 md:px-14 py-16 md:py-24">
        <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-10">Design Language</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight mb-8">
              PRECISION.<br/>RESTRAINT.<br/>CLARITY.
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm">
              VEH does not chase trends or hype. Instead, it focuses on timeless design and limited releases — created for those who value depth, aesthetics, and individuality.
            </p>
            <div className="flex flex-col gap-3">
              {[
                "Clean forms over complex graphics",
                "Strong typography as a design element",
                "Minimal symbols, maximum meaning",
                "Structured silhouettes, deep colours",
                "No trendy noise. No loud prints.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-100">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"/>
                  <p className="text-sm text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ARCHETYPE */}
          <div className="flex flex-col gap-6">
            <div className="border border-black p-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-4">Archetype</p>
              <p className="text-lg font-black uppercase tracking-tight leading-tight">
                Underground Streetwear<br/>
                + Philosophical Minimalism<br/>
                + Quiet Luxury Energy
              </p>
            </div>
            <div className="bg-[#0D0D0D] text-white p-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-4">Position</p>
              <p className="text-sm text-white/60 leading-relaxed">
                Not a mass brand. Not fast fashion. Not luxury hype. VEH is selective streetwear — limited collections and conscious design for those who move with intention.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Silent", "Pride", "Minimal", "Motion", "Precision", "Presence", "Philosophy", "Underground", "Limited"].map(k => (
                <span key={k}
                  className="border border-gray-200 text-gray-400 text-[9px] uppercase tracking-widest px-3 py-1.5 hover:border-black hover:text-black transition-colors cursor-default">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR THE FEW ───────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] text-white border-b border-black px-8 md:px-14 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-8">Who it's for</p>
          <h2 className="font-black uppercase leading-[0.88] tracking-tighter mb-10"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>
            VEH IS NOT<br/>
            MADE FOR<br/>
            <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.25)", color: "transparent" }}>EVERYONE.</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-xl mb-12">
            VEH is designed for people who move with intention. People who understand that true presence does not need to be loud. It is made for those who understand.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Value aesthetics",
              "Understand design",
              "Love minimalism",
              "Don't like showing off",
              "Feel the culture",
              "Move with intention",
            ].map((item, i) => (
              <div key={i} className="border border-white/10 px-4 py-3">
                <span className="text-[10px] uppercase tracking-wider text-white/40">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-16 md:py-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-4">If you understand</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.9]">
            WEAR THE<br/>
            PHILOSOPHY.
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop"
            className="bg-black text-white px-10 py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-gray-900 transition-colors text-center">
            Shop Now
          </Link>
          <Link href="/register"
            className="border border-black px-10 py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-black hover:text-white transition-colors text-center">
            Join VEH
          </Link>
        </div>
      </section>

    </main>
  );
}