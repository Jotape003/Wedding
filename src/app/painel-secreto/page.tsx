import prisma from '@/src/lib/prisma';
import { Users, Gift, Heart, CalendarHeart, MessageSquare, Wallet, Lock, UserCheck, CheckCircle2 } from 'lucide-react';
import FiltroConvidados from '@/src/components/FiltroConvidados';
// Força o Next.js a sempre buscar dados novos ao recarregar a página
export const dynamic = 'force-dynamic';

export default async function PainelAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }> | { [key: string]: string | undefined };
}) {
  
  const params = await searchParams;

  // ─── 1. TRAVA DE SEGURANÇA ───
  if (params.senha !== 'sim') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF8] text-pastel-texto font-sans">
        <Lock size={48} className="text-pastel-texto/20 mb-4" />
        <h1 className="text-2xl font-serif italic mb-2">Acesso Restrito</h1>
        <p className="text-sm text-pastel-texto/60">Essa área é exclusiva dos noivos.</p>
      </div>
    );
  }

  // ─── 2. BUSCA DE DADOS NO BANCO ───
  // Contagem geral
  const totalConvidados = await prisma.convidado.count();
  const confirmadosCount = await prisma.convidado.count({
    where: { confirmado: true },
  });

  // Lista de confirmados (em ordem alfabética)
  const listaConfirmados = await prisma.convidado.findMany({
    where: { confirmado: true },
    orderBy: { nome: 'asc' },
  });

  // Presentes
  const presentesComprados = await prisma.presente.findMany({
    where: { comprado: true },
    orderBy: { compradoEm: 'desc' }, 
  });

  const totalArrecadado = presentesComprados.reduce((acc, p) => acc + p.valor, 0);

  // Contagem Regressiva
  const dataCasamento = new Date('2026-08-28T00:00:00');
  const hoje = new Date();
  const diasRestantes = Math.ceil((dataCasamento.getTime() - hoje.getTime()) / (1000 * 3600 * 24));

  // Utilitários
  const formatarMoeda = (valor: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  
  const formatarData = (data: Date | null) => {
    if (!data) return 'Data desconhecida';
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(data);
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* CABEÇALHO */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-pastel-texto/5">
          <div className="flex items-center gap-5 text-center md:text-left">
            <div className="w-16 h-16 bg-pastel-blush/20 text-pastel-blush rounded-full flex items-center justify-center">
              <Heart size={28} strokeWidth={2} className="fill-pastel-blush/20" />
            </div>
            <div>
              <h1 className="font-serif italic text-3xl md:text-4xl text-pastel-texto">
                Painel da Noiva
              </h1>
              <p className="text-xs uppercase tracking-widest text-pastel-texto/50 font-bold mt-1">
                Controle dos Bastidores
              </p>
            </div>
          </div>
          
          <div className="bg-pastel-sage/10 border border-pastel-sage/20 px-6 py-4 rounded-2xl flex items-center gap-4">
            <CalendarHeart size={24} className="text-pastel-sage" />
            <div>
              <span className="block text-2xl font-serif italic text-pastel-texto leading-none">
                {Math.max(0, diasRestantes)} dias
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-pastel-sage">
                Para o grande dia
              </span>
            </div>
          </div>
        </header>

        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-pastel-texto/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-pastel-texto/40">Presenças</span>
              <Users size={18} className="text-pastel-lavender" />
            </div>
            <div>
              <p className="font-serif italic text-4xl text-pastel-texto mb-1">
                {confirmadosCount} <span className="text-lg font-sans not-italic font-light text-pastel-texto/40">/ {totalConvidados}</span>
              </p>
              <p className="text-xs text-pastel-texto/60">Convidados confirmados</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-pastel-texto/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-pastel-texto/40">Presentes</span>
              <Gift size={18} className="text-pastel-sage" />
            </div>
            <div>
              <p className="font-serif italic text-4xl text-pastel-texto mb-1">
                {presentesComprados.length}
              </p>
              <p className="text-xs text-pastel-texto/60">Itens já reservados</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-pastel-texto/5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-pastel-texto/40">Arrecadação</span>
              <Wallet size={18} className="text-pastel-blush" />
            </div>
            <div>
              <p className="font-serif italic text-3xl text-pastel-texto mb-1 truncate">
                {formatarMoeda(totalArrecadado)}
              </p>
              <p className="text-xs text-pastel-texto/60">Total recebido em presentes</p>
            </div>
          </div>
        </div>

        {/* ─── GRID INFERIOR: PRESENTES E CONVIDADOS LADO A LADO EM TELAS GRANDES ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* LISTA DE CONVIDADOS CONFIRMADOS */}
          <FiltroConvidados convidados={listaConfirmados} />
          <div className="bg-white rounded-[32px] shadow-sm border border-pastel-texto/5 overflow-hidden flex flex-col h-full max-h-[600px]">
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {listaConfirmados.length === 0 ? (
                <div className="text-center py-12 text-pastel-texto/40">
                  <Users size={40} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhuma confirmação até o momento.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {listaConfirmados.map((convidado) => (
                    <div key={convidado.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-colors hover:bg-gray-100">
                      <div className="w-8 h-8 rounded-full bg-[#00B4A0]/10 text-[#00B4A0] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={16} strokeWidth={2.5} />
                      </div>
                      <span className="font-sans font-medium text-pastel-texto text-sm">
                        {convidado.nome}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LISTA DE PRESENTES RECEBIDOS */}
          <div className="bg-white rounded-[32px] shadow-sm border border-pastel-texto/5 overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="p-8 border-b border-pastel-texto/5 flex items-center justify-between bg-white z-10">
              <h2 className="font-serif italic text-2xl text-pastel-texto flex items-center gap-3">
                <Gift className="text-pastel-sage" size={24} />
                Presentes Ganhos
              </h2>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
              {presentesComprados.length === 0 ? (
                <div className="text-center py-12 text-pastel-texto/40">
                  <Gift size={40} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
                  <p>Nenhum presente foi confirmado ainda.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {presentesComprados.map((presente) => (
                    <div key={presente.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-pastel-sage block mb-1">
                            {formatarData(presente.compradoEm)}
                          </span>
                          <h4 className="font-sans font-bold text-pastel-texto text-sm">
                            {presente.compradorNome || 'Convidado Anônimo'}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="font-serif italic text-lg text-pastel-texto leading-none mb-1">
                            {formatarMoeda(presente.valor)}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-100 mb-4">
                        <p className="text-xs text-pastel-texto/70 font-medium">
                          <Gift size={12} className="inline mr-1 text-pastel-texto/40 mb-0.5" />
                          {presente.nome}
                        </p>
                      </div>

                      {presente.mensagem && (
                        <div className="mt-auto bg-pastel-lavender/5 border border-pastel-lavender/10 p-4 rounded-xl relative">
                          <MessageSquare size={14} className="absolute top-4 left-4 text-pastel-lavender/40" />
                          <p className="text-xs text-pastel-texto/80 italic pl-6 leading-relaxed">
                            "{presente.mensagem}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}