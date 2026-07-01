'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CreditCard, QrCode, Copy, Check, X, PartyPopper, Heart } from 'lucide-react';
import { buscarPresentesDisponiveis, reservarPresente } from '@/src/actions/presentes';

// Tipagem atualizada para receber o status
type Presente = {
  id: string;
  nome: string;
  imagemUrl: string;
  valor: number;
  linkCredito: string | null;
  linkPix: string | null;
  comprado: boolean; // <-- Novo campo!
};

export default function PresentesPage() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
  const [etapaModal, setEtapaModal] = useState<'ESCOLHA' | 'PIX' | 'SUCESSO'>('ESCOLHA');
  const [copiado, setCopiado] = useState(false);
  const [processando, setProcessando] = useState(false);

  useEffect(() => {
    const carregarPresentes = async () => {
      const res = await buscarPresentesDisponiveis();
      if (res.success && res.presentes) {
        setPresentes(res.presentes as Presente[]);
      }
      setLoading(false);
    };
    carregarPresentes();
  }, []);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const abrirModal = (presente: Presente) => {
    if (presente.comprado) return;
    setPresenteSelecionado(presente);
    setEtapaModal('ESCOLHA');
    setCopiado(false);
  };

  const finalizarReserva = async (metodo: 'CARTAO' | 'PIX') => {
    if (!presenteSelecionado) return;

    let abaPagamento: Window | null = null;
    if (metodo === 'CARTAO') {
      abaPagamento = window.open('', '_blank');
    }

    setProcessando(true);
    await reservarPresente(presenteSelecionado.id);
    
    setPresentes((prev) => {
      const novaLista = prev.map(p => p.id === presenteSelecionado.id ? { ...p, comprado: true } : p);
      return novaLista.sort((a, b) => Number(a.comprado) - Number(b.comprado) || a.valor - b.valor);
    });

    if (metodo === 'CARTAO' && presenteSelecionado.linkCredito) {
      if (abaPagamento) {
        abaPagamento.location.href = presenteSelecionado.linkCredito;
      } else {
        window.location.href = presenteSelecionado.linkCredito;
      }
      setEtapaModal('SUCESSO');
      
    } else if (metodo === 'PIX' && presenteSelecionado.linkPix) {
      navigator.clipboard.writeText(presenteSelecionado.linkPix);
      setCopiado(true);
      setEtapaModal('SUCESSO');
    }
    
    setProcessando(false);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden bg-[#FCFAF8]">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-pastel-lavender/10 to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-lavender mb-2">
            <Gift size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-pastel-texto">
            Lista de Presentes
          </h1>
          <p className="text-pastel-texto/60 text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Sua presença é o nosso maior presente! Mas se desejar nos abençoar com algo para o nosso novo lar, preparamos esta lista com muito carinho.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-pastel-lavender/30 border-t-pastel-lavender rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {presentes.map((presente) => (
              <motion.div 
                layout
                key={presente.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                // Se estiver comprado, adiciona tons de cinza e um pouco de transparência
                className={`bg-white rounded-[24px] overflow-hidden border border-pastel-texto/5 flex flex-col relative transition-all duration-500
                  ${presente.comprado ? 'opacity-70 grayscale shadow-none' : 'group hover:shadow-[0_8px_30px_rgba(74,68,63,0.08)] shadow-[0_8px_30px_rgba(74,68,63,0.04)]'}
                `}
              >
                
                {/* ETIQUETA DE COMPRADO (Overlay de Vidro) */}
                {presente.comprado && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                    <div className="bg-pastel-texto/90 text-white px-6 py-2.5 rounded-full font-sans font-bold uppercase tracking-[0.15em] text-[10px] shadow-lg flex items-center gap-2 transform -rotate-12 backdrop-blur-md">
                      <Heart size={14} className="fill-white" /> Já Presenteado
                    </div>
                  </div>
                )}

                <div className="w-full h-56 relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={presente.imagemUrl} 
                    alt={presente.nome} 
                    className={`max-w-full max-h-full object-contain transition-transform duration-500 ${!presente.comprado && 'group-hover:scale-105'}`}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/monograma.png' }}
                  />
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className={`font-sans font-medium text-sm mb-2 line-clamp-2 ${presente.comprado ? 'text-pastel-texto/50 line-through' : 'text-pastel-texto'}`}>
                    {presente.nome}
                  </h3>
                  <p className={`font-serif italic text-xl mb-6 mt-auto ${presente.comprado ? 'text-pastel-texto/40' : 'text-pastel-lavender'}`}>
                    {formatarMoeda(presente.valor)}
                  </p>
                  
                  {/* Esconde o botão de presentear se já estiver comprado */}
                  {!presente.comprado && (
                    <button 
                      onClick={() => abrirModal(presente)}
                      className="w-full py-3.5 bg-pastel-fundo text-pastel-texto border border-pastel-texto/10 rounded-xl font-sans font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-pastel-lavender hover:text-white hover:border-pastel-lavender transition-all duration-300 relative z-30"
                    >
                      Presentear
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ─── MODAL DE PAGAMENTO (CÓDIGO INTACTO) ─── */}
      {/* ... Mantenha o bloco AnimatePresence do seu modal de pagamento que já funcionava perfeitamente ... */}
      <AnimatePresence>
        {presenteSelecionado && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !processando && setPresenteSelecionado(null)}
              className="absolute inset-0 bg-pastel-texto/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl z-10 overflow-hidden"
            >
              {!processando && etapaModal !== 'SUCESSO' && (
                <button 
                  onClick={() => setPresenteSelecionado(null)}
                  className="absolute top-6 right-6 text-pastel-texto/40 hover:text-pastel-texto transition-colors"
                >
                  <X size={20} />
                </button>
              )}

              <AnimatePresence mode="wait">
                
                {/* ETAPA 1: ESCOLHER MÉTODO */}
                {etapaModal === 'ESCOLHA' && (
                  <motion.div key="escolha" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-pastel-lavender/10 flex items-center justify-center text-pastel-lavender mb-2">
                      <Gift size={28} />
                    </div>
                    <div>
                      <h3 className="font-serif italic text-2xl text-pastel-texto mb-1">Muito Obrigado!</h3>
                      <p className="text-sm text-pastel-texto/60">Você escolheu nos presentear com:</p>
                      <p className="font-sans font-bold text-pastel-texto mt-2">{presenteSelecionado.nome} — {formatarMoeda(presenteSelecionado.valor)}</p>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-xs text-orange-800/80 mb-6">
                      <strong>Atenção:</strong> Ao clicar em uma das opções abaixo, este item será reservado e removido da lista para outros convidados.
                    </div>

                    <div className="space-y-3">
                      {presenteSelecionado.linkCredito && (
                        <button 
                          onClick={() => finalizarReserva('CARTAO')}
                          disabled={processando}
                          className="w-full py-4 px-6 bg-[#1A1A1A] text-white rounded-2xl font-sans font-medium flex items-center justify-center gap-3 hover:bg-black transition-colors disabled:opacity-50"
                        >
                          <CreditCard size={18} />
                          Pagar com Cartão
                        </button>
                      )}
                      
                      {presenteSelecionado.linkPix && (
                        <button 
                          onClick={() => setEtapaModal('PIX')}
                          disabled={processando}
                          className="w-full py-4 px-6 bg-[#00B4A0] text-white rounded-2xl font-sans font-medium flex items-center justify-center gap-3 hover:bg-[#00A390] transition-colors disabled:opacity-50"
                        >
                          <QrCode size={18} />
                          Pagar com Pix
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ETAPA 2: MOSTRAR CÓDIGO PIX */}
                {etapaModal === 'PIX' && (
                  <motion.div key="pix" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-[#00B4A0]/10 flex items-center justify-center text-[#00B4A0] mb-2">
                      <QrCode size={28} />
                    </div>
                    <h3 className="font-serif italic text-2xl text-pastel-texto mb-2">Pix Copia e Cola</h3>
                    <p className="text-xs text-pastel-texto/60 mb-6">
                      Copie o código abaixo, abra o aplicativo do seu banco e escolha a opção "Pix Copia e Cola".
                    </p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 break-all text-[10px] text-gray-500 font-mono h-24 overflow-y-auto relative">
                      {presenteSelecionado.linkPix}
                    </div>

                    <button 
                      onClick={() => finalizarReserva('PIX')}
                      disabled={processando}
                      className="w-full py-4 px-6 bg-[#00B4A0] text-white rounded-2xl font-sans font-bold uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 hover:bg-[#00A390] transition-all"
                    >
                      {processando ? 'Processando...' : copiado ? <><Check size={16} /> Código Copiado!</> : <><Copy size={16} /> Copiar Código Pix</>}
                    </button>
                  </motion.div>
                )}

                {/* ETAPA 3: SUCESSO (OBRIGADO) */}
                {etapaModal === 'SUCESSO' && (
                  <motion.div key="sucesso" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-pastel-sage/10 flex items-center justify-center text-pastel-sage mb-6">
                      <PartyPopper size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif italic text-3xl text-pastel-texto mb-2">Deu tudo certo!</h3>
                    <p className="text-sm text-pastel-texto/60 leading-relaxed max-w-xs mx-auto">
                      O presente foi reservado e agradecemos imensamente pelo seu carinho conosco.
                    </p>
                    <button 
                      onClick={() => setPresenteSelecionado(null)}
                      className="mt-8 px-8 py-3 bg-pastel-fundo text-pastel-texto rounded-full font-sans font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-pastel-texto hover:text-white transition-all"
                    >
                      Voltar para a lista
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}