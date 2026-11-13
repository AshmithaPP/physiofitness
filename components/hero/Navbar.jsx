"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import Wordmark from "./Wordmark";
import Magnetic from "./Magnetic";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const root = useRef(null);
  const bar = useRef(null);
  const menu = useRef(null);
  const [open, setOpen] = useState(false);

  // Logo + links are revealed by StoryStage's scroll timeline: the intro logo
  // flies into [data-nav-logo] and [data-nav-item]s fade in as it lands.
  // StoryStage also toggles `.is-scrolled` on [data-navbar] once the pin ends.

  // mobile menu
  useGSAP(
    () => {
      const lenis = window.__lenis;
      if (open) {
        lenis?.stop();
        gsap.timeline()
          .set(menu.current, { display: "flex" })
          .fromTo(
            menu.current,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" }
          )
          .fromTo(
            "[data-menu-link]",
            { yPercent: 110 },
            { yPercent: 0, stagger: 0.06, duration: 1 },
            "-=0.35"
          );
      } else if (menu.current && menu.current.style.display === "flex") {
        lenis?.start();
        gsap.timeline()
          .to(menu.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" })
          .set(menu.current, { display: "none" });
      }
    },
    { dependencies: [open], scope: root }
  );

  return (
    <div ref={root}>
    <header className="fixed inset-x-0 top-0 z-40 px-[var(--gutter)] pt-4 md:pt-6">
      <nav
        ref={bar}
        data-navbar
        aria-label="Primary"
        className="group/nav relative z-10 mx-auto flex h-14 max-w-[110rem] items-center justify-between rounded-full px-2 text-primary transition-[background-color,backdrop-filter,box-shadow] duration-700 ease-expo md:h-16 [&.is-scrolled]:bg-secondary/85 [&.is-scrolled]:px-5 [&.is-scrolled]:shadow-[0_10px_40px_-12px] [&.is-scrolled]:shadow-secondary/40 [&.is-scrolled]:backdrop-blur-xl"
      >
        <Link href="/" data-nav-logo aria-label="Physiofit Studio home" className="relative z-10">
          <Wordmark className="text-[1.65rem]" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l, i) => (
            <li key={l.href} data-nav-item>
              <Link
                href={l.href}
                aria-current={i === 0 ? "page" : undefined}
                className="eyebrow block rounded-full border border-transparent px-4 py-2.5 text-[0.625rem] transition-colors duration-500 hover:border-line-inverse aria-[current=page]:border-primary/60"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span data-nav-item className="hidden sm:inline-block">
            <Magnetic>
              <Link href="/book" className="btn btn-light h-11 px-5 text-xs">
                Book appointment
                <span aria-hidden className="text-base leading-none">↗</span>
              </Link>
            </Magnetic>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-10 grid size-11 place-items-center rounded-full border border-line-inverse lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-expo ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-expo ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>
    </header>

      {/* mobile menu — kept outside the (transformed) header so `fixed` stays viewport-relative */}
      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-0 z-30 hidden flex-col justify-end bg-secondary px-[var(--gutter)] pb-12 pt-28 text-primary lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {[...LINKS, { label: "Book appointment", href: "/book" }].map((l) => (
            <li key={l.href} className="mask-line">
              <Link
                href={l.href}
                data-menu-link
                onClick={() => setOpen(false)}
                className="block font-display text-[clamp(2.75rem,12vw,4.5rem)] leading-[1.05] tracking-[-0.02em]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-1 border-t border-line-inverse pt-6 text-sm text-primary/70">
          <a href="tel:+917200831203">+91 72008 31203</a>
          <span>New No. 128, N Usman Road, T. Nagar, Chennai</span>
          <span>Open 7 days · 10:00 AM – 7:00 PM</span>
        </div>
      </div>
    </div>
  );
}
