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

  // Fecha o menu mobile se mudar de página
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getLinkStyles = (path: string, isMobile = false) => {
    const isActive = pathname === path;
    
    if (isMobile) {
      return `block py-3 text-lg font-serif italic text-stone-800 border-b border-stone-100 ${isActive ? 'text-amber-700' : ''}`;
    }

    return `
      relative py-1 transition-colors duration-300
      after:content-[''] 
      after:absolute after:w-full after:h-[1px] 
      after:bg-current after:bottom-0 after:left-0 
      after:origin-center after:transition-transform after:duration-300 after:ease-out
      ${isActive ? 'after:scale-x-100 ' : 'after:scale-x-0 group-hover:after:scale-x-100'}
    `;
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 flex justify-between py-3 items-center px-6 md:px-12 transition-all duration-500 ${
        scrolled || isMobileMenuOpen ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        
        {/* LOGO / HOME */}
        <Link href="/" className="flex items-center cursor-pointer">
          <img 
            src="/monograma.png" 
            alt="Monograma J&E" 
            className={`h-12 md:h-18 w-auto transition-all duration-500 ${
              scrolled || isMobileMenuOpen
                ? 'brightness-0 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]' 
                : 'brightness-0 invert drop-shadow-[0_0_1.5px_rgba(255,255,255,0.7)]'
            }`} 
          />
        </Link>

        {/* DESKTOP MENU (Escondido no celular) */}
        <div className={`hidden md:flex items-center space-x-10 text-[12px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${
          scrolled ? 'text-stone-600' : 'text-white'
        }`}>
          <Link href="/" className="group relative">
            <span className={getLinkStyles('/')}>Início</span>
          </Link>
          <Link href="/local" className="group relative">
            <span className={getLinkStyles('/local')}>O Local</span>
          </Link>
          <Link href="/presentes" className="group relative">
            <span className={getLinkStyles('/presentes')}>Presentes</span>
          </Link>
          <button 
            onClick={() => setIsRsvpOpen(true)}
            className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 font-bold uppercase tracking-[0.2em] text-[12px] cursor-pointer ${
              scrolled ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-900'
            }`}
          >
            RSVP
          </button>
        </div>

        {/* MOBILE MENU BUTTON (Aparece apenas no celular) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors duration-500 cursor-pointer ${
              scrolled || isMobileMenuOpen ? 'text-stone-800' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN (Menu cortina elegante para mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/50 p-6 md:hidden flex flex-col gap-2 text-center shadow-lg"
          >
            <Link href="/" className={getLinkStyles('/', true)}>
              Início
            </Link>
            <Link href="/local" className={getLinkStyles('/local', true)}>
              O Local
            </Link>
            <Link href="/presentes" className={getLinkStyles('/presentes', true)}>
              Presentes
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsRsvpOpen(true);
              }}
              className="mt-4 w-full bg-stone-900 text-white py-3.5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] shadow-md cursor-pointer active:scale-95 transition-transform"
            >
              RSVP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY / MODAL DO RSVP (Compatível com Desktop e Mobile) */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRsvpOpen(false)}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-md z-10"
            >
              <button 
                onClick={() => setIsRsvpOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-800 flex items-center justify-center transition-colors text-sm font-medium z-50 cursor-pointer"
              >
                ✕
              </button>
              <RsvpForm />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}