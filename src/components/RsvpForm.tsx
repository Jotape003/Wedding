'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RsvpForm() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [convidado, setConvidado] = useState<{ codigo: string; nome: string; maxAcompanhantes: number; confirmado: boolean; qtdConfirmados: number } | null>(null);

  // Estados do RSVP
  const [vaiAoCasamento, setVaiAoCasamento] = useState<string>('sim');
  const [qtdConfirmados, setQtdConfirmados] = useState(1);
  const [mensagem, setMensagem] = useState('');
  const [sucessoFinal, setSucessoFinal] = useState(false);

  // Checa se o usuário já tem uma sessão ativa ao carregar o componente
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
      <div className="w-full max-w-md mx-auto bg-white/95 p-8 rounded-3xl text-center text-stone-500 font-light text-sm">
        Carregando informações...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-stone-200/60 shadow-xl max-h-[85vh] overflow-y-auto">
      <AnimatePresence mode="wait">
        
        {/* TELA 1: EXIBE SE O CONVIDADO JÁ ESTAVA CONFIRMADO PREVIAMENTE NO BANCO */}
        {convidado && convidado.confirmado && !sucessoFinal && (
          <motion.div
            key="ja-confirmado"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center flex flex-col gap-5 py-2"
          >
            <div className="w-14 h-14 bg-amber-50 text-amber-700 border border-amber-200/40 rounded-full flex items-center justify-center mx-auto text-xl">
              ✨
            </div>
            <div>
              <h3 className="font-serif text-2xl text-stone-800 font-semibold">Presença Confirmada!</h3>
              <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                Olá, <strong className="font-medium text-stone-700">{convidado.nome}</strong>. Sua resposta já está salva no nosso sistema para o grande dia!
              </p>
              {convidado.qtdConfirmados > 0 && (
                <p className="text-xs text-stone-400 mt-3 bg-stone-50 py-2 rounded-xl border border-stone-100">
                  Confirmado para: <strong className="text-stone-700 font-semibold">{convidado.qtdConfirmados} {convidado.qtdConfirmados === 1 ? 'pessoa' : 'pessoas'}</strong>
                </p>
              )}
            </div>
            <div className="space-y-2 mt-2">
              <button
                onClick={() => {
                  // Caso ele queira alterar, resetamos temporariamente o status de confirmado no front
                  setConvidado({ ...convidado, confirmado: false });
                }}
                className="w-full bg-stone-100 text-stone-600 font-medium py-3 rounded-full hover:bg-stone-200 text-xs transition-all cursor-pointer"
              >
                Alterar Resposta / Enviar Nova Mensagem
              </button>
            </div>
          </motion.div>
        )}

        {/* TELA 2: SOLICITAÇÃO DE CÓDIGO (SÓ EXIBE SE NÃO TIVER SESSÃO LOGADA) */}
        {!convidado && !sucessoFinal && (
          <motion.form
            key="step-codigo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleValidarCodigo}
            className="flex flex-col gap-5"
          >
            <div className="text-center mb-2">
              <h3 className="font-serif text-2xl text-stone-800 font-semibold">Confirme sua Presença</h3>
              <p className="text-sm text-stone-500 mt-1">Insira o código do seu convite.</p>
            </div>

            <input
              type="text"
              placeholder="Ex: TESTE123"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-5 py-3.5 rounded-full border border-stone-300 bg-stone-50/50 text-center uppercase tracking-widest font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 text-sm"
              disabled={loading}
            />
            {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-semibold py-3.5 rounded-full hover:bg-stone-800 text-sm cursor-pointer transition-all">
              {loading ? 'Validando...' : 'Acessar Convite'}
            </button>
          </motion.form>
        )}

        {/* TELA 3: FORMULÁRIO DE SELEÇÃO RSVP + MENSAGEM (SÓ LOGADO, MAS NÃO CONFIRMADO OU EM EDIÇÃO) */}
        {convidado && !convidado.confirmado && !sucessoFinal && (
          <motion.form
            key="step-rsvp-mural"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSalvarPresencaEMensagem}
            className="flex flex-col gap-4 text-left"
          >
            <div>
              <h3 className="font-serif text-xl text-stone-800 font-semibold">Olá, {convidado.nome}!</h3>
              <p className="text-xs text-stone-500">Responda abaixo para liberar o acesso ao site completo.</p>
            </div>

            <hr className="border-stone-100" />

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Você irá ao casamento?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVaiAoCasamento('sim')}
                  className={`py-2.5 rounded-xl border font-medium text-sm transition-all cursor-pointer ${vaiAoCasamento === 'sim' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  Sim, com certeza!
                </button>
                <button
                  type="button"
                  onClick={() => setVaiAoCasamento('nao')}
                  className={`py-2.5 rounded-xl border font-medium text-sm transition-all cursor-pointer ${vaiAoCasamento === 'nao' ? 'bg-rose-50 border-rose-400 text-rose-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                >
                  Não poderei ir
                </button>
              </div>
            </div>

            {vaiAoCasamento === 'sim' && convidado.maxAcompanhantes > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Quantas pessoas no total?</label>
                <select
                  value={qtdConfirmados}
                  onChange={(e) => setQtdConfirmados(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-600"
                >
                  {[...Array(convidado.maxAcompanhantes + 1)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? 'pessoa' : 'pessoas'}</option>
                  ))}
                </select>
                <span className="text-[14px] text-stone-400 block">Este convite dá direito a até {convidado.maxAcompanhantes + 1} confirmações.</span>
              </div>
            )}

            <div className="space-y-1.5 text-stone-700">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Deixe uma mensagem para os noivos</label>
              <textarea
                placeholder="Escreva aqui uma mensagem carinhosa para nosso mural de memórias..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl  border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none bg-stone-50/30"
              />
            </div>

            {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-stone-900 text-white font-semibold py-3.5 rounded-full hover:bg-stone-800 text-sm transition-all shadow-md cursor-pointer">
              {loading ? 'Salvando...' : 'Confirmar e Entrar'}
            </button>
          </motion.form>
        )}

        {/* TELA 4: SUCESSO LOGO APÓS UMA CONFIRMAÇÃO DO FLUXO */}
        {sucessoFinal && (
          <motion.div
            key="step-final"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center flex flex-col gap-5 py-4"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            <div>
              <h3 className="font-serif text-2xl text-stone-800 font-semibold">Tudo Pronto!</h3>
              <p className="text-sm text-stone-500 mt-1">Sua resposta foi salva com sucesso.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-full shadow-md hover:bg-emerald-700 transition-all text-sm cursor-pointer"
            >
              Acessar Site Completo
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}