'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RsvpForm() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [convidado, setConvidado] = useState<{ codigo: string; nome: string; maxAcompanhantes: number; confirmado: boolean; qtdConfirmados: number } | null>(null);

  const [vaiAoCasamento, setVaiAoCasamento] = useState<string>('sim');
  const [qtdConfirmados, setQtdConfirmados] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [sucessoFinal, setSucessoFinal] = useState(false);

  useEffect(() => {
    const checarSessaoExistente = async () => {
      try {
        const res = await fetch('/api/auth/rsvp');
        const data = await res.json();
        
        if (data.loggedIn && data.guest) {
          setConvidado(data.guest);
          if (data.guest.confirmado) {
            setVaiAoCasamento('sim');
            setQtdConfirmados(data.guest.qtdConfirmados || 1);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão ativa:', err);
      } finally {
        setCheckingSession(false);
      }
    };

    checarSessaoExistente();
  }, []);

  const handleValidarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao validar código.');

      setConvidado(data.guest);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarPresencaEMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: convidado?.codigo,
          confirmado: vaiAoCasamento === 'sim',
          qtdConfirmados: vaiAoCasamento === 'sim' ? qtdConfirmados : 0,
          mensagem: mensagem.trim()
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar confirmação.');

      setSucessoFinal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-xl p-8 rounded-[32px] text-center text-pastel-texto/60 font-sans font-light text-sm shadow-xl">
        <div className="animate-pulse">Preparando seu convite...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-2xl p-8 rounded-[32px] border border-white/50 shadow-[0_20px_60px_rgba(74,68,63,0.15)] max-h-[85vh] overflow-y-auto custom-scrollbar">
      <AnimatePresence mode="wait">
        
        {/* TELA 1: JÁ CONFIRMADO */}
        {convidado && convidado.confirmado && !sucessoFinal && (
          <motion.div
            key="ja-confirmado"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center flex flex-col gap-5 py-2"
          >
            {/* Ícone com borda Lilás */}
            <div className="w-16 h-16 bg-pastel-lavender/20 text-pastel-texto border border-pastel-lavender/50 rounded-full flex items-center justify-center mx-auto text-2xl shadow-sm">
              ✨
            </div>
            <div>
              <h3 className="font-serif text-3xl text-pastel-texto font-semibold italic">Presença Confirmada!</h3>
              <p className="text-sm text-pastel-texto/70 mt-3 leading-relaxed font-sans font-light px-2">
                Olá, <strong className="font-medium text-pastel-texto">{convidado.nome}</strong>. Sua resposta já está guardada com muito carinho para o nosso grande dia!
              </p>
              {convidado.qtdConfirmados > 0 && (
                <p className="text-xs text-pastel-texto/60 mt-4 bg-pastel-fundo/50 py-3 rounded-2xl border border-pastel-texto/5 font-sans">
                  Confirmado para: <strong className="text-pastel-texto font-semibold">{convidado.qtdConfirmados} {convidado.qtdConfirmados === 1 ? 'pessoa' : 'pessoas'}</strong>
                </p>
              )}
            </div>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => setConvidado({ ...convidado, confirmado: false })}
                className="w-full bg-transparent border border-pastel-texto/20 text-pastel-texto font-medium font-sans py-3 rounded-full hover:bg-pastel-texto/5 text-xs transition-all cursor-pointer"
              >
                Alterar Resposta / Editar Mensagem
              </button>
            </div>
          </motion.div>
        )}

        {/* TELA 2: SOLICITAÇÃO DE CÓDIGO */}
        {!convidado && !sucessoFinal && (
          <motion.form
            key="step-codigo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleValidarCodigo}
            className="flex flex-col gap-6"
          >
            <div className="text-center mb-2">
              <h3 className="font-serif text-3xl text-pastel-texto font-semibold italic">O Convite</h3>
              <p className="text-sm text-pastel-texto/60 mt-2 font-sans font-light px-4">
                Por favor, insira o código de acesso presente no seu convite.
              </p>
            </div>

            {/* Input foca com cor Lilás (Lavender) */}
            <input
              type="text"
              placeholder="Ex: TESTE123"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-pastel-texto/10 bg-white/60 text-center uppercase tracking-[0.3em] font-medium text-pastel-texto focus:outline-none focus:ring-2 focus:ring-pastel-lavender/60 focus:border-pastel-lavender/60 text-sm shadow-inner transition-all placeholder:text-pastel-texto/20"
              disabled={loading}
            />
            {error && <p className="text-pastel-blush text-xs text-center font-medium px-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-pastel-texto text-pastel-fundo font-sans font-bold uppercase tracking-[0.2em] py-4 rounded-full hover:bg-pastel-texto/90 text-[11px] cursor-pointer transition-all shadow-md mt-2">
              {loading ? 'Validando...' : 'Acessar Convite'}
            </button>
          </motion.form>
        )}

        {/* TELA 3: FORMULÁRIO RSVP + MENSAGEM */}
        {convidado && !convidado.confirmado && !sucessoFinal && (
          <motion.form
            key="step-rsvp-mural"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSalvarPresencaEMensagem}
            className="flex flex-col gap-5 text-left"
          >
            <div className="text-center mb-2">
              <h3 className="font-serif text-3xl text-pastel-texto font-semibold italic">Olá, {convidado.nome}!</h3>
              <p className="text-xs text-pastel-texto/60 font-sans font-light mt-2">
                Ficaremos muito felizes com a sua presença.
              </p>
            </div>

            <hr className="border-pastel-texto/10" />

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-pastel-texto/50 font-sans pl-1">
                Você irá ao casamento?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVaiAoCasamento('sim')}
                  className={`py-3 rounded-2xl border font-sans font-medium text-xs transition-all cursor-pointer ${
                    vaiAoCasamento === 'sim' 
                      ? 'bg-pastel-sage/20 border-pastel-sage/50 text-pastel-texto shadow-sm' 
                      : 'border-pastel-texto/10 text-pastel-texto/50 hover:bg-pastel-fundo/50'
                  }`}
                >
                  Sim, com certeza!
                </button>
                <button
                  type="button"
                  onClick={() => setVaiAoCasamento('nao')}
                  className={`py-3 rounded-2xl border font-sans font-medium text-xs transition-all cursor-pointer ${
                    vaiAoCasamento === 'nao' 
                      ? 'bg-pastel-blush/20 border-pastel-blush/50 text-pastel-texto shadow-sm' 
                      : 'border-pastel-texto/10 text-pastel-texto/50 hover:bg-pastel-fundo/50'
                  }`}
                >
                  Não poderei ir
                </button>
              </div>
            </div>

            <AnimatePresence>
              {vaiAoCasamento === 'sim' && convidado.maxAcompanhantes > 0 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-pastel-texto/50 font-sans pl-1">
                    Quantas pessoas no total?
                  </label>
                  {/* Select foca com cor Sálvia (Sage) */}
                  <select
                    value={qtdConfirmados}
                    onChange={(e) => setQtdConfirmados(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl border border-pastel-texto/10 bg-white/60 text-pastel-texto font-sans text-sm focus:outline-none focus:ring-2 focus:ring-pastel-sage/60 focus:border-pastel-sage/60"
                  >
                    {[...Array(convidado.maxAcompanhantes + 1)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'pessoa' : 'pessoas'}</option>
                    ))}
                  </select>
                  <span className="text-[11px] text-pastel-texto/40 font-sans italic pl-1 block">
                    Seu convite é válido para até {convidado.maxAcompanhantes + 1} pessoas.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-pastel-texto/50 font-sans pl-1">
                Deixe uma mensagem (Opcional)
              </label>
              {/* Textarea foca com cor Rosa Antigo (Blush) */}
              <textarea
                placeholder="Escreva algo especial para o nosso mural..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-2xl border border-pastel-texto/10 text-pastel-texto font-sans text-sm focus:outline-none focus:ring-2 focus:ring-pastel-blush/60 focus:border-pastel-blush/60 resize-none bg-white/60 placeholder:text-pastel-texto/30"
              />
            </div>

            {error && <p className="text-pastel-blush text-xs text-center font-medium px-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-pastel-texto text-pastel-fundo font-sans font-bold uppercase tracking-[0.2em] py-4 rounded-full hover:bg-pastel-texto/90 text-[11px] transition-all shadow-md cursor-pointer mt-4">
              {loading ? 'Salvando...' : 'Confirmar e Entrar'}
            </button>
          </motion.form>
        )}

        {/* TELA 4: SUCESSO FINAL */}
        {sucessoFinal && (
          <motion.div
            key="step-final"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col gap-6 py-6"
          >
            <div className="w-16 h-16 bg-pastel-sage/20 text-pastel-sage border border-pastel-sage/40 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
              ✓
            </div>
            <div>
              <h3 className="font-serif text-3xl text-pastel-texto font-semibold italic">Tudo Pronto!</h3>
              <p className="text-sm text-pastel-texto/60 mt-3 font-sans font-light px-2 leading-relaxed">
                Agradecemos por confirmar sua resposta. O acesso ao nosso site completo acaba de ser liberado!
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-pastel-sage text-white font-sans font-bold uppercase tracking-[0.2em] py-4 rounded-full shadow-md hover:opacity-90 transition-all text-[11px] cursor-pointer mt-2"
            >
              Acessar Site Completo
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}