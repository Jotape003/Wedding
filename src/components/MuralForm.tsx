'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MuralForm() {
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const router = useRouter();

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensagem.trim()) return;

    setLoading(true);
    setErro('');

    try {
      const res = await fetch('/api/mural', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conteudo: mensagem,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem.');
      }

      setSucesso(true);
      setMensagem('');

      router.refresh();

      setTimeout(() => {
        setSucesso(false);
      }, 3000);
    } catch (err) {
      setErro(
        err instanceof Error ? err.message : 'Erro ao enviar mensagem.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-20 relative group mt-12">

      {/* Card de fundo desalinhado */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-butter/80 via-pastel-blush/50 to-pastel-sage/50 rounded-[32px] rotate-[-3deg] scale-[1.02] shadow-md z-0 transition-transform duration-500 group-hover:rotate-[-4deg]" />

      {/* Container da borda animada */}
      <div className="relative mx-auto mt-12 mb-12 max-w-3xl rounded-[34px] p-[3px] overflow-hidden shadow-[0_8px_30px_rgba(74,68,63,0.08)]">

        {/* Fundo degradê giratório */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,var(--color-pastel-blush),var(--color-pastel-butter),var(--color-pastel-lavender),var(--color-pastel-sage),var(--color-pastel-blush))] animate-[spin_6s_linear_infinite] w-[200%] h-[200%] top-[-50%] left-[-50%]" />

        {/* Card principal */}
        <div className="relative py-12 px-4 md:px-8 bg-white/90 backdrop-blur-xl rounded-[32px] w-full h-full flex flex-col items-center">

          {/* Selo superior */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pastel-blush px-4 py-1 rounded-full border-[3px] border-[#FCFAF8] shadow-md z-30 transition-transform duration-500 group-hover:-translate-y-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-pastel-texto font-sans">
              Livro de Visitas
            </span>
          </div>

          <div className="relative z-10 mt-2 w-full">
            <h3 className="font-serif italic text-3xl text-pastel-texto mb-2 text-center">
              Deixe seu carinho...
            </h3>

            <p className="text-pastel-texto/70 text-sm font-sans font-light text-center mb-8 px-4">
              Escreva um recadinho fofo para lermos e guardarmos com carinho.
            </p>

            <form
              onSubmit={handleEnviar}
              className="flex flex-col gap-4 relative"
            >
              <textarea
                placeholder="Era uma vez..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={4}
                disabled={loading || sucesso}
                className="w-full p-5 rounded-2xl border border-pastel-texto/10 bg-white text-pastel-texto font-sans text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blush/60 focus:border-transparent resize-none placeholder:text-pastel-texto/30 transition-all shadow-inner"
              />

              {erro && (
                <p className="text-pastel-blush text-xs font-medium text-center">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || sucesso || !mensagem.trim()}
                className="self-end px-8 py-3.5 bg-pastel-blush text-white rounded-full font-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-pastel-blush/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>

          {/* Overlay de sucesso */}
          <AnimatePresence>
            {sucesso && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#FCFAF8]/95 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-[32px]"
              >
                <div className="w-16 h-16 bg-pastel-sage/20 text-pastel-sage border border-pastel-sage/40 rounded-full flex items-center justify-center mb-4 text-3xl font-bold shadow-sm">
                  ✓
                </div>

                <p className="font-serif italic text-2xl text-pastel-texto">
                  Mensagem guardada!
                </p>

                <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-pastel-texto/50 mt-2">
                  O mural foi atualizado
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}