'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <footer className="relative bg-[#36312D] text-[#F8F4EE] py-16 px-6 overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pastel-blush/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* TOPO: MONOGRAMA ANIMADO */}
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative group flex justify-center items-center mb-14"
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,var(--color-pastel-blush),var(--color-pastel-butter),var(--color-pastel-lavender),var(--color-pastel-sage),var(--color-pastel-blush))] rounded-full blur-[40px] opacity-10 group-hover:opacity-25 transition-opacity duration-700 animate-[spin_8s_linear_infinite]"></div>
          
          <img 
            src="/monograma.png" 
            alt="Monograma J&E" 
            className="relative z-10 h-24 md:h-32 w-auto brightness-0 invert opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        </motion.div>
        
        {/* MEIO: INFORMAÇÕES DISTRIBUÍDAS EM 3 COLUNAS */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 text-center md:text-left border-y border-white/10 py-10 mb-10">
          
          {/* Coluna 1: Navegação Rápida (Título Rosa Antigo) */}
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <h4 className="font-serif italic text-xl font-bold text-pastel-blush">Navegação</h4>
            <nav className="flex flex-col space-y-3 text-sm font-sans font-light text-white/80">
              <Link href="/" className={`flex items-center gap-2 hover:text-white hover:translate-x-1 transition-transform ${isActive('/') ? 'text-pastel-blush font-medium' : ''}`}>
                {isActive('/') && <span className="w-1.5 h-1.5 rounded-full bg-pastel-blush" />}
                Início
              </Link>
              <Link href="/local" className={`flex items-center gap-2 hover:text-white hover:translate-x-1 transition-transform ${isActive('/local') ? 'text-pastel-sage font-medium' : ''}`}>
                {isActive('/local') && <span className="w-1.5 h-1.5 rounded-full bg-pastel-sage" />}
                O Local
              </Link>
              <Link href="/presentes" className={`flex items-center gap-2 hover:text-white hover:translate-x-1 transition-transform ${isActive('/presentes') ? 'text-pastel-lavender font-medium' : ''}`}>
                {isActive('/presentes') && <span className="w-1.5 h-1.5 rounded-full bg-pastel-lavender" />}
                Lista de Presentes
              </Link>
            </nav>
          </div>

          {/* Coluna 2: O Grande Dia (Título Verde Sálvia) */}
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="font-serif font-bold italic text-xl text-pastel-sage">O Grande Dia</h4>
            <div className="text-sm font-sans font-light text-white/80 space-y-2 text-center">
              <p>28 de Agosto de 2026</p>
              <p>Fortaleza, Ceará</p>
              <p className="pt-3 font-semibold tracking-[0.3em] text-[10px] uppercase text-white/50">
                #CASAMENTOJOAOEESTER
              </p>
            </div>
          </div>

          {/* Coluna 3: Fale Conosco (Título Lilás Acinzentado) */}
          <div className="space-y-4 flex flex-col items-center md:items-end md:text-right">
            <h4 className="font-serif font-bold italic text-xl text-pastel-lavender">Fale Conosco</h4>
            <p className="text-sm font-sans font-light text-white/80 max-w-[220px]">
              Qualquer dúvida sobre o site, a cerimônia ou a lista de presentes, é só nos mandar uma mensagem no WhatsApp!
            </p>
          </div>

        </div>

        {/* BASE: ASSINATURA */}
        <div className="w-full text-center text-[10px] md:text-[11px] text-white/40 tracking-[0.2em] font-sans uppercase">
          Projetado e desenvolvido com muito amor por João Pedro © 2026
        </div>

      </div>
    </footer>
  );
}