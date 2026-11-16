import Navbar from "@/components/hero/Navbar";
import ServicesShowcase from "@/components/services/ServicesShowcase";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "Services · Four Disciplines. One Studio. | Physiofit Studio Chennai",
  description:
    "Every service at Physiofit is designed to work with the others. Move from acute care to long-term strength — without changing therapists or centres.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-secondary text-primary">
        <ServicesShowcase />
      </main>
      <Footer ready={true} />
    </>
  );
}

