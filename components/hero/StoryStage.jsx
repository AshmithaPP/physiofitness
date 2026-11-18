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
     then the page scrolls for real: the photo flies down into the next
     section ("The Physiofit method"), which holds while its four steps play
   -------------------------------------------------------------------------- */

export default function StoryStage({ ready }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready) return;
      const wrap = root.current;
      const stage = wrap.querySelector("[data-story]");
      const method = wrap.querySelector("[data-method]");
      const q = gsap.utils.selector(wrap);
      const reduced = prefersReducedMotion();

      const photo = q("[data-photo]")[0];
      const logo = q("[data-fly-logo]")[0];
      const heroSlot = q("[data-slot-hero]")[0];
      const navLogo = document.querySelector("[data-nav-logo]");
      const navItems = document.querySelectorAll("[data-nav-item]");
      const navBar = document.querySelector("[data-navbar]");

      const heroBox = () => boxIn(heroSlot, stage);
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
        const diag = Math.hypot(sw, sh);
        return { x, y, r: Math.max(Math.hypot(Math.max(x, sw - x), Math.max(y, sh - y)) + 80, diag * 1.4) };
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
          .fromTo(q("[data-fly-logo] [data-wm-mark]"), { scale: 0.4, rotate: -25, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.4, ease: "back.out(1.6)" }, 0.15)
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

      const setPinSpacerBg = () => {
        if (stage.parentElement?.classList.contains("pin-spacer")) {
          stage.parentElement.style.backgroundColor = "var(--brand-secondary)";
        }
      };
      setPinSpacerBg();

      /* ---------- master scroll timeline ---------- */
      const W = 0.8; // extra timeline (most of a screen of scroll) for the walk-in
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${window.innerHeight * (W + 1.7)}`,
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
          onRefresh: (self) => {
            setVpVars();
            setPinSpacerBg();
            // next frame: the timeline may still be under construction during the first refresh
            requestAnimationFrame(() => syncNav(self));
          },
          // always white once the story is behind us, whatever the timeline is doing
          onLeave: () => navBar?.classList.add("is-scrolled"),
        },
        // the navbar turns into the white pill the moment the intro logo lands
        // in it — the same bar every other page shows
        onUpdate: () => syncNav(tl.scrollTrigger),
      });

      function syncNav(st) {
        const landed = tl.time() >= W + 0.9 || (st && st.progress >= 0.999);
        navBar?.classList.toggle("is-scrolled", landed);
      }

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
          .fromTo(q("[data-walk-tint]"), { opacity: 1 }, { opacity: 0.4, duration: W, ease: "none" }, 0);
      }
      tl.fromTo(
        q("[data-curtain]"),
        { clipPath: () => { const v = vp(); return `circle(0px at ${v.x}px ${v.y}px)`; } },
        { clipPath: () => { const v = vp(); return `circle(${v.r}px at ${v.x}px ${v.y}px)`; }, duration: 0.7, ease: "power2.in" },
        W - 0.35
      )
        .set(q("[data-curtain]"), { clipPath: "none" }, W + 0.35)
        .set(q("[data-intro-bg]"), { autoAlpha: 0 }, W + 0.35);

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

      // the hero rests a moment, then the story pin releases into a real scroll
      tl.to({}, { duration: 0.4 }, W + 1.3);

      /* B — hero → method: the page genuinely scrolls to the next section while
         a floating copy of the photo glides from the hero slot into the method
         frame. Both ends are measured live, so the hand-off is seamless. */
      const heroHandoff = q("[data-photo-handoff]")[0];
      const flyer = q("[data-flyer]")[0];
      const methodPhoto = q("[data-method-photo]")[0];
      const flyEase = gsap.parseEase("power2.inOut");
      const lerp = (a, b, t) => a + (b - a) * t;

      const placeFlyer = (p) => {
        if (p <= 0.001 || p >= 0.999) {
          heroHandoff.style.opacity = p <= 0.001 ? "1" : "0";
          methodPhoto.style.opacity = p >= 0.999 ? "1" : "0";
          flyer.style.visibility = "hidden";
          return;
        }
        const a = heroSlot.getBoundingClientRect();
        const b = methodPhoto.getBoundingClientRect();
        const t = flyEase(p);
        const top = lerp(a.width / 2, 36, t);
        const bottom = lerp(28, 36, t);
        Object.assign(flyer.style, {
          visibility: "visible",
          left: `${lerp(a.left, b.left, t)}px`,
          top: `${lerp(a.top, b.top, t)}px`,
          width: `${lerp(a.width, b.width, t)}px`,
          height: `${lerp(a.height, b.height, t)}px`,
          borderRadius: `${top}px ${top}px ${bottom}px ${bottom}px`,
        });
        heroHandoff.style.opacity = "0";
        methodPhoto.style.opacity = "0";
      };

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: method,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => placeFlyer(self.progress),
            onRefresh: (self) => placeFlyer(self.progress),
          },
        })
        .fromTo(q("[data-steps-in]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.05 }, 0.55)
        .fromTo(q('[data-step="0"] [data-tline]'), { yPercent: 130 }, { yPercent: 0, duration: 0.35, stagger: 0.06, ease: "expo.out" }, 0.6)
        .fromTo(q('[data-body="0"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7)
        .fromTo(q("[data-chips]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.8)
        .to({}, { duration: 0.01 }, 0.99);

      /* C — the method section holds while the four steps play in its frame */
      const n = STEPS.length;
      const end = n - 1 + 0.5;
      const steps = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: {
          trigger: method,
          start: "top top",
          end: () => `+=${window.innerHeight * (end + 0.2)}`,
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
        },
      });
      steps.addLabel("s0", 0);

      steps
        .fromTo(q("[data-fill]"), { scaleX: 0 }, { scaleX: 1, ease: "none", duration: end }, 0)
        .fromTo(q("[data-knob]"), { left: "0%" }, { left: "100%", ease: "none", duration: end }, 0);

      for (let i = 1; i < n; i++) {
        const at = i - 1 + 0.35;
        const prev = i - 1;
        steps
          .to(q(`[data-step="${prev}"] [data-tline]`), { yPercent: -130, duration: 0.45, stagger: 0.05 }, at)
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
          steps.to(q("[data-method-tilt]"), { keyframes: { rotate: [0, -3, 0], scale: [1, 0.96, 1] }, duration: 0.8, ease: "power2.inOut" }, at);
        }
        steps.addLabel(`s${i}`, at + 0.85);
      }
      steps.to({}, { duration: 0.2 }, end);

      // initial states are in place — reveal the layers
      gsap.set(q("[data-reveal]"), { autoAlpha: 1 });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div ref={root}>
    <section
      data-story
      aria-label="Physiofit Studio"
      data-stage-secondary
      className="relative z-10 h-dvh min-h-[100dvh] w-full overflow-hidden bg-secondary text-primary"
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
        <div className="mx-auto flex h-full max-w-[110rem] flex-col items-center justify-center gap-3.5 px-[var(--gutter)] pb-6 pt-16 sm:gap-[2.5svh] sm:pb-[4svh] sm:pt-[calc(4.5rem+2svh)] md:flex-row md:items-center md:justify-between md:gap-[5vw] md:pb-0 md:pt-20">
          {/* landing box for the travelling photo */}
          <div className="order-1 flex shrink-0 justify-center md:order-2 md:flex-1 md:justify-end">
            <div
              data-slot-hero
              className="aspect-[3/4] h-[clamp(9rem,23svh,14.5rem)] sm:h-[clamp(10rem,28svh,18rem)] md:h-[min(68svh,44vw)] lg:h-[min(76svh,46vw)]"
            />
          </div>

          <div
            data-hero-col
            className="pointer-events-auto order-2 flex min-h-0 flex-col items-center text-center md:items-start md:text-left md:order-1 md:w-[min(48rem,55%)]"
          >
            <h1 className="font-display text-[clamp(1.6rem,min(5vw,6.8svh),4.25rem)] font-medium leading-[1.05] tracking-[-0.035em] md:mt-2">
              <span className="mask-line"><span data-hero-line className="block">Restore your health,</span></span>
              <span className="mask-line"><span data-hero-line className="block font-light text-primary/65">rebuild your strength,</span></span>
              <span className="mask-line"><span data-hero-line className="block">renew your life.</span></span>
            </h1>

            <p
              data-hero-fade
              className="mt-2.5 max-w-[32rem] text-xs leading-relaxed text-primary/75 sm:mt-3 sm:text-sm md:mt-4 md:text-base lg:text-lead [@media(max-height:700px)]:hidden"
            >
              A modern clinical studio in T. Nagar combining physiotherapy, targeted rehab, functional
              fitness and restorative foot spa — all under one roof.
            </p>

            <div data-hero-fade className="mt-3.5 flex w-full max-w-xs flex-col gap-2 sm:max-w-none sm:flex-row sm:items-center sm:justify-center md:justify-start md:gap-3.5 md:mt-6">
              <Magnetic>
                <Link href="/book" className="btn btn-light h-11 w-full px-5 text-sm font-medium sm:h-12 sm:w-auto sm:px-6 md:h-13 md:px-7 md:text-base">
                  Book an appointment
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/services"
                  className="btn h-11 w-full border border-line-inverse px-5 text-sm font-medium text-primary before:bg-primary hover:text-secondary sm:h-12 sm:w-auto sm:px-6 md:h-13 md:px-7 md:text-base"
                >
                  Explore services
                </Link>
              </Magnetic>
            </div>

            <dl data-hero-fade className="mt-4 grid w-full max-w-xs grid-cols-3 gap-2 border-t border-line-inverse pt-3 sm:max-w-sm sm:gap-4 sm:pt-4 md:max-w-[30rem] md:mt-7 md:pt-5">
              {STATS.map((s) => (
                <div key={s.label} className="flex flex-col-reverse text-center md:text-left">
                  <dt className="eyebrow mt-1 text-[0.48rem] whitespace-nowrap text-primary/60 sm:text-[0.55rem] md:mt-1.5 md:text-[0.6rem]">{s.label}</dt>
                  <dd className="font-display text-[clamp(1.2rem,4vw,2.15rem)] font-medium leading-none tracking-[-0.03em]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ================= HERO PHOTO ================= */}
      <div data-photo className="invisible absolute z-40 will-change-transform">
        {/* fades out while the floating copy carries the photo to the next section */}
        <div data-photo-handoff className="absolute inset-0 rounded-[inherit] shadow-[0_40px_90px_-30px] shadow-ink/40">
          <div data-photo-clip className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div data-photo-zoom className="absolute inset-0">
              <Image
                src={STEPS[0].img}
                alt={STEPS[0].alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className={`object-cover ${STEPS[0].pos}`}
              />
            </div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />

            {/* booking pill */}
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
      </div>

      {/* ================= INTRO: centred logo ================= */}
      <div data-reveal className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center px-6 text-center select-text selection:bg-primary selection:text-secondary">
        <p data-intro-fade className="pointer-events-auto mb-4 cursor-text select-text md:mb-5">
          <span data-intro-in className="eyebrow block text-[0.625rem] text-primary/85 sm:text-xs">Physiotherapy · Rehab · Fitness</span>
        </p>
        <div data-fly-logo className="pointer-events-auto origin-center cursor-text select-text will-change-transform">
          <Wordmark priority className="text-[clamp(1.9rem,6vw,4.75rem)]" />
        </div>
        <p data-intro-fade className="pointer-events-auto mt-4 cursor-text select-text md:mt-5">
          <span data-intro-in className="block text-sm font-light text-primary/80 sm:text-base">
            Restore · Rebuild · Renew
          </span>
        </p>

        <div data-intro-fade className="pointer-events-auto absolute inset-x-0 bottom-6 flex cursor-text flex-col items-center gap-2.5 select-text md:bottom-8">
          <span data-intro-in className="eyebrow block text-[0.55rem] text-primary/80 sm:text-[0.6rem]">Scroll to explore</span>
          <span data-intro-in className="relative block h-10 w-px overflow-hidden bg-primary/25 sm:h-12">
            <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-primary" />
          </span>
        </div>
      </div>
    </section>

      {/* ================= THE PHYSIOFIT METHOD (its own section) ================= */}
      <section
        data-method
        data-stage-secondary
        aria-label="The Physiofit method"
        className="relative z-10 h-dvh min-h-[100dvh] w-full overflow-hidden bg-secondary text-primary"
      >
        <div data-reveal className="absolute inset-0">
          <div className="mx-auto grid h-full max-w-[110rem] grid-rows-[auto_1fr] gap-4 px-[var(--gutter)] pb-6 pt-20 sm:gap-6 sm:pb-8 sm:pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:grid-rows-1 lg:items-center lg:gap-16 lg:pb-0 lg:pt-20">
            {/* copy */}
            <div className="order-2 flex flex-col justify-center lg:order-1">
              <p data-steps-in className="eyebrow mb-2 sm:mb-4 text-primary/70 lg:mb-8">
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

              <div className="mt-3 grid max-w-md sm:mt-5 lg:mt-7">
                {STEPS.map((s, i) => (
                  <p key={s.key} data-body={i} className="invisible text-sm text-primary/75 sm:text-base lg:text-lead [grid-area:1/1]">
                    {s.body}
                  </p>
                ))}
              </div>

              <div data-steps-in className="mt-5 w-full max-w-sm sm:max-w-md sm:mt-8 lg:max-w-lg lg:mt-12">
                <div className="relative h-8">
                  <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary/25" />
                  <div data-fill className="absolute inset-x-0 top-1/2 h-0.5 origin-left -translate-y-1/2 rounded-full bg-primary" />
                  <span
                    data-knob
                    aria-hidden
                    className="absolute left-0 top-1/2 h-5 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_7px] shadow-primary/20 sm:h-5.5 sm:w-12"
                  />
                </div>
                <ol className="mt-3.5 flex justify-between">
                  {STEPS.map((s, i) => (
                    <li key={s.key} data-label={i} className="eyebrow text-[0.6875rem] font-medium tracking-[0.12em] sm:text-xs">
                      {s.key}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* the photo frame (the hero photo lands here) */}
            <div className="relative order-1 flex min-h-0 items-center justify-center lg:order-2 lg:h-full">
              <div className="relative aspect-[4/3] h-[24svh] max-w-full sm:h-[30svh] lg:aspect-[5/6] lg:h-[72svh]">
                <div data-method-tilt className="absolute inset-0 will-change-transform">
                  <div
                    data-method-photo
                    style={{ opacity: 0 }}
                    className="absolute inset-0 rounded-[36px] shadow-[0_40px_90px_-30px] shadow-ink/40"
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
                      {STEPS.map((s, i) => (
                        <div key={s.key} data-img={i} className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                          <div data-img-inner className="absolute inset-0 will-change-transform">
                            <Image
                              src={s.img}
                              alt={s.alt}
                              fill
                              sizes="(min-width: 1024px) 45vw, 90vw"
                              className={`object-cover ${s.pos}`}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />

                      {/* step counter chip */}
                      <div data-chips className="absolute bottom-5 right-5 z-20 lg:bottom-7 lg:right-7">
                        <span className="eyebrow block h-[2.1rem] overflow-hidden rounded-full border border-primary/30 bg-secondary/45 px-3 text-[0.58rem] leading-[2.1rem] backdrop-blur-md">
                          <span data-counter className="block">
                            {STEPS.map((s, i) => (
                              <span key={s.key} className="block h-[2.1rem]">{pad(i + 1)} · {s.key}</span>
                            ))}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLOATING PHOTO (hero → method hand-off) ================= */}
      <div
        data-flyer
        aria-hidden
        style={{ visibility: "hidden" }}
        className="pointer-events-none fixed z-30 overflow-hidden shadow-[0_40px_90px_-30px] shadow-ink/40 will-change-transform"
      >
        <Image src={STEPS[0].img} alt="" fill sizes="(min-width: 1024px) 45vw, 90vw" className={`object-cover ${STEPS[0].pos}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/55 via-transparent to-transparent" />
      </div>
    </div>
  );
}
