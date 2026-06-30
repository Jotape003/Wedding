'use server';

import prisma from "../lib/prisma";


// 1. Função para o convidado tentar "abrir a porta" com o código
export async function validarCodigo(codigo: string) {
  if (!codigo || codigo.trim() === '') {
    return { error: 'Por favor, digite o código do convite.' };
  }

  try {
    // Busca a família e já traz a lista de convidados junto
    const familia = await prisma.familia.findUnique({
      where: { 
        codigoAcesso: codigo.toUpperCase().trim() 
      },
      include: {
        convidados: true
      }
    });

    if (!familia) {
      return { error: 'Código não encontrado. Verifique se digitou corretamente.' };
    }

    return { success: true, familia };
  } catch (error) {
    console.error('Erro ao buscar código:', error);
    return { error: 'Erro no servidor. Tente novamente mais tarde.' };
  }
}

// 2. Função para salvar o número final no banco
export async function confirmarPresenca(familiaId: string, numeroPessoas: number) {
  try {
    await prisma.familia.update({
      where: { id: familiaId },
      data: {
        numeroConfirmados: numeroPessoas
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao confirmar:', error);
    return { error: 'Não foi possível salvar sua confirmação.' };
  }
}