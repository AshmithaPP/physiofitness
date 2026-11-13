"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Wordmark from "./Wordmark";
import Magnetic from "./Magnetic";

/* --------------------------------------------------------------------------
   Content
   -------------------------------------------------------------------------- */

const STATS = [
  { value: "1.5k+", label: "Sessions" },
  { value: "98%", label: "Recovery rate" },
  { value: "12+", label: "Years combined" },
];

const STEPS = [
  {
    key: "Assess",
    lines: ["First,", "a slow diagnosis."],
    body: "A full-body screen of posture, movement, pain triggers and history — before treatment ever begins.",
    img: "/images/hero/hero.jpg",
    alt: "Physiofit therapists at work",
    pos: "object-[50%_68%]",
  },
  {
    key: "Plan",
    lines: ["Then,", "a clear roadmap."],
    body: "A milestone-driven plan built around your recovery timeline, so you always know what comes next.",
    img: "/images/hero/plan.jpg",
    alt: "Guided rehabilitation exercise session",
    pos: "object-center",
  },
  {
    key: "Treat",
    lines: ["Hands-on,", "and precise."],
    body: "Manual therapy, guided exercise, dry needling and modalities — used only as your body needs them.",
    img: "/images/hero/treat.jpg",
    alt: "Cupping therapy on a patient's back",
    pos: "object-center",
  },
  {
    key: "Sustain",
    lines: ["Strong,", "and staying that way."],
    body: "Home programmes, education and periodic check-ins that keep the progress yours for good.",
    img: "/images/hero/sustain.jpg",
    alt: "Strength training in the studio",
    pos: "object-center",
  },
];

const pad = (n) => String(n).padStart(2, "0");

