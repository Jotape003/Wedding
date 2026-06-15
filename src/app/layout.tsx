import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MusicPlayer from "../components/MusicPlayer";

// Configuração da fonte dos Títulos
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-titulo",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

// Configuração da fonte do Texto
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-corpo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Casamento João Pedro & Ester",
  description: "Um site para celebrar o amor e compartilhar detalhes do nosso grande dia. Contagem regressiva, história, local e muito mais!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body 
        className={`
          ${cormorantGaramond.variable} 
          ${plusJakartaSans.variable} 
          font-sans 
          bg-pastel-fundo 
          text-pastel-texto 
          antialiased
        `}
      >
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