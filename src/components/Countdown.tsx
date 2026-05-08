'use client';
import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const target = new Date('2026-08-28T09:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((diff / 1000 / 60) % 60),
        segundos: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Unit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center group">
      <span className="text-5xl md:text-7xl font-serif font-light text-stone-800 transition-transform group-hover:scale-110 duration-500">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-stone-400 mt-2 font-bold">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-12">
      <Unit value={timeLeft.dias} label="Dias" />
      <span className="text-3xl text-stone-200 font-light pb-6">:</span>
      <Unit value={timeLeft.horas} label="Horas" />
      <span className="text-3xl text-stone-200 font-light pb-6">:</span>
      <Unit value={timeLeft.minutos} label="Minutos" />
      <span className="text-3xl text-stone-200 font-light pb-6">:</span>
      <Unit value={timeLeft.segundos} label="Segundos" />
    </div>
  );
}