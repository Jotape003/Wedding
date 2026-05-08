'use client';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkStyle = `
    relative py-1
    after:content-[''] 
    after:absolute after:w-full after:h-[1px] 
    after:bg-current after:bottom-0 after:left-0 
    after:scale-x-0 after:origin-center
    after:transition-transform after:duration-300 after:ease-out
    group-hover:after:scale-x-100
  `;

  return (
    <nav className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent'
    }`}>
      <img 
        src="/monograma.png" 
        alt="Monograma J&E" 
        className={`h-18 w-auto transition-all duration-500 ${
          scrolled 
            ? 'brightness-0 drop-shadow-[0_0_1px_rgba(0,0,0,0.3)]' 
            : 'brightness-0 invert drop-shadow-[0_0_1.5px_rgba(255,255,255,0.7)]'
        }`} 
      />
      <div className={`hidden md:flex items-center space-x-10 text-[12px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${
        scrolled ? 'text-stone-600' : 'text-white'
      }`}>
        {/* Link Nossa História */}
        <a href="#historia" className="group relative">
          <span className={navLinkStyle}>Nossa História</span>
        </a>

        {/* Link O Local */}
        <a href="#local" className="group relative">
          <span className={navLinkStyle}>O Local</span>
        </a>

        {/* Link Presentes */}
        <a href="#presentes" className="group relative">
          <span className={navLinkStyle}>Presentes</span>
        </a>

        {/* Botão RSVP (Mantemos o destaque, mas você pode aplicar a linha se preferir) */}
        <a href="#rsvp" className={`px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
          scrolled ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-900'
        }`}>
          RSVP
        </a>
      </div>
    </nav>
  );
}