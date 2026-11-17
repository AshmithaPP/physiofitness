/**
 * "Now" at the clinic (Asia/Kolkata), as a stable string that changes at most
 * once an hour: "YYYY-MM-DD-HH". Shared by the server (so the booking calendar
 * arrives already filled in) and the browser (which keeps it current).
 */
const clinicClock = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
});

export const readClinicNow = () => {
  const p = Object.fromEntries(clinicClock.formatToParts(new Date()).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}-${p.hour}`;
};
