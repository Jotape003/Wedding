'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X as CloseIcon } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { 
      path: '/', 
      label: 'Início', 
      textColorActive: 'text-pastel-blush', 
      hoverTextColor: 'hover:text-pastel-blush',
      dotColor: 'bg-pastel-blush'
    },
    { 
      path: '/local', 
      label: 'O Local', 
      textColorActive: 'text-pastel-sage', 
      hoverTextColor: 'hover:text-pastel-sage',
      dotColor: 'bg-pastel-sage'
    },
    { 
      path: '/presentes', 
      label: 'Presentes', 
      textColorActive: 'text-pastel-lavender', 
      hoverTextColor: 'hover:text-pastel-lavender',
      dotColor: 'bg-pastel-lavender'
    },
    { 
      path: '/mural', 
      label: 'Mural', 
      textColorActive: 'text-pastel-butter', 
      hoverTextColor: 'hover:text-pastel-butter',
      dotColor: 'bg-pastel-butter'
    }
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 flex justify-between py-4 items-center px-6 md:px-12 transition-all duration-500 ${
        scrolled || isMobileMenuOpen 
          ? 'bg-pastel-fundo/90 backdrop-blur-md shadow-sm border-b border-pastel-texto/5' 
          : 'bg-transparent'
      }`}>
        
        {/* LOGO / HOME */}
        <Link href="/" className="flex items-center cursor-pointer">
          <img 
            src="/monograma.png" 
            alt="Monograma J&E" 
            className={`h-12 md:h-16 w-auto transition-all duration-500 ${
              scrolled || isMobileMenuOpen
                ? 'brightness-0 drop-shadow-sm'
                : 'brightness-0 invert drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'
            }`} 
          />
        </Link>

        {/* ─── DESKTOP MENU ─── */}
        <div className={`hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.25em] font-sans font-medium transition-colors duration-500 ${
          scrolled ? 'text-pastel-texto' : 'text-white'
        }`}>
          
          {navItems.map((item) => {
            const active = isActive(item.path);
            
            return (
              <Link key={item.path} href={item.path} className="group relative flex flex-col items-center gap-1.5 cursor-pointer">
                <span className={`transition-colors duration-300 ${item.hoverTextColor} ${active ? `${item.textColorActive} font-bold` : ''}`}>
                  {item.label}
                </span>
                <span className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full ${item.dotColor} transition-all duration-300 ${
                  active ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                }`} />
              </Link>
            )
          })}

          {/* Botão RSVP (Agora é um Link direto!) */}
          <Link 
            href="/rsvp"
            className={`ml-4 px-7 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 font-sans font-bold uppercase tracking-[0.2em] text-[11px] shadow-sm ${
              scrolled 
                ? 'bg-pastel-texto text-pastel-fundo hover:bg-pastel-texto/90' 
                : 'bg-white/95 text-pastel-texto hover:bg-white'
            }`}
          >
            Presença
          </Link>
        </div>

        {/* ─── MOBILE MENU BUTTON ─── */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors duration-500 cursor-pointer ${
              scrolled || isMobileMenuOpen ? 'text-pastel-texto' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <CloseIcon size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* ─── MOBILE MENU DROPDOWN (AJUSTADO E CONTIDO) ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            // Agora o menu é um card flutuante, não ocupa a largura inteira
            className="fixed top-[90px] right-6 z-40 w-[200px] bg-white/95 backdrop-blur-xl border border-pastel-texto/10 p-4 rounded-3xl shadow-2xl md:hidden flex flex-col gap-2"
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`block py-2 px-3 text-[11px] uppercase tracking-[0.2em] font-sans font-medium transition-colors text-center rounded-xl ${
                    active ? `${item.textColorActive} bg-pastel-fundo/50` : 'text-pastel-texto hover:bg-pastel-fundo/30'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <div className="my-2 border-t border-pastel-texto/5" />
            
            <Link
              href="/rsvp"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex justify-center bg-pastel-texto text-pastel-fundo py-3 rounded-xl font-sans font-bold uppercase tracking-[0.2em] text-[10px] active:scale-95 transition-transform"
            >
              Presença
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}