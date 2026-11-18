"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import Wordmark from "./Wordmark";
import Magnetic from "./Magnetic";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const root = useRef(null);
  const bar = useRef(null);
  const menu = useRef(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  // a section stays highlighted on its sub-pages (e.g. /resources/some-article)
  const isCurrent = (href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  // On inner pages (like /services), reveal logo & items immediately on mount
  useGSAP(
    () => {
      if (!isHome) {
        gsap.set("[data-nav-logo], [data-nav-item]", { autoAlpha: 1, y: 0 });
      }
    },
    { dependencies: [isHome], scope: root }
  );

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
            { opacity: 0, y: -14, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
          );
      } else if (menu.current && menu.current.style.display === "flex") {
        lenis?.start();
        gsap.timeline()
          .to(menu.current, { opacity: 0, y: -10, scale: 0.97, duration: 0.22, ease: "power2.in" })
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
        className={`group/nav relative z-10 mx-auto flex h-12 max-w-[110rem] items-center justify-between rounded-full px-2 text-primary transition-[background-color,color,backdrop-filter,box-shadow] duration-700 ease-expo md:h-14 ${!isHome ? "is-scrolled" : ""} [&.is-scrolled]:bg-primary/95 [&.is-scrolled]:pl-5 [&.is-scrolled]:pr-3.5 md:[&.is-scrolled]:pl-10 md:[&.is-scrolled]:pr-7 lg:[&.is-scrolled]:pl-12 lg:[&.is-scrolled]:pr-9 [&.is-scrolled]:text-secondary [&.is-scrolled]:shadow-[0_10px_40px_-12px] [&.is-scrolled]:shadow-ink/30 [&.is-scrolled]:backdrop-blur-xl`}
      >
        <Link href="/" data-nav-logo aria-label="Physiofit Studio home" className="relative z-10">
          <Wordmark
            priority
            className="text-[1.3rem] min-[400px]:text-[1.4rem] md:text-[1.5rem]"
            markClassName="rounded-[0.3em] p-[0.12em] transition-colors duration-700 group-[.is-scrolled]/nav:bg-secondary"
          />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href} data-nav-item>
              <Link
                href={l.href}
                aria-current={isCurrent(l.href) ? "page" : undefined}
                className="eyebrow block rounded-full border border-transparent px-3.5 py-1.5 text-xs transition-colors duration-500 hover:border-line-inverse aria-[current=page]:border-primary/60 group-[.is-scrolled]/nav:hover:border-line group-[.is-scrolled]/nav:aria-[current=page]:border-secondary/60"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <span data-nav-item className="hidden sm:inline-block">
            <Magnetic>
              <Link href="/book" className="btn btn-light h-9 px-5 text-xs font-medium md:h-10 md:px-5 md:text-sm group-[.is-scrolled]/nav:bg-secondary group-[.is-scrolled]/nav:text-primary group-[.is-scrolled]/nav:before:bg-secondary-soft">
                Book appointment
              </Link>
            </Magnetic>
          </span>

          <span data-nav-item className="inline-block lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-50 grid size-9 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-primary/15 active:scale-95 group-[.is-scrolled]/nav:border-secondary/20 group-[.is-scrolled]/nav:bg-secondary/5 group-[.is-scrolled]/nav:text-secondary group-[.is-scrolled]/nav:hover:border-secondary/40 group-[.is-scrolled]/nav:hover:bg-secondary/10"
            >
              <span className="relative flex h-3.5 w-4 flex-col justify-between items-center">
                <span
                  className={`h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-expo ${open ? "translate-y-[6.25px] rotate-45" : ""}`}
                />
                <span
                  className={`h-[1.5px] w-full rounded-full bg-current transition-all duration-200 ease-expo ${open ? "opacity-0 scale-x-0" : "opacity-100"}`}
                />
                <span
                  className={`h-[1.5px] w-full rounded-full bg-current transition-all duration-300 ease-expo ${open ? "-translate-y-[6.25px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </span>
        </div>
      </nav>
    </header>

      {/* mobile menu backdrop */}
      {open && (
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* mobile menu compact floating card */}
      <div
        id="mobile-menu"
        ref={menu}
        className="fixed inset-x-[var(--gutter)] top-[calc(3rem+1.25rem)] z-40 mx-auto hidden max-w-sm flex-col rounded-3xl border border-primary/20 bg-secondary/95 p-3 text-primary shadow-[0_25px_60px_-15px] shadow-ink/60 backdrop-blur-2xl lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {[...LINKS, { label: "Book appointment", href: "/book" }].map((l) => {
            const isActive = isCurrent(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`block rounded-2xl px-4 py-2.5 text-base font-medium transition-all ${
                    isActive
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-primary/90 hover:bg-primary/10 hover:text-primary active:bg-primary/15"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
