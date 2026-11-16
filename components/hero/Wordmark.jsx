import Image from "next/image";

/**
 * Brand logo: the Physiofit mark + text wordmark.
 * Everything is sized in `em`, so the same logo scales cleanly from the
 * navbar (1.65rem) to the full-screen intro — which lets the intro logo fly
 * into the navbar and land as an exact match.
 *
 * tone="light" → white figure, for dark/green backgrounds (default)
 * tone="dark"  → green figure, for light backgrounds
 */
export default function Wordmark({ className = "", tone = "light", priority = false }) {
  const src = tone === "dark" ? "/images/brand/logo-mark-dark.png" : "/images/brand/logo-mark.png";
  return (
    <span className={`inline-flex items-center gap-[0.32em] whitespace-nowrap font-display leading-none ${className}`}>
      <span data-wm-mark className="inline-block shrink-0">
        <Image
          src={src}
          alt=""
          aria-hidden
          width={415}
          height={480}
          priority={priority}
          sizes="(min-width: 768px) 96px, 64px"
          className="block h-[1.5em] w-auto select-none"
          draggable={false}
        />
      </span>
      <span className="inline-flex items-baseline">
        <span data-wm className="font-semibold tracking-[-0.025em]">Physiofit</span>
        <span data-wm className="font-light tracking-[-0.015em] opacity-70">.studio</span>
      </span>
    </span>
  );
}
