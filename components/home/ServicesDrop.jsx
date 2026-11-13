"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* --------------------------------------------------------------------------
   Services drop
   A studio photo sits in the centre; the four service photos fall from the
   top of the screen and land in two piles either side of it (scroll-scrubbed).
   Resting positions live in CSS (responsive), resting tilts in SERVICES; GSAP animates the
   fall, so every breakpoint lands exactly where its classes say.
   -------------------------------------------------------------------------- */

const SERVICES = [
  {
    name: "Physiotherapy",
    tilt: -8,
    chipTilt: -14,
    img: "/images/hero/assess.jpg",
    alt: "Therapist treating a patient's leg",
    card: "left-[3%] top-[50%] sm:left-[6%] lg:left-[7%] lg:top-[40%]",
    chip: "left-[3%] top-[41%] lg:left-[3%] lg:top-[76%]",
  },
  {
    name: "Rehab",
    tilt: 6,
    chipTilt: 10,
    img: "/images/hero/plan.jpg",
    alt: "Guided rehab exercise with dumbbells",
    card: "left-[22%] top-[60%] sm:left-[20%] lg:left-[21%] lg:top-[56%]",
    chip: "hidden lg:block lg:left-[27%] lg:top-[24%]",
  },
  {
    name: "Fitness",
    tilt: 7,
    chipTilt: -8,
    img: "/images/hero/sustain.jpg",
    alt: "Strength training in the studio",
    card: "right-[3%] top-[48%] sm:right-[6%] lg:right-[20%] lg:top-[42%]",
    chip: "hidden lg:block lg:right-[28%] lg:top-[20%]",
  },
  {
    name: "Foot Spa",
    tilt: -5,
    chipTilt: 12,
    img: "/images/services/footspa.jpg",
    alt: "Restorative foot spa with flowers",
    card: "right-[22%] top-[59%] sm:right-[20%] lg:right-[6%] lg:top-[58%]",
    chip: "right-[3%] top-[38%] lg:right-[3%] lg:top-[40%]",
  },
];

