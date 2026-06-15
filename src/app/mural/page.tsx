import { prisma } from "@/src/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import MuralForm from "@/src/components/MuralForm";

export const revalidate = 0;

async function buscarMensagensDoBanco() {
  const mensagens = await prisma.mensagem.findMany({
    include: {
      convite: {
        select: {
          nomeExibicao: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return mensagens;
}

// Array de estilos para intercalar nos cartões
const cardThemes = [
  { bg: 'bg-pastel-blush/30', border: 'border-pastel-blush/40', accent: 'text-pastel-blush' },
  { bg: 'bg-pastel-sage/20', border: 'border-pastel-sage/40', accent: 'text-pastel-sage' },
  { bg: 'bg-pastel-lavender/30', border: 'border-pastel-lavender/40', accent: 'text-pastel-lavender' },
  { bg: 'bg-pastel-butter/30', border: 'border-pastel-butter/50', accent: 'text-yellow-600/50' }, // Dourado mais fechado no ícone
];

export default async function MuralPage() {
  const mensagens = await buscarMensagensDoBanco();

  return (
    <main className="min-h-screen px-6 pt-12 pb-24 relative overflow-hidden">
      
      {/* LUZES MÁGICAS DE FUNDO (Mais vibrantes) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pastel-lavender/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-pastel-blush/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-pastel-butter/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* CABEÇALHO DO MURAL */}
        <header className="text-center space-y-4 mb-14">
          <h1 className="text-4xl md:text-5xl font-serif italic text-pastel-texto">
            Mural de Mensagens
          </h1>
          <p className="text-pastel-texto/50 uppercase tracking-[0.3em] text-[11px] font-bold font-sans">
            O carinho de quem amamos guardado para sempre
          </p>
        </header>

        {/* FORMULÁRIO */}
        <MuralForm />

        {mensagens.length === 0 ? (
          
          <div className="text-center py-20 px-8 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-lg max-w-md mx-auto">
            <div className="text-4xl mb-4 opacity-70 grayscale-0 filter hue-rotate-15">💌</div>
            <p className="text-pastel-texto font-serif italic text-2xl">
              O mural está em branco...
            </p>
            <p className="text-pastel-texto/60 text-xs mt-3 font-sans uppercase tracking-[0.2em]">
              Seja o primeiro a escrever um capítulo!
            </p>
          </div>

        ) : (
          
          /* GRID DE RECADOS COLORIDOS */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {mensagens.map((msg, index) => {
              // Pega um tema diferente baseado no index da mensagem
              const theme = cardThemes[index % cardThemes.length];

              return (
                <div
                  key={msg.id}
                  className={`break-inside-avoid relative overflow-hidden backdrop-blur-md p-8 rounded-[28px] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between group ${theme.bg} ${theme.border}`}
                >
                  {/* Aspas gigantes usando a cor de destaque do card */}
                  <span className={`absolute -top-2 right-6 text-9xl font-serif leading-none rotate-6 group-hover:rotate-12 transition-transform duration-500 pointer-events-none opacity-20 ${theme.accent}`}>
                    "
                  </span>

                  <p className="relative z-10 text-pastel-texto/90 font-sans font-medium text-sm md:text-[15px] leading-relaxed whitespace-pre-line italic">
                    "{msg.conteudo}"
                  </p>

                  <div className="relative z-10 pt-6 mt-6 border-t border-pastel-texto/10 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <strong className={`font-bold font-sans uppercase tracking-[0.1em] text-[11px] ${theme.accent}`}>
                      {msg.convite.nomeExibicao}
                    </strong>
                    <span className="text-pastel-texto/60 font-sans text-[10px] tracking-wider font-light">
                      {format(new Date(msg.createdAt), "d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}