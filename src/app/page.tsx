'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from '../components/Countdown';
import { Lock, X } from "lucide-react";

// 1. Isolamos o Toast que consome o 'useSearchParams' para não quebrar o build estático
function UnauthorizedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Se a URL contiver o erro de não autorizado, exibe o alerta
    if (searchParams.get('error') === 'unauthorized') {
      setShowToast(true);

      // Limpa a URL para o "/?error=unauthorized" sumir da barra de endereço
      router.replace('/');

      // Esconde o alerta automaticamente depois de 5 segundos
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed top-30 left-1/2 -translate-x-1/2
            z-[250]
            w-[92%] max-w-md
            overflow-hidden
            rounded-[28px]
            border border-white/40
            bg-white/70
            backdrop-blur-2xl
            shadow-[0_12px_50px_rgba(0,0,0,0.12)]
          "
        >
          {/* Glow decorativo */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-[#efe7de]/30 pointer-events-none" />

          {/* Linha superior elegante */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d8c3a5] to-transparent" />

          <div className="relative p-5 flex items-start gap-4 text-left">

            {/* Ícone */}
            <div
              className="
                flex items-center justify-center
                min-w-11 h-11 rounded-full
                bg-[#f7f3ee]
                border border-[#ece3d8]
                shadow-sm
              "
            >
              <Lock
                size={16}
                strokeWidth={1.7}
                className="text-[#b59b7d]"
              />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pr-2">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#b59b7d] font-semibold">
                Área Privada
              </p>

              <h4 className="mt-1 text-[22px] leading-none text-stone-800 font-serif italic">
                Acesso exclusivo
              </h4>

              <p className="mt-3 text-[14px] leading-relaxed text-stone-600">
                Esta página é reservada para convidados.
                Clique em{" "}
                <span className="font-medium text-stone-800">
                  RSVP
                </span>{" "}
                no menu superior e insira seu código de acesso.
              </p>
            </div>

            {/* Botão fechar */}
            <button
              onClick={() => setShowToast(false)}
              className="
                relative z-20
                flex items-center justify-center
                min-w-8 h-8 rounded-full
                text-stone-400
                hover:text-stone-700
                hover:bg-black/5
                transition-all duration-300
                cursor-pointer
              "
            >
              <X size={20} strokeWidth={2} />
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
    <main className="min-h-screen bg-[#f3f2ee]">
      {/* INTRODUÇÃO E TIMER */}
      <section className="relative z-20 -mt-32 pb-24 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif italic text-stone-800">Bem-vindos ao nosso site</h2>
            <p className="text-stone-600 leading-relaxed font-light text-lg">
              Criamos este espaço para compartilhar com vocês cada detalhe da nossa caminhada até o altar. 
              Aqui você encontrará nossa história, informações sobre o local da cerimônia, nossa lista de presentes 
              e, claro, o espaço para confirmar sua presença. Estamos ansiosos para celebrar este dia 
              inesquecível ao seu lado. Ah! e se quiser deixar uma mensagem para a gente, tem um espaço especial para isso também. Basta clicar no botão RSVP e escrever o que quiser!
            </p>
          </div>

          <div className="py-12 border-y border-stone-200/60">
            <p className="text-stone-400 uppercase tracking-[0.5em] text-[10px] mb-10 font-bold">
              Faltam para o grande dia:
            </p>
            <Countdown />
          </div>
          
          <p className="text-stone-500 font-serif italic text-xl">28 de Agosto de 2026 • Fortaleza, CE</p>

          {/* O segredo do build de sucesso: envelopar o componente dinâmico com o Suspense */}
          <Suspense fallback={null}>
            <UnauthorizedToast />
          </Suspense>

        </div>
      </section>
    </main>
  );
}