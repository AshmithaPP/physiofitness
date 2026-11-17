"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/hero/Magnetic";

const GALLERY_IMAGES = [
  {
    src: "/images/hero/treat.jpg",
    alt: "Hands-on physiotherapy treatment session",
  },
  {
    src: "/images/about-studio.jpg",
    alt: "Modern Physiofit clinical studio interior in T. Nagar",
  },
  {
    src: "/images/services/studio-rehab.jpg",
    alt: "Functional rehab equipment and movement studio",
  },
  {
    src: "/images/hero/assess.jpg",
    alt: "Doctor and patient consultation and mobility assessment",
  },
];

const PILLARS = [
  {
    title: "Evidence-based",
    body: "Rooted in current physiotherapy research and outcomes.",
  },
  {
    title: "One-on-one",
    body: "Never a rotating cast of therapists — you keep the same lead.",
  },
  {
    title: "Milestone-driven",
    body: "Clear goals, tested regularly, communicated to you.",
  },
  {
    title: "Studio-quality",
    body: "Modern equipment in a calm, well-designed clinical space.",
  },
];

export default function AboutShowcase() {
  const root = useRef(null);

  useGSAP(
    () => {
      const container = root.current;
      if (!container) return;
      const q = gsap.utils.selector(container);
      const reduced = prefersReducedMotion();

      if (reduced) return;

      // Section scroll reveals
      const sections = q("[data-about-section]");
      sections.forEach((sec) => {
        const items = sec.querySelectorAll("[data-about-in]");
        if (items.length) {
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: sec,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // Line-by-line reveal for Founder Quote
      const quoteEl = q("[data-quote-text]")[0];
      const authorEl = q("[data-quote-author]")[0];
      if (quoteEl) {
        const split = SplitText.create(quoteEl, {
          type: "lines,words",
          linesClass: "overflow-hidden",
          wordsClass: "inline-block will-change-transform",
        });

        const quoteTl = gsap.timeline({
          scrollTrigger: {
            trigger: quoteEl,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        quoteTl
          .fromTo(
            split.words,
            { opacity: 0, yPercent: 110 },
            {
              opacity: 1,
              yPercent: 0,
              duration: 0.5,
              stagger: 0.032,
              ease: "power2.out",
            }
          )
          .fromTo(
            authorEl,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            "-=0.1"
          );
      }
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative w-full bg-primary text-secondary select-text font-roboto">
      
      {/* ================= 1. HERO BANNER (Brand Secondary Deep Green) ================= */}
      <section className="relative w-full bg-secondary text-primary pt-32 sm:pt-40 pb-28 sm:pb-36 px-[var(--gutter)] text-center overflow-hidden">
        <div className="relative mx-auto max-w-3xl z-10">
          <p className="eyebrow text-primary/75 text-xs font-semibold tracking-widest mb-2 sm:mb-3">
            About us
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.03em] text-primary">
            Not another clinic.{" "}
            <span className="font-light text-primary/70 block sm:inline">
              A studio for the body.
            </span>
          </h1>
          <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm md:text-base text-primary/80 max-w-xl mx-auto font-light leading-relaxed">
            Recovery deserves the same care and craft as fitness.
          </p>
        </div>
      </section>

      {/* ================= 2. 4 OVERLAPPING PHOTO CARDS ================= */}
      <section className="relative w-full px-[var(--gutter)] -mt-14 sm:-mt-20 lg:-mt-24 z-20 mx-auto max-w-[110rem]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_16px_36px] shadow-secondary/18 border-2 sm:border-4 border-primary bg-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 48vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. TWO-COLUMN STORY SECTION ================= */}
      <section data-about-section className="relative w-full mx-auto max-w-[110rem] px-[var(--gutter)] pt-16 sm:pt-24 pb-12 sm:pb-16 text-left">
        <div className="w-full">
          <p data-about-in className="eyebrow text-secondary/70 text-xs font-semibold tracking-widest mb-2 sm:mb-2.5">
            About
          </p>

          <h2 data-about-in className="font-display text-2xl sm:text-3xl md:text-[2.65rem] font-medium tracking-[-0.03em] text-secondary text-left max-w-3xl leading-[1.12]">
            Not another clinic.{" "}
            <span className="font-light text-secondary/70 block sm:inline">
              A studio for the body.
            </span>
          </h2>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 text-left">
            <p data-about-in className="text-xs sm:text-sm md:text-base text-secondary/85 leading-relaxed font-light text-left">
              Physiofit Studio was born from a simple idea: recovery deserves the same care and craft as fitness. Too often people are handed a printout of exercises and sent home, or shuttled between generic clinics and unrelated gyms. We do it differently.
            </p>

            <div data-about-in className="flex flex-col gap-3.5 sm:gap-4 text-left">
              <p className="text-xs sm:text-sm md:text-base text-secondary/85 leading-relaxed font-light text-left">
                Our space in T. Nagar houses physiotherapy, rehab and functional fitness under one roof, with a foot spa for restoration in between. Every plan starts with a slow, honest assessment — then we design a treatment path that scales from pain relief to real, sustainable strength.
              </p>
              <p className="text-xs sm:text-sm md:text-base text-secondary/85 leading-relaxed font-light text-left">
                We believe in fewer, better sessions. In evidence-based care that respects your time. And in listening to bodies as carefully as we treat them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FOUNDER SPLIT SECTION (Image on Left, Quote on Right without line) ================= */}
      <section data-about-section className="relative w-full mx-auto max-w-[110rem] px-[var(--gutter)] pt-8 sm:pt-12 pb-8 sm:pb-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column: Image with Floating Bottom Card */}
          <div data-about-in className="relative w-full max-w-lg mx-auto lg:max-w-none pb-8 sm:pb-10">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl border border-line bg-secondary/5">
              <Image
                src="/images/about-studio.jpg"
                alt="Physiofit Studio clinical team in T. Nagar"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover object-center"
              />

              {/* Center Play Circle Badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/95 text-secondary shadow-xl flex items-center justify-center pl-1 border border-line">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Card at Bottom */}
            <div className="absolute -bottom-2 sm:-bottom-4 left-4 right-4 sm:left-10 sm:right-10 bg-primary rounded-2xl shadow-[0_16px_36px] shadow-secondary/12 p-4 sm:p-5 border border-line text-center">
              <p className="font-display font-medium text-xs sm:text-sm text-secondary leading-snug">
                &ldquo;You should leave every session feeling steadier than you walked in. That&rsquo;s the whole standard.&rdquo;
              </p>
              <span className="eyebrow text-[0.625rem] text-secondary/65 font-medium block mt-1.5">
                Founder Note &middot; Team Physiofit
              </span>
            </div>
          </div>

          {/* Right Column: Heading, Story & Highlight Quote (Line Removed) */}
          <div data-about-in className="flex flex-col justify-center text-left">
            <span className="eyebrow text-secondary/70 text-xs font-semibold tracking-widest mb-2 sm:mb-2.5">
              Founder note
            </span>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.03em] text-secondary text-left leading-[1.15]">
              We believe in fewer, better sessions.
            </h3>

            <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-secondary/80 leading-relaxed text-left font-light">
              In evidence-based care that respects your time. And in listening to bodies as carefully as we treat them. Every plan starts with a slow, honest assessment — then we design a treatment path that scales from pain relief to real, sustainable strength.
            </p>

            {/* Quote Block — Clean typography with NO vertical line */}
            <div className="mt-6 sm:mt-8 pt-2 text-left">
              <blockquote
                data-quote-text
                className="font-display italic font-light text-base sm:text-lg md:text-xl text-secondary leading-snug text-left"
              >
                &ldquo;You should leave every session feeling steadier than you walked in. That&rsquo;s the whole standard.&rdquo;
              </blockquote>
              <cite
                data-quote-author
                className="eyebrow block not-italic text-xs sm:text-sm text-secondary/75 mt-3 font-medium tracking-wider text-left"
              >
                — Team Physiofit
              </cite>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 5. PILLARS / STANDARDS (Primary BG with Secondary Green Cards) ================= */}
      <section data-about-section className="relative w-full bg-primary text-secondary pt-2 sm:pt-4 pb-14 sm:pb-20 px-[var(--gutter)] text-center">
        <div className="mx-auto max-w-[110rem] w-full">
          
          <p data-about-in className="eyebrow text-secondary/70 text-xs font-semibold tracking-widest mb-2 sm:mb-2.5">
            Our standard
          </p>

          <h3 data-about-in className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.03em] text-secondary text-center">
            Four disciplines. <span className="font-light text-secondary/70">One studio.</span>
          </h3>

          <p data-about-in className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-secondary/80 text-center max-w-xl mx-auto leading-relaxed font-light">
            Physiotherapy, targeted rehab, functional fitness, and restoration under one roof.
          </p>

          {/* 4 Feature Cards (Secondary Green BG on Primary Off-white Section) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-8 sm:mt-10 text-left">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                data-about-in
                className="flex flex-col justify-start rounded-2xl sm:rounded-3xl border border-secondary/20 bg-secondary text-primary p-6 sm:p-7 shadow-lg transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1 hover:shadow-2xl text-left"
              >
                <h4 className="font-display text-base sm:text-lg lg:text-xl font-medium tracking-[-0.025em] text-primary mb-2 text-left">
                  {p.title}
                </h4>

                <p className="text-xs sm:text-sm text-primary/85 leading-relaxed text-left font-light">
                  {p.body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= 6. COME VISIT CTA (Green BG with Primary Button) ================= */}
      <section data-about-section className="relative w-full bg-secondary text-primary py-18 sm:py-24 md:py-28 px-[var(--gutter)] text-center">
        <div data-about-in className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-primary/75 text-xs font-semibold tracking-widest block mb-2 sm:mb-2.5">
            Come visit
          </p>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-[-0.03em] text-primary">
            Walk in for an assessment.{" "}
            <span className="font-light text-primary/70 block sm:inline">
              Leave with a plan.
            </span>
          </h3>

          <div className="mt-7 sm:mt-8 flex justify-center">
            <Magnetic>
              <Link
                href="/book"
                className="btn btn-light h-12 px-8 text-xs sm:text-sm font-medium shadow-xl hover:shadow-2xl transition-all"
              >
                Book an appointment
                <span aria-hidden className="ml-2 text-base leading-none">↗</span>
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

    </div>
  );
}
