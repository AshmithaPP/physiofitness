import { Suspense } from "react";
import { connection } from "next/server";
import Navbar from "@/components/hero/Navbar";
import BookShowcase from "@/components/book/BookShowcase";
import Footer from "@/components/home/Footer";
import { readClinicNow } from "@/lib/clinicClock";

export const metadata = {
  title: "Book Appointment · Reserve Your Slot | Physiofit Studio Chennai",
  description:
    "Reserve your slot at Physiofit Studio in T. Nagar, Chennai. Pick a date, choose a time, and tell us who you are. Open 7 days a week, 11 AM – 5 PM (Sunday by Appointment only).",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-primary text-secondary overflow-x-hidden">
        {/* the static shell shows instantly; the dated calendar streams in right after */}
        <Suspense fallback={<BookShowcase />}>
          <BookWithToday />
        </Suspense>
      </main>
      <Footer ready={true} />
    </>
  );
}

/** Reads today's date at request time so the calendar arrives already filled in. */
async function BookWithToday() {
  await connection();
  return <BookShowcase initialNow={readClinicNow()} />;
}
