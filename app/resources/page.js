import Navbar from "@/components/hero/Navbar";
import Footer from "@/components/home/Footer";
import ResourcesShowcase from "@/components/resources/ResourcesShowcase";

export const metadata = {
  title: "Resources · Physio Blog & Recovery Guides | Physiofit Studio Chennai",
  description:
    "Practical advice from Physiofit Studio's physiotherapists on back pain, injury recovery, exercise and everyday wellbeing.",
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="w-full overflow-x-clip bg-primary text-secondary">
        <ResourcesShowcase />
      </main>
      <Footer ready={true} />
    </>
  );
}
