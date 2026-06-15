'use client';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden">
      
      {/* ─── FOTO DE FUNDO ─── */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ─── CONTEÚDO (Monograma com Aura e Textos) ─── */}
      <div className="relative z-20 text-center text-white flex flex-col items-center -mt-20 md:-mt-32">
        
        {/* Wrapper do Monograma para segurar o efeito de luz */}
        <div className="relative flex items-center justify-center mb-8">
          
          {/* O Efeito Glow (Desfocado e girando suavemente por trás) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }} /* 50% de opacidade para ser uma aura discreta */
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute w-48 h-48 md:w-64 md:h-64 bg-[conic-gradient(from_0deg,var(--color-pastel-blush),var(--color-pastel-butter),var(--color-pastel-lavender),var(--color-pastel-sage),var(--color-pastel-blush))] rounded-full blur-[50px] animate-[spin_10s_linear_infinite] z-0 pointer-events-none"
          />

          {/* O Monograma por cima do glow */}
          <motion.img 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            src="/monograma.png" 
            alt="Monograma J&E" 
            className="relative z-10 h-56 md:h-80 w-auto object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-[13px] md:text-sm uppercase tracking-[0.3em] font-medium font-sans">
            28 de Agosto de 2026
          </p>
          <p className="text-xs md:text-[13px] text-white/80 uppercase tracking-[0.2em] font-light font-sans">
            Fortaleza, Ceará
          </p>
        </motion.div>
      </div>

      {/* ─── CURVA INFERIOR ─── */}
      <div 
        className="absolute bottom-[-150px] w-[150%] h-[150px] md:h-[250px] bg-pastel-fundo z-10"
        style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
      />
    </section>
  );
}