import { Roboto } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const roboto = Roboto({
  variable: "--font-roboto",
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
      className={`${roboto.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
