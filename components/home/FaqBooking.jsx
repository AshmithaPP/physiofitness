"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/hero/Magnetic";
import { TREATMENTS, EMPTY_FORM, FIELDS, validate, cleanPhone, sendBooking, sendErrorMessage } from "@/lib/booking";

/* --------------------------------------------------------------------------
   FAQ (left) + booking form (right), shown on the home page above "Visit us".
   Form shares validation + email delivery with the Contact page (lib/booking).
   -------------------------------------------------------------------------- */

const FAQS = [
  {
    q: "Do I need a doctor's referral to book?",
    a: "No. You can book directly with us. If you have a referral, scans or reports from a doctor, please bring them along. They help us plan your treatment.",
  },
  {
    q: "What happens at my first visit?",
    a: "Your first session starts with a detailed assessment of your history, posture, movement and pain triggers. We then explain what we found and agree a treatment plan with you before we begin.",
  },
  {
    q: "What should I wear or bring?",
    a: "Wear comfortable clothes you can move in easily, such as track pants and a T-shirt. Bring any medical reports, scans or prescriptions related to your concern.",
  },
  {
    q: "How many sessions will I need?",
    a: "It depends on your condition and goals. After your assessment we'll give you an honest estimate and review your progress regularly, so you're never booked for more than you need.",
  },
  {
    q: "What are your opening hours?",
    a: "We're open 7 days a week, from 10:00 AM to 7:00 PM, at New No. 128, N Usman Road, T. Nagar, Chennai.",
  },
  {
    q: "Can I combine treatments like cupping or foot spa with physiotherapy?",
    a: "Yes. Many clients combine therapies. Our team will recommend what suits your recovery, whether that's physiotherapy, rehab, fitness, cupping or a restorative foot spa.",
  },
];

const INPUT =
  "w-full rounded-xl border border-line bg-mist/60 text-sm text-secondary placeholder:text-secondary/40 outline-none transition-all duration-300 hover:border-secondary/30 focus:border-secondary focus:bg-primary focus:shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand-secondary)_10%,transparent)]";
const INPUT_ERR = "border-danger-ink/70 focus:border-danger-ink";

const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  phone: <path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
};

const Svg = ({ name, className = "" }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {ICONS[name]}
  </svg>
);

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1.5 text-xs font-medium text-secondary/75">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.6875rem] leading-tight text-danger-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function FaqItem({ item, open, onToggle, idx }) {
  const id = `faq-${idx}`;
  return (
    <li data-faq className="border-b border-line-inverse">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          className="group flex w-full items-center justify-between gap-4 py-4 text-left"
        >
          <span className="font-display text-[0.9375rem] font-medium leading-snug tracking-[-0.01em] sm:text-base lg:text-[1.0625rem]">
            {item.q}
          </span>
          <span
            aria-hidden
            className={`relative grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-expo ${
              open ? "rotate-45 border-primary bg-primary text-secondary" : "border-primary/30 text-primary group-hover:border-primary"
            }`}
          >
            <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
            <span className="absolute h-3 w-[1.5px] rounded-full bg-current" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-expo ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 pr-10 text-sm font-light leading-relaxed text-primary/75">{item.a}</p>
        </div>
      </div>
    </li>
  );
}

