'use client';
import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Evita o erro de hidratação do Next.js garantindo que o timer só rode no cliente
    setIsMounted(true);

    // A data do grande dia!
    const targetDate = new Date('2026-08-28T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        dias: Math.floor(distance / (1000 * 60 * 60 * 24)),
        horas: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Previne aquele piscar de números errados antes do site carregar por completo
  if (!isMounted) {
    return <div className="h-[88px] md:h-[112px] w-full" />; 
  }

  const timeBlocks = [
    { label: 'Dias', value: timeLeft.dias },
    { label: 'Horas', value: timeLeft.horas },
    { label: 'Minutos', value: timeLeft.minutos },
    { label: 'Segundos', value: timeLeft.segundos },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 select-none">
      {timeBlocks.map((block, index) => (
        <div key={block.label} className="flex items-center">
          
          {/* O Bloco do Número + Texto */}
          <div className="flex flex-col items-center w-[60px] md:w-24">
            <span className="text-4xl md:text-7xl font-serif text-pastel-texto tracking-tight drop-shadow-sm">
              {String(block.value).padStart(2, '0')}
            </span>
            <span className="text-[8px] md:text-[10px] font-sans uppercase tracking-[0.3em] text-pastel-texto/50 mt-3 font-semibold">
              {block.label}
            </span>
          </div>

          {/* O Separador (:) - Escondido no último bloco */}
          {index < timeBlocks.length - 1 && (
            <span className="text-2xl md:text-4xl font-serif text-pastel-texto/30 mx-1 md:mx-2 -mt-6">
              :
            </span>
          )}
          
        </div>
      ))}
    </div>
  );
}