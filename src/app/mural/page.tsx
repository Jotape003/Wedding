import { prisma } from "@/src/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


// Força o Next.js a sempre pegar os dados atualizados do Neon sem cache estático antigo
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

export default async function MuralPage() {
  const mensagens = await buscarMensagensDoBanco();

  return (
    <main className="min-h-screen bg-[#f3f2ee] pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Cabeçalho do Mural */}
        <div className="text-center space-y-3">
          <h1 className="font-serif text-4xl text-stone-800 italic">Mural de Mensagens</h1>
          <p className="text-stone-500 tracking-widest uppercase text-[10px] font-bold">
            O carinho de quem amamos guardado para sempre
          </p>
          <div className="w-12 h-[1px] bg-stone-300 mx-auto mt-4" />
        </div>

        {mensagens.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl border border-stone-200/40 max-w-md mx-auto">
            <p className="text-stone-400 font-serif italic text-base">
              Nenhuma mensagem deixada ainda...
            </p>
            <p className="text-stone-400 text-xs mt-1 px-4">
              Seja o primeiro clicando no botão RSVP!
            </p>
          </div>
        ) : (
          /* Grid de Recados Elegante estilo Pinterest / Alinhamento Fluido */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className="break-inside-avoid bg-white/95 p-6 rounded-2xl border border-stone-200/50 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                {/* Texto da Mensagem */}
                <p className="text-stone-600 font-light text-sm leading-relaxed whitespace-pre-line italic">
                  "{msg.conteudo}"
                </p>

                {/* Rodapé do Card (Nome + Data) */}
                <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-[11px]">
                  <strong className="text-stone-800 font-medium tracking-wide">
                    {msg.convite.nomeExibicao}
                  </strong>
                  <span className="text-stone-400">
                    {format(new Date(msg.createdAt), "d 'de' MMMM", {
                        locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}