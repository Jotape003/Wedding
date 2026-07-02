'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Check, PartyPopper, ArrowLeft, Users } from 'lucide-react';
import { validarCodigo, confirmarPresenca } from '@/src/actions/rsvp';

type Convidado = { id: string; nome: string; confirmado: boolean };

type FamiliaData = {
  id: string;
  nomeExibicao: string;
  convidados: Convidado[];
};

export default function RsvpPage() {
  const [etapa, setEtapa] = useState<'CODIGO' | 'CONFIRMACAO' | 'SUCESSO'>('CODIGO');
  const [codigo, setCodigo] = useState('');
  const [familia, setFamilia] = useState<FamiliaData | null>(null);
  
  // O NOVO ESTADO: Guarda um Array com os IDs de quem foi "ticado" na tela
  const [selecionados, setSelecionados] = useState<string[]>([]);
  
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
      setFamilia(res.familia as FamiliaData);
      
      // Quando abrir, já deixa marcado quem estava confirmado no banco
      const jaConfirmados = res.familia.convidados
        .filter((c: Convidado) => c.confirmado)
        .map((c: Convidado) => c.id);
      
      setSelecionados(jaConfirmados);
      setEtapa('CONFIRMACAO');
    }
    setLoading(false);
  };

  // Função mágica que marca/desmarca o convidado ao clicar no nome dele
  const toggleConvidado = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) // Remove se já estava
        : [...prev, id] // Adiciona se não estava
    );
  };

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familia) return;
    
    setLoading(true);
    setErro(null);

    // Envia a lista de IDs de quem vai para a Ação
    const res = await confirmarPresenca(familia.id, selecionados);

    if (res.error) {
      setErro(res.error);
    } else {
      setEtapa('SUCESSO');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="max-w-4xl w-full relative z-10 mt-8">
        
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

        <div className="bg-[#FCFAF8]/95 backdrop-blur-xl rounded-[40px] shadow-[0_20px_60px_rgba(74,68,63,0.08)] border border-white overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* ─── ETAPA 1: DIGITAR CÓDIGO (Intacta) ─── */}
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

            {/* ─── ETAPA 2: LISTA DE CONVIDADOS INTERATIVA ─── */}
            {etapa === 'CONFIRMACAO' && familia && (
              <motion.div 
                key="etapa-confirmacao"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 md:p-12 flex flex-col items-center"
              >
                <div className="mb-8 pb-8 border-b border-pastel-texto/10 w-full text-center max-w-2xl">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-pastel-sage mb-2 block">
                    Convite Destravado
                  </span>
                  <h3 className="font-serif italic text-4xl text-pastel-texto mb-4">
                    Olá, {familia.nomeExibicao}!
                  </h3>
                  <p className="text-sm font-sans text-pastel-texto/60 leading-relaxed">
                    Por favor, marque na lista abaixo <strong>quem</strong> poderá comparecer. 
                    Se alguém não puder ir, basta deixar desmarcado.
                  </p>
                </div>

                <form onSubmit={handleConfirmar} className="w-full max-w-xl">
                  
                  <div className="space-y-3 mb-10">
                    {familia.convidados.map((c, idx) => {
                      const isSelected = selecionados.includes(c.id);

                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleConvidado(c.id)}
                          className={`w-full bg-white p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 group
                            ${isSelected ? 'border-pastel-sage shadow-[0_0_0_2px_rgba(164,188,168,0.2)]' : 'border-pastel-texto/10 hover:border-pastel-texto/30'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg shadow-sm transition-colors
                              ${isSelected ? 'bg-pastel-sage text-white' : 'bg-gray-100 text-gray-400'}
                            `}>
                              {c.nome.charAt(0).toUpperCase()}
                            </div>
                            <span className={`font-sans text-[15px] font-medium transition-colors
                              ${isSelected ? 'text-pastel-texto' : 'text-pastel-texto/60'}
                            `}>
                              {c.nome}
                            </span>
                          </div>

                          {/* O Checkbox Redesenhado */}
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors
                            ${isSelected ? 'bg-pastel-sage border-pastel-sage text-white' : 'border-pastel-texto/20 text-transparent'}
                          `}>
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {erro && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">{erro}</motion.p>}
                  </AnimatePresence>

                  <div className="bg-pastel-sage/5 rounded-3xl p-6 border border-pastel-sage/20 mb-8 text-center">
                    <span className="block text-[10px] uppercase tracking-[0.2em] font-bold text-pastel-sage mb-1">
                      Resumo
                    </span>
                    <span className="font-serif italic text-2xl text-pastel-texto">
                      {selecionados.length} {selecionados.length === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'}
                    </span>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-4">
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
                      {loading ? 'Salvando...' : 'Confirmar Presença'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ─── ETAPA 3: SUCESSO (Intacta) ─── */}
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
                  onClick={() => { setEtapa('CODIGO'); setCodigo(''); }}
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