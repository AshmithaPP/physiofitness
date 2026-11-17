import { Roboto } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import WhatsAppButton from "@/components/WhatsAppButton";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // used to build absolute URLs for social-share images; update when the custom domain goes live
  metadataBase: new URL("https://physiofitness-nu.vercel.app"),
  title: "Physiofit Studio · Physiotherapy & Rehab in T. Nagar, Chennai",
  description:
    "A modern clinical studio in T. Nagar combining physiotherapy, targeted rehab, functional fitness and restorative foot spa — all under one roof.",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${roboto.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <WhatsAppButton />
      </body>
    </html>
  );
}
