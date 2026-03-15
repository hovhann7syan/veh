import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import { CartProvider } from "@/context/CartContext";

// 1. Настраиваем шрифт для текстов (Inter - чистый, как на iPhone)
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// 2. Настраиваем шрифт для Заголовков (Space Grotesk - модный, квадратный)
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VEH | ARCHIVE",
  description: "Armenian Archive Fashion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Подключаем переменные шрифтов ко всему HTML
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased bg-white text-black font-sans">
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}