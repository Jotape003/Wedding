'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// Busca apenas os presentes disponíveis (comprado: false) e ordena pelo mais barato
// Busca TODOS os presentes, ordenando os disponíveis primeiro, e depois pelo menor preço
export async function buscarPresentesDisponiveis() {
  try {
    const presentes = await prisma.presente.findMany({
      orderBy: [
        { comprado: 'asc' }, // false (disponível) vem antes de true (comprado)
        { valor: 'asc' }     // Ordena do mais barato para o mais caro
      ]
    });
    return { success: true, presentes };
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    return { error: 'Erro ao buscar a lista de presentes.' };
  }
}

// Marca o presente como comprado para sumir da lista
export async function reservarPresente(id: string) {
  try {
    await prisma.presente.update({
      where: { id },
      data: { comprado: true }
    });
    
    // Atualiza a página para todos os usuários automaticamente
    revalidatePath('/presentes');
    return { success: true };
  } catch (error) {
    console.error('Erro ao reservar presente:', error);
    return { error: 'Erro ao reservar o item.' };
  }
}