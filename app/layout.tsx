import type { Metadata } from "next";
import { Inter, Kaushan_Script, Zilla_Slab } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const zilla = Zilla_Slab({
  variable: "--font-zilla",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const kaushan = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tilia Honey — Pure Giant Wild Honey",
  description:
    "Raw, unheated giant wild honey from the forests of the Western Ghats.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${zilla.variable} ${kaushan.variable}`}>
      <body>{children}</body>
    </html>
  );
}
