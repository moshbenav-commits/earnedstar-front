/**
 * Copyright (c) 2024-2026 Expedia Solutions, LLC. All Rights Reserved.
 */
import Image from "next/image";
import { MESHY } from "@/lib/marketing-editorial-data";

export function BrandGallerySection() {
  return (
    <section className="relative overflow-hidden border-y border-ink/8 bg-cream-light py-24 md:py-32">
      <div className="paper-grain pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <div className="mb-14 grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="smallcaps mb-3 text-[10px] text-gold-dark">The Mark</div>
            <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] tracking-tight text-balance">
              A trust badge worth <em className="text-gold-dark underline-hand">earning</em>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-pretty leading-[1.65] text-ink/65">
              Padded navy leather. Gold piping. A medallion that holds <em className="italic">your</em> logo —
              because every star on the platform points back to a real merchant who earned it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="vellum-card gilded-edge relative overflow-hidden rounded-2xl p-8 md:p-12 lg:col-span-5">
            <div className="gold-foil absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-10" aria-hidden />
            <div className="smallcaps relative mb-3 text-[10px] text-gold-dark">Primary — Navy / Gold</div>
            <div className="relative flex justify-center">
              <Image
                src={MESHY.heroBadge}
                alt="EarnedStar 3D leather badge"
                width={320}
                height={320}
                className="max-w-full drop-shadow-[0_24px_50px_rgba(11,26,56,0.32)]"
              />
            </div>
            <h3 className="font-heading mt-6 text-center text-3xl leading-tight italic">The EarnedStar mark.</h3>
          </div>

          <div className="vellum-card relative overflow-hidden rounded-2xl p-8 md:p-10 lg:col-span-7">
            <div className="mb-5 flex items-center justify-between">
              <div className="smallcaps text-[10px] text-gold-dark">Brand System · Edition I</div>
              <div className="font-num smallcaps text-[10px] text-ink/40">Vol. 01 · 2026</div>
            </div>
            <Image
              src={MESHY.brandSystem}
              alt="EarnedStar full brand system — primary logo, icon detail, dark version, color variants"
              width={900}
              height={600}
              className="h-auto w-full rounded-xl drop-shadow-[0_20px_40px_rgba(11,26,56,0.16)]"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            className="vellum-card rounded-2xl p-10 text-center"
            style={{ background: "radial-gradient(ellipse at top, #FEF3C7 0%, #FFFFFF 60%)" }}
          >
            <div className="smallcaps mb-2 text-[10px] text-gold-dark">Quarterly Leaders Award</div>
            <h4 className="font-heading text-3xl italic">For merchants who earn it.</h4>
            <div className="mt-6 flex justify-center">
              <Image src={MESHY.awardBadge} alt="EarnedStar Q1 Leader Award" width={280} height={280} className="max-w-full" />
            </div>
          </div>
          <div
            className="vellum-card rounded-2xl p-10 text-center"
            style={{ background: "radial-gradient(ellipse at top, #DBEAFE 0%, #FFFFFF 60%)" }}
          >
            <div className="smallcaps mb-2 text-[10px] text-gold-dark">Anti-AI · Phase I</div>
            <h4 className="font-heading text-3xl italic">Verified Human.</h4>
            <div className="mt-6 flex justify-center">
              <Image src={MESHY.verifiedHuman} alt="EarnedStar Verified Human badge" width={280} height={280} className="max-w-full" />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="vellum-card flex min-h-[220px] items-center justify-center rounded-2xl p-10" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F7F4EE 100%)" }}>
            <Image src={MESHY.heroWordmark} alt="EarnedStar leather wordmark" width={400} height={200} className="max-h-52 w-auto object-contain" />
          </div>
          <div className="vellum-card flex min-h-[220px] items-center justify-center rounded-2xl p-10" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F7F4EE 100%)" }}>
            <Image src={MESHY.heroMotto} alt="No order, no star. Every review is real." width={400} height={200} className="max-h-52 w-auto object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
