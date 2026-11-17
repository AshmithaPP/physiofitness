/**
 * Shared booking-request form logic (Contact page + Home page).
 * Requests are emailed via FormSubmit (https://formsubmit.co). The first
 * submission sends an activation link to CONTACT_EMAIL; click it once.
 */

// export const CONTACT_EMAIL = "physiofitstudio.org@gmail.com";
export const CONTACT_EMAIL = "ashmitha048@gmail.com";


export const TREATMENTS = ["Physiotherapy", "Rehab", "Fitness", "Foot Spa", "Cupping", "Others"];

export const EMPTY_FORM = { name: "", phone: "", treatment: "", message: "", _honey: "" };

export const FIELDS = ["name", "phone", "treatment", "message"];

export function validate(f) {
  const e = {};
  const name = f.name.trim();
  if (!name) e.name = "Please enter your name.";
  else if (name.length < 2) e.name = "Name must be at least 2 characters.";
  else if (!/^[\p{L}][\p{L} .'-]*$/u.test(name)) e.name = "Please use letters only.";

  const phone = f.phone.replace(/[\s-]/g, "");
  if (!phone) e.phone = "Please enter your phone number.";
  else if (!/^(?:\+91|0)?[6-9]\d{9}$/.test(phone)) e.phone = "Enter a valid 10-digit mobile number.";

  if (!f.treatment) e.treatment = "Please choose a treatment.";

  const msg = f.message.trim();
  if (!msg) e.message = "Please enter a message.";
  else if (msg.length < 10) e.message = "Tell us a little more (at least 10 characters).";

  return e;
}

/** Keep only characters that belong in a phone number. */
export const cleanPhone = (v) => v.replace(/[^\d+\s-]/g, "");

export const SEND_ERROR =
  "Sorry, we couldn't send your request. Please try again, or call us on +91 72008 31203.";

/**
 * Visitor-facing text for a failed send (always friendly, never technical).
 * The owner-facing reason, e.g. FormSubmit's one-time activation, goes to the console.
 */
export function sendErrorMessage(err) {
  if (/activat/i.test(err?.message ?? "")) {
    console.warn(
      `[Booking form] Not delivered: FormSubmit needs a one-time activation for ${CONTACT_EMAIL}. ` +
        `Open the email from FormSubmit in that inbox (check spam), click "Activate Form", then submit again.`
    );
  }
  return SEND_ERROR;
}

/** Email the request. Resolves on success, throws on failure. `source` tags where it came from. */
export async function sendBooking(form, source = "Website") {
  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      Name: form.name.trim(),
      Phone: form.phone.trim(),
      Treatment: form.treatment,
      Message: form.message.trim(),
      Source: source,
      _subject: `New appointment request: ${form.name.trim()} (${form.treatment})`,
      _template: "table",
      _captcha: "false",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || String(data.success) !== "true") {
    // keep FormSubmit's own reason (e.g. "This form needs Activation") for the message + console
    console.warn("FormSubmit:", data.message || `HTTP ${res.status}`);
    throw new Error(data.message || `Request failed (HTTP ${res.status})`);
  }
}
