"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Wordmark from "@/components/hero/Wordmark";

const MAPS =
  "https://www.google.com/maps/search/?api=1&query=New+No.+128+N+Usman+Road+T.+Nagar+Chennai+600017";

export default function Footer({ ready = true }) {
  const root = useRef(null);

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root.current);

      gsap.fromTo(
        q("[data-foot-in]"),
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    },
    { scope: root, dependencies: [ready] }
  );

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 2.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={root} className="relative border-t border-line bg-primary text-secondary">
      <div className="mx-auto max-w-[110rem] px-[var(--gutter)] pt-16 md:pt-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10">
          <div data-foot-in className="max-w-md sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Physiofit Studio home" className="inline-block">
              <Wordmark onLight markOnly className="text-[1.75rem] sm:text-[2rem]" />
            </Link>
            <p className="mt-5 font-display text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium leading-[1.2] tracking-[-0.025em]">
              Restore your health, rebuild your strength,{" "}
              <span className="font-light text-secondary/60">renew your life.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-secondary/65">
              Evidence-based physiotherapy, rehab, and fitness in the heart of T. Nagar.
            </p>
          </div>

          <div data-foot-in>
            <h3 className="eyebrow text-[0.625rem] text-secondary/55">Visit</h3>
            <a
              href={MAPS}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block text-base leading-relaxed transition-opacity duration-300 hover:opacity-70"
            >
              New No. 128
              <br />
              N Usman Road, T. Nagar
              <br />
              Chennai - 600017
            </a>
          </div>

          <div data-foot-in>
            <h3 className="eyebrow text-[0.625rem] text-secondary/55">Contact</h3>
            <a
              href="tel:+917200831203"
              className="mt-4 inline-block text-base transition-opacity duration-300 hover:opacity-70"
            >
              +91 7200831203
            </a>
          </div>

          <div data-foot-in>
            <h3 className="eyebrow text-[0.625rem] text-secondary/55">Open 7 days a week</h3>
            <p className="mt-4 text-base">10:00 AM – 7:00 PM</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-line py-6 text-xs text-secondary/60 sm:flex-row sm:items-center md:mt-20">
          <p>© 2026 Physiofit Studio. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/book" className="transition-colors hover:text-secondary">Book appointment</Link>
            <button type="button" onClick={toTop} className="inline-flex items-center gap-2 transition-colors hover:text-secondary">
              Back to top <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
