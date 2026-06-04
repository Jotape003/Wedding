import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MusicPlayer from "../components/MusicPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casamento João Pedro & Ester",
  description: "Um site para celebrar o amor e compartilhar detalhes do nosso grande dia. Contagem regressiva, história, local e muito mais!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body className="antialiased">
        <Navbar />
          <Hero />
          <main>
            {children}
          </main>
          <MusicPlayer />
        <Footer />
      </body>
    </html>
  );
}
