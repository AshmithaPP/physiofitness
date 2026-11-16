import Navbar from "@/components/hero/Navbar";
import BookShowcase from "@/components/book/BookShowcase";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Book Appointment · Reserve Your Slot | Physiofit Studio Chennai",
  description:
    "Reserve your slot at Physiofit Studio in T. Nagar, Chennai. Pick a date, choose a time, and tell us who you are. Open 7 days a week, 10 AM – 7 PM.",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-primary text-secondary overflow-x-hidden">
        <BookShowcase />
      </main>
      <Footer ready={true} />
    </>
  );
}

