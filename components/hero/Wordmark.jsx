import Image from "next/image";

/**
 * Brand logo: the Physiofit mark (exact original artwork) + text wordmark.
 *
 * The mark is shown as-is on the brand colour (`--brand-secondary` in
 * globals.css), which is a deep navy chosen so the logo's white figure and
 * blue arcs both stay visible. On light backgrounds pass `onLight` — the mark
 * then sits on a small tile of the brand colour so its white figure still shows.
 *
 * Everything is sized in `em`, so the same logo scales cleanly from the navbar
 * to the full-screen intro — which lets the intro logo fly into the navbar and
 * land as an exact match.
 */
export default function Wordmark({ className = "", markClassName = "", priority = false, onLight = false, markOnly = false }) {
  return (
    <span className={`inline-flex items-center gap-[0.32em] whitespace-nowrap font-display leading-none ${className}`}>
      <span
        data-wm-mark
        className={`inline-flex shrink-0 items-center justify-center ${
          onLight ? "rounded-[0.34em] bg-secondary p-[0.16em] shadow-[0_0.15em_0.5em_-0.15em] shadow-ink/40" : ""
        } ${markClassName}`}
      >
        <Image
          src="/images/brand/logo.png"
          alt=""
          aria-hidden
          width={413}
          height={480}
          priority={priority}
          sizes="(min-width: 768px) 96px, 64px"
          className={`block w-auto select-none ${onLight ? "h-[1.25em]" : "h-[1.5em]"}`}
          draggable={false}
        />
      </span>
      {markOnly ? (
        // logo only (navbar, footer); the name stays available to screen readers
        <span className="sr-only">Physiofit Studio</span>
      ) : (
        <span data-wm-text className="inline-flex items-baseline">
          <span data-wm className="font-semibold tracking-[-0.025em]">Physiofit</span>
          <span data-wm className="font-light tracking-[-0.015em] opacity-70">.studio</span>
        </span>
      )}
    </span>
  );
}
