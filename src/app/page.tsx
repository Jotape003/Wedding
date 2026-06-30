'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from '../components/Countdown';
import { Heart, Lock, X } from "lucide-react";
import StoryCarousel from '../components/StoryCarousel';

// 1. Isolamos o Toast que consome o 'useSearchParams' para não quebrar o build estático
function UnauthorizedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setShowToast(true);

      router.replace('/');

      const timer = setTimeout(() => {
        setShowToast(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed top-[90px] left-1/2 -translate-x-1/2
            z-[250]
            w-[92%] max-w-md
            overflow-hidden
            rounded-[28px]
            border border-pastel-blush/20
            bg-white/90
            backdrop-blur-xl
            shadow-[0_20px_60px_rgba(74,68,63,0.12)]
          "
        >
          {/* Glow suave */}
          <div className="absolute inset-0 bg-gradient-to-br from-pastel-blush/10 via-transparent to-pastel-butter/20 pointer-events-none" />

          {/* Linha decorativa superior */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-pastel-blush to-transparent" />

          <div className="relative p-5 flex items-start gap-4">

            {/* Ícone */}
            <div
              className="
                flex items-center justify-center
                min-w-12 h-12
                rounded-full
                bg-pastel-blush/15
                border border-pastel-blush/20
                shadow-sm
              "
            >
              <Lock size={20} strokeWidth={2.5} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pr-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-pastel-blush font-bold">
                Área Especial
              </p>

              <h4 className="mt-1 text-2xl font-serif font-bold italic text-pastel-texto">
                Convite necessário
              </h4>

              <p className="mt-3 text-sm leading-relaxed text-pastel-texto/70 font-sans">
                Esta página foi preparada para nossos convidados confirmados.
                Para continuar, basta realizar seu{' '}
                <span className="font-semibold text-pastel-texto">
                  RSVP
                </span>{' '}
                utilizando o menu superior.
              </p>
            </div>

            {/* Fechar */}
            <button
              onClick={() => setShowToast(false)}
              className="
                flex items-center justify-center
                min-w-8 h-8
                rounded-full
                text-pastel-texto/40
                hover:text-pastel-texto
                hover:bg-pastel-blush/10
                transition-all duration-300
                cursor-pointer
              "
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 2. Componente principal da página limpo e compatível com a renderização estática
export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* INTRODUÇÃO E TIMER */}
      <section className="relative z-20 pt-12 pb-12 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-2">
                 <Heart size={28} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif italic text-pastel-texto">
              Sejam bem-vindos!
            </h2>
            <p className="text-pastel-texto/80 leading-relaxed font-light text-lg">
              Criamos este espaço para dividir com vocês cada etapa da nossa caminhada até o altar. Aqui, vocês encontrarão nossa história, os detalhes da nossa cerimônia, a nossa lista de presentes e o campo dedicado para a Confirmação de Presença.
              
              Além disso, preparamos um Mural especial para guardarmos o carinho de quem amamos; fiquem à vontade para deixar sua mensagem por lá. Estamos contando os dias para celebrar este capítulo inesquecível ao lado de vocês!
            </p>
          </div>

          {/* O Bloco do Contador Repaginado (Com Borda Animada Pastel) */}
          <div className="relative mx-auto mt-12 mb-12 max-w-3xl rounded-[34px] p-[3px] overflow-hidden shadow-[0_8px_30px_rgba(74,68,63,0.08)]">

            
            {/* 1. O Efeito Mágico: Fundo Degradê Giratório */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,var(--color-pastel-blush),var(--color-pastel-butter),var(--color-pastel-lavender),var(--color-pastel-sage),var(--color-pastel-blush))] animate-[spin_6s_linear_infinite] w-[200%] h-[200%] top-[-50%] left-[-50%]" />   

            {/* 2. O Card Principal (Fica por cima, cobrindo o miolo e deixando só a borda vazar) */}
            <div className="relative py-12 px-4 md:px-8 bg-white/90 backdrop-blur-xl rounded-[32px] w-full h-full flex flex-col items-center">
              
              {/* Detalhe flutuante no topo */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pastel-blush px-4 py-1 rounded-full border-[3px] border-[#FCFAF8] shadow-md z-30 transition-transform duration-500 group-hover:-translate-y-1">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-pastel-texto font-sans">
                  Contagem Regressiva
                </span>
              </div>

              <p className="text-pastel-texto/60 uppercase tracking-[0.4em] text-[15px] mb-8 font-bold font-sans mt-2">
                Faltam para o grande dia:
              </p>
              
              <Countdown />
            </div>
          </div>
          
          {/* Data e Local de Destaque Inferior */}
          <div className="space-y-1 pb-8">
            <p className="text-pastel-texto font-serif italic text-2xl md:text-3xl tracking-wide">
              28 de Agosto de 2026
            </p>
            <p className="text-pastel-texto/60 font-sans uppercase tracking-[0.2em] text-xs font-medium">
              Fortaleza, CE
            </p>
          </div>

          <Suspense fallback={null}>
            <UnauthorizedToast />
          </Suspense>

        </div>
      </section>

      {/* ─── NOSSA HISTÓRIA (Carrossel Interativo) ─── */}
      <section className="relative z-20 pb-24">
        {/* Usamos o componente que acabamos de criar */}
        <StoryCarousel />
      </section>

    </main>
  );
}