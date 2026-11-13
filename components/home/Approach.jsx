"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* --------------------------------------------------------------------------
   Approach
   An arch-shaped photo sits under the title. On scroll the arch opens out to
   a full-screen image, then the four steps rise in on the left.
   The arch is a clip-path on a full-bleed image, so "opening" is just the
   inset shrinking to zero — no layout changes, no reflow.
   -------------------------------------------------------------------------- */

const STEPS = [
  { n: "01", title: "Assess", body: "A full-body screen to understand posture, movement, pain triggers, and history." },
  { n: "02", title: "Plan", body: "A structured, milestone-driven roadmap tailored to your recovery timeline." },
  { n: "03", title: "Treat", body: "Manual therapy, guided exercise, dry needling, and modalities as needed." },
  { n: "04", title: "Sustain", body: "Home programs, education, and periodic check-ins to prevent relapse." },
];

function Badge() {
  return (
    <svg viewBox="0 0 120 120" className="size-full" aria-hidden>
      <defs>
        <path id="approach-badge" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
      </defs>
      <text className="fill-current" style={{ fontSize: 9.2, letterSpacing: "0.2em", fontWeight: 600 }}>
        <textPath href="#approach-badge">EVIDENCE-BASED CARE · T. NAGAR · CHENNAI · </textPath>
      </text>
    </svg>
  );
}

export default function Approach({ ready = true }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      const stage = root.current;
      const q = gsap.utils.selector(stage);
      const slot = q("[data-arch-slot]")[0];

      // arch rect → clip-path inset, measured from the responsive slot
      const arch = () => {
        const s = slot.getBoundingClientRect();
        const st = stage.getBoundingClientRect();
        const t = s.top - st.top;
        const l = s.left - st.left;
        const r = st.width - l - s.width;
        const b = st.height - t - s.height;
        const R = s.width / 2;
        return `inset(${t}px ${r}px ${b}px ${l}px round ${R}px ${R}px 0px 0px)`;
      };
      const full = "inset(0px 0px 0px 0px round 0px 0px 0px 0px)";

      if (prefersReducedMotion()) {
        gsap.set(q("[data-arch]"), { clipPath: full });
        gsap.set(q("[data-arch-title]"), { autoAlpha: 0 });
        gsap.set(q("[data-arch-shade], [data-ap-fade], [data-ap-step], [data-ap-badge]"), { autoAlpha: 1 });
        return;
      }

      gsap.set(q("[data-arch]"), { clipPath: arch });

      const setPinSpacerBg = () => {
        if (stage.parentElement?.classList.contains("pin-spacer")) {
          stage.parentElement.style.backgroundColor = "var(--brand-secondary)";
        }
      };
      setPinSpacerBg();

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.4}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: setPinSpacerBg,
        },
      });

      tl.fromTo(q("[data-arch]"), { clipPath: arch }, { clipPath: full, duration: 1.2 }, 0)
        .fromTo(q("[data-arch-zoom]"), { scale: 1.25 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0)
        .to(q("[data-arch-title]"), { yPercent: -40, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0)
        .fromTo(q("[data-arch-shade]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "none" }, 0.8)
        .fromTo(q("[data-ap-line]"), { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.08, ease: "expo.out" }, 1.1)
        .fromTo(q("[data-ap-fade]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.05)
        .fromTo(q("[data-ap-step]"), { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.3)
        .fromTo(q("[data-ap-badge]"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" }, 1.5)
        .fromTo(q("[data-ap-spin]"), { rotate: 0 }, { rotate: 240, duration: 2.2, ease: "none" }, 0.4)
        .to({}, { duration: 0.4 });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      aria-labelledby="approach-title"
      data-stage-secondary
      className="relative h-dvh min-h-[100dvh] w-full overflow-hidden bg-secondary text-primary"
    >
      {/* title above the arch */}
      <div data-arch-title className="absolute inset-x-0 top-[12svh] z-10 px-[var(--gutter)] text-center lg:top-[13svh]">
        <p className="font-display text-[clamp(1.75rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em]">
          Slow diagnosis. <span className="font-light text-primary/65">Precise treatment.</span>
        </p>
        <p className="eyebrow mt-4 text-[0.625rem] text-primary/60">Approach · Physiofit Studio</p>
      </div>

      {/* invisible slot — sets the arch size per breakpoint */}
      <div className="pointer-events-none absolute inset-x-0 top-[27svh] flex justify-center lg:top-[29svh]">
        <div data-arch-slot className="aspect-[4/5] h-[56svh] max-w-[84vw] lg:aspect-[5/6] lg:h-[62svh]" />
      </div>

      {/* the photo — clipped to the arch, opens to full screen */}
      <div data-arch className="absolute inset-0 overflow-hidden" style={{ clipPath: "inset(30% 35% 10% 35% round 999px 999px 0 0)" }}>
        <div data-arch-zoom className="absolute inset-0 will-change-transform">
          <Image
            src="/images/services/studio-rehab.jpg"
            alt="Therapist guiding a resistance-band rehab exercise"
            fill
            sizes="100vw"
            className="-scale-x-100 object-cover object-[30%_50%]"
          />
        </div>

        {/* shade for legibility — from the left on desktop, from the bottom on phones */}
        <div data-arch-shade className="invisible absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/85 to-secondary/20 lg:bg-gradient-to-r lg:from-secondary lg:via-secondary/80 lg:to-transparent" />
        </div>
      </div>

      {/* steps panel */}
      <div className="absolute inset-0 z-20 flex items-end px-[var(--gutter)] pb-[6svh] lg:items-center lg:pb-0 lg:pt-16">
        <div className="w-full max-w-[38rem]">
          <p data-ap-fade className="eyebrow invisible mb-4 text-primary/70 lg:mb-6">
            Approach
          </p>
          <h2 id="approach-title" className="font-display text-[clamp(2rem,4.2vw,4rem)] font-medium leading-[1.02] tracking-[-0.035em]">
            <span className="mask-line"><span data-ap-line className="block">Slow diagnosis.</span></span>
            <span className="mask-line"><span data-ap-line className="block font-light text-primary/70">Precise treatment.</span></span>
          </h2>

          <ol className="mt-7 grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-x-8 lg:mt-12 lg:gap-y-8">
            {STEPS.map((s) => (
              <li key={s.title} data-ap-step className="invisible border-t border-primary/25 pt-3 lg:pt-4">
                <h3 className="font-display text-lg font-medium tracking-[-0.02em] lg:text-2xl">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-primary/70 sm:text-sm lg:mt-2">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* rotating badge (desktop) */}
      <div
        data-ap-badge
        className="invisible absolute bottom-[8svh] right-[var(--gutter)] z-20 hidden size-32 rounded-full bg-secondary/40 p-2 text-primary ring-1 ring-primary/30 backdrop-blur-sm lg:block xl:size-36"
      >
        <div data-ap-spin className="size-full">
          <Badge />
        </div>
        <span className="absolute inset-0 grid place-items-center">
          <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden>
            <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </section>
  );
}
