'use client';

import { useState } from 'react';
import { Users, Trash2, Plus, Key, UserPlus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  criarFamilia, 
  deletarFamilia, 
  adicionarConvidadoFamilia, 
  removerConvidado 
} from '@/src/actions/familias';

type Convidado = {
  id: string;
  nome: string;
  confirmado: boolean;
};

type Familia = {
  id: string;
  nomeExibicao: string;
  codigoAcesso: string;
  numeroConfirmados: number | null;
  convidados: Convidado[];
};

export default function GerenciadorFamilias({ familias }: { familias: Familia[] }) {
  // Estado para o formulário de Nova Família
  const [mostrarFormNovaFamilia, setMostrarFormNovaFamilia] = useState(false);
  const [novoNomeExibicao, setNovoNomeExibicao] = useState('');
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novosConvidados, setNovosConvidados] = useState<string[]>(['']);
  const [processando, setProcessando] = useState(false);

  // Controle de qual família está "aberta" (Expandida) na lista e formulários internos
  const [familiaExpandida, setFamiliaExpandida] = useState<string | null>(null);
  const [adicionandoConvidadoNaFamiliaId, setAdicionandoConvidadoNaFamiliaId] = useState<string | null>(null);
  const [nomeNovoConvidado, setNomeNovoConvidado] = useState('');

  // ─── FUNÇÕES DE NOVA FAMÍLIA ───
  const handleAddInputConvidado = () => setNovosConvidados([...novosConvidados, '']);
  
  const handleMudarNomeNovoConvidado = (index: number, valor: string) => {
    const atualizados = [...novosConvidados];
    atualizados[index] = valor;
    setNovosConvidados(atualizados);
  };

  const handleRemoverInputConvidado = (index: number) => {
    setNovosConvidados(novosConvidados.filter((_, i) => i !== index));
  };

  const handleSalvarNovaFamilia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeExibicao || !novoCodigo) return;
    setProcessando(true);
    
    await criarFamilia(novoNomeExibicao, novoCodigo, novosConvidados);
    
    // Limpa o formulário
    setNovoNomeExibicao('');
    setNovoCodigo('');
    setNovosConvidados(['']);
    setMostrarFormNovaFamilia(false);
    setProcessando(false);
  };

  // ─── FUNÇÕES DE ATUALIZAÇÃO E EXCLUSÃO ───
  const handleAdicionarConvidadoExistente = async (familiaId: string) => {
    if (!nomeNovoConvidado.trim()) return;
    setProcessando(true);
    await adicionarConvidadoFamilia(familiaId, nomeNovoConvidado);
    setNomeNovoConvidado('');
    setAdicionandoConvidadoNaFamiliaId(null);
    setProcessando(false);
  };

  const handleRemoverConvidado = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este convidado?')) {
      await removerConvidado(id);
    }
  };

  const handleDeletarFamilia = async (id: string, nome: string) => {
    if (confirm(`Atenção: Você está prestes a excluir a "${nome}" e TODOS os seus convidados. Deseja continuar?`)) {
      await deletarFamilia(id);
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-pastel-texto/5 overflow-hidden">
      
      {/* CABEÇALHO */}
      <div className="p-6 md:p-8 border-b border-pastel-texto/5 flex items-center justify-between bg-white z-10">
        <h2 className="font-serif italic text-2xl text-pastel-texto flex items-center gap-3">
          <Users className="text-pastel-blush" size={24} />
          Gerenciar Famílias e Convites
        </h2>
        <button 
          onClick={() => setMostrarFormNovaFamilia(!mostrarFormNovaFamilia)}
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider bg-pastel-blush/10 text-pastel-blush px-4 py-2 rounded-xl hover:bg-pastel-blush hover:text-white transition-colors"
        >
          {mostrarFormNovaFamilia ? <X size={14} /> : <Plus size={14} />}
          {mostrarFormNovaFamilia ? 'Cancelar' : 'Nova Família'}
        </button>
      </div>

      {/* FORMULÁRIO DE CRIAÇÃO (Expandível) */}
      {mostrarFormNovaFamilia && (
        <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100">
          <form onSubmit={handleSalvarNovaFamilia} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-pastel-texto/40 pl-1 block mb-1">Nome de Exibição</label>
                <input 
                  type="text" required placeholder="Ex: Dona Lucinha e Família" value={novoNomeExibicao} onChange={(e) => setNovoNomeExibicao(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pastel-lavender"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-pastel-texto/40 pl-1 block mb-1">Código de Acesso</label>
                <input 
                  type="text" required placeholder="Ex: LUCINHA2026" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm uppercase focus:outline-none focus:border-pastel-lavender"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-wider text-pastel-texto/40 pl-1 block">Nomes dos Convidados (Integrantes)</label>
              {novosConvidados.map((nome, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="text" placeholder={`Convidado ${index + 1}`} value={nome} onChange={(e) => handleMudarNomeNovoConvidado(index, e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pastel-lavender"
                  />
                  {novosConvidados.length > 1 && (
                    <button type="button" onClick={() => handleRemoverInputConvidado(index)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" onClick={handleAddInputConvidado}
                className="text-xs font-bold uppercase tracking-wider text-pastel-lavender flex items-center gap-1 mt-2 hover:underline"
              >
                <Plus size={14} /> Adicionar mais um integrante
              </button>
            </div>

            <button 
              type="submit" disabled={processando}
              className="w-full py-4 bg-pastel-texto text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
            >
              {processando ? 'Salvando...' : 'Salvar Família e Convidados'}
            </button>
          </form>
        </div>
      )}

      {/* LISTA DAS FAMÍLIAS CADASTRADAS (O CRUD) */}
      <div className="p-6 md:p-8">
        {familias.length === 0 ? (
          <p className="text-center py-6 text-pastel-texto/40">Nenhuma família cadastrada.</p>
        ) : (
          <div className="space-y-4">
            {familias.map((familia) => {
              const isExpanded = familiaExpandida === familia.id;
              
              return (
                <div key={familia.id} className="border border-gray-100 rounded-2xl bg-white overflow-hidden transition-all shadow-sm hover:border-gray-200">
                  
                  {/* Linha Resumo (Clicável para expandir) */}
                  <div 
                    onClick={() => setFamiliaExpandida(isExpanded ? null : familia.id)}
                    className="p-5 flex items-center justify-between cursor-pointer bg-gray-50/50 hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-sans font-bold text-pastel-texto flex items-center gap-2">
                        {familia.nomeExibicao} 
                        <span className="bg-pastel-texto/5 px-2 py-0.5 rounded-full text-[10px] text-pastel-texto/50 font-normal">
                          {familia.convidados.length} integrantes
                        </span>
                      </h3>
                      <p className="text-xs text-pastel-texto/50 font-mono mt-1 flex items-center gap-1.5">
                        <Key size={12} className="text-pastel-lavender" /> Código: <strong className="text-pastel-texto">{familia.codigoAcesso}</strong>
                      </p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-pastel-texto/30" /> : <ChevronDown size={20} className="text-pastel-texto/30" />}
                  </div>

                  {/* Conteúdo Expandido (Lista de Convidados e Botões de Ação) */}
                  {isExpanded && (
                    <div className="p-5 border-t border-gray-100 bg-white space-y-5">
                      
                      {/* Lista de Integrantes */}
                      <div className="space-y-2">
                        {familia.convidados.length === 0 ? (
                          <p className="text-xs text-pastel-texto/40 italic">Sem convidados cadastrados.</p>
                        ) : (
                          familia.convidados.map(convidado => (
                            <div key={convidado.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg group">
                              <span className="text-sm font-medium text-pastel-texto flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${convidado.confirmado ? 'bg-pastel-sage' : 'bg-gray-300'}`} title={convidado.confirmado ? 'Confirmado' : 'Pendente'} />
                                {convidado.nome}
                              </span>
                              <button 
                                onClick={() => handleRemoverConvidado(convidado.id)}
                                className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                title="Remover convidado"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Ações da Família (Adicionar novo membro ou Excluir tudo) */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-dashed border-gray-100">
                        {adicionandoConvidadoNaFamiliaId === familia.id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input 
                              type="text" placeholder="Nome do novo convidado" value={nomeNovoConvidado} onChange={(e) => setNomeNovoConvidado(e.target.value)} autoFocus
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-pastel-lavender"
                            />
                            <button 
                              onClick={() => handleAdicionarConvidadoExistente(familia.id)} disabled={processando}
                              className="px-4 py-2 bg-pastel-lavender text-white text-xs font-bold rounded-lg hover:bg-pastel-lavender/90 disabled:opacity-50"
                            >
                              Salvar
                            </button>
                            <button 
                              onClick={() => { setAdicionandoConvidadoNaFamiliaId(null); setNomeNovoConvidado(''); }}
                              className="px-3 py-2 bg-gray-100 text-pastel-texto/60 text-xs font-bold rounded-lg hover:bg-gray-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 flex justify-between items-center">
                            <button 
                              onClick={() => setAdicionandoConvidadoNaFamiliaId(familia.id)}
                              className="text-xs font-bold uppercase tracking-wider text-pastel-lavender flex items-center gap-1 hover:underline"
                            >
                              <UserPlus size={14} /> Adicionar Membro
                            </button>
                            
                            <button 
                              onClick={() => handleDeletarFamilia(familia.id, familia.nomeExibicao)}
                              className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1 hover:text-red-500 hover:underline"
                            >
                              <Trash2 size={14} /> Excluir Família
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}