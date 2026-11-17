"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Magnetic from "@/components/hero/Magnetic";

import { TREATMENTS, EMPTY_FORM, FIELDS, validate, sendBooking, sendErrorMessage } from "@/lib/booking";

const INPUT =
  "w-full rounded-lg sm:rounded-xl bg-primary/10 border border-primary/20 text-primary placeholder:text-primary/45 text-xs sm:text-sm focus:outline-none focus:border-primary/60 transition-colors";
const INPUT_ERR = "border-danger/80 focus:border-danger";

function Field({ id, label, error, children }) {
  return (
    <div className="flex flex-col text-left">
      <label htmlFor={id} className="text-[0.6875rem] sm:text-xs text-primary/80 mb-0.5 sm:mb-1 font-light">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-[0.625rem] sm:text-[0.6875rem] leading-tight text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=New+No.+128+N+Usman+Road+T.+Nagar+Chennai+600017";

export default function ContactShowcase() {
  const root = useRef(null);
  const pullGroupRef = useRef(null);
  const physioRef = useRef(null);
  const cardRef = useRef(null);
  const stageRef = useRef(null);

  // Form states
  const formRef = useRef(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendError, setSendError] = useState("");

  const errors = validate(formData);
  const shownError = (k) => (touched[k] ? errors[k] : undefined);
  const update = (k) => (e) => setFormData((f) => ({ ...f, [k]: e.target.value }));
  const touch = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  // GSAP Animation: Physiotherapist on left pulling the form from Right to Center
  useGSAP(
    () => {
      const container = root.current;
      const pullGroup = pullGroupRef.current;
      const physio = physioRef.current;
      const card = cardRef.current;
      if (!container || !pullGroup || !card) return;

      const reduced = prefersReducedMotion();
      if (reduced) return;

      // Master timeline for the pulling animation
      const tl = gsap.timeline({
        paused: false,
        scrollTrigger: {
          trigger: stageRef.current || pullGroup,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Group starts off-screen to the right, physiotherapist pulls it across
      const isMobile = window.innerWidth < 640;
      const startX = isMobile ? 140 : 320;

      gsap.set(physio, { transformOrigin: "bottom center" });

      tl.set(pullGroup, { autoAlpha: 1 })
        .fromTo(
          pullGroup,
          { x: startX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.45,
            ease: "power3.out",
          }
        )
        // Natural rhythmic footstep bobbing while walking/pulling
        .to(
          physio,
          {
            y: -4,
            duration: 0.22,
            repeat: 3,
            yoyo: true,
            ease: "sine.inOut",
          },
          "<0.1"
        )
        // Settle smoothly onto ground baseline
        .to(
          card,
          {
            scale: 1,
            duration: 0.35,
            ease: "back.out(1.05)",
          },
          "-=0.2"
        )
        .to(
          physio,
          {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "<"
        );
    },
    { scope: root }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError("");
    setTouched({ name: true, phone: true, treatment: true, message: true });

    const firstInvalid = FIELDS.find((k) => errors[k]);
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // bots fill the hidden honeypot: pretend it worked, send nothing
    if (formData._honey) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await sendBooking(formData, "Contact page");
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
    <div ref={root} className="relative w-full bg-secondary text-primary select-text font-roboto">
      
      {/* ================= MAIN CONTACT SECTION (Address on Left, Animated Form on Right) ================= */}
      <section
        ref={stageRef}
        className="relative w-full pt-24 xs:pt-28 sm:pt-36 pb-16 sm:pb-24 px-3 xs:px-4 sm:px-[var(--gutter)] mx-auto max-w-[110rem] overflow-hidden"
      >
        <div className="w-full grid grid-cols-1 xl:grid-cols-[0.75fr_1.25fr] gap-10 xl:gap-18 items-center">
          
          {/* ================= LEFT SIDE: STUDIO ADDRESS & DETAILS (Unboxed - No Cards) + MAP ================= */}
          <div className="flex flex-col gap-6 sm:gap-8 text-left order-2 xl:order-1 px-1 sm:px-0">
            
            {/* Studio Address */}
            <div className="text-left">
              <span className="eyebrow block text-primary/65 text-xs font-semibold tracking-widest mb-2">
                Studio
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-tight">
                New No. 128, N Usman Road
              </h2>
              <p className="text-sm sm:text-base text-primary/80 mt-1 font-light">
                T. Nagar, Chennai &ndash; 600017
              </p>
            </div>

            {/* Call Us & Email (Clean text, no card borders) */}
            <div className="grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-5 sm:gap-x-10 sm:gap-y-6 pt-1">
              {/* Call Us */}
              <div className="text-left">
                <span className="eyebrow block text-primary/65 text-[0.6875rem] font-semibold tracking-wider mb-1">
                  Call us
                </span>
                <a
                  href="tel:+917200831203"
                  draggable={false}
                  className="font-display text-lg sm:text-xl font-medium text-primary hover:underline underline-offset-4 block select-text"
                >
                  +91 7200831203
                </a>
                <p className="text-xs text-primary/70 mt-1 font-light">
                  Direct line to our clinic desk
                </p>
              </div>

              {/* Email */}
              <div className="text-left">
                <span className="eyebrow block text-primary/65 text-[0.6875rem] font-semibold tracking-wider mb-1">
                  Email
                </span>
                <a
                  href="mailto:afrozmeeran13@gmail.com"
                  draggable={false}
                  className="font-display text-base sm:text-lg font-medium text-primary hover:underline underline-offset-4 block break-all select-text"
                >
                  afrozmeeran13@gmail.com
                </a>
                <p className="text-xs text-primary/70 mt-1 font-light">
                  We usually reply within a few hours
                </p>
              </div>
            </div>

            {/* Hours (Unboxed) */}
            <div className="text-left pt-1">
              <span className="eyebrow block text-primary/65 text-[0.6875rem] font-semibold tracking-wider mb-1">
                Hours
              </span>
              <p className="font-display text-lg sm:text-xl font-medium text-primary">
                Open 7 days a week
              </p>
              <p className="text-xs sm:text-sm text-primary/80 mt-0.5 font-light">
                10:00 AM &ndash; 7:00 PM
              </p>
            </div>

            {/* Embedded Location Map in UI */}
            <div className="mt-2 text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="eyebrow text-primary/65 text-[0.6875rem] font-semibold tracking-wider">
                  Location
                </span>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow text-[0.6875rem] text-primary hover:underline underline-offset-4"
                >
                  Open in Google Maps ↗
                </a>
              </div>
              <div className="relative w-full h-[200px] sm:h-[260px] rounded-2xl overflow-hidden shadow-md border border-line-inverse bg-primary">
                <iframe
                  title="Physiofit Studio Location Map in T. Nagar Chennai"
                  src="https://maps.google.com/maps?q=128+North+Usman+Road+T+Nagar+Chennai+600017&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale contrast-[1.08] hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

          </div>

          {/* ================= RIGHT SIDE: ANIMATED FORM WITH PHYSIOTHERAPIST ON LEFT ================= */}
          <div className="relative w-full flex items-center justify-center order-1 xl:order-2">
            
            {/* Unified Pulling Group (Physiotherapist + Form Card) - Aligned to floor baseline */}
            <div
              ref={pullGroupRef}
              className="relative flex items-end justify-center w-full max-w-3xl xl:max-w-none will-change-transform"
            >
              
              {/* Physiotherapist Character: Facing the user, hands gripping card edge, feet grounded on floor baseline */}
              <div
                ref={physioRef}
                className="shrink-0 h-[200px] min-[400px]:h-[230px] sm:h-[340px] md:h-[400px] lg:h-[450px] xl:h-[480px] w-auto aspect-[614/800] relative z-30 pointer-events-none -mr-8 min-[400px]:-mr-9 sm:-mr-14 md:-mr-18 lg:-mr-22 mb-0 will-change-transform bg-transparent"
              >
                {/* Contact shadow on floor under shoes */}
                <div className="absolute -bottom-1.5 left-4 right-4 h-3 bg-ink/60 rounded-full blur-[4px] pointer-events-none" />

                <Image
                  src="/images/contact/physiotherapist.png"
                  alt="Physiotherapist facing user and holding the form card into position"
                  fill
                  sizes="(min-width: 1280px) 380px, (min-width: 1024px) 350px, (min-width: 640px) 270px, 170px"
                  className="object-contain object-bottom drop-shadow-[4px_10px_20px_color-mix(in_oklch,var(--brand-ink)_55%,transparent)] bg-transparent"
                  priority
                />
              </div>

              {/* Dual-Pane Form Card */}
              <div
                ref={cardRef}
                className="relative z-20 w-full min-w-0 max-w-[calc(100%-55px)] sm:max-w-xl md:max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_24px_60px_-15px] shadow-ink/70 border border-primary/15 bg-secondary text-primary grid grid-cols-1 md:grid-cols-[1fr_1.15fr]"
              >
                
                {/* Left Pane: Walking Rehabilitation Photo (User Attached 2nd Image) */}
                <div className="relative min-h-[160px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-full w-full overflow-hidden bg-secondary-soft">
                  <Image
                    src="/images/contact/rehab-walk.jpg"
                    alt="Doctor and physiotherapist guiding patient gait and walking rehabilitation at Physiofit Studio"
                    fill
                    sizes="(min-width: 768px) 45vw, 92vw"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/95 via-secondary/30 to-transparent md:bg-gradient-to-r md:from-transparent md:via-secondary/25 md:to-secondary" />
                  {/* Left-edge shade: hides the bright window behind the physiotherapist's hands on every breakpoint */}
                  <div className="absolute inset-y-0 left-0 w-2/5 sm:w-1/3 bg-gradient-to-r from-secondary via-secondary/70 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-left">
                    <span className="eyebrow inline-block bg-primary text-secondary px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[0.5625rem] sm:text-[0.625rem] font-semibold mb-1 sm:mb-2 shadow-sm">
                      T. Nagar &middot; Chennai
                    </span>
                    <h3 className="font-display text-sm xs:text-base sm:text-xl font-medium tracking-tight text-primary leading-snug">
                      Physiofit Studio
                    </h3>
                   
                  </div>
                </div>

                {/* Right Pane: Contact Form Fields (Replay Button Removed) */}
                <div className="p-3.5 pl-10 min-[400px]:pl-11 sm:p-6 sm:pl-16 md:p-8 flex flex-col justify-center text-left bg-secondary">
                  <div className="mb-2.5 sm:mb-4 text-left">
                    <h2 className="font-display text-base xs:text-lg sm:text-xl md:text-2xl font-medium text-primary tracking-[-0.025em]">
                      Send a message
                    </h2>
                  </div>

                  {submitted ? (
                    <div className="py-6 sm:py-8 text-center flex flex-col items-center" role="status">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary text-secondary flex items-center justify-center mb-3 sm:mb-4 shadow-lg">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl font-medium text-primary">
                        Request received!
                      </h3>
                      <p className="text-xs sm:text-sm text-primary/80 mt-1.5 sm:mt-2 max-w-xs font-light leading-relaxed">
                        Thank you. We&apos;ll call you shortly to confirm your appointment.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData(EMPTY_FORM);
                          setTouched({});
                        }}
                        className="mt-4 sm:mt-6 text-xs text-primary/90 underline underline-offset-4 hover:text-primary"
                        suppressHydrationWarning
                      >
                        Book another appointment
                      </button>
                    </div>
                  ) : (
                    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-2 sm:gap-3" suppressHydrationWarning>
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

                      {/* Name */}
                      <Field id="contact-name" label="Name" error={shownError("name")}>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          maxLength={60}
                          autoComplete="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={update("name")}
                          onBlur={touch("name")}
                          aria-invalid={!!shownError("name")}
                          aria-describedby={shownError("name") ? "contact-name-error" : undefined}
                          className={`${INPUT} h-8 min-[400px]:h-9 sm:h-10 px-3 ${shownError("name") ? INPUT_ERR : ""}`}
                          suppressHydrationWarning
                        />
                      </Field>

                      {/* Phone number */}
                      <Field id="contact-phone" label="Phone number" error={shownError("phone")}>
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          required
                          maxLength={16}
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\s-]/g, "") }))}
                          onBlur={touch("phone")}
                          aria-invalid={!!shownError("phone")}
                          aria-describedby={shownError("phone") ? "contact-phone-error" : undefined}
                          className={`${INPUT} h-8 min-[400px]:h-9 sm:h-10 px-3 ${shownError("phone") ? INPUT_ERR : ""}`}
                          suppressHydrationWarning
                        />
                      </Field>

                      {/* Treatment */}
                      <Field id="contact-treatment" label="Treatment" error={shownError("treatment")}>
                        <div className="relative">
                          <select
                            id="contact-treatment"
                            name="treatment"
                            required
                            value={formData.treatment}
                            onChange={update("treatment")}
                            onBlur={touch("treatment")}
                            aria-invalid={!!shownError("treatment")}
                            aria-describedby={shownError("treatment") ? "contact-treatment-error" : undefined}
                            className={`${INPUT} h-8 min-[400px]:h-9 sm:h-10 appearance-none pl-3 pr-9 cursor-pointer ${formData.treatment ? "" : "text-primary/45"} ${shownError("treatment") ? INPUT_ERR : ""}`}
                            suppressHydrationWarning
                          >
                            <option value="" disabled className="bg-secondary text-primary/60">
                              Select a treatment
                            </option>
                            {TREATMENTS.map((t) => (
                              <option key={t} value={t} className="bg-secondary text-primary">
                                {t}
                              </option>
                            ))}
                          </select>
                          <svg aria-hidden className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary/70" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 7.5l5 5 5-5" />
                          </svg>
                        </div>
                      </Field>

                      {/* Message */}
                      <Field id="contact-message" label="Message" error={shownError("message")}>
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={2}
                          required
                          maxLength={1000}
                          autoComplete="off"
                          placeholder="How can we help your recovery?"
                          value={formData.message}
                          onChange={update("message")}
                          onBlur={touch("message")}
                          aria-invalid={!!shownError("message")}
                          aria-describedby={shownError("message") ? "contact-message-error" : undefined}
                          className={`${INPUT} p-2 min-[400px]:p-2.5 resize-none ${shownError("message") ? INPUT_ERR : ""}`}
                          suppressHydrationWarning
                        />
                      </Field>

                      {sendError && (
                        <p role="alert" className="text-[0.6875rem] sm:text-xs text-danger leading-snug">
                          {sendError}
                        </p>
                      )}

                      {/* Submit Button */}
                      <div className="mt-1 flex justify-start">
                        <Magnetic>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-light w-full h-10 sm:h-11 whitespace-nowrap px-5 text-xs sm:text-sm font-medium shadow-md hover:shadow-xl transition-all disabled:opacity-60"
                            suppressHydrationWarning
                          >
                            {isSubmitting ? "Sending..." : "Book appointment"}
                          </button>
                        </Magnetic>
                      </div>
                    </form>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
