'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Check, PartyPopper, ArrowLeft, ChevronDown, UserCheck, Users } from 'lucide-react';
import { validarCodigo, confirmarPresenca } from '@/src/actions/rsvp';

type FamiliaData = {
  id: string;
  nomeExibicao: string;
  numeroConfirmados: number | null;
  convidados: { id: string; nome: string }[];
};

export default function RsvpPage() {
  const [etapa, setEtapa] = useState<'CODIGO' | 'CONFIRMACAO' | 'SUCESSO'>('CODIGO');
  const [codigo, setCodigo] = useState('');
  const [familia, setFamilia] = useState<FamiliaData | null>(null);
  const [qtdSelecionada, setQtdSelecionada] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleValidar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    const res = await validarCodigo(codigo);

    if (res.error) {
      setErro(res.error);
    } else if (res.familia) {
      setFamilia(res.familia);
      if (res.familia.numeroConfirmados !== null) {
        setQtdSelecionada(res.familia.numeroConfirmados);
      } else {
        setQtdSelecionada(res.familia.convidados.length);
      }
      setEtapa('CONFIRMACAO');
    }
    setLoading(false);
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familia) return;
    
    setLoading(true);
    setErro(null);

    const res = await confirmarPresenca(familia.id, qtdSelecionada);

    if (res.error) {
      setErro(res.error);
    } else {
      setEtapa('SUCESSO');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden flex flex-col items-center">
      {/* Aumentamos a largura máxima para dar respiro (max-w-4xl) */}
      <div className="max-w-4xl w-full relative z-10 mt-8">
        
        {/* Cabeçalho */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-2">
             {etapa === 'SUCESSO' ? <PartyPopper size={28} /> : <Users size={28} strokeWidth={1.5} />}
          </div>
          <h1 className="text-5xl md:text-6xl font-serif italic text-pastel-texto">
            Presença
          </h1>
          <p className="text-pastel-texto/60 text-xs md:text-sm font-sans font-light uppercase tracking-[0.3em] max-w-lg mx-auto">
            O nosso dia só será perfeito com você
          </p>
        </div>

        {/* O Card Principal - Agora mais robusto e estruturado */}
        <div className="bg-[#FCFAF8]/95 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(74,68,63,0.08)] border border-white overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* ─── ETAPA 1: DIGITAR CÓDIGO ─── */}
            {etapa === 'CODIGO' && (
              <motion.div 
                key="etapa-codigo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 md:p-16 flex flex-col items-center justify-center text-center max-w-xl mx-auto"
              >
                <div className="w-20 h-20 bg-pastel-blush/10 text-pastel-blush rounded-full flex items-center justify-center mb-8 border border-pastel-blush/20">
                  <KeyRound size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className="font-serif italic text-3xl md:text-4xl text-pastel-texto mb-4">
                  Acesse seu convite
                </h3>
                <p className="text-sm font-sans text-pastel-texto/60 mb-10 leading-relaxed">
                  Digite o código exclusivo que você recebeu no seu convite impresso ou através da nossa mensagem.
                </p>

                <form onSubmit={handleValidar} className="w-full space-y-4">
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={codigo}
                      onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO EX: FAMILIA26"
                      required
                      className="w-full text-center py-5 px-6 rounded-2xl bg-white border-2 border-pastel-texto/10 text-pastel-texto font-sans font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-pastel-blush transition-colors shadow-inner text-lg placeholder:text-sm placeholder:tracking-widest placeholder:text-pastel-texto/30"
                    />
                  </div>
                  
                  <AnimatePresence>
                    {erro && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-400 text-xs font-bold uppercase tracking-wider">
                        {erro}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 py-5 bg-pastel-texto text-[#FCFAF8] rounded-2xl font-sans font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-pastel-texto/90 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Buscando...' : 'Localizar Convite'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── ETAPA 2: CONFIRMAR NÚMERO (LAYOUT DIVIDIDO) ─── */}
            {etapa === 'CONFIRMACAO' && familia && (
              <motion.div 
                key="etapa-confirmacao"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12"
              >
                {/* Boas-vindas alinhada à esquerda para quebrar a centralização */}
                <div className="mb-10 pb-8 border-b border-pastel-texto/10">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pastel-sage mb-2 block">
                    Convite Destravado
                  </span>
                  <h3 className="font-serif italic text-4xl text-pastel-texto">
                    Olá, {familia.nomeExibicao}!
                  </h3>
                </div>

                {/* GRID DE DUAS COLUNAS PARA DISTRIBUIR O ESPAÇO */}
                <form onSubmit={handleConfirmar} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                  
                  {/* Lado Esquerdo: Lista de Convidados com mais "Peso" */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <UserCheck size={20} className="text-pastel-texto/40" />
                      <h4 className="uppercase tracking-[0.15em] text-[11px] text-pastel-texto font-bold">
                        Lista de Convidados
                      </h4>
                    </div>
                    
                    <div className="space-y-3">
                      {familia.convidados.map((c, idx) => (
                        <div key={c.id} className="bg-white p-4 rounded-2xl border border-pastel-texto/5 flex items-center gap-4 shadow-[0_2px_10px_rgba(74,68,63,0.02)]">
                          {/* Avatar com a inicial do nome */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg text-white shadow-sm
                            ${idx % 2 === 0 ? 'bg-pastel-blush/90' : 'bg-pastel-sage/90'}
                          `}>
                            {c.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-sans text-[15px] font-medium text-pastel-texto">
                            {c.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lado Direito: Pergunta e Seletor Redesenhado */}
                  <div className="flex flex-col justify-center">
                    <h4 className="font-serif italic text-3xl text-pastel-texto mb-3">
                      Confirmação
                    </h4>
                    <p className="text-sm font-sans text-pastel-texto/60 mb-8 leading-relaxed">
                      Por favor, nos informe o número exato de pessoas da sua lista que estarão presentes para prepararmos tudo com muito carinho.
                    </p>

                    {/* Caixa do Seletor */}
                    <div className="bg-pastel-sage/5 rounded-3xl p-6 border border-pastel-sage/20 mb-8 relative">
                      <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-pastel-sage mb-3">
                        Total de Confirmados
                      </label>
                      
                      <div className="relative">
                        <select 
                          value={qtdSelecionada}
                          onChange={(e) => setQtdSelecionada(Number(e.target.value))}
                          className="w-full appearance-none bg-white py-4 pl-6 pr-12 rounded-2xl border border-pastel-texto/10 text-pastel-texto font-serif text-2xl italic focus:outline-none focus:border-pastel-sage shadow-sm cursor-pointer transition-colors"
                        >
                          {Array.from({ length: familia.convidados.length + 1 }, (_, i) => (
                            <option key={i} value={i} className="font-sans text-base not-italic">
                              {i} {i === 1 ? 'pessoa' : 'pessoas'}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-pastel-texto/40">
                          <ChevronDown size={24} />
                        </div>
                      </div>

                      {qtdSelecionada === 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] text-pastel-texto/50 font-sans font-medium uppercase tracking-wider mt-4 text-center">
                          Sentiremos sua falta!
                        </motion.p>
                      )}
                    </div>

                    <AnimatePresence>
                      {erro && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">{erro}</motion.p>}
                    </AnimatePresence>

                    {/* Botões Robustos */}
                    <div className="flex gap-4 mt-auto">
                      <button 
                        type="button"
                        onClick={() => setEtapa('CODIGO')}
                        className="px-6 py-4 bg-white border border-pastel-texto/10 text-pastel-texto rounded-2xl hover:bg-[#FCFAF8] hover:border-pastel-texto/20 transition-all shadow-sm cursor-pointer"
                        title="Voltar"
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 bg-pastel-sage text-white rounded-2xl font-sans font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-pastel-sage/90 transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check size={16} />
                        {loading ? 'Salvando...' : 'Confirmar'}
                      </button>
                    </div>
                  </div>

                </form>
              </motion.div>
            )}

            {/* ─── ETAPA 3: SUCESSO ─── */}
            {etapa === 'SUCESSO' && (
              <motion.div 
                key="etapa-sucesso"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 md:p-20 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-pastel-sage/20 text-pastel-sage rounded-full flex items-center justify-center mb-8 border border-pastel-sage/30 shadow-inner">
                  <PartyPopper size={48} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif italic text-4xl md:text-5xl text-pastel-texto mb-4">
                  Tudo Certo!
                </h3>
                <p className="text-pastel-texto/70 text-base md:text-lg font-sans font-light leading-relaxed max-w-md">
                  Sua resposta foi registrada com sucesso no nosso sistema. Agradecemos o carinho e mal podemos esperar por esse dia!
                </p>
                
                <button
                  onClick={() => setEtapa('CODIGO')}
                  className="mt-12 uppercase text-[10px] tracking-[0.2em] font-bold text-pastel-texto/40 hover:text-pastel-texto transition-colors cursor-pointer border-b border-transparent hover:border-pastel-texto pb-1"
                >
                  Confirmar outro convite
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}