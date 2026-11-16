import Navbar from "@/components/hero/Navbar";
import ContactShowcase from "@/components/contact/ContactShowcase";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Contact · Say Hello | Physiofit Studio T. Nagar Chennai",
  description:
    "Have a question? Want to check availability before booking? Reach out to Physiofit Studio in T. Nagar, Chennai.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-primary text-secondary overflow-x-hidden">
        <ContactShowcase />
      </main>
      <Footer ready={true} />
    </>
  );
}

