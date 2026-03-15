import Link from "next/link";

const JOBS = [
  {
    id: 1,
    title: "Brand Motion Designer",
    type: "Full-time / Freelance",
    location: "Yerevan, Armenia",
    tags: ["Motion Design", "After Effects", "Brand"],
    description:
      "We're looking for a Brand Motion Designer who understands the VEH aesthetic — minimal, precise, intentional. You will create motion content for our digital presence: product reveals, campaign visuals, social assets, and brand films.",
    responsibilities: [
      "Create motion graphics and animations for social media and campaigns",
      "Develop product reveal videos aligned with VEH visual identity",
      "Collaborate with the creative team on brand storytelling",
      "Maintain consistency with our silent, minimal aesthetic",
      "Deliver high-quality work under tight deadlines",
    ],
    requirements: [
      "2+ years of motion design or animation experience",
      "Proficiency in After Effects, Cinema 4D or similar tools",
      "Strong understanding of typography and minimal aesthetics",
      "Portfolio demonstrating clean, intentional work",
      "Ability to translate brand philosophy into motion",
    ],
    nice: [
      "Experience with fashion or streetwear brands",
      "Knowledge of 3D animation",
      "Understanding of Armenian culture and aesthetics",
    ],
  },
  {
    id: 2,
    title: "Fashion Designer",
    type: "Full-time",
    location: "Yerevan, Armenia",
    tags: ["Streetwear", "Conceptual Design"],
    description:
      "VEH is looking for a Fashion Designer who lives and breathes silent streetwear. You will lead the design direction of our collections — from concept to final garment — bringing the philosophy of «Վեհ» into every piece.",
    responsibilities: [
      "Lead the design process for each collection from concept to delivery",
      "Develop technical specifications and work closely with production",
      "Translate the VEH brand philosophy into wearable form",
      "Research trends while maintaining a timeless, anti-hype perspective",
      "Mentor junior designers and build the creative culture at VEH",
    ],
    requirements: [
      "+ years of experience in fashion design, streetwear preferred",
      "Deep understanding of garment construction and materials",
      "Strong conceptual thinking with a minimal design sensibility",
      "Experience managing a collection from idea to final product",
      "Portfolio that reflects precision, restraint, and clarity",
    ],
    nice: [
      "Experience with sustainable / organic materials",
      "Background in art, architecture, or graphic design",
      "Familiarity with Armenian craft and textile traditions",
    ],
  },
];

export default function CareerPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-16">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-black grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">

        {/* LEFT */}
        <div className="flex flex-col justify-between px-8 md:px-14 py-16 md:py-24 border-b md:border-b-0 md:border-r border-black">
          <div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-8">VEH / Career</p>
            <h1 className="font-black uppercase leading-[0.85] tracking-tighter mb-8"
              style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}>
              BUILD<br/>
              <span style={{ WebkitTextStroke: "2px black", color: "transparent" }}>THE</span><br/>
              VISION.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse"/>
            <span className="text-[10px] uppercase tracking-widest font-bold">{JOBS.length} Open Positions</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-between px-8 md:px-14 py-16 md:py-24 bg-[#F5F5F5]">
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300">Why join VEH</p>
          <div className="flex flex-col gap-5">
            <p className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight">
              WE DON'T HIRE PEOPLE<br/>TO FILL ROLES.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              We find people who understand what VEH is trying to say — and give them the space to say it louder. Small team. Real impact. Yerevan-born, world-facing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { t: "Creative Freedom", d: "Your ideas shape the brand" },
              { t: "Real Impact",      d: "Small team, big decisions" },
              { t: "Yerevan First",    d: "Built here for the world" },
              { t: "No Hype",         d: "Intentional growth only" },
            ].map(item => (
              <div key={item.t} className="border border-gray-200 px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-tight mb-1">{item.t}</p>
                <p className="text-[9px] text-gray-400 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── JOBS ──────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-12 border-b border-black">
        <div className="flex items-center justify-between mb-10">
          <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300">Open Positions</p>
          <span className="text-[9px] uppercase tracking-widest font-bold border border-black px-3 py-1.5">
            {JOBS.length} open
          </span>
        </div>

        <div className="flex flex-col gap-8">
          {JOBS.map((job) => (
            <div key={job.id} className="border border-black">

              {/* JOB HEADER */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="px-8 py-8 border-b md:border-b-0 md:border-r border-black flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-[8px] uppercase tracking-widest border border-gray-100 px-2 py-1 text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none mb-4">
                      {job.title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-widest text-gray-400">{job.type}</span>
                      <span className="text-gray-200">·</span>
                      <span className="text-[9px] uppercase tracking-widest text-gray-400">{job.location}</span>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-8 flex flex-col justify-between bg-[#F9F9F9]">
                  <p className="text-sm text-gray-500 leading-relaxed">{job.description}</p>
                  <div className="flex items-center gap-4 mt-8">
                    <a
                      href={`mailto:vehbrand@gmail.com?subject=Application: ${job.title}&body=Hi VEH team,%0D%0A%0D%0AI'm applying for the ${job.title} position.%0D%0A%0D%0A`}
                      className="bg-black text-white px-8 py-3.5 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-gray-800 transition-colors"
                    >
                      Apply Now →
                    </a>
                    <span className="text-[9px] uppercase tracking-widest text-gray-300">
                      via email
                    </span>
                  </div>
                </div>
              </div>

              {/* JOB DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black">

                <div className="px-8 py-8 border-b md:border-b-0 md:border-r border-black">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-5">Responsibilities</p>
                  <ul className="flex flex-col gap-3">
                    {job.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[9px] font-bold text-gray-200 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-xs text-gray-500 leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 py-8 border-b md:border-b-0 md:border-r border-black">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-5">Requirements</p>
                  <ul className="flex flex-col gap-3">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"/>
                        <span className="text-xs text-gray-600 leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-8 py-8">
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 mb-5">Nice to Have</p>
                  <ul className="flex flex-col gap-3">
                    {job.nice.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1 h-1 bg-gray-200 rounded-full mt-2 shrink-0"/>
                        <span className="text-xs text-gray-400 leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── OPEN APPLICATION ──────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] text-white px-8 md:px-14 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-4">Don't see your role?</p>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-tight">
            SEND US YOUR<br/>PORTFOLIO ANYWAY.
          </h2>
          <p className="text-sm text-white/30 mt-4 max-w-xs leading-relaxed">
            If you feel VEH — reach out. We're always open to people who understand the vision.
          </p>
        </div>
        <a
          href="mailto:vehbrand@gmail.com?subject=Open Application — VEH&body=Hi VEH team,%0D%0A%0D%0AI'd love to be part of VEH.%0D%0A%0D%0A"
          className="border border-white/30 text-white px-10 py-4 text-[10px] uppercase font-black tracking-[0.3em] hover:bg-white hover:text-black transition-colors whitespace-nowrap"
        >
          vehbrand@gmail.com →
        </a>
      </section>

    </main>
  );
}