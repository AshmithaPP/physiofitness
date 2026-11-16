import Navbar from "@/components/hero/Navbar";
import AboutShowcase from "@/components/about/AboutShowcase";
import Footer from "@/components/home/Footer";

export const metadata = {
  title: "About · Not Another Clinic. A Studio for the Body. | Physiofit Studio Chennai",
  description:
    "Physiofit Studio was born from a simple idea: recovery deserves the same care and craft as fitness. T. Nagar, Chennai.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="w-full bg-primary text-secondary overflow-x-hidden">
        <AboutShowcase />
      </main>
      <Footer ready={true} />
    </>
  );
}