export default function FaqBooking({ ready = true }) {
  const root = useRef(null);
  const formRef = useRef(null);
  const [openIdx, setOpenIdx] = useState(0);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendError, setSendError] = useState("");

  const errors = validate(formData);
  const shownError = (k) => (touched[k] ? errors[k] : undefined);
  const update = (k) => (e) => setFormData((f) => ({ ...f, [k]: e.target.value }));
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));
  const aria = (k, id) => ({
    "aria-invalid": !!shownError(k),
    "aria-describedby": shownError(k) ? `${id}-error` : undefined,
  });

  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root.current);
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" },
        })
        .fromTo(q("[data-fb-fade]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0)
        .fromTo(q("[data-fb-line]"), { yPercent: 110 }, { yPercent: 0, duration: 1.1 }, 0.05)
        .fromTo(q("[data-faq]"), { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.06 }, 0.25)
        .fromTo(q("[data-fb-card]"), { autoAlpha: 0, y: 50, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 }, 0.15)
        .fromTo(q("[data-fb-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 0.45)
        .fromTo(q("[data-fb-field]"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.45)
        .fromTo(q("[data-fb-chip]"), { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.04, ease: "back.out(2)" }, 0.75);

      gsap.to(q("[data-fb-orb]"), { x: 40, y: -30, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut" });
    },
    { scope: root, dependencies: [ready] }
  );

  const pickTreatment = (t) => {
    setFormData((f) => ({ ...f, treatment: t }));
    setTouched((s) => ({ ...s, treatment: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError("");
    setTouched({ name: true, phone: true, treatment: true, message: true });

    const firstInvalid = FIELDS.find((k) => errors[k]);
    if (firstInvalid) {
      const el =
        firstInvalid === "treatment"
          ? formRef.current?.querySelector("[data-fb-chip]")
          : formRef.current?.querySelector(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }
    if (formData._honey) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendBooking(formData, "Home page");
      setSubmitted(true);
      setFormData(EMPTY_FORM);
      setTouched({});
    } catch (err) {
      setSendError(sendErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={root}
      aria-labelledby="faq-title"
      className="relative isolate overflow-hidden bg-secondary py-12 text-primary md:py-16 lg:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-fb-orb className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-highlight/20 blur-3xl sm:h-[30rem] sm:w-[30rem]" />
      </div>

      <div className="mx-auto grid max-w-[110rem] items-center gap-10 px-[var(--gutter)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
        {/* ================= FAQ ================= */}
        <div>
          <p data-fb-fade className="eyebrow text-[0.625rem] text-primary/60">
            FAQ
          </p>
          <h2
            id="faq-title"
            className="mt-3 font-display text-[clamp(1.75rem,3.2vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]"
          >
            <span className="mask-line">
              <span data-fb-line className="block">
                Questions, <span className="font-light text-primary/60">answered.</span>
              </span>
            </span>
          </h2>
          <p data-fb-fade className="mt-3 max-w-[34rem] text-sm leading-relaxed text-primary/70 sm:text-base">
            Everything to know before your first visit. Can&apos;t find your answer? Send us a message.
          </p>

          <ul className="mt-6 border-t border-line-inverse">
            {FAQS.map((item, i) => (
              <FaqItem key={item.q} item={item} idx={i} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
            ))}
          </ul>
        </div>

        {/* ================= FORM ================= */}
        <div
          data-fb-card
          className="relative overflow-hidden rounded-[1.75rem] bg-primary p-5 text-secondary shadow-[0_40px_80px_-30px] shadow-ink/80 ring-1 ring-primary/40 min-[400px]:p-6 sm:rounded-[2rem] sm:p-7 lg:p-8"
        >
          {/* accent bar + soft glow */}
          <div data-fb-bar aria-hidden className="absolute inset-x-0 top-0 h-1.5 origin-left bg-gradient-to-r from-secondary via-highlight to-secondary" />
          <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-highlight/15 blur-3xl" />

          {/* header */}
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span
                data-fb-field
                className="inline-flex items-center gap-2 rounded-full bg-mist px-3 py-1.5 text-[0.6875rem] font-medium text-secondary/80"
              >
                <span className="relative flex size-2">
                  <span className="absolute inset-0 rounded-full bg-highlight animate-pulse-ring" />
                  <span className="relative size-2 rounded-full bg-highlight" />
                </span>
                Open today · 10 AM – 7 PM
              </span>
              <h3 data-fb-field className="mt-3 font-display text-2xl font-medium leading-tight tracking-[-0.025em] sm:text-[1.75rem]">
                Request an appointment
              </h3>
              <p data-fb-field className="mt-1 text-sm font-light text-secondary/65">
                We&apos;ll call you to confirm a time that suits you.
              </p>
            </div>
            <span
              data-fb-field
              aria-hidden
              className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-secondary text-primary shadow-[0_12px_24px_-12px] shadow-secondary/80 min-[400px]:grid"
            >
              <Svg name="calendar" className="size-6" />
            </span>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center" role="status">
              <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary shadow-[0_14px_30px_-12px] shadow-secondary/70">
                <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <p className="mt-4 font-display text-xl font-medium">Request received!</p>
              <p className="mt-1.5 max-w-xs text-sm font-light text-secondary/65">
                Thank you. We&apos;ll call you shortly to confirm your appointment.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData(EMPTY_FORM);
                  setTouched({});
                }}
                className="mt-5 text-xs text-secondary/80 underline underline-offset-4 hover:text-secondary"
              >
                Book another appointment
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative mt-6 flex flex-col gap-4" suppressHydrationWarning>
              {/* honeypot: hidden from people, bots fill it */}
              <input
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={formData._honey}
                onChange={update("_honey")}
                className="hidden"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div data-fb-field>
                  <Field id="fb-name" label="Name" error={shownError("name")}>
                    <div className="relative">
                      <Svg name="user" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/45" />
                      <input
                        id="fb-name"
                        name="name"
                        type="text"
                        maxLength={60}
                        autoComplete="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={update("name")}
                        onBlur={touch("name")}
                        {...aria("name", "fb-name")}
                        className={`${INPUT} h-11 pr-4 pl-10 ${shownError("name") ? INPUT_ERR : ""}`}
                        suppressHydrationWarning
                      />
                    </div>
                  </Field>
                </div>
                <div data-fb-field>
                  <Field id="fb-phone" label="Phone number" error={shownError("phone")}>
                    <div className="relative">
                      <Svg name="phone" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-secondary/45" />
                      <input
                        id="fb-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        maxLength={16}
                        autoComplete="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData((f) => ({ ...f, phone: cleanPhone(e.target.value) }))}
                        onBlur={touch("phone")}
                        {...aria("phone", "fb-phone")}
                        className={`${INPUT} h-11 pr-4 pl-10 ${shownError("phone") ? INPUT_ERR : ""}`}
                        suppressHydrationWarning
                      />
                    </div>
                  </Field>
                </div>
              </div>

              {/* treatment as tappable chips */}
              <div data-fb-field>
                <p id="fb-treatment-label" className="mb-2 text-xs font-medium text-secondary/75">
                  Treatment
                </p>
                <div
                  role="radiogroup"
                  aria-labelledby="fb-treatment-label"
                  aria-describedby={shownError("treatment") ? "fb-treatment-error" : undefined}
                  className="flex flex-wrap gap-2"
                >
                  {TREATMENTS.map((t) => {
                    const on = formData.treatment === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        data-fb-chip
                        onClick={() => pickTreatment(t)}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-all duration-300 ease-expo sm:text-[0.8125rem] ${
                          on
                            ? "scale-[1.04] border-secondary bg-secondary text-primary shadow-[0_10px_22px_-12px] shadow-secondary/80"
                            : `bg-primary text-secondary/75 hover:-translate-y-0.5 hover:border-secondary/50 hover:text-secondary ${
                                shownError("treatment") ? "border-danger-ink/60" : "border-line"
                              }`
                        }`}
                      >
                        {on && (
                          <svg aria-hidden viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {t}
                      </button>
                    );
                  })}
                </div>
                {shownError("treatment") && (
                  <p id="fb-treatment-error" className="mt-1.5 text-[0.6875rem] leading-tight text-danger-ink">
                    {shownError("treatment")}
                  </p>
                )}
              </div>

              <div data-fb-field>
                <Field id="fb-message" label="Message" error={shownError("message")}>
                  <textarea
                    id="fb-message"
                    name="message"
                    rows={3}
                    maxLength={1000}
                    placeholder="How can we help your recovery?"
                    value={formData.message}
                    onChange={update("message")}
                    onBlur={touch("message")}
                    {...aria("message", "fb-message")}
                    className={`${INPUT} resize-none px-4 py-3 ${shownError("message") ? INPUT_ERR : ""}`}
                    suppressHydrationWarning
                  />
                </Field>
              </div>

              {sendError && (
                <p role="alert" className="text-xs leading-snug text-danger-ink">
                  {sendError}
                </p>
              )}

              <div data-fb-field className="mt-1">
                <Magnetic strength={0.12} className="block w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary group h-12 w-full px-6 text-sm shadow-[0_16px_32px_-14px] shadow-secondary/90 disabled:opacity-60"
                    suppressHydrationWarning
                  >
                    {isSubmitting ? "Sending..." : "Book appointment"}
                    {!isSubmitting && (
                      <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">
                        →
                      </span>
                    )}
                  </button>
                </Magnetic>
              </div>

              <div data-fb-field className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-secondary/60">
                <span>Prefer to talk?</span>
                <a href="tel:+917200831203" className="font-medium text-secondary underline-offset-4 hover:underline">
                  Call +91 72008 31203
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