/** Layout box of `el` relative to `stage`, ignoring CSS transforms. */
function boxIn(el, stage) {
  let x = 0;
  let y = 0;
  let n = el;
  while (n && n !== stage) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/* --------------------------------------------------------------------------
   Stage
   One pinned, scroll-scrubbed scene:
     intro  — full-screen gym photo, logo centred
     walk   — camera pushes down the gym aisle (layered parallax + edge blur)
     hero   — logo flies to the navbar, green opens from the aisle, photo grows in
     steps  — photo flies to the right, four-step method plays inside it
   -------------------------------------------------------------------------- */

export default function StoryStage({ ready }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      const stage = root.current;
      const q = gsap.utils.selector(stage);
      const reduced = prefersReducedMotion();

      const photo = q("[data-photo]")[0];
      const logo = q("[data-fly-logo]")[0];
      const heroSlot = q("[data-slot-hero]")[0];
      const stepsSlot = q("[data-slot-steps]")[0];
      const navLogo = document.querySelector("[data-nav-logo]");
      const navItems = document.querySelectorAll("[data-nav-item]");
      const navBar = document.querySelector("[data-navbar]");

      const heroBox = () => boxIn(heroSlot, stage);
      const stepsBox = () => boxIn(stepsSlot, stage);
      const logoFit = () => {
        const b = boxIn(logo, stage);
        const t = navLogo.getBoundingClientRect(); // stage == viewport while pinned
        return {
          x: t.left + t.width / 2 - (b.x + b.w / 2),
          y: t.top + t.height / 2 - (b.y + b.h / 2),
          scale: t.width / b.w,
        };
      };

      /* ---------- walk-in: the gym photo's vanishing point on screen ----------
         The aisle (rack + ceiling lights) converges at VP_U/VP_V of the photo.
         The photo is object-cover with object-position VP_U, so that point can
         be mapped to stage pixels for any screen shape. */
      const VP_U = 0.63;
      const VP_V = 0.45;
      const IMG_W = 1400;
      const IMG_H = 933;
      const vp = () => {
        const sw = stage.clientWidth;
        const sh = stage.clientHeight;
        const k = Math.max(sw / IMG_W, sh / IMG_H);
        const dw = IMG_W * k;
        const dh = IMG_H * k;
        const x = (sw - dw) * VP_U + VP_U * dw;
        const y = (sh - dh) * 0.5 + VP_V * dh;
        return { x, y, r: Math.hypot(Math.max(x, sw - x), Math.max(y, sh - y)) + 2 };
      };
      const origin = () => `${vp().x}px ${vp().y}px`;
      const setVpVars = () => {
        const v = vp();
        stage.style.setProperty("--vpx", `${v.x}px`);
        stage.style.setProperty("--vpy", `${v.y}px`);
      };
      setVpVars();

      /* ---------- one-off entrance on load (intro only) ---------- */
      const logoChars = SplitText.create(q("[data-fly-logo] [data-wm]"), {
        type: "chars",
        mask: "chars",
        charsClass: "inline-block will-change-transform",
      });

      if (!reduced) {
        gsap.timeline({ defaults: { ease: "expo.out" } })
          .fromTo(q("[data-intro-bg-inner]"), { scale: 1.22 }, { scale: 1, duration: 3.2, ease: "power2.out" }, 0)
          .fromTo(logoChars.chars, { yPercent: 115 }, { yPercent: 0, duration: 1.4, stagger: 0.045 }, 0.25)
          .fromTo(q("[data-intro-in]"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12 }, 0.7);
      }

      /* ---------- static initial states for steps 2–4 ---------- */
      STEPS.forEach((_, i) => {
        if (i === 0) return;
        gsap.set(q(`[data-step="${i}"] [data-tline]`), { yPercent: 130 });
        gsap.set(q(`[data-body="${i}"]`), { autoAlpha: 0, y: 24 });
        gsap.set(q(`[data-img="${i}"]`), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(q(`[data-img="${i}"] [data-img-inner]`), { scale: 1.3 });
      });
      gsap.set(q("[data-label]"), { opacity: 0.4 });
      gsap.set(q('[data-label="0"]'), { opacity: 1 });

      /* ---------- master scroll timeline ---------- */
      const W = 0.8; // extra timeline (most of a screen of scroll) for the walk-in
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * (6.5 + W)}`,
          pin: true,
          scrub: reduced ? true : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labelsDirectional",
            duration: { min: 0.3, max: 0.9 },
            delay: 0.1,
            ease: "power2.inOut",
          },
          onRefresh: setVpVars,
          onLeave: () => navBar?.classList.add("is-scrolled"),
          onEnterBack: () => navBar?.classList.remove("is-scrolled"),
        },
      });

      // photo parked on the hero slot from the start
      tl.set(photo, {
        left: () => heroBox().x,
        top: () => heroBox().y,
        width: () => heroBox().w,
        height: () => heroBox().h,
        borderRadius: () => `${heroBox().w / 2}px ${heroBox().w / 2}px 28px 28px`,
      }, 0)
        .set(navLogo, { autoAlpha: 0 }, 0)
        .set(logo, { autoAlpha: 1 }, 0)
        .addLabel("intro", 0);

      /* A0 — walk into the gym: the camera pushes down the aisle toward the
         vanishing point, the rack slides past, lights pass overhead, edges blur,
         then the green opens as a circle from the end of the aisle. */
      tl.to(q("[data-intro-fade]"), {
        autoAlpha: 0,
        scale: 1.5,
        y: (i) => [-70, 70, 110][i] ?? 0,
        duration: 0.45,
        stagger: 0.03,
        ease: "power2.in",
      }, 0);
      if (!reduced) {
        tl.fromTo(q("[data-intro-bg]"), { scale: 1, transformOrigin: origin }, { scale: 2.6, transformOrigin: origin, duration: W + 0.3, ease: "power2.in" }, 0)
          .fromTo(q("[data-walk-fg]"), { scale: 1, xPercent: 0, transformOrigin: origin }, { scale: 1.55, xPercent: -14, transformOrigin: origin, duration: W + 0.25, ease: "power2.in" }, 0)
          .fromTo(q("[data-walk-ceil]"), { scale: 1, yPercent: 0, transformOrigin: origin }, { scale: 1.3, yPercent: -12, transformOrigin: origin, duration: W + 0.25, ease: "power2.in" }, 0)
          .fromTo(q("[data-walk-blur]"), { opacity: 0 }, { opacity: 1, duration: W, ease: "power1.in" }, 0.2)
          .fromTo(q("[data-walk-tint]"), { opacity: 1 }, { opacity: 0.4, duration: W, ease: "none" }, 0);
      }
      tl.fromTo(
        q("[data-curtain]"),
        { clipPath: () => { const v = vp(); return `circle(0px at ${v.x}px ${v.y}px)`; } },
        { clipPath: () => { const v = vp(); return `circle(${v.r}px at ${v.x}px ${v.y}px)`; }, duration: 0.7, ease: "power2.in" },
        W - 0.35
      );

      /* A — intro → hero (shifted by W so the walk-in plays first) */
      tl.fromTo(
          logo,
          { x: 0, y: 0, scale: 1 },
          { x: () => logoFit().x, y: () => logoFit().y, scale: () => logoFit().scale, duration: 0.9 },
          W
        )
        .set(logo, { autoAlpha: 0 }, W + 0.9)
        .set(navLogo, { autoAlpha: 1 }, W + 0.9)
        .fromTo(navItems, { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, W + 0.75)
        .fromTo(photo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "none" }, W + 0.45)
        .fromTo(q("[data-hero-col]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, ease: "none" }, W + 0.7)
        .fromTo(q("[data-photo-clip]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65 }, W + 0.45)
        .fromTo(q("[data-photo-zoom]"), { scale: 1.4 }, { scale: 1, duration: 0.9, ease: "expo.out" }, W + 0.45)
        .fromTo(q("[data-booking]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, W + 0.95)
        .fromTo(q("[data-hero-line]"), { yPercent: 108 }, { yPercent: 0, duration: 0.5, stagger: 0.06, ease: "expo.out" }, W + 0.7)
        .fromTo(q("[data-hero-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" }, W + 0.8);

      tl.addLabel("hero", W + 1.3);

      /* B — hero → steps: the photo travels to the right */
      const B = W + 1.6;
      tl.to(q("[data-hero-col]"), { y: -50, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "power2.in" }, B)
        .to(q("[data-booking]"), { autoAlpha: 0, y: 16, duration: 0.25 }, B)
        .fromTo(
          photo,
          {
            left: () => heroBox().x,
            top: () => heroBox().y,
            width: () => heroBox().w,
            height: () => heroBox().h,
            borderRadius: () => `${heroBox().w / 2}px ${heroBox().w / 2}px 28px 28px`,
          },
          {
            left: () => stepsBox().x,
            top: () => stepsBox().y,
            width: () => stepsBox().w,
            height: () => stepsBox().h,
            borderRadius: "36px 36px 36px 36px",
            duration: 1,
          },
          B + 0.1
        )
        .fromTo(q("[data-chips]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, B + 0.9)
        .fromTo(q("[data-steps-in]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }, B + 0.6)
        .fromTo(q('[data-step="0"] [data-tline]'), { yPercent: 130 }, { yPercent: 0, duration: 0.5, stagger: 0.07, ease: "expo.out" }, B + 0.7)
        .fromTo(q('[data-body="0"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, B + 0.8);

      const S0 = B + 1.3;
      tl.addLabel("s0", S0);

      /* C — steps 2–4 inside the same photo frame */
      const n = STEPS.length;
      const end = S0 + (n - 1) + 0.5;

      tl.fromTo(q("[data-fill]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: end - S0 }, S0)
        .fromTo(q("[data-knob]"), { left: "0%" }, { left: "100%", ease: "none", duration: end - S0 }, S0);

      for (let i = 1; i < n; i++) {
        const at = S0 + (i - 1) + 0.35;
        const prev = i - 1;
        tl.to(q(`[data-step="${prev}"] [data-tline]`), { yPercent: -130, duration: 0.45, stagger: 0.05 }, at)
          .to(q(`[data-step="${i}"] [data-tline]`), { yPercent: 0, duration: 0.55, stagger: 0.07 }, at + 0.2)
          .to(q(`[data-body="${prev}"]`), { autoAlpha: 0, y: -20, duration: 0.35 }, at)
          .to(q(`[data-body="${i}"]`), { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.3)
          .to(q(`[data-img="${i}"]`), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 }, at)
          .to(q(`[data-img="${i}"] [data-img-inner]`), { scale: 1, duration: 0.8 }, at)
          .to(q(`[data-img="${prev}"] [data-img-inner]`), { scale: 1.15, yPercent: -6, duration: 0.8 }, at)
          .to(q("[data-counter]"), { yPercent: (-100 / n) * i, duration: 0.5 }, at + 0.1)
          .to(q(`[data-label="${prev}"]`), { opacity: 0.4, duration: 0.3 }, at + 0.2)
          .to(q(`[data-label="${i}"]`), { opacity: 1, duration: 0.3 }, at + 0.2);
        if (!reduced) {
          tl.to(photo, { keyframes: { rotate: [0, -3, 0], scale: [1, 0.96, 1] }, duration: 0.8, ease: "power2.inOut" }, at);
        }
        tl.addLabel(`s${i}`, at + 0.85);
      }
      tl.to({}, { duration: 0.2 }, end);

      // initial states are in place — reveal the layers
      gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      aria-label="Physiofit Studio"
      className="relative z-10 h-svh w-full overflow-hidden bg-secondary text-primary"
    >
      {/* ================= INTRO: gym photo ================= */}
      <div data-intro-bg aria-hidden className="absolute inset-0 z-0 will-change-transform">
        <div data-intro-bg-inner className="absolute inset-0 will-change-transform">
          <Image
            src="/images/hero/sustain.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[63%_50%]"
          />
          {/* walk-in depth layers: copies of the same photo, so at rest they
              line up exactly with the base and are invisible */}
          <div
            data-walk-blur
            className="absolute inset-0 opacity-0 blur-[10px] max-sm:blur-[6px]"
            style={{
              maskImage: "radial-gradient(circle at var(--vpx, 63%) var(--vpy, 45%), transparent 16%, black 58%)",
              WebkitMaskImage: "radial-gradient(circle at var(--vpx, 63%) var(--vpy, 45%), transparent 16%, black 58%)",
            }}
          >
            <Image src="/images/hero/sustain.jpg" alt="" fill sizes="100vw" className="object-cover object-[63%_50%]" />
          </div>
          <div
            data-walk-ceil
            className="absolute inset-0 hidden will-change-transform sm:block"
            style={{
              maskImage: "linear-gradient(to bottom, black 0%, black 12%, transparent 26%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 12%, transparent 26%)",
            }}
          >
            <Image src="/images/hero/sustain.jpg" alt="" fill sizes="100vw" className="object-cover object-[63%_50%]" />
          </div>
          <div
            data-walk-fg
            className="absolute inset-0 will-change-transform"
            style={{
              maskImage: "linear-gradient(100deg, black 34%, transparent 56%)",
              WebkitMaskImage: "linear-gradient(100deg, black 34%, transparent 56%)",
            }}
          >
            <Image src="/images/hero/sustain.jpg" alt="" fill sizes="100vw" className="object-cover object-[63%_50%]" />
          </div>
        </div>
        {/* brand tint keeps the photo in the green palette, easing off as you walk in */}
        <div data-walk-tint className="absolute inset-0">
          <div className="absolute inset-0 bg-secondary/55 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/10 to-secondary/80" />
        </div>
      </div>

      {/* plain green hero background: opens as a circle from the end of the aisle */}
      <div
        data-curtain
        aria-hidden
        className="absolute inset-0 z-10 bg-secondary"
        style={{ clipPath: "circle(0px at 63% 45%)" }}
      />

      {/* ================= HERO ================= */}
      <div data-reveal className="pointer-events-none absolute inset-0 z-30">
        {/* copy on the left, photo on the right (photo first, on top, on phones) */}
        <div className="mx-auto flex h-full max-w-[110rem] flex-col gap-[3svh] px-[var(--gutter)] pb-[4svh] pt-[calc(4.5rem+3svh)] md:flex-row md:items-center md:gap-[5vw] md:pb-0 md:pt-20">
          {/* landing box for the travelling photo */}
          <div className="order-1 flex shrink-0 justify-center md:order-2 md:flex-1 md:justify-end">
            <div
              data-slot-hero
              className="aspect-[3/4] h-[clamp(9rem,25svh,15rem)] md:h-[min(60svh,40vw)] lg:h-[min(68svh,40vw)]"
            />
          </div>

          <div
            data-hero-col
            className="pointer-events-auto order-2 flex min-h-0 flex-col md:order-1 md:w-[min(48rem,56%)]"
          >
            <p data-hero-fade className="eyebrow flex items-center gap-3 text-[0.625rem] text-primary/70">
              <span className="h-px w-8 bg-current" />
              Physiofit Studio · Chennai
            </p>

            <h1 className="mt-3 font-display text-[clamp(1.9rem,min(4.6vw,8svh),4.75rem)] font-medium leading-[1.04] tracking-[-0.035em] md:mt-5">
              <span className="mask-line"><span data-hero-line className="block">Restore your health,</span></span>
              <span className="mask-line"><span data-hero-line className="block font-light text-primary/65">rebuild your strength,</span></span>
              <span className="mask-line"><span data-hero-line className="block">renew your life.</span></span>
            </h1>

            <p
              data-hero-fade
              className="mt-3 max-w-[34rem] text-sm leading-relaxed text-primary/70 md:mt-5 md:text-base lg:text-lead [@media(max-height:700px)]:hidden"
            >
              A modern clinical studio in T. Nagar combining physiotherapy, targeted rehab, functional
              fitness and restorative foot spa — all under one roof.
            </p>

            <div data-hero-fade className="mt-5 flex flex-wrap items-center gap-3 md:mt-7">
              <Magnetic>
                <Link href="/book" className="btn btn-light h-11 px-5 text-sm md:h-12 md:px-6">
                  Book an appointment
                  <span aria-hidden className="text-base leading-none">↗</span>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/services"
                  className="btn h-11 border border-line-inverse px-5 text-sm text-primary before:bg-primary hover:text-secondary md:h-12 md:px-6"
                >
                  Explore services
                </Link>
              </Magnetic>
            </div>

            <dl data-hero-fade className="mt-6 grid max-w-[30rem] grid-cols-3 gap-4 border-t border-line-inverse pt-4 md:mt-9 md:pt-6">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="eyebrow mt-1.5 text-[0.55rem] text-primary/60 md:mt-2 md:text-[0.6rem]">{s.label}</dt>
                  <dd className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.03em]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ================= TRAVELLING PHOTO ================= */}
      <div
        data-photo
        className="invisible absolute z-40 overflow-hidden shadow-[0_40px_90px_-30px] shadow-black/40 will-change-transform"
      >
        <div data-photo-clip className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <div data-photo-zoom className="absolute inset-0">
            {STEPS.map((s, i) => (
              <div key={s.key} data-img={i} className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                <div data-img-inner className="absolute inset-0 will-change-transform">
                  <Image
                    src={s.img}
                    alt={s.alt}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className={`object-cover ${s.pos}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />

          {/* step chips (steps scene) */}
          <div data-chips className="absolute bottom-5 right-5 z-20 lg:bottom-7 lg:right-7">
            <span className="eyebrow block h-[2.1rem] overflow-hidden rounded-full border border-primary/30 bg-secondary/45 px-3 text-[0.58rem] leading-[2.1rem] backdrop-blur-md">
              <span data-counter className="block">
                {STEPS.map((s, i) => (
                  <span key={s.key} className="block h-[2.1rem]">{pad(i + 1)} · {s.key}</span>
                ))}
              </span>
            </span>
          </div>

          {/* booking pill (hero scene) */}
          <div
            data-booking
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-secondary shadow-lg"
          >
            <span className="relative flex size-1.5">
              <span className="animate-pulse-ring absolute inset-0 rounded-full bg-secondary" />
              <span className="relative size-1.5 rounded-full bg-secondary" />
            </span>
            Now booking
          </div>
        </div>
      </div>

      {/* ================= STEPS ================= */}
      <div data-reveal className="pointer-events-none absolute inset-0 z-50">
        <div className="mx-auto grid h-full max-w-[110rem] grid-rows-[auto_1fr] gap-6 px-[var(--gutter)] pb-8 pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-1 lg:items-center lg:gap-16 lg:pb-0 lg:pt-20">
          {/* copy */}
          <div className="order-2 flex flex-col lg:order-1">
            <p data-steps-in className="eyebrow mb-6 flex items-center gap-3 text-primary/70 lg:mb-10">
              <span className="h-px w-8 bg-current" />
              The Physiofit method
            </p>

            <div className="grid">
              {STEPS.map((s, i) => (
                <h2 key={s.key} data-step={i} className="serif text-h2 [grid-area:1/1]">
                  <span className="mask-line">
                    <span data-tline className="block">{s.lines[0]}</span>
                  </span>
                  <span className="mask-line">
                    <span data-tline className="italic-accent block">{s.lines[1]}</span>
                  </span>
                </h2>
              ))}
            </div>

            <div className="mt-5 grid max-w-md lg:mt-7">
              {STEPS.map((s, i) => (
                <p key={s.key} data-body={i} className="invisible text-lead text-primary/75 [grid-area:1/1]">
                  {s.body}
                </p>
              ))}
            </div>

            <div data-steps-in className="mt-8 w-full max-w-md lg:mt-12">
              <div className="relative h-6">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/20" />
                <div data-fill className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-primary" />
                <span
                  data-knob
                  aria-hidden
                  className="absolute left-0 top-1/2 h-4 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_6px] shadow-primary/15"
                />
              </div>
              <ol className="mt-3 flex justify-between">
                {STEPS.map((s, i) => (
                  <li key={s.key} data-label={i} className="eyebrow text-[0.58rem]">
                    {s.key}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* landing box for the photo */}
          <div className="relative order-1 flex min-h-0 items-center justify-center lg:order-2 lg:h-full">
            <div data-slot-steps className="relative aspect-[4/3] h-[30svh] max-w-full lg:aspect-[5/6] lg:h-[72svh]" />
          </div>
        </div>
      </div>

      {/* ================= INTRO: centred logo ================= */}
      <div data-reveal className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center">
        <p data-intro-fade className="mb-6 md:mb-8">
          <span data-intro-in className="eyebrow block text-primary/85">Physiotherapy · Rehab · Fitness</span>
        </p>
        <div data-fly-logo className="origin-center will-change-transform">
          <Wordmark className="text-[clamp(3.5rem,12vw,10.5rem)]" />
        </div>
        <p data-intro-fade className="mt-6 md:mt-8">
          <span data-intro-in className="block text-base text-primary/80 md:text-lg">
            Restore · Rebuild · Renew
          </span>
        </p>

        <div data-intro-fade className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 md:bottom-10">
          <span data-intro-in className="eyebrow block text-[0.6rem] text-primary/80">Scroll to explore</span>
          <span data-intro-in className="relative block h-12 w-px overflow-hidden bg-primary/25">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-primary" />
          </span>
        </div>
      </div>
    </section>
  );
}
