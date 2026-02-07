import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VEH",
  description: "SILENCE OVER NOISE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-hidden">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#050505] text-[#EDEDED]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
