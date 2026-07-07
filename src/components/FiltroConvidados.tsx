'use client';

import { useState } from 'react';
import { Users, UserCheck, CheckCircle2, Search } from 'lucide-react';

type Convidado = {
  id: string;
  nome: string;
  confirmado: boolean;
  familiaId: string | null;
};

export default function FiltroConvidados({ convidados }: { convidados: Convidado[] }) {
  const [busca, setBusca] = useState('');

  // Filtra em tempo real pelo nome ou pela família
  const convidadosFiltrados = convidados.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase()) || 
    (c.familiaId && c.familiaId.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-pastel-texto/5 overflow-hidden flex flex-col h-full max-h-[600px]">
      
      {/* CABEÇALHO COM A BARRA DE PESQUISA */}
      <div className="p-6 md:p-8 border-b border-pastel-texto/5 bg-white z-10 space-y-5">
        <h2 className="font-serif italic text-2xl text-pastel-texto flex items-center gap-3">
          <UserCheck className="text-pastel-lavender" size={24} />
          Lista de Presença
        </h2>

        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pastel-texto/30" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou família..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-sans focus:outline-none focus:border-pastel-lavender focus:bg-white transition-all text-pastel-texto placeholder:text-pastel-texto/30"
          />
        </div>
      </div>
      
      {/* LISTA AGRUPADA E FILTRADA */}
      <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
        {convidadosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-pastel-texto/40">
            <Users size={40} strokeWidth={1} className="mx-auto mb-4 opacity-50" />
            <p>{busca ? 'Nenhum convidado encontrado.' : 'Nenhuma confirmação até o momento.'}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.entries(
              convidadosFiltrados.reduce((acc, convidado) => {
                const nomeDaFamilia = convidado.familiaId || 'Outros / Individuais';
                if (!acc[nomeDaFamilia]) acc[nomeDaFamilia] = [];
                acc[nomeDaFamilia].push(convidado);
                return acc;
              }, {} as Record<string, Convidado[]>)
            )
            .sort(([familiaA], [familiaB]) => familiaA.localeCompare(familiaB))
            .map(([familia, membros]) => (
              <div key={familia} className="space-y-3">
                <h3 className="text-[11px] uppercase font-bold tracking-widest text-pastel-texto/50 border-b border-pastel-texto/10 pb-2">
                  {familia} <span className="text-pastel-lavender ml-1">({membros.length})</span>
                </h3>
                <div className="flex flex-col gap-2">
                  {membros.map((convidado) => (
                    <div key={convidado.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-[#00B4A0]/10 text-[#00B4A0] flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                      <span className="font-sans font-medium text-pastel-texto text-sm">
                        {convidado.nome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}