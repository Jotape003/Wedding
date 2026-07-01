'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';

// Os "Capítulos" da história de vocês
const chapters = [
  {
    id: 1,
    title: "Onde Tudo Começou",
    date: "Aquele dia inesquecível...",
    description: "Nossos caminhos se cruzaram e, mesmo sem sabermos, ali começava o primeiro capítulo da nossa história.",
    // Quando tiver a foto, troque o bg colorido pela URL da imagem: image: "/fotos/comeco.jpg"
    placeholderBg: "bg-gradient-to-br from-pastel-blush to-pastel-butter",
    icon: "✨"
  },
  {
    id: 2,
    title: "O Primeiro Encontro",
    date: "Frio na barriga",
    description: "Horas conversando como se já nos conhecêssemos a vida inteira. O tempo simplesmente parou.",
    placeholderBg: "bg-gradient-to-br from-pastel-sage to-pastel-blush",
    icon: "☕"
  },
  {
    id: 3,
    title: "O Pedido",
    date: "Um momento mágico",
    description: "Com o coração batendo forte e a certeza de que era para sempre, dissemos o sim mais importante das nossas vidas.",
    placeholderBg: "bg-gradient-to-br from-pastel-lavender to-pastel-sage",
    icon: "💍"
  },
  {
    id: 4,
    title: "Rumo ao Altar",
    date: "28 de Agosto de 2026",
    description: "Agora, estamos preparando cada detalhe com muito amor para celebrar essa união com as pessoas que mais amamos.",
    placeholderBg: "bg-gradient-to-br from-pastel-butter to-pastel-lavender",
    icon: "💒"
  }
];

export default function StoryCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Calcula o limite de arraste baseado no tamanho da tela
  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="w-full py-16 overflow-hidden">
      
      {/* Cabeçalho da Sessão */}
      <div className="text-center space-y-4 mb-12 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-2">
          <Clapperboard size={28} strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl md:text-5xl font-serif italic text-pastel-texto">
          Nossa História
        </h2>
        <p className="text-pastel-texto/60 uppercase tracking-[0.3em] text-[11px] font-bold font-sans">
          Cada momento que nos trouxe até aqui
        </p>
      </div>

      {/* Área do Carrossel */}
      <motion.div 
        ref={carouselRef} 
        className="cursor-grab active:cursor-grabbing px-6 md:px-12"
      >
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }} 
          className="flex gap-6 md:gap-8 w-max"
        >
          {chapters.map((chapter) => (
            <motion.div 
              key={chapter.id}
              className="relative w-[300px] md:w-[400px] flex-shrink-0 bg-[#FCFAF8] rounded-[32px] p-3 shadow-[0_8px_30px_rgba(74,68,63,0.06)] border border-pastel-texto/5 group"
            >
              {/* Espaço da Foto (O Placeholder Mágico) */}
              <div className={`w-full h-[350px] md:h-[450px] rounded-[24px] overflow-hidden relative flex items-center justify-center ${chapter.placeholderBg}`}>
                
                {/* Quando você tiver a imagem real, o código ficará mais ou menos assim: 
                    <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover" />
                */}

                {/* Ícone fofo que some quando passar o mouse (só para dar vida ao placeholder) */}
                <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-500">
                  {chapter.icon}
                </span>

                {/* Gradiente escuro embaixo da foto para o texto branco aparecer bem depois */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Textos (Ficam fora da foto, embaixo, garantindo a leitura sempre) */}
              <div className="pt-6 pb-4 px-4 text-center">
                <span className="text-pastel-blush text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
                  {chapter.date}
                </span>
                <h3 className="font-serif italic text-2xl text-pastel-texto mb-3">
                  {chapter.title}
                </h3>
                <p className="text-pastel-texto/70 text-sm font-sans font-light leading-relaxed">
                  {chapter.description}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Dica de interação para o usuário */}
      <div className="text-center mt-8 text-pastel-texto/40 text-[10px] uppercase tracking-[0.2em] font-sans animate-pulse">
        ← Arraste para os lados →
      </div>

    </div>
  );
}