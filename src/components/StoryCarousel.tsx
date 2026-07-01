'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';

const chapters = [
  {
    id: 1,
    title: "Onde Tudo Começou",
    date: "Aquele dia inesquecível...",
    description: "Nos conhecemos dia 15 de novembro de 2021, em um acampamento de Jovens. Éramos de equipes opostas, e a noiva muito competitiva chamou a atenção do noivo rapidinho. Depois de vários jogos, risadas, Deus fez a carona do noivo dar errado e então começamos a conversar antes que alguém vinhesse buscar ele, daí em diante não passamos um dia sem conversar.",
    image: "/historia/1.jpeg"
  },
  {
    id: 2,
    title: "Como nos apaixonamos",
    date: "Frio na barriga",
    description: "Ficamos conversando pelo Instagram, depois WhatsApp e finalmente por ligações, era uma amizade muito gostosa, passávamos a noite conversando e rindo, mas a realidade é que os dois estavam apaixonados. Então em abril de 2022 ele se declarou e ela correspondeu, esperamos que os dois tivessem 18 anos e começamos a orar e falar com nossos pais. Um ano depois, o frio na barriga: fomos nos ver pela segunda vez em um acampamento de jovens da igreja dele. Uma semana depois começamos a namorar 🥹.",
    image: "/historia/2.jpeg"
  },
  {
    id: 3,
    title: "O Pedido",
    date: "Um momento mágico",
    description: "Nosso pedido de noivado, planejamos uma noite temática de Natal com nossos amigos e um caça ao tesouro com todos, em que a noiva seria uma parte importante, mal ela sabia que seria pedida em casamento. Depois de passar pelos desafios e adivinhar as pistas, lá em cima estava ele todo lindo rodeado por velas se declarando, se ajoelhou e fez o pedido mais lindo da nossa vida: Quer casar comigo?",
    image: "/historia/3.jpeg"
  },
  {
    id: 4,
    title: "Rumo ao Altar",
    date: "28 de Agosto de 2026",
    description: "Agora é nossa hora de virar uma só carne, unidos como um só, depois de quase 4 anos de muita oração e de muito muito amor nosso dia está chegando e estamos ansiosos por te-lo lá, para celebrar conosco e testemunhar o nosso sim diante de Deus e de todos que amamos. Estamos muito felizes por você fazer parte da nossa história e não vemos a hora de te ver no nosso grande dia.",
    image: "/historia/4.jpeg"
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
    <div className="w-full py-20 overflow-hidden bg-[#FCFAF8]">
      
      {/* Cabeçalho da Sessão */}
      <div className="text-center space-y-4 mb-16 px-6">
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
        className="cursor-grab active:cursor-grabbing px-6 md:px-12 select-none"
      >
        <motion.div 
          drag="x" 
          dragConstraints={{ right: 0, left: -width }} 
          className="flex gap-6 md:gap-8 w-max"
        >
          {chapters.map((chapter) => (
            <motion.div 
              key={chapter.id}
              className="relative w-[300px] md:w-[380px] flex-shrink-0 bg-white rounded-[32px] p-3 shadow-[0_8px_30px_rgba(74,68,63,0.04)] border border-pastel-texto/5 group hover:shadow-[0_12px_40px_rgba(74,68,63,0.08)] transition-all duration-500"
            >
              {/* Espaço da Foto Atualizado */}
              <div className="w-full h-[380px] md:h-[460px] rounded-[24px] overflow-hidden relative bg-gray-50 border border-pastel-texto/5">
                <img 
                  src={chapter.image} 
                  alt={chapter.title} 
                  // Adicionado efeito de zoom suave ao passar o mouse por cima do card
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none" 
                  // Caso a imagem falhe ou não exista na pasta ainda, carrega o monograma para não quebrar a tela
                  onError={(e) => { (e.target as HTMLImageElement).src = '/monograma.png' }}
                />
                
                {/* Filtro sutil de escurecimento que clareia quando passa o mouse */}
                <div className="absolute inset-0 bg-black/[0.03] group-hover:bg-black/0 transition-colors duration-500 pointer-events-none" />
              </div>

              {/* Textos embaixo da foto */}
              <div className="pt-6 pb-4 px-3 text-center">
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
      <div className="text-center mt-10 text-pastel-texto/80 text-[10px] uppercase tracking-[0.2em] font-sans animate-pulse">
        ← Arraste para os lados →
      </div>

    </div>
  );
}