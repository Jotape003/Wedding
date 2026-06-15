'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X as CloseIcon } from 'lucide-react';
import RsvpForm from './RsvpForm';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
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

  // Array de navegação com as cores exclusivas para cada rota
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
      path: '/mural', 
      label: 'Mural', 
      textColorActive: 'text-pastel-butter', 
      hoverTextColor: 'hover:text-pastel-butter',
      dotColor: 'bg-pastel-butter'
    },
    { 
      path: '/presentes', 
      label: 'Presentes', 
      textColorActive: 'text-pastel-lavender', 
      hoverTextColor: 'hover:text-pastel-lavender',
      dotColor: 'bg-pastel-lavender'
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
                {/* A bolinha agora assume a cor única de cada menu! */}
                <span className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full ${item.dotColor} transition-all duration-300 ${
                  active ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                }`} />
              </Link>
            )
          })}

          {/* Botão RSVP */}
          <button 
            onClick={() => setIsRsvpOpen(true)}
            className={`ml-4 px-7 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 font-sans font-bold uppercase tracking-[0.2em] text-[11px] cursor-pointer shadow-sm ${
              scrolled 
                ? 'bg-pastel-texto text-pastel-fundo hover:bg-pastel-texto/90' 
                : 'bg-white/95 text-pastel-texto hover:bg-white'
            }`}
          >
            RSVP
          </button>
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

      {/* ─── MOBILE MENU DROPDOWN ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[70px] z-40 bg-pastel-fundo/95 backdrop-blur-xl border-b border-pastel-texto/10 p-6 md:hidden flex flex-col gap-4 text-center shadow-2xl"
          >
            {navItems.map((item) => {
              const active = isActive(item.path);
              
              return (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`block py-3 text-xl font-serif italic transition-colors ${
                    active ? item.textColorActive : 'text-pastel-texto'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsRsvpOpen(true);
              }}
              className="mt-6 w-full mx-auto max-w-[200px] bg-pastel-texto text-pastel-fundo py-3.5 rounded-full font-sans font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg cursor-pointer active:scale-95 transition-transform"
            >
              RSVP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── OVERLAY / MODAL DO RSVP ─── */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRsvpOpen(false)}
              className="absolute inset-0 bg-pastel-texto/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md z-10"
            >
              <button 
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pastel-fundo text-pastel-texto hover:bg-pastel-blush flex items-center justify-center transition-colors shadow-sm z-50 cursor-pointer"
              >
                <CloseIcon size={16} strokeWidth={2} />
              </button>
              
              <RsvpForm />
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}