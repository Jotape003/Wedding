'use server';

import { revalidatePath } from 'next/cache';
import prisma from '../lib/prisma';

const MENSAGENS_POR_PAGINA = 9;

// ─── 1. AÇÃO DE SALVAR MENSAGEM ───
export async function adicionarMensagem(formData: FormData) {
  const nome = formData.get('nome') as string;
  const mensagem = formData.get('mensagem') as string;

  // Validação básica de segurança no servidor
  if (!nome || nome.trim().length < 2) {
    return { error: 'O nome precisa ter pelo menos 2 caracteres.' };
  }
  
  if (!mensagem || mensagem.trim().length < 5) {
    return { error: 'A mensagem precisa ter pelo menos 5 caracteres.' };
  }

  try {
    await prisma.mensagemMural.create({
      data: {
        nome: nome.trim(),
        mensagem: mensagem.trim(),
        aprovada: true, // Se quiser aprovar antes de ir pro ar, mude para false
      }
    });

    // Avisa o Next.js para limpar o cache da página e mostrar a mensagem nova na hora
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar no banco:', error);
    return { error: 'Houve um erro de conexão. Tente novamente mais tarde.' };
  }
}

// ─── 2. AÇÃO DE BUSCAR MENSAGENS (PAGINADA) ───
export async function buscarMensagens(cursor?: string) {
  try {
    const mensagens = await prisma.mensagemMural.findMany({
      take: MENSAGENS_POR_PAGINA,
      ...(cursor && {
        skip: 1, // Pula o próprio cursor (já que ele apareceu na página anterior)
        cursor: { id: cursor }
      }),
      orderBy: {
        createdAt: 'desc' // As mais novas primeiro
      },
      where: {
        aprovada: true // Segurança: só puxa o que estiver aprovado
      }
    });

    // Se o banco retornou 10 itens, significa que provavelmente tem mais.
    // Pegamos o ID do último item para ser o cursor da próxima chamada.
    const proximoCursor = mensagens.length === MENSAGENS_POR_PAGINA 
      ? mensagens[MENSAGENS_POR_PAGINA - 1].id 
      : null;

    return { 
      mensagens, 
      proximoCursor 
    };
  } catch (error) {
    console.error('Erro ao buscar do banco:', error);
    return { error: 'Não foi possível carregar as mensagens.' };
  }
}