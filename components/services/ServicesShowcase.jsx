"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/hero/Magnetic";

const SERVICES_DATA = [
  {
    id: "physiotherapy",
    num: "01",
    tag: "01 · Physiotherapy",
    name: "Physiotherapy",
    summary:
      "Hands-on musculoskeletal care. We assess pain triggers, movement patterns and posture, and treat with manual therapy, dry needling and guided exercise.",
    bullets: [
      "Back & neck pain relief",
      "Sports injury recovery",
      "Post-natal & pelvic care",
      "Dry needling & manual therapy",
    ],
    cta: "Book Physiotherapy",
    href: "/book",
    img: "/images/hero/assess.jpg",
    alt: "Physiotherapy musculoskeletal assessment and manual therapy",
  },
  {
    id: "fitness",
    num: "02",
    tag: "02 · Fitness",
    name: "Fitness",
    summary:
      "Personalised strength and conditioning designed to complement your recovery or fitness goal. Small-group, one-on-one, or hybrid formats.",
    bullets: [
      "Strength & mobility",
      "Weight & fat loss",
      "Sport-specific training",
      "Corrective exercise",
    ],
    cta: "Book Fitness",
    href: "/book",
    img: "/images/hero/sustain.jpg",
    alt: "Personalised strength and conditioning training at Physiofit",
  },
  {
    id: "rehab",
    num: "03",
    tag: "03 · Rehab",
    name: "Rehab",
    summary:
      "Structured, milestone-driven programs for post-surgical or post-injury clients. We work with your surgeon or referring doctor for continuity.",
    bullets: [
      "Post-surgical protocol",
      "ACL / shoulder / spine rehab",
      "Return-to-sport testing",
      "Chronic pain programs",
    ],
    cta: "Book Rehab",
    href: "/book",
    img: "/images/services/rehab.jpg",
    pos: "object-center",
    alt: "Physiotherapist assessing a patient's knee during rehabilitation",
  },
  {
    id: "foot-spa",
    num: "04",
    tag: "04 · Foot Spa",
    name: "Foot Spa",
    summary:
      "Restorative foot care combining warmth, hydro-therapy, reflexology and soft-tissue release. Ideal for tired feet, plantar issues and stress relief.",
    bullets: [
      "Reflexology",
      "Warm water therapy",
      "Plantar fasciitis care",
      "Deep relaxation",
    ],
    cta: "Book Foot Spa",
    href: "/book",
    img: "/images/services/footspa.jpg",
    alt: "Restorative warm water foot spa and reflexology",
  },
  {
    id: "cupping",
    num: "05",
    tag: "05 · Cupping",
    name: "Cupping",
    summary:
      "Traditional and modern cupping therapy to release deep muscle tension, improve circulation, and accelerate recovery from training or injury.",
    bullets: [
      "Dry & fire cupping",
      "Trigger-point release",
      "Improved circulation",
      "Post-workout recovery",
    ],
    cta: "Book Cupping",
    href: "/book",
    img: "/images/services/cupping.jpg",
    pos: "object-[center_50%] lg:object-center",
    alt: "Therapist applying cupping therapy to a client's back",
  },
];

