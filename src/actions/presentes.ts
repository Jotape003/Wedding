'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// Busca todos os presentes
export async function buscarPresentesDisponiveis() {
  try {
    const presentes = await prisma.presente.findMany({
      orderBy: [
        { comprado: 'asc' }, // Disponíveis (false) vêm antes de comprados (true)
        { nome: 'asc' }
      ]
    });
    return { success: true, presentes };
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    return { error: 'Erro ao buscar a lista de presentes.' };
  }
}

// Salva as informações do comprador e confirma de vez o presente
export async function registrarCompraPresente(id: string, compradorNome: string, mensagem: string) {
  try {
    await prisma.presente.update({
      where: { id },
      data: {
        comprado: true,
        compradorNome: compradorNome.trim(),
        mensagem: mensagem.trim() || null,
        compradoEm: new Date()
      }
    });
    
    // Força o Next.js a atualizar a página para todos os usuários imediatamente
    revalidatePath('/presentes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao registrar presente:', error);
    return { error: 'Erro ao salvar a confirmação do presente.' };
  }
}