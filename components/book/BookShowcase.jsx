"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/hero/Magnetic";
import { readClinicNow } from "@/lib/clinicClock";

/* ==========================================================================
   Static data
   ========================================================================== */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS_AHEAD = 3; // current month + 2 more
const OPEN_HOUR = 11;
const CLOSE_HOUR = 18; // 11 AM to 5 PM (last slot 5 PM)

const GENDERS = ["Female", "Male", "Other", "Prefer not to say"];

const PERIODS = [
  { id: "morning", label: "Morning", from: 11, to: 12 },
  { id: "afternoon", label: "Afternoon", from: 13, to: 15 },
  { id: "evening", label: "Evening", from: 16, to: 17 },
];

/* ==========================================================================
   Date helpers — "today" is always the clinic's day (Asia/Kolkata)
   ========================================================================== */

const subscribeClock = (cb) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};

const keyOf = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const fmtHour = (h) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? "AM" : "PM"}`;

const longDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const wd = new Date(y, m - 1, d).getDay();
  return {
    weekday: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][wd],
    short: `${d} ${MONTHS[m - 1].slice(0, 3)}`,
    full: `${d} ${MONTHS[m - 1]} ${y}`,
  };
};

// Every slot within opening hours is offered; only times that have already
// passed (today) are unavailable. The studio confirms the final time by phone.
const slotsFor = (dateKey, now) =>
  Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, i) => {
    const hour = OPEN_HOUR + i;
    const past = dateKey < now.dateKey || (dateKey === now.dateKey && hour <= now.hour);
    return { hour, label: fmtHour(hour), status: past ? "past" : "open" };
  });

/* ==========================================================================
   Component
   ========================================================================== */

/**
 * `initialNow` comes from the server (same "YYYY-MM-DD-HH" format as
 * readClinicNow) so the calendar's dates are in the very first HTML,
 * before any JavaScript has loaded. The browser then keeps it current.
 */
export default function BookShowcase({ initialNow = null }) {
  const root = useRef(null);
  const monthDir = useRef(1);
  const firstMonthRun = useRef(true);

  const nowKey = useSyncExternalStore(subscribeClock, readClinicNow, () => initialNow);
  const now = useMemo(() => {
    if (!nowKey) return null;
    const [y, m, d, h] = nowKey.split("-").map(Number);
    return { y, m: m - 1, d, hour: h, dateKey: keyOf(y, m - 1, d) };
  }, [nowKey]);

  const [monthOffset, setMonthOffset] = useState(0);
  const [dateKey, setDateKey] = useState(null);
  const [hour, setHour] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "", email: "", notes: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | done

  /* ---------- calendar model ---------- */
  const month = useMemo(() => {
    if (!now) return null;
    const first = new Date(now.y, now.m + monthOffset, 1);
    const y = first.getFullYear();
    const m = first.getMonth();
    const lead = first.getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      const key = keyOf(y, m, d);
      const open = slotsFor(key, now).filter((s) => s.status === "open").length;
      cells.push({ d, key, past: key < now.dateKey, open, isToday: key === now.dateKey });
    }
    return { y, m, cells };
  }, [now, monthOffset]);

  const slots = useMemo(() => (dateKey && now ? slotsFor(dateKey, now) : []), [dateKey, now]);
  const openCount = slots.filter((s) => s.status === "open").length;

  const detailsDone =
    form.name.trim().length > 1 &&
    form.phone.replace(/\D/g, "").length >= 10 &&
    String(form.age).trim().length > 0 &&
    !!form.gender;
  const ready = !!(dateKey && hour !== null && detailsDone);
  const missing = !dateKey
    ? "Pick a date"
    : hour === null
    ? "Pick a time"
    : !detailsDone
    ? "Add your details (name, phone, age, gender)"
    : null;
  const date = dateKey ? longDate(dateKey) : null;

  /* ---------- entrance + ambient motion ---------- */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q("[data-head-fade]"), { autoAlpha: 0, y: 16, duration: 0.9 })
        .from(q("[data-line] > span"), { yPercent: 115, rotate: 2.5, duration: 1.3, stagger: 0.1 }, "-=0.7")
        .from(q("[data-head-sub]"), { autoAlpha: 0, y: 20, duration: 1 }, "-=1")
        .from(q("[data-card]"), { autoAlpha: 0, y: 56, scale: 0.97, duration: 1.3, stagger: 0.14 }, "-=0.9")
        .from(q("[data-field]"), { autoAlpha: 0, x: 28, duration: 0.9, stagger: 0.07 }, "-=0.8")
        // dates stay visible the whole time: just a quick pop, never hidden
        .from(q("[data-day]"), { scale: 0.85, duration: 0.5, stagger: { each: 0.008, grid: [6, 7], from: "start" }, ease: "back.out(1.7)" }, 0.15);

      // slow rotating sheen behind the green form card
      gsap.to(q("[data-sheen]"), { rotate: 360, duration: 18, repeat: -1, ease: "none" });
      gsap.to(q("[data-orb]"), { y: -24, x: 16, scale: 1.12, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 1.5 });

      q("[data-blob]").forEach((blob, i) => {
        gsap.to(blob, {
          x: i % 2 ? -60 : 50,
          y: i % 2 ? 40 : -50,
          scale: 1.15,
          duration: 9 + i * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: root }
  );

  /* ---------- month slide ---------- */
  useGSAP(
    () => {
      if (firstMonthRun.current) {
        firstMonthRun.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-cal-grid] > *",
        { autoAlpha: 0, x: monthDir.current * 36 },
        { autoAlpha: 1, x: 0, duration: 0.6, ease: "expo.out", stagger: { each: 0.008, from: monthDir.current > 0 ? "start" : "end" } }
      );
      gsap.fromTo("[data-cal-title]", { autoAlpha: 0, y: monthDir.current * 10 }, { autoAlpha: 1, y: 0, duration: 0.5 });
    },
    { scope: root, dependencies: [monthOffset] }
  );

  /* ---------- time-slot ripple when the date changes ---------- */
  useGSAP(
    () => {
      if (!dateKey || prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-slot]",
        { autoAlpha: 0, y: 14, scale: 0.92 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)", stagger: 0.03 }
      );
    },
    { scope: root, dependencies: [dateKey] }
  );

  /* ---------- confirmation sequence ---------- */
  useGSAP(
    () => {
      if (status !== "done") return;
      const q = gsap.utils.selector(root);
      if (prefersReducedMotion()) {
        gsap.set(q("[data-check]"), { strokeDashoffset: 0 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(q("[data-done-badge]"), { scale: 0, rotate: -90, duration: 0.9, ease: "back.out(1.8)" })
        .to(q("[data-check]"), { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=0.45")
        .fromTo(
          q("[data-burst]"),
          { x: 0, y: 0, scale: 1, autoAlpha: 1 },
          {
            x: () => gsap.utils.random(-120, 120),
            y: () => gsap.utils.random(-110, 70),
            scale: 0,
            autoAlpha: 0,
            duration: () => gsap.utils.random(0.8, 1.3),
            ease: "power3.out",
          },
          "<"
        )
        .from(q("[data-done-fade]"), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, "-=1")
        .from(q("[data-done-ticket]"), { autoAlpha: 0, y: -50, rotate: -4, duration: 1.2, ease: "back.out(1.2)" }, "-=0.9");
    },
    { scope: root, dependencies: [status] }
  );

  /* ---------- handlers ---------- */
  const changeMonth = (delta) => {
    const next = monthOffset + delta;
    if (next < 0 || next >= MONTHS_AHEAD) return;
    monthDir.current = delta;
    setMonthOffset(next);
  };

  const pickDate = (cell) => {
    if (!cell || cell.past || cell.open === 0) return;
    setDateKey(cell.key);
    setHour(null);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!ready || status !== "idle") return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("done");
      root.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1100);
  };

  const reset = () => {
    setStatus("idle");
    setDateKey(null);
    setHour(null);
    setForm({ name: "", phone: "", age: "", gender: "", email: "", notes: "" });
  };

  const passCode = dateKey && hour !== null ? `PF-${dateKey.slice(5).replace("-", "")}${String(hour).padStart(2, "0")}` : "PF-—";

  /* ======================================================================
     Render
     ====================================================================== */

  return (
    <section ref={root} className="relative isolate w-full overflow-hidden bg-primary text-secondary scroll-mt-24">
      {/* soft ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-blob className="absolute -top-32 right-[8%] h-[22rem] w-[22rem] rounded-full bg-secondary/[0.07] blur-[110px] sm:h-[34rem] sm:w-[34rem]" />
        <div data-blob className="absolute top-[45%] -left-24 h-[18rem] w-[18rem] rounded-full bg-secondary/[0.06] blur-[100px] sm:h-[28rem] sm:w-[28rem]" />
      </div>

      {/* ================= HERO BAND (brand colour) ================= */}
      {status !== "done" && (
        <div className="relative bg-secondary text-primary">
          <div className="mx-auto w-full max-w-[90rem] px-[var(--gutter)] pt-28 pb-10 sm:pt-36 sm:pb-14">
            <header className="max-w-3xl">
              <p data-head-fade className="eyebrow text-primary/70">Book</p>
              <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4.25rem)] font-medium leading-[1] tracking-[-0.035em] sm:mt-4">
                <span data-line className="mask-line">
                  <span className="block">
                    Reserve your <span className="italic-accent text-primary/70">slot.</span>
                  </span>
                </span>
              </h1>
              <p data-head-sub className="mt-5 max-w-xl text-lead font-light text-primary/75 sm:mt-6">
                Pick a date, choose a time, and tell us who you are. We&apos;ll confirm by phone or email shortly.
              </p>
            </header>
          </div>
        </div>
      )}

      <div className={`mx-auto w-full max-w-[90rem] px-[var(--gutter)] pb-20 sm:pb-28 ${status === "done" ? "pt-28 sm:pt-36" : "pt-8 sm:pt-12"}`}>
        {status === "done" ? (
          <Confirmation date={date} hour={hour} name={form.name} code={passCode} onReset={reset} />
        ) : (
          <>
          <form
            onSubmit={submit}
            className="grid items-start gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-8"
            suppressHydrationWarning
          >
            {/* ================= CALENDAR ================= */}
            <Card title="Pick a date & time" hint="Times shown in IST">
              <div className="grid gap-7 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-8">
                {/* calendar */}
                <div className="min-w-0 rounded-3xl border-2 border-secondary/15 bg-primary p-3 shadow-[0_18px_40px_-28px] shadow-secondary/45 min-[400px]:p-4 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p data-cal-title className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {month ? MONTHS[month.m] : " "}
                      <span className="ml-1.5 font-light text-secondary/50">{month?.y}</span>
                    </p>
                    <div className="flex gap-2">
                      {[-1, 1].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => changeMonth(d)}
                          disabled={d < 0 ? monthOffset === 0 : monthOffset === MONTHS_AHEAD - 1}
                          aria-label={d < 0 ? "Previous month" : "Next month"}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-secondary bg-secondary text-primary transition-all hover:scale-105 hover:bg-secondary-soft active:scale-90 disabled:pointer-events-none disabled:border-secondary/20 disabled:bg-transparent disabled:text-secondary/30 sm:h-11 sm:w-11"
                          suppressHydrationWarning
                        >
                          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points={d < 0 ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-7 gap-1 rounded-2xl bg-secondary py-2 text-center text-primary sm:gap-1.5">
                    {WEEKDAYS.map((w) => (
                      <span key={w} className="text-[0.6875rem] font-bold uppercase tracking-wider sm:text-xs">
                        {w}
                      </span>
                    ))}
                  </div>

                  <div data-cal-grid className="grid grid-cols-7 gap-1 sm:gap-1.5">
                    {month
                      ? month.cells.map((c, i) => {
                          if (!c) return <span key={`e${i}`} />;
                          const disabled = c.past || c.open === 0;
                          const on = c.key === dateKey;
                          return (
                            <button
                              key={c.key}
                              data-day
                              type="button"
                              disabled={disabled}
                              onClick={() => pickDate(c)}
                              aria-pressed={on}
                              aria-label={`${c.d} ${MONTHS[month.m]}${disabled ? ", unavailable" : `, ${c.open} slots open`}`}
                              className={`group relative flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 text-sm transition-all duration-300 ease-(--ease-out-expo) active:scale-90 disabled:cursor-not-allowed sm:rounded-2xl sm:text-base ${
                                on
                                  ? "z-10 scale-[1.08] border-secondary bg-secondary text-primary shadow-[0_14px_28px_-12px] shadow-secondary/80"
                                  : disabled
                                  ? "border-transparent bg-mist/50 text-secondary/25"
                                  : c.isToday
                                  ? "border-secondary bg-primary font-bold hover:bg-mist"
                                  : "border-secondary/10 bg-primary font-semibold hover:-translate-y-0.5 hover:border-secondary/60 hover:shadow-[0_10px_20px_-14px] hover:shadow-secondary/60"
                              }`}
                              suppressHydrationWarning
                            >
                              <span className={`leading-none ${on ? "font-bold" : ""}`}>{c.d}</span>
                              {!disabled && (
                                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${on ? "bg-primary" : c.open <= 3 ? "bg-secondary/30" : "bg-secondary"}`} />
                              )}
                            </button>
                          );
                        })
                      : Array.from({ length: 35 }, (_, i) => (
                          <span key={i} className="aspect-square w-full animate-pulse rounded-xl bg-mist sm:rounded-2xl" />
                        ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3 text-[0.6875rem] font-medium text-secondary/70">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" />Plenty of slots</span>
                      <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary/30" />Few slots left today</span>
                      <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-md border-2 border-secondary" />Today</span>
                    </div>
                    <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[0.625rem] text-secondary font-semibold">
                      Sunday by Appointment only
                    </span>
                  </div>
                </div>

                {/* time slots */}
                <div className="min-w-0">
                  {!date ? (
                    <div className="flex h-full min-h-[14rem] flex-col items-center justify-center rounded-2xl bg-mist/70 px-6 py-10 text-center">
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary animate-float">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="3" />
                          <path d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                      </span>
                      <p className="text-sm font-medium">Choose a day first</p>
                      <p className="mt-1 text-xs font-light text-secondary/55">Open times will appear here.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="eyebrow text-secondary/55">{date.weekday}</p>
                            {date.weekday === "Sunday" && (
                              <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[0.625rem] font-medium text-secondary">
                                By appointment only
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 truncate font-display text-base font-medium tracking-tight sm:text-lg">{date.full}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-[0.6875rem] font-medium">{openCount} open</span>
                      </div>

                      <div className="flex flex-col gap-4">
                        {PERIODS.map((p) => (
                          <div key={p.id}>
                            <p className="mb-2 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-secondary/50">{p.label}</p>
                            <div className="grid grid-cols-3 gap-2">
                              {slots
                                .filter((s) => s.hour >= p.from && s.hour <= p.to)
                                .map((s) => {
                                  const on = s.hour === hour;
                                  const off = s.status !== "open";
                                  return (
                                    <button
                                      key={s.hour}
                                      data-slot
                                      type="button"
                                      disabled={off}
                                      onClick={() => setHour(s.hour)}
                                      aria-pressed={on}
                                      aria-label={`${s.label}${off ? ", passed" : ""}`}
                                      className={`h-11 rounded-xl border-2 text-[0.8125rem] font-semibold transition-all duration-300 sm:h-12 sm:text-sm ${
                                        on
                                          ? "border-secondary bg-secondary text-primary shadow-[0_10px_24px_-12px] shadow-secondary/80"
                                          : off
                                          ? "cursor-not-allowed border-transparent bg-mist/60 text-secondary/30"
                                          : "border-secondary/15 bg-primary hover:-translate-y-0.5 hover:border-secondary/60 active:scale-95"
                                      }`}
                                      suppressHydrationWarning
                                    >
                                      {s.label.replace(":00", "")}
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* ================= FORM ================= */}
            <Card tone="dark" title="Your details" hint="We only use this to confirm" className="lg:sticky lg:top-28">
              <div className="flex flex-col gap-3 sm:gap-4">
                <Field dark id="name" label="Full name" autoComplete="name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field dark id="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <div className="grid grid-cols-2 gap-3">
                  <Field dark id="age" label="Age" type="number" inputMode="numeric" min={1} max={120} required value={form.age} onChange={(v) => setForm({ ...form, age: v })} />
                  <Field dark id="gender" label="Gender" select options={GENDERS} required value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} />
                </div>
                <Field dark id="email" label="Email (optional)" type="email" autoComplete="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field dark id="notes" label="What's bothering you? (optional)" textarea value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
              </div>

              {/* selection recap */}
              <div data-field className="mt-5 flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/[0.07] px-4 py-3">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <p key={`${dateKey}-${hour}`} className="animate-srv-in min-w-0 truncate text-sm">
                  {date ? (
                    <>
                      <span className="font-semibold">{date.weekday}, {date.short}</span>
                      <span className="text-primary/65">{hour !== null ? ` · ${fmtHour(hour)}` : " · pick a time"}</span>
                    </>
                  ) : (
                    <span className="text-primary/65">No date chosen yet</span>
                  )}
                </p>
              </div>

              <Magnetic className="mt-4 w-full" strength={0.2}>
                <button
                  data-field
                  type="submit"
                  disabled={!ready || status !== "idle"}
                  className="btn btn-light h-13 w-full text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-55"
                  suppressHydrationWarning
                >
                  {status === "sending" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-secondary/25 border-t-secondary" />
                      Securing your slot…
                    </>
                  ) : (
                    <>
                      Confirm booking
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </Magnetic>

              <p className="mt-3 text-center text-[0.6875rem] font-light text-primary/65" aria-live="polite">
                {missing ? `Next: ${missing.toLowerCase()}` : "Free to reschedule up to 4 hours before"}
              </p>
            </Card>
          </form>
          </>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   Pieces
   ========================================================================== */

function Card({ title, hint, tone = "light", className = "", children }) {
  const dark = tone === "dark";
  return (
    <div
      data-card
      className={`relative isolate min-w-0 overflow-hidden rounded-3xl p-4 min-[400px]:p-5 sm:rounded-4xl sm:p-7 ${
        dark
          ? "bg-secondary text-primary shadow-[0_40px_80px_-30px] shadow-secondary/70"
          : "border border-line bg-primary/85 shadow-[0_30px_60px_-40px] shadow-secondary/35 backdrop-blur-xl"
      } ${className}`}
    >
      {dark && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* rotating light sheen */}
          <div
            data-sheen
            className="absolute top-1/2 left-1/2 h-[180%] w-[180%] -translate-x-1/2 -translate-y-1/2 opacity-50"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, var(--brand-primary) 14%, transparent) 60deg, transparent 140deg, transparent 220deg, color-mix(in oklch, var(--brand-primary) 9%, transparent) 280deg, transparent 360deg)",
            }}
          />
          {/* drifting orbs */}
          <div data-orb className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div data-orb className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-secondary-soft/40 blur-3xl" />
          {/* inner hairline glow */}
          <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-primary/15" />
        </div>
      )}
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 sm:mb-6">
        <h2 className="font-display text-xl font-medium tracking-tight sm:text-2xl">{title}</h2>
        <span className={`text-xs font-light ${dark ? "text-primary/60" : "text-secondary/50"}`}>{hint}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ id, label, value, onChange, textarea, select, options = [], dark = false, className = "", ...rest }) {
  const base = dark
    ? "peer w-full rounded-2xl border border-primary/20 bg-primary/[0.07] px-4 pt-6 pb-2 text-sm text-primary caret-primary outline-none transition-all duration-300 placeholder:text-transparent hover:border-primary/40 hover:bg-primary/10 focus:border-primary focus:bg-primary/[0.12] focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand-primary)_14%,transparent)]"
    : "peer w-full rounded-2xl border border-line bg-primary px-4 pt-6 pb-2 text-sm text-secondary outline-none transition-all duration-300 placeholder:text-transparent hover:border-secondary/40 focus:border-secondary focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand-secondary)_12%,transparent)]";
  const labelTone = dark ? "text-primary/60 peer-focus:text-primary" : "text-secondary/55 peer-focus:text-secondary";
  return (
    <div data-field className={`relative ${className}`}>
      {textarea ? (
        <textarea id={`book-${id}`} name={id} rows={3} placeholder=" " value={value} onChange={(e) => onChange(e.target.value)} className={`${base} resize-none`} suppressHydrationWarning />
      ) : select ? (
        <div className="relative">
          <select
            id={`book-${id}`}
            name={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${base} h-14 appearance-none cursor-pointer ${value ? "" : "text-primary/40"}`}
            suppressHydrationWarning
            {...rest}
          >
            <option value="" disabled className="bg-secondary text-primary/60">
              Select
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt} className="bg-secondary text-primary">
                {opt}
              </option>
            ))}
          </select>
          <svg aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 size-4 text-primary/60" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 7.5l5 5 5-5" />
          </svg>
        </div>
      ) : (
        <input id={`book-${id}`} name={id} placeholder=" " value={value} onChange={(e) => onChange(e.target.value)} className={`${base} h-14`} suppressHydrationWarning {...rest} />
      )}
      <label
        htmlFor={`book-${id}`}
        className={`pointer-events-none absolute left-4 text-[0.6875rem] font-medium transition-all duration-300 ease-(--ease-out-expo) ${select ? "top-2 text-[0.6875rem]" : "top-2.5 peer-placeholder-shown:top-[1.1rem] peer-placeholder-shown:text-sm peer-placeholder-shown:font-light"} peer-focus:top-2.5 peer-focus:text-[0.6875rem] peer-focus:font-medium ${labelTone}`}
      >
        {label}
      </label>
    </div>
  );
}

function Confirmation({ date, hour, name, code, onReset }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
      <div className="relative mb-8">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            data-burst
            aria-hidden
            className={`absolute top-1/2 left-1/2 -mt-1 -ml-1 h-2 w-2 opacity-0 ${i % 3 ? "rounded-full" : "rounded-[2px]"} ${i % 2 ? "bg-secondary" : "bg-secondary/40"}`}
          />
        ))}
        <span data-done-badge className="relative flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary shadow-[0_20px_50px_-15px] shadow-secondary/70 sm:h-24 sm:w-24">
          <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-11 sm:w-11" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline data-check points="20 6 9 17 4 12" style={{ strokeDasharray: 24, strokeDashoffset: 24 }} />
          </svg>
        </span>
      </div>

      <p data-done-fade className="eyebrow text-secondary/60">Request received</p>
      <h1 data-done-fade className="mt-4 font-display text-[clamp(2.25rem,7vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
        See you soon{name.trim() ? `, ${name.trim().split(" ")[0]}` : ""}.
      </h1>
      <p data-done-fade className="mt-5 max-w-md text-lead font-light text-secondary/70">
        We&apos;ve held your slot. Our front desk will call to confirm within a few hours.
      </p>

      <div data-done-ticket className="mt-10 w-full max-w-md overflow-hidden rounded-[1.75rem] bg-secondary p-5 text-left text-primary shadow-[0_40px_80px_-30px] shadow-secondary/65 sm:p-6">
        <div className="flex items-center justify-between">
          <span className="eyebrow text-primary/60">Appointment</span>
          <span className="font-roboto tabular-nums text-xs text-primary/70">{code}</span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.14em] text-primary/55">Date</p>
            <p className="mt-1 font-display text-xl font-medium">{date?.short}</p>
            <p className="text-xs font-light text-primary/60">{date?.weekday}</p>
          </div>
          <div>
            <p className="text-[0.625rem] uppercase tracking-[0.14em] text-primary/55">Time</p>
            <p className="mt-1 font-display text-xl font-medium">{hour !== null ? fmtHour(hour) : ""}</p>
            <p className="text-xs font-light text-primary/60">IST</p>
          </div>
        </div>
        <p className="mt-5 text-xs font-light text-primary/65">New no -128, Usman road, T.nagar, Chennai-600017 · +91 72008 31203</p>
        <p className="mt-1 text-[0.6875rem] font-light text-primary/55">physiofitstudio.org@gmail.com</p>
      </div>

      <div data-done-fade className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onReset} className="btn btn-primary h-12 w-full text-sm sm:flex-1" suppressHydrationWarning>
          Book another
        </button>
        <Link href="/" className="btn btn-ghost h-12 w-full text-sm sm:flex-1">
          Back to home
        </Link>
      </div>
    </div>
  );
}
