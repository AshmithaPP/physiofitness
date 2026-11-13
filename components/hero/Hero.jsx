"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import StoryStage from "./StoryStage";
import ServicesDrop from "@/components/home/ServicesDrop";
import Approach from "@/components/home/Approach";
import Visit from "@/components/home/Visit";
import Footer from "@/components/home/Footer";

/**
 * Home hero: one pinned scroll story (intro → hero → method steps).
 * `ready` flips once web fonts are loaded so text splits measure correctly.
 */
export default function Hero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    document.fonts.ready.then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-secondary">
        <StoryStage ready={ready} />
        <ServicesDrop ready={ready} />
        <Approach ready={ready} />
        <Visit ready={ready} />
      </main>
      <Footer ready={ready} />
    </>
  );
}
