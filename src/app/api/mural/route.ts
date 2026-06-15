import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/src/lib/db';

export async function POST(request: Request) {
  try {
    const { conteudo } = await request.json();

    if (!conteudo || conteudo.trim() === '') {
      return NextResponse.json({ error: 'A mensagem não pode estar vazia.' }, { status: 400 });
    }

    // Procura o cookie de sessão do convidado
    const cookieStore = await cookies();
    const session = cookieStore.get('guest_session');

    if (!session || !session.value) {
      return NextResponse.json({ error: 'Você precisa acessar o convite (RSVP) para deixar uma mensagem.' }, { status: 401 });
    }

    // Busca o ID interno do convite a partir do código do cookie
    const convite = await prisma.convite.findUnique({
      where: { codigo: session.value },
    });

    if (!convite) {
      return NextResponse.json({ error: 'Convite não encontrado.' }, { status: 404 });
    }

    // Salva a nova mensagem no banco de dados vinculada a esse convite (sem limites de quantidade)
    const novaMensagem = await prisma.mensagem.create({
      data: {
        conteudo: conteudo.trim(),
        conviteId: convite.id,
      },
    });

    return NextResponse.json({ success: true, mensagem: novaMensagem });
  } catch (error) {
    console.error('Erro ao salvar mensagem no mural:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}