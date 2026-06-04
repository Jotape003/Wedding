import { prisma } from '@/src/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { codigo, confirmado, qtdConfirmados, mensagem } = await req.json();

    if (!codigo) {
      return NextResponse.json({ error: 'Código inválido.' }, { status: 400 });
    }

    // 1. Atualiza o status do Convite no banco de dados do Neon
    const conviteAtualizado = await prisma.convite.update({
      where: { codigo: codigo },
      data: {
        confirmado: confirmado,
        qtdConfirmados: qtdConfirmados,
        dataConfirmacao: new Date(),
      },
    });

    // 2. Se o convidado deixou uma mensagem carinhosa, grava na tabela Mensagem
    if (mensagem && mensagem.trim() !== '') {
      await prisma.mensagem.create({
        data: {
          conteudo: mensagem.trim(),
          conviteId: conviteAtualizado.id,
        },
      });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set('guest_session', codigo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
    });

    return response;

  } catch (error) {
    console.error('Erro ao salvar RSVP e Mensagem:', error);
    return NextResponse.json(
      { error: 'Não foi possível salvar sua confirmação. Tente novamente.' },
      { status: 500 }
    );
  }
}