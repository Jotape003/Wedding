'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. CRIAR FAMÍLIA E SEUS CONVIDADOS JUNTOS
export async function criarFamilia(nomeExibicao: string, codigoAcesso: string, nomesConvidados: string[]) {
  try {
    await prisma.familia.create({
      data: {
        nomeExibicao: nomeExibicao.trim(),
        codigoAcesso: codigoAcesso.trim().toUpperCase(),
        // O Prisma é inteligente e já cria os convidados vinculados a essa família na mesma requisição
        convidados: {
          create: nomesConvidados.filter(nome => nome.trim() !== '').map(nome => ({
            nome: nome.trim(),
            confirmado: false,
          }))
        }
      }
    });
    revalidatePath('/painel-secreto');
    return { success: true };
  } catch (error) {
    console.error('Erro ao criar família:', error);
    return { error: 'Erro ao criar família. Verifique se o código de acesso já existe.' };
  }
}

// 2. DELETAR FAMÍLIA (O Cascade apagará os convidados dela automaticamente)
export async function deletarFamilia(id: string) {
  try {
    await prisma.familia.delete({
      where: { id }
    });
    revalidatePath('/painel-secreto');
    return { success: true };
  } catch (error) {
    return { error: 'Erro ao deletar família.' };
  }
}

// 3. ADICIONAR UM ÚNICO CONVIDADO A UMA FAMÍLIA EXISTENTE
export async function adicionarConvidadoFamilia(familiaId: string, nome: string) {
  try {
    await prisma.convidado.create({
      data: {
        nome: nome.trim(),
        familiaId: familiaId
      }
    });
    revalidatePath('/painel-secreto');
    return { success: true };
  } catch (error) {
    return { error: 'Erro ao adicionar convidado.' };
  }
}

// 4. REMOVER UM CONVIDADO ESPECÍFICO
export async function removerConvidado(id: string) {
  try {
    await prisma.convidado.delete({
      where: { id }
    });
    revalidatePath('/painel-secreto');
    return { success: true };
  } catch (error) {
    return { error: 'Erro ao remover convidado.' };
  }
}