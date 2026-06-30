'use client';

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import MuralForm from "@/src/components/MuralForm";
import { buscarMensagens } from "@/src/actions/mural";
import { MapPin, MessageCircle } from "lucide-react";

interface Mensagem {
  id: string;
  nome: string;
  mensagem: string;
  createdAt: Date;
}

const cardThemes = [
  { bg: 'bg-pastel-blush/30', border: 'border-pastel-blush/40', accent: 'text-pastel-blush', btnHover: 'hover:text-pastel-blush/70' },
  { bg: 'bg-pastel-sage/20', border: 'border-pastel-sage/40', accent: 'text-pastel-sage', btnHover: 'hover:text-pastel-sage/70' },
  { bg: 'bg-pastel-lavender/30', border: 'border-pastel-lavender/40', accent: 'text-pastel-lavender', btnHover: 'hover:text-pastel-lavender/70' },
  { bg: 'bg-pastel-butter/30', border: 'border-pastel-butter/50', accent: 'text-yellow-600/50', btnHover: 'hover:text-yellow-700/70' },
];

// ─── SUBCOMPONENTE DE CARD EXPANDÍVEL (LIMITADO A 1 LINHA) ───
function MuralCard({ msg, theme }: { msg: Mensagem; theme: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [precisaCortar, setPrecisaCortar] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Esse useEffect roda uma vez quando o card aparece na tela.
  // Ele checa se a altura real do texto (scrollHeight) é maior que a altura de uma linha (clientHeight).
  useEffect(() => {
    if (textRef.current) {
      const transborda = textRef.current.scrollHeight > textRef.current.clientHeight;
      setPrecisaCortar(transborda);
    }
  }, [msg.mensagem]);

  return (
    <div
      className={`break-inside-avoid relative overflow-hidden backdrop-blur-md p-8 rounded-[28px] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${theme.bg} ${theme.border}`}
    >
      {/* Aspas gigantes */}
      <span className={`absolute -top-2 right-6 text-9xl font-serif leading-none rotate-6 group-hover:rotate-12 transition-transform duration-500 pointer-events-none opacity-20 ${theme.accent}`}>
        "
      </span>

      <div className="relative z-10 flex-1">
        {/* Usamos o line-clamp-1 do Tailwind para travar em 1 linha quando não estiver expandido */}
        <p
          ref={textRef}
          className={`text-pastel-texto/90 font-sans font-medium text-sm md:text-[15px] leading-relaxed whitespace-pre-line italic transition-all duration-300 ${
            !isExpanded ? 'line-clamp-1' : 'line-clamp-none'
          }`}
        >
          "{msg.mensagem}"
        </p>
        
        {/* Botão Ver Mais / Ver Menos */}
        {precisaCortar && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`mt-2 text-[10px] font-sans font-bold uppercase tracking-wider cursor-pointer border-b border-transparent hover:border-current transition-all ${theme.accent} ${theme.btnHover}`}
          >
            {isExpanded ? '▲ Ver menos' : '▼ Ver mais'}
          </button>
        )}
      </div>

      <div className="relative z-10 pt-6 mt-6 border-t border-pastel-texto/10 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <strong className={`font-bold font-sans uppercase tracking-[0.1em] text-[11px] ${theme.accent}`}>
          {msg.nome}
        </strong>
        <span className="text-pastel-texto/60 font-sans text-[10px] tracking-wider font-light">
          {format(new Date(msg.createdAt), "d 'de' MMMM", {
            locale: ptBR,
          })}
        </span>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL DA PÁGINA ───
export default function MuralPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [temMais, setTemMais] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const carregarIniciais = async () => {
    const resultado = await buscarMensagens();
    if (!('error' in resultado)) {
      const msgsFormatadas = resultado.mensagens.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
      setMensagens(msgsFormatadas);
      setCursor(resultado.proximoCursor);
      setTemMais(!!resultado.proximoCursor);
    }
  };

  useEffect(() => {
    carregarIniciais();
  }, []);

  const handleCarregarMais = async () => {
    if (!cursor || carregandoMais) return;
    setCarregandoMais(true);
    
    const resultado = await buscarMensagens(cursor);
    if (!('error' in resultado)) {
      const novasMsgs = resultado.mensagens.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
      setMensagens(prev => [...prev, ...novasMsgs]);
      setCursor(resultado.proximoCursor);
      setTemMais(!!resultado.proximoCursor);
    }
    setCarregandoMais(false);
  };

  return (
    <main className="min-h-screen px-6 pt-12 pb-24 relative overflow-hidden">
  

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* CABEÇALHO DO MURAL */}
        <header className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-2">
            <MessageCircle size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-pastel-texto">
            Mural de Mensagens
          </h1>
          <p className="text-pastel-texto/50 uppercase tracking-[0.3em] text-[11px] font-bold font-sans">
            O carinho de quem amamos guardado para sempre
          </p>
        </header>

        {/* FORMULÁRIO */}
        <MuralForm onMensagemEnviada={carregarIniciais} />

        {mensagens.length === 0 ? (
          <div className="text-center py-20 px-8 rounded-[32px] max-w-md mx-auto">
            <p className="text-pastel-texto font-serif italic text-2xl">
              O mural está em branco...
            </p>
            <p className="text-pastel-texto/60 text-xs mt-3 font-sans uppercase tracking-[0.2em]">
              Seja o primeiro a escrever um capítulo!
            </p>
          </div>
        ) : (
          <>
            {/* GRID DE RECADOS COM O NOVO CARD OPTIMIZADO */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {mensagens.map((msg, index) => {
                const theme = cardThemes[index % cardThemes.length];
                return (
                  <MuralCard 
                    key={msg.id} 
                    msg={msg} 
                    theme={theme} 
                  />
                );
              })}
            </div>

            {/* BOTÃO DE CARREGAR MAIS */}
            {temMais && (
              <div className="text-center pt-16">
                <button
                  onClick={handleCarregarMais}
                  disabled={carregandoMais}
                  className="px-8 py-4 border border-pastel-texto/20 bg-[#FCFAF8]/50 text-pastel-texto hover:bg-white rounded-full font-sans font-bold uppercase tracking-[0.1em] text-[10px] transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {carregandoMais ? "Carregando..." : "Ver mensagens anteriores"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}