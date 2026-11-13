"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* --------------------------------------------------------------------------
   Visit — address, phone, hours + a live map.
   Scroll-in reveal: heading lines rise, details stagger in with their icons
   popping, the map wipes up from the bottom while settling from a zoom, and
   drifts gently (parallax) while the section is on screen.
   -------------------------------------------------------------------------- */

const ADDRESS = "New No. 128, N Usman Road, T. Nagar, Chennai - 600017";
const QUERY = encodeURIComponent("Physiofit Studio, New No. 128, N Usman Road, T. Nagar, Chennai 600017");
const EMBED = `https://www.google.com/maps?q=${QUERY}&z=16&output=embed`;
const OPEN = `https://www.google.com/maps/search/?api=1&query=${QUERY}`;
const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`;

const Icon = {
  pin: (
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
  ),
  phone: (
    <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
};

const DETAILS = [
  { icon: "pin", label: "Address", value: ADDRESS, href: OPEN, external: true },
  { icon: "phone", label: "Phone", value: "+91 7200831203", href: "tel:+917200831203" },
  { icon: "clock", label: "Hours", value: "Open 7 days a week", sub: "10:00 AM – 7:00 PM" },
];

export default function Visit({ ready = true }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root.current);

      gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: root.current, start: "top 72%", toggleActions: "play none none reverse" },
      })
        .fromTo(q("[data-v-fade]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1 }, 0)
        .fromTo(q("[data-v-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.08 }, 0.05)
        .fromTo(q("[data-v-row]"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 1, stagger: 0.1 }, 0.35)
        .fromTo(q("[data-v-icon]"), { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)" }, 0.45)
        .fromTo(
          q("[data-v-map]"),
          { clipPath: "inset(100% 0% 0% 0% round 24px)" },
          { clipPath: "inset(0% 0% 0% 0% round 24px)", duration: 1.4, ease: "expo.inOut" },
          0.15
        )
        .fromTo(q("[data-v-map-zoom]"), { scale: 1.2 }, { scale: 1, duration: 1.8 }, 0.15)
        .fromTo(q("[data-v-chip]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 1.1);

      // gentle drift while scrolling past
      gsap.fromTo(
        q("[data-v-map-wrap]"),
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section
      ref={root}
      aria-labelledby="visit-title"
      className="relative overflow-hidden bg-primary py-14 text-secondary md:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-[110rem] items-center gap-10 px-[var(--gutter)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* copy + details */}
        <div>
          <p data-v-fade className="eyebrow text-[0.625rem] text-secondary/60">
            Visit us
          </p>
          <h2
            id="visit-title"
            className="mt-4 font-display text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.035em]"
          >
            <span className="mask-line"><span data-v-line className="block">A walk-in</span></span>
            <span className="mask-line"><span data-v-line className="block font-light text-secondary/60">at T. Nagar.</span></span>
          </h2>
          <p data-v-fade className="mt-4 max-w-[34rem] text-base leading-relaxed text-secondary/70">
            Right in the heart of Chennai&apos;s shopping district, our studio is a calm, well-equipped space
            designed to feel more like a wellness retreat than a clinic.
          </p>

          <ul className="mt-8 flex flex-col gap-4 md:mt-9">
            {DETAILS.map((d) => {
              const body = (
                <>
                  <span className="eyebrow block text-[0.6rem] text-secondary/55">{d.label}</span>
                  <span className="mt-1 block text-base">{d.value}</span>
                  {d.sub && <span className="mt-0.5 block text-sm text-secondary/60">{d.sub}</span>}
                </>
              );
              return (
                <li key={d.label} data-v-row className="flex items-start gap-4">
                  <span
                    data-v-icon
                    className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-mist text-secondary"
                  >
                    <svg viewBox="0 0 24 24" className="size-[1.15rem] fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {Icon[d.icon]}
                    </svg>
                  </span>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group min-w-0 pt-0.5 transition-opacity duration-300 hover:opacity-70"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="min-w-0 pt-0.5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* map */}
        <div data-v-map-wrap className="relative">
          <div
            data-v-map
            className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-mist shadow-[0_40px_80px_-40px] shadow-secondary/40 sm:aspect-[16/9] lg:aspect-[16/11]"
          >
            <div data-v-map-zoom className="absolute inset-0">
              <iframe
                title="Map showing Physiofit Studio, N Usman Road, T. Nagar, Chennai"
                src={EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[35%] transition-[filter] duration-700 hover:grayscale-0"
              />
            </div>
          </div>

          {/* floating chips */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-2 sm:inset-x-5 sm:bottom-5">
            <span
              data-v-chip
              className="pointer-events-auto flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-xs font-medium text-primary shadow-lg"
            >
              <span className="relative flex size-2">
                <span className="animate-pulse-ring absolute inset-0 rounded-full bg-primary" />
                <span className="relative size-2 rounded-full bg-primary" />
              </span>
              Physiofit Studio · T. Nagar
            </span>
            <a
              data-v-chip
              href={DIRECTIONS}
              target="_blank"
              rel="noreferrer"
              className="btn btn-light pointer-events-auto h-10 px-4 text-xs shadow-lg"
            >
              Get directions
              <span aria-hidden className="text-sm leading-none">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
