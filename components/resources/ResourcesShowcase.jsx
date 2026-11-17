"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, SplitText, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import PostCard from "./PostCard";
import { POSTS, CATEGORIES } from "@/lib/posts";

const ALL = "All";

export default function ResourcesShowcase() {
  const root = useRef(null);
  const grid = useRef(null);
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { [ALL]: POSTS.length };
    CATEGORIES.forEach((cat) => (c[cat] = POSTS.filter((p) => p.category === cat).length));
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POSTS.filter(
      (p) =>
        (category === ALL || p.category === category) &&
        (!q || `${p.title} ${p.excerpt} ${p.category}`.toLowerCase().includes(q))
    );
  }, [category, query]);

  /* ---------- page entrance + scroll reveals ---------- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const split = SplitText.create("[data-res-title]", { type: "lines", mask: "lines", linesClass: "block" });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-res-eyebrow]", { y: 14, autoAlpha: 0, duration: 0.8 }, 0.1)
        .from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.15)
        .from("[data-res-fade]", { y: 18, autoAlpha: 0, duration: 1, stagger: 0.1 }, 0.45)
        .from("[data-res-orb]", { scale: 0.6, autoAlpha: 0, duration: 1.8, stagger: 0.15 }, 0);

      // drifting background orbs
      gsap.utils.toArray("[data-res-orb]").forEach((el, i) => {
        gsap.to(el, { x: i % 2 ? -40 : 50, y: i % 2 ? 30 : -25, duration: 9 + i * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });


      return () => split.revert();
    },
    { scope: root }
  );

  /* ---------- grid cards: animate in on scroll and on every filter change ---------- */
  useGSAP(
    () => {
      const cards = gsap.utils.toArray("[data-card]", grid.current);
      if (!cards.length) return;
      if (prefersReducedMotion()) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.set(cards, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(cards, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "expo.out", overwrite: true }),
      });
      ScrollTrigger.refresh();
    },
    { scope: grid, dependencies: [category, query], revertOnUpdate: true }
  );

  return (
    <div ref={root} className="w-full">
      {/* ================= HERO ================= */}
      <section className="relative isolate overflow-hidden bg-secondary text-primary">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div data-res-orb className="absolute -top-24 right-[6%] h-72 w-72 rounded-full bg-primary/10 blur-3xl sm:h-[26rem] sm:w-[26rem]" />
          <div data-res-orb className="absolute -bottom-32 left-[-6%] h-72 w-72 rounded-full bg-secondary-soft/40 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
        </div>

        <div className="mx-auto w-full max-w-[90rem] px-[var(--gutter)] pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pb-20">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <p data-res-eyebrow className="eyebrow text-primary/70">Resources · Blog</p>
              <h1
                data-res-title
                className="mt-3 font-display text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.035em] sm:mt-4"
              >
                Guides for your <span className="italic-accent text-primary/70">recovery.</span>
              </h1>
              <p data-res-fade className="mt-5 max-w-xl text-lead font-light text-primary/75 sm:mt-6">
                Practical advice from our physiotherapists on pain, recovery, movement and everyday wellbeing.
              </p>
            </div>

            {/* search */}
            <div data-res-fade className="w-full lg:justify-self-end lg:max-w-md">
              <label htmlFor="res-search" className="sr-only">
                Search articles
              </label>
              <div className="group relative">
                <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-primary/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  id="res-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  autoComplete="off"
                  className="h-12 w-full rounded-full border border-primary/20 bg-primary/[0.07] pr-4 pl-11 text-sm text-primary placeholder:text-primary/50 outline-none transition-all duration-300 hover:border-primary/40 focus:border-primary focus:bg-primary/[0.12] sm:h-14"
                  suppressHydrationWarning
                />
              </div>
              <p className="mt-3 text-xs font-light text-primary/60">
                {POSTS.length} articles · updated regularly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS + GRID ================= */}
      <section className="mx-auto w-full max-w-[90rem] px-[var(--gutter)] pt-10 pb-16 sm:pt-14 sm:pb-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-secondary/60">Latest articles</p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.025em] sm:text-3xl">Browse by topic</h2>
          </div>

          {/* category chips: scroll sideways on small phones */}
          <div className="-mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div role="tablist" aria-label="Filter articles by topic" className="flex w-max gap-2">
              {[ALL, ...CATEGORIES].map((cat) => {
                const on = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setCategory(cat)}
                    className={`inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-xs font-medium transition-all duration-300 sm:text-sm ${
                      on
                        ? "border-secondary bg-secondary text-primary shadow-[0_10px_24px_-12px] shadow-secondary/70"
                        : "border-line bg-primary text-secondary/75 hover:border-secondary/50 hover:text-secondary"
                    }`}
                  >
                    {cat}
                    <span className={`rounded-full px-1.5 text-[0.625rem] tabular-nums ${on ? "bg-primary/20" : "bg-mist"}`}>{counts[cat]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div ref={grid} className="mt-8 sm:mt-10">
          {filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8">
              {filtered.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[1.75rem] bg-mist px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-primary text-2xl animate-float" aria-hidden>
                ?
              </span>
              <p className="mt-4 font-display text-lg font-medium">No articles found</p>
              <p className="mt-1 text-sm font-light text-secondary/60">Try another search or topic.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory(ALL);
                }}
                className="btn btn-ghost mt-6 h-10 px-5 text-xs"
              >
                Show all articles
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
