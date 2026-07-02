'use server';

import prisma from "../lib/prisma";


// 1. Função para o convidado tentar "abrir a porta" com o código
export async function validarCodigo(codigo: string) {
  try {
    // A busca agora é inteligente e ignora maiúsculas/minúsculas
    const familia = await prisma.familia.findFirst({
      where: {
        codigoAcesso: {
          equals: codigo.trim(), // O trim() tira espaços em branco que o celular pode colocar sem querer
          mode: 'insensitive'    // A mágica que resolve o problema!
        }
      },
      include: {
        convidados: true
      }
    });

    if (!familia) {
      // Uma mensagem de erro mais carinhosa e clara
      return { error: 'Ops! Código não encontrado. Verifique se digitou corretamente.' };
    }

    return { familia };
  } catch (error) {
    console.error('Erro ao validar código:', error);
    return { error: 'Ocorreu um erro ao buscar o convite. Tente novamente.' };
  }
}

// 2. Função para salvar o número final no banco
export async function confirmarPresenca(familiaId: string, convidadosConfirmadosIds: string[]) {
  try {
    await prisma.convidado.updateMany({
      where: { familiaId },
      data: { confirmado: false }
    });

    if (convidadosConfirmadosIds.length > 0) {
      await prisma.convidado.updateMany({
        where: {
          id: { in: convidadosConfirmadosIds }
        },
        data: { confirmado: true }
      });
    }

    await prisma.familia.update({
      where: { id: familiaId },
      data: { numeroConfirmados: convidadosConfirmadosIds.length }
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao confirmar presença:', error);
    return { error: 'Ocorreu um erro ao salvar sua confirmação. Tente novamente.' };
  }
}