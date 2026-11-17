"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, SplitText, prefersReducedMotion } from "@/lib/gsap";
import PostCard from "./PostCard";
import { formatDate, slugify } from "@/lib/posts";

/* ---------- body blocks ---------- */
function Block({ block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={slugify(block.text)} data-art-in className="mt-12 scroll-mt-28 font-display text-2xl font-medium leading-tight tracking-[-0.025em] sm:text-[1.75rem]">
          {block.text}
        </h2>
      );
    case "list":
      return (
        <ul data-art-in className="mt-5 space-y-2.5">
          {block.items.map((it) => (
            <li key={it} className="flex gap-3 text-base font-light leading-relaxed text-secondary/80 sm:text-[1.0625rem]">
              <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-secondary" />
              {it}
            </li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol data-art-in className="mt-6 grid gap-3 sm:grid-cols-2">
          {block.items.map((it, i) => (
            <li key={it.title} className="rounded-2xl border border-line bg-primary p-4 sm:p-5">
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 font-medium">{it.title}</p>
              <p className="mt-1 text-sm font-light leading-relaxed text-secondary/70">{it.text}</p>
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <aside data-art-in className="relative mt-8 overflow-hidden rounded-2xl bg-secondary p-5 text-primary sm:p-6">
          <div aria-hidden className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/10 blur-2xl" />
          <p className="eyebrow text-primary/65">Physio tip</p>
          <p className="mt-2 font-display text-lg font-medium">{block.title}</p>
          <p className="mt-1.5 text-sm font-light leading-relaxed text-primary/80 sm:text-base">{block.text}</p>
        </aside>
      );
    case "quote":
      return (
        <blockquote data-art-in className="mt-10 border-l-2 border-secondary pl-5 font-display text-xl font-light leading-snug tracking-[-0.015em] sm:pl-6 sm:text-2xl">
          “{block.text}”
        </blockquote>
      );
    default:
      return (
        <p data-art-in className="mt-5 text-base font-light leading-[1.8] text-secondary/80 sm:text-[1.0625rem]">
          {block.text}
        </p>
      );
  }
}

export default function ArticleView({ post, related }) {
  const root = useRef(null);
  const bar = useRef(null);
  const body = useRef(null);
  const [active, setActive] = useState("");
  const [copied, setCopied] = useState(false);

  const toc = useMemo(
    () => post.body.filter((b) => b.type === "h2").map((b) => ({ id: slugify(b.text), text: b.text })),
    [post]
  );

  /* reading progress */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = body.current;
      if (!el || !bar.current) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.5;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - r.top) / Math.max(1, total)));
      bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* active section in the table of contents */
  useEffect(() => {
    const heads = toc.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!heads.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    heads.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [toc]);

  /* entrance + scroll reveals */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const split = SplitText.create("[data-art-title]", { type: "lines", mask: "lines", linesClass: "block" });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-art-meta]", { y: 14, autoAlpha: 0, duration: 0.8, stagger: 0.06 }, 0.1)
        .from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.1 }, 0.15)
        .from("[data-art-hero]", { clipPath: "inset(10% 8% 0% 8% round 2rem)", y: 40, duration: 1.6 }, 0.35)
        .from("[data-art-hero] img", { scale: 1.18, duration: 2 }, 0.35);

      gsap.utils.toArray("[data-art-in]").forEach((el) => {
        gsap.from(el, { y: 26, autoAlpha: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
      });
      return () => split.revert();
    },
    { scope: root }
  );

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -110, duration: 1.1 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  const shareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${window.location.href}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article ref={root} className="w-full">
      {/* reading progress */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-highlight" />
      </div>

      {/* ================= HERO ================= */}
      <header className="relative bg-secondary text-primary">
        <div className="mx-auto w-full max-w-[64rem] px-[var(--gutter)] pt-28 pb-28 sm:pt-36 sm:pb-36 lg:pb-44">
          <Link
            href="/resources"
            data-art-meta
            className="inline-flex items-center gap-2 text-xs font-medium text-primary/70 transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span> All articles
          </Link>
          <p data-art-meta className="eyebrow mt-6 text-primary/65">
            {post.category}
          </p>
          <h1
            data-art-title
            className="mt-3 font-display text-[clamp(2rem,5.2vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.035em]"
          >
            {post.title}
          </h1>
          <div data-art-meta className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-light text-primary/70 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary text-[0.625rem] font-bold text-secondary">PF</span>
              Physiofit Studio team
            </span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readMin} min read</span>
          </div>
        </div>
      </header>

      {/* hero image overlapping the band */}
      <div className="mx-auto -mt-20 w-full max-w-[72rem] px-[var(--gutter)] sm:-mt-24 lg:-mt-32">
        <div
          data-art-hero
          className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] shadow-[0_40px_80px_-40px] shadow-ink/60 sm:aspect-[2/1] sm:rounded-[2rem]"
        >
          <Image src={post.img} alt="" fill priority sizes="(min-width: 1152px) 72rem, 100vw" className={`object-cover ${post.pos ?? "object-center"}`} />
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="mx-auto w-full max-w-[72rem] px-[var(--gutter)] pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div ref={body} className="min-w-0 max-w-[44rem] text-secondary">
            <p data-art-in className="font-display text-lg font-light leading-relaxed text-secondary sm:text-xl">
              {post.excerpt}
            </p>
            {post.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}

            <p data-art-in className="mt-12 rounded-2xl bg-mist p-4 text-xs font-light leading-relaxed text-secondary/65 sm:p-5 sm:text-sm">
              This article is general information, not a diagnosis. If you have pain or an injury, please get
              assessed by a qualified professional before starting new exercises.
            </p>
          </div>

          {/* sidebar */}
          <aside>
            <div className="lg:sticky lg:top-28">
              {toc.length > 0 && (
                <nav aria-label="On this page" className="hidden lg:block">
                  <p className="eyebrow text-secondary/55">On this page</p>
                  <ul className="mt-4 space-y-1 border-l border-line">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => scrollToId(t.id)}
                          className={`-ml-px block border-l-2 py-1.5 pl-4 text-left text-sm leading-snug transition-colors ${
                            active === t.id
                              ? "border-secondary font-medium text-secondary"
                              : "border-transparent font-light text-secondary/55 hover:text-secondary"
                          }`}
                        >
                          {t.text}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              <div className="flex flex-wrap items-center gap-2 lg:mt-8">
                <span className="eyebrow mr-1 text-secondary/55">Share</span>
                <button
                  type="button"
                  onClick={shareWhatsApp}
                  aria-label="Share on WhatsApp"
                  title="Share on WhatsApp"
                  className="grid size-10 place-items-center rounded-full bg-whatsapp text-primary shadow-[0_8px_20px_-10px] shadow-ink/50 transition-transform duration-300 ease-expo hover:scale-110 active:scale-95"
                >
                  <svg aria-hidden viewBox="0 0 32 32" className="size-5" fill="currentColor">
                    <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.3.6 4.55 1.75 6.53L3 29l6.64-1.73A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.004 3Zm0 23.62c-2.02 0-4-.54-5.73-1.57l-.41-.24-3.94 1.03 1.05-3.84-.27-.4A10.55 10.55 0 0 1 5.38 16c0-5.86 4.77-10.62 10.63-10.62 5.85 0 10.61 4.76 10.61 10.62 0 5.85-4.76 10.62-10.62 10.62Zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  aria-live="polite"
                  className="inline-flex h-10 items-center rounded-full border border-line px-4 text-xs font-medium transition-colors hover:border-secondary hover:bg-secondary hover:text-primary"
                >
                  {copied ? "Link copied ✓" : "Copy link"}
                </button>
              </div>

            </div>
          </aside>
        </div>
      </div>

      {/* ================= RELATED ================= */}
      {related.length > 0 && (
        <section className="bg-mist">
          <div className="mx-auto w-full max-w-[90rem] px-[var(--gutter)] py-16 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-secondary/60">Keep reading</p>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-[-0.025em] sm:text-3xl">Related articles</h2>
              </div>
              <Link href="/resources" className="btn btn-ghost h-10 px-5 text-xs">
                All articles
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8">
              {related.map((p) => (
                <div key={p.slug} data-art-in>
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  );
}