export default function ServicesDrop({ ready = true }) {
  const root = useRef(null);

  useGSAP(
    () => {
      // wait for the hero so its pin spacer exists before we measure ours
      if (!ready) return;
      const stage = root.current;
      const q = gsap.utils.selector(stage);
      if (prefersReducedMotion()) return; // everything already rests in place

      const pieces = q("[data-piece]");
      const spins = pieces.map(() => gsap.utils.random(-120, 120, 1));
      const above = (el) => -(el.offsetTop + el.offsetHeight + 80);
      const isMobile = () => typeof window !== "undefined" && window.innerWidth < 1024;

      const setPinSpacerBg = () => {
        if (stage.parentElement?.classList.contains("pin-spacer")) {
          stage.parentElement.style.backgroundColor = "var(--brand-primary)";
        }
      };
      setPinSpacerBg();

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: setPinSpacerBg,
        },
      });

      tl.fromTo(
        q("[data-drop-pill]"),
        { autoAlpha: () => (isMobile() ? 1 : 0), y: () => (isMobile() ? 0 : -16) },
        { autoAlpha: 1, y: 0, duration: 0.4 },
        0
      )
        .fromTo(
          q("[data-drop-center]"),
          {
            yPercent: () => (isMobile() ? 0 : 25),
            scale: () => (isMobile() ? 1 : 0.82),
            autoAlpha: 1,
          },
          { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1 },
          0
        )
        .fromTo(
          q("[data-drop-center] [data-zoom]"),
          { scale: () => (isMobile() ? 1.08 : 1.35) },
          { scale: 1, duration: 1.2 },
          0
        );

      // the fall — staggered, alternating sides, with a landing bounce
      const order = [0, 2, 1, 3, 4, 6, 5, 7].filter((i) => i < pieces.length);
      order.forEach((idx, n) => {
        const el = pieces[idx];
        const at = 0.55 + n * 0.14;
        tl.fromTo(el, { y: () => above(el) }, { y: 0, duration: 1, ease: "bounce.out" }, at)
          .fromTo(el, { rotation: spins[idx] }, { rotation: Number(el.dataset.tilt), duration: 1, ease: "power2.out" }, at);
      });

      tl.fromTo(
        q("[data-drop-line]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" },
        1.5
      ).to({}, { duration: 0.4 });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      aria-labelledby="services-title"
      data-stage-primary
      className="relative h-dvh min-h-[100dvh] w-full overflow-hidden bg-primary text-secondary"
    >
      {/* soft floor shadow so the piles feel grounded */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-mist to-transparent"
      />

      {/* top pill */}
      <div className="absolute inset-x-0 top-[12svh] z-10 flex justify-center lg:top-[13svh]">
        <span
          data-drop-pill
          className="eyebrow rounded-full bg-secondary px-4 py-2.5 text-[0.625rem] text-primary shadow-[0_8px_20px_-8px] shadow-secondary/50"
        >
          Our services
        </span>
      </div>

      {/* centre photo */}
      <div className="absolute inset-x-0 top-[19svh] flex justify-center lg:top-[20svh]">
        <div
          data-drop-center
          className="relative aspect-[3/4] h-[36svh] max-w-[70vw] overflow-hidden rounded-[1.75rem] shadow-[0_40px_80px_-30px] shadow-secondary/45 sm:h-[46svh] lg:h-[50svh]"
        >
          <div data-zoom className="absolute inset-0">
            <Image
              src="/images/hero/hero.jpg"
              alt="Physiofit therapists treating a patient"
              fill
              sizes="(min-width: 1024px) 30vw, 70vw"
              className="object-cover object-[50%_68%]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 via-transparent to-transparent" />
          <p className="absolute inset-x-0 bottom-4 px-4 text-center font-display text-base font-medium leading-tight sm:text-lg tracking-[-0.02em] text-primary lg:bottom-6 lg:text-2xl">
            One studio. <span className="font-light text-primary/75">Four ways back.</span>
          </p>
        </div>
      </div>

      {/* falling service photos */}
      <ul className="absolute inset-0 z-20">
        {SERVICES.map((s) => (
          <li key={s.name} data-piece data-tilt={s.tilt} style={{ rotate: `${s.tilt}deg` }} className={`absolute w-[clamp(5.5rem,min(26vw,17svh),9rem)] lg:w-[clamp(9rem,13vw,14rem)] ${s.card}`}>
            <Link
              href="/services"
              className="group block rounded-[1.1rem] bg-primary p-1.5 shadow-[0_24px_40px_-18px] shadow-secondary/50 transition-transform duration-500 ease-expo hover:-translate-y-2 hover:scale-[1.03] lg:rounded-[1.4rem] lg:p-2"
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[0.8rem] lg:rounded-[1rem]">
                <Image
                  src={s.img}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 14rem, 9rem"
                  className="object-cover transition-transform duration-700 ease-expo group-hover:scale-110"
                />
              </span>
              <span className="block px-1 pb-0.5 pt-2 text-center text-[0.7rem] font-semibold tracking-[-0.01em] lg:pt-2.5 lg:text-sm">
                {s.name}
              </span>
            </Link>
          </li>
        ))}

        {/* small round chips — the "scatter" around the piles */}
        {SERVICES.map((s) => (
          <li
            key={`${s.name}-chip`}
            aria-hidden
            data-piece
            data-tilt={s.chipTilt}
            style={{ rotate: `${s.chipTilt}deg` }}
            className={`absolute size-[clamp(2.75rem,11vw,3.5rem)] overflow-hidden rounded-full border-[3px] border-primary shadow-[0_14px_24px_-12px] shadow-secondary/60 lg:size-[clamp(3.5rem,5vw,5rem)] ${s.chip}`}
          >
            <Image src={s.img} alt="" fill sizes="5rem" className="object-cover" />
          </li>
        ))}
      </ul>

      {/* bottom heading */}
      <div className="absolute inset-x-0 bottom-[4svh] z-30 px-[var(--gutter)] text-center sm:bottom-[6svh] lg:bottom-[7svh]">
        <h2 id="services-title" className="font-display text-[clamp(1.75rem,min(4vw,6.5svh),3.5rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          <span className="mask-line"><span data-drop-line className="block">Care for every body,</span></span>
          <span className="mask-line"><span data-drop-line className="block font-light text-secondary/60">under one roof.</span></span>
        </h2>
      </div>
    </section>
  );
}
