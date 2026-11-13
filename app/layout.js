import { Inter, Inter_Tight } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const interTight = Inter_Tight({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Physiofit Studio · Physiotherapy & Rehab in T. Nagar, Chennai",
  description:
    "A modern clinical studio in T. Nagar combining physiotherapy, targeted rehab, functional fitness and restorative foot spa — all under one roof.",
};

export const viewport = {
  themeColor: "#064e3b",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
