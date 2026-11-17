/**
 * Floating WhatsApp chat button, fixed bottom-right on every page.
 * Number and greeting live here; the green comes from --brand-whatsapp in globals.css.
 */
const WHATSAPP_NUMBER = "917200831203"; // +91 72008 31203, digits only for wa.me
const GREETING = "Hi Physiofit Studio, I'd like to know more about your treatments.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(GREETING)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex items-center sm:right-6 sm:bottom-6 animate-srv-in"
    >
      {/* label on hover (desktop) */}
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-secondary opacity-0 shadow-[0_10px_30px_-12px] shadow-ink/50 transition-all duration-300 ease-expo group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Chat on WhatsApp
      </span>

      <span className="relative grid size-13 place-items-center sm:size-14">
        {/* soft pulse */}
        <span aria-hidden className="absolute inset-0 rounded-full bg-whatsapp/60 animate-pulse-ring" />
        <span className="relative grid size-full place-items-center rounded-full bg-whatsapp text-primary shadow-[0_14px_30px_-10px] shadow-ink/60 ring-2 ring-primary/80 transition-transform duration-300 ease-expo group-hover:scale-110 group-active:scale-95">
          <svg aria-hidden viewBox="0 0 32 32" className="size-7 sm:size-[1.85rem]" fill="currentColor">
            <path d="M16.004 3C8.82 3 3 8.82 3 16c0 2.3.6 4.55 1.75 6.53L3 29l6.64-1.73A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16.004 3Zm0 23.62c-2.02 0-4-.54-5.73-1.57l-.41-.24-3.94 1.03 1.05-3.84-.27-.4A10.55 10.55 0 0 1 5.38 16c0-5.86 4.77-10.62 10.63-10.62 5.85 0 10.61 4.76 10.61 10.62 0 5.85-4.76 10.62-10.62 10.62Zm5.83-7.95c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