export default function ServicesShowcase() {
  const root = useRef(null);
  const stageRef = useRef(null);
  const photoRef = useRef(null);
  const stInstance = useRef(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  const goToStep = (index) => {
    setActiveStep(index);
    activeStepRef.current = index;
    const st = stInstance.current;
    if (!st) return;
    const n = SERVICES_DATA.length;
    const progress = (index + 0.5) / n;
    const target = st.start + (st.end - st.start) * progress;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { duration: 1.0 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const idx = SERVICES_DATA.findIndex((s) => s.id === hash);
    if (idx !== -1) {
      const timer = setTimeout(() => goToStep(idx), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduced = prefersReducedMotion();
    const n = SERVICES_DATA.length;

    // Create a pinned ScrollTrigger that controls the active step smoothly as user scrolls
    const st = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * 3.2}`,
      pin: true,
      scrub: reduced ? true : 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const step = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)));
        if (step !== activeStepRef.current) {
          activeStepRef.current = step;
          setActiveStep(step);
        }
      },
    });

    stInstance.current = st;

    return () => {
      st.kill();
    };
  }, []);

  const curr = SERVICES_DATA[activeStep] ?? SERVICES_DATA[0];

  return (
    <div ref={root} className="relative w-full bg-secondary text-primary select-text font-roboto">
      {/* ================= INTRO HEADER ================= */}
      <header className="relative z-10 mx-auto max-w-[110rem] px-[var(--gutter)] pt-24 sm:pt-32 pb-2 sm:pb-3 text-center">
        <p className="eyebrow mb-2 sm:mb-2.5 inline-block text-primary/75 sm:text-xs">
          Services
        </p>

        <h1 className="mx-auto max-w-4xl font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.035em]">
          Four disciplines. <span className="font-light text-primary/65">One studio.</span>
        </h1>

        <p className="mx-auto mt-2.5 sm:mt-3.5 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-primary/80 lg:text-lead">
          Every service at Physiofit is designed to work with the others. Move from acute care
          to long-term strength — without changing therapists or centres.
        </p>
      </header>

      {/* ================= PINNED SERVICES STAGE ================= */}
      <section
        ref={stageRef}
        aria-label="Physiofit Services Showcase"
        className="relative h-screen min-h-[100svh] w-full overflow-hidden bg-secondary flex flex-col justify-between pt-[4.75rem] sm:pt-[5.25rem] lg:pt-[5.5rem] pb-3 sm:pb-6"
      >
        <div className="mx-auto flex h-full w-full max-w-[110rem] flex-col justify-between px-[var(--gutter)]">
          
          {/* Quick section navigation pills */}
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-0.5 pb-1 sm:pb-2">
            {SERVICES_DATA.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goToStep(idx)}
                className={`eyebrow rounded-full border px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[0.625rem] transition-all duration-300 sm:text-xs ${
                  activeStep === idx
                    ? "border-primary bg-primary text-secondary font-bold shadow-md scale-105"
                    : "border-primary/25 bg-primary/5 text-primary/80 hover:border-primary/50 hover:bg-primary/10"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Main Visual & Content Grid */}
          <div className="flex flex-1 flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 xl:gap-20 items-center justify-center my-auto">
            
            {/* Master Photo Container (Mobile: Top/Center, Desktop: Right Column) */}
            <div className="order-1 lg:order-2 flex shrink-0 items-center justify-center w-full my-1 sm:my-2 lg:my-0">
              <div
                ref={photoRef}
                data-srv-master-photo
                className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/5] w-[min(100%,20rem,max(11rem,(100svh_-_28.5rem)_*_1.6))] sm:w-[min(100%,34rem,max(13rem,(100svh_-_30rem)_*_1.78))] lg:w-[min(100%,28rem,max(15rem,(100svh_-_13rem)_*_0.8))] xl:w-[min(100%,31rem,max(15rem,(100svh_-_13rem)_*_0.8))] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_20px_50px_-15px] shadow-ink/60 lg:shadow-[0_35px_90px_-20px] lg:shadow-ink/75 border border-primary/20 will-change-transform"
              >
                {/* 5 Stacked Image Layers: Hardware-accelerated crossfade, ONLY active image is fully visible */}
                {SERVICES_DATA.map((s, i) => (
                  <div
                    key={s.id}
                    className={`absolute inset-0 overflow-hidden transition-all duration-700 ease-out ${
                      activeStep === i
                        ? "opacity-100 scale-100 z-10"
                        : "opacity-0 scale-105 pointer-events-none z-0"
                    }`}
                  >
                    <div className="absolute inset-0 will-change-transform">
                      <Image
                        src={s.img}
                        alt={s.alt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1024px) 40vw, (min-width: 640px) 70vw, 92vw"
                        className={`object-cover ${s.pos ?? "object-center"}`}
                      />
                    </div>
                    {/* Dark gradient base for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/65 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}

                {/* Floating Active Discipline Badge inside the photo */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-5 lg:left-5 z-20">
                  <span className="eyebrow inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-primary/30 bg-secondary/85 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] text-primary backdrop-blur-md shadow-lg">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                    {curr.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Area: ONLY the active service text is rendered, guaranteeing ZERO overlapping or blurred text */}
            <div className="order-2 lg:order-1 relative w-full max-w-xl flex flex-col justify-center min-h-[170px] sm:min-h-[220px]">
              <div
                key={curr.id}
                className="animate-srv-in flex flex-col justify-center text-center lg:text-left"
              >
                {/* Step Eyebrow */}
                <span className="eyebrow mb-1.5 sm:mb-2.5 inline-block text-[0.6875rem] sm:text-xs text-primary/75 font-semibold">
                  {curr.tag}
                </span>

                {/* Section Title */}
                <h2 className="font-display text-[clamp(1.85rem,4.5vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.035em] text-primary">
                  {curr.name}
                </h2>

                {/* Description Paragraph */}
                <p className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base leading-relaxed text-primary/80 lg:text-lead line-clamp-3 sm:line-clamp-none max-w-xl mx-auto lg:mx-0">
                  {curr.summary}
                </p>

                {/* 4 Feature Tags */}
                <div className="mt-3 sm:mt-5 flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2">
                  {curr.bullets.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-xs font-medium text-primary/90 backdrop-blur-sm shadow-sm"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Booking CTA Button */}
                <div className="mt-4 sm:mt-7 flex justify-center lg:justify-start">
                  <Magnetic>
                    <Link
                      href={curr.href}
                      className="btn btn-light h-9 sm:h-11 px-5 sm:px-6 text-xs sm:text-sm font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      {curr.cta}
                      <span aria-hidden className="ml-1 text-base leading-none">↗</span>
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom subtle progress cue */}
          <div className="flex shrink-0 items-center justify-center gap-2 py-1">
            {SERVICES_DATA.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeStep === i ? "w-6 bg-primary" : "w-1.5 bg-primary/25"
                }`}
              />
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
