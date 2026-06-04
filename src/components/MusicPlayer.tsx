'use client';
import { useState, memo, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MusicPlayer = memo(function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const playlistId = "37i9dQZF1EJHevdp29Ll2V?si=jaVte_AeQ4iiA9Ij8h5WEA";

  const handleToggle = (e?: MouseEvent<HTMLButtonElement>) => {
    if (isDragging) return;
    if (!isOpen) setIsPlaying(true);
    setIsOpen(prev => !prev);
  };

  const handleStop = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPlaying(false);
    setIsOpen(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => requestAnimationFrame(() => setIsDragging(false))}
      className="fixed bottom-10 left-10 z-[100] cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className={`absolute bottom-full mb-6 transition-all duration-500 origin-bottom-left ${
          isOpen && isPlaying ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="rounded-[2.5rem] overflow-hidden bg-[#0f0f0f] w-[300px] h-[152px] shadow-2xl ring-1 ring-white/10">
          {isPlaying && (
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0"
            />
          )}
        </div>
      </div>
    
      <div className="relative group">
        <button
          onClick={handleToggle}
          className={`flex items-center p-1.5 rounded-full transition-all duration-500 shadow-2xl border bg-white/80 backdrop-blur-md border-stone-200/50 hover:border-stone-300 cursor-pointer ${
            isPlaying ? 'pr-1.5' : 'pr-8' // Remove o recuo extra da direita se estiver tocando
          }`}
        >
          {/* O "Disco" do Spotify */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-700 shadow-lg ${
            isPlaying ? 'bg-stone-900 rotate-[360deg]' : 'bg-stone-900'
          }`}>
            <img
              src="/spotify.png"
              alt="Spotify"
              className={`w-7 h-7 object-contain transition-all ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            />
          </div>

          {/* Bloco de Texto Animado (Desaparece quando dá o play) */}
          <div className={`flex flex-col items-start select-none transition-all duration-500 overflow-hidden ${
            isPlaying 
              ? 'w-0 opacity-0 ml-0 pointer-events-none' 
              : 'w-[120px] opacity-100 ml-4' // Mantém o tamanho original se estiver pausado
          }`}>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-stone-800 whitespace-nowrap">
              Nossa Trilha
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-stone-400 whitespace-nowrap">
              Clique e dê o play!
            </span>
          </div>
        </button>

        {/* Botão de Stop (Quadradinho para parar a música) */}
        <AnimatePresence>
          {isPlaying && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleStop}
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl border-2 border-white hover:bg-red-500 transition-colors duration-300 cursor-pointer z-30"
              title="Desligar vitrola"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default MusicPlayer;