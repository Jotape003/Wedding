'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, CreditCard, QrCode, Copy, Check, X, PartyPopper, Heart, MessageSquare, User } from 'lucide-react';
import { buscarPresentesDisponiveis, registrarCompraPresente } from '@/src/actions/presentes';

type Presente = {
  id: string;
  nome: string;
  imagemUrl: string;
  valor: number;
  linkCredito: string | null;
  linkPix: string | null;
  comprado: boolean;
};

export default function PresentesPage() {
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Controles do Modal e Formas de Pagamento
  const [presenteSelecionado, setPresenteSelecionado] = useState<Presente | null>(null);
  const [etapaModal, setEtapaModal] = useState<'IDENTIFICACAO' | 'PAGAMENTO' | 'SUCESSO'>('IDENTIFICACAO');
  const [metodoSelecionado, setMetodoSelecionado] = useState<'CARTAO' | 'PIX' | null>(null);
  
  // Dados do Convidado
  const [compradorNome, setCompradorNome] = useState('');
  const [mensagem, setMensagem] = useState('');
  
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
    setEtapaModal('IDENTIFICACAO');
    setMetodoSelecionado(null);
    setCompradorNome('');
    setMensagem('');
    setCopiado(false);
  };

  // Avança do nome para a tela com as opções de Pix/Cartão
  const avancarParaPagamento = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compradorNome.trim()) return;
    setEtapaModal('PAGAMENTO');
  };

  // Abre o link do cartão tratando o bloqueio do Safari
  const abrirLinkCartao = () => {
    if (presenteSelecionado?.linkCredito) {
      window.open(presenteSelecionado.linkCredito, '_blank');
    }
  };

  // Copia o código Pix para a área de transferência
  const copiarPix = () => {
    if (presenteSelecionado?.linkPix) {
      navigator.clipboard.writeText(presenteSelecionado.linkPix);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  // Ação definitiva acionada apenas quando o convidado confirma que pagou
  const finalizarCompra = async () => {
    if (!presenteSelecionado || !compradorNome.trim()) return;
    setProcessando(true);

    const res = await registrarCompraPresente(presenteSelecionado.id, compradorNome, mensagem);

    if (res.success) {
      // Altera o status localmente para "borrar" o item na tela e jogá-lo para baixo
      setPresentes((prev) => {
        const novaLista = prev.map(p => p.id === presenteSelecionado.id ? { ...p, comprado: true } : p);
        return novaLista.sort((a, b) => Number(a.comprado) - Number(b.comprado) || a.valor - b.valor);
      });
      setEtapaModal('SUCESSO');
    }

    setProcessando(false);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[500px] to-transparent pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabeçalho */}
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
                className={`bg-white rounded-[24px] overflow-hidden border border-pastel-texto/5 flex flex-col relative transition-all duration-500
                  ${presente.comprado ? 'opacity-70 grayscale shadow-none' : 'group hover:shadow-[0_8px_30px_rgba(74,68,63,0.08)] shadow-[0_8px_30px_rgba(74,68,63,0.04)]'}
                `}
              >
                
                {/* ETIQUETA DE COMPRADO */}
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

      {/* ─── MODAL DE FLUXO SEGURO CONTRA CURIOSOS ─── */}
      <AnimatePresence>
        {presenteSelecionado && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !processando && etapaModal !== 'SUCESSO' && setPresenteSelecionado(null)}
              className="absolute inset-0 bg-pastel-texto/60 backdrop-blur-md"
            />

            {/* Caixa do Modal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-6 md:p-8 shadow-2xl z-10 custom-scrollbar"
            >
              {/* Botão Fechar lateral */}
              {!processando && etapaModal !== 'SUCESSO' && (
                <button 
                  onClick={() => setPresenteSelecionado(null)}
                  className="absolute top-6 right-6 text-pastel-texto/40 hover:text-pastel-texto transition-colors z-50 bg-white/80 rounded-full p-1 backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
              )}

              <AnimatePresence mode="wait">
                
                {/* ─── ETAPA 1: BARREIRA DE IDENTIFICAÇÃO (E AGORA A IMAGEM FICA AQUI) ─── */}
                {etapaModal === 'IDENTIFICACAO' && (
                  <motion.div key="identificacao" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-6">
                    
                    {/* Imagem Grande e Centralizada */}
                    <div className="flex flex-col items-center text-center mt-2 mb-6">
                      <div className="w-28 h-28 md:w-32 md:h-32 bg-gray-50 rounded-3xl border border-pastel-texto/5 overflow-hidden flex items-center justify-center p-3 shadow-inner mb-4 relative group">
                        <img 
                          src={presenteSelecionado.imagemUrl} 
                          alt={presenteSelecionado.nome} 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/monograma.png' }}
                        />
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-pastel-texto/40 block mb-1">
                        Você está presenteando:
                      </span>
                      <h4 className="font-sans font-bold text-lg text-pastel-texto max-w-[280px] leading-tight">
                        {presenteSelecionado.nome}
                      </h4>
                      <p className="font-serif italic text-xl text-pastel-lavender mt-1">
                        {formatarMoeda(presenteSelecionado.valor)}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-[11px] text-pastel-texto/60 max-w-[260px] mx-auto mb-4 leading-relaxed uppercase tracking-wider font-bold">
                        Informe seu nome antes de prosseguir
                      </p>
                    </div>

                    <form onSubmit={avancarParaPagamento} className="space-y-4">
                      <div className="space-y-1 relative">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-pastel-texto/40 flex items-center gap-1.5 pl-1">
                          <User size={12} /> Seu Nome Completo
                        </label>
                        <input 
                          type="text" required value={compradorNome} onChange={(e) => setCompradorNome(e.target.value)}
                          placeholder="Ex: João Silva"
                          className="w-full px-4 py-3.5 rounded-xl border border-pastel-texto/10 bg-gray-50 focus:bg-white text-sm text-pastel-texto font-sans focus:outline-none focus:border-pastel-lavender transition-all"
                        />
                      </div>

                      <div className="space-y-1 relative">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-pastel-texto/40 flex items-center gap-1.5 pl-1">
                          <MessageSquare size={12} /> Deixe um Recado (Opcional)
                        </label>
                        <textarea 
                          value={mensagem} onChange={(e) => setMensagem(e.target.value)} rows={2}
                          placeholder="Escreva uma mensagem carinhosa..."
                          className="w-full px-4 py-3.5 rounded-xl border border-pastel-texto/10 bg-gray-50 focus:bg-white text-sm text-pastel-texto font-sans focus:outline-none focus:border-pastel-lavender transition-all resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full mt-2 py-4 bg-pastel-texto text-white rounded-xl font-sans font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-colors"
                      >
                        Avançar para Pagamento
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ─── ETAPA 2: OPÇÕES DE MEIOS DE PAGAMENTO + CONFIRMAÇÃO DO USUÁRIO ─── */}
                {etapaModal === 'PAGAMENTO' && (
                  <motion.div key="pagamento" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 15 }} className="space-y-6">
                    
                    {/* Título Menor do Presente na Etapa 2 para não perder o contexto */}
                    <div className="text-center pb-4 border-b border-gray-100">
                       <h2 className="font-sans font-bold text-lg text-pastel-texto">{presenteSelecionado.nome}</h2>
                       <p className="font-serif italic text-2xl text-pastel-lavender">{formatarMoeda(presenteSelecionado.valor)}</p>
                    </div>

                    {/* SELEÇÃO DO MÉTODO */}
                    {metodoSelecionado === null ? (
                      <div className="space-y-3 pt-2 text-center">
                        <p className="text-xs text-pastel-texto/50 mb-4">Escolha a sua forma de pagamento preferida:</p>
                        
                        {presenteSelecionado.linkCredito && (
                          <button 
                            onClick={() => { setMetodoSelecionado('CARTAO'); abrirLinkCartao(); }}
                            className="w-full py-4 px-6 bg-[#1A1A1A] text-white rounded-2xl font-sans font-medium flex items-center justify-center gap-3 hover:bg-black transition-colors shadow-sm"
                          >
                            <CreditCard size={18} /> Pagar com Cartão
                          </button>
                        )}
                        
                        {presenteSelecionado.linkPix && (
                          <button 
                            onClick={() => setMetodoSelecionado('PIX')}
                            className="w-full py-4 px-6 bg-[#00B4A0] text-white rounded-2xl font-sans font-medium flex items-center justify-center gap-3 hover:bg-[#00A390] transition-colors shadow-sm"
                          >
                            <QrCode size={18} /> Pagar com Pix
                          </button>
                        )}
                      </div>
                    ) : (
                      /* INTERFACE DO MÉTODO SELECIONADO */
                      <div className="space-y-6 pt-2">
                        {metodoSelecionado === 'CARTAO' && (
                          <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                            <p className="text-xs text-pastel-texto/70 leading-relaxed">
                              Uma nova aba foi aberta no sistema de pagamento da <strong>InfinitePay</strong>.
                            </p>
                            <button 
                              onClick={abrirLinkCartao}
                              className="text-[11px] font-bold uppercase tracking-wider text-pastel-lavender underline block mx-auto hover:text-pastel-texto transition-colors mt-4"
                            >
                              Clique aqui se a aba não abriu
                            </button>
                          </div>
                        )}

                        {metodoSelecionado === 'PIX' && (
                          <div className="flex flex-col items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center">
                            <p className="text-xs text-pastel-texto/60 leading-relaxed mb-4">
                              Escaneie o QR Code ou use a opção Pix Copia e Cola:
                            </p>
                            
                            {/* IMAGEM DO QR CODE GERADA AUTOMATICAMENTE */}
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-5">
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(presenteSelecionado.linkPix || '')}`}
                                alt="QR Code Pix"
                                className="w-40 h-40 object-contain"
                              />
                            </div>

                            <button 
                              onClick={copiarPix}
                              className="w-full py-3.5 bg-[#00B4A0] text-white rounded-xl font-sans font-bold uppercase tracking-wider text-[10px] flex items-center justify-center gap-2 hover:bg-[#00A390] transition-all shadow-sm"
                            >
                              {copiado ? <><Check size={14} /> Copiado com sucesso!</> : <><Copy size={14} /> Copiar Código Pix</>}
                            </button>
                          </div>
                        )}

                        {/* A TRAVA HUMANA: PERGUNTA DEFINITIVA */}
                        <div className="pt-2">
                          <p className="text-xs font-bold text-pastel-texto leading-relaxed mb-4 text-center">
                            {compradorNome}, concluiu a transação de pagamento no seu banco?
                          </p>
                          
                          <div className="flex gap-3">
                            <button
                              type="button" disabled={processando}
                              onClick={() => setMetodoSelecionado(null)}
                              className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-pastel-texto/60 text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                            >
                              Voltar
                            </button>
                            <button
                              type="button" disabled={processando}
                              onClick={finalizarCompra}
                              className="flex-1 py-3.5 bg-pastel-sage text-white text-[10px] font-sans font-bold uppercase tracking-widest rounded-xl hover:bg-pastel-sage/90 shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {processando ? 'Processando...' : <><Check size={14} strokeWidth={2.5} /> Sim, já paguei!</>}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ─── ETAPA 3: SUCESSO COBERTO DE CONFETES ─── */}
                {etapaModal === 'SUCESSO' && (
                  <motion.div key="sucesso" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-4">
                    <div className="mx-auto w-20 h-20 rounded-full bg-pastel-sage/10 flex items-center justify-center text-pastel-sage mb-4">
                      <PartyPopper size={40} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif italic text-3xl text-pastel-texto mb-2">Muito obrigado!</h3>
                    <p className="text-sm text-pastel-texto/60 leading-relaxed max-w-xs mx-auto">
                      Parabéns, seu presente foi reservado com sucesso! Já salvamos sua mensagem e estamos muito ansiosos pelo nosso encontro no dia 28 de Agosto!
                    </p>
                    <button 
                      onClick={() => setPresenteSelecionado(null)}
                      className="mt-6 px-8 py-3.5 bg-pastel-fundo text-pastel-texto border border-pastel-texto/10 rounded-full font-sans font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-pastel-texto hover:text-white transition-all"
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