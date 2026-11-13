/**
 * Text wordmark used until a logo file exists.
 * Sized in `em`, so the same mark scales cleanly from the navbar (1.65rem)
 * to the full-screen intro — which lets the intro logo fly into the navbar
 * and land as an exact match.
 */
export default function Wordmark({ className = "" }) {
  return (
    <span className={`inline-flex items-baseline whitespace-nowrap font-display leading-none ${className}`}>
      <span data-wm className="font-semibold tracking-[-0.025em]">Physiofit</span>
      <span data-wm className="font-light tracking-[-0.015em] opacity-70">.studio</span>
    </span>
  );
}
