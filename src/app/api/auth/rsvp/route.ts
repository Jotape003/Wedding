import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/src/lib/db';

// 1. O método POST existente (Valida o código digitado manualmente)
export async function POST(request: Request) {
  try {
    const { codigo } = await request.json();

    if (!codigo) {
      return NextResponse.json({ error: 'Por favor, digite um código.' }, { status: 400 });
    }

    const codigoFormatado = codigo.trim().toUpperCase();

    const convite = await prisma.convite.findUnique({
      where: { codigo: codigoFormatado },
    });

    if (!convite) {
      return NextResponse.json({ error: 'Código não encontrado. Verifique seu convite.' }, { status: 404 });
    }

    const response = NextResponse.json({ 
      success: true, 
      guest: {
        codigo: convite.codigo,
        nome: convite.nomeExibicao,
        maxAcompanhantes: convite.maxAcompanhantes,
        confirmado: convite.confirmado,
        qtdConfirmados: convite.qtdConfirmados
      } 
    });

    response.cookies.set('guest_session', convite.codigo, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erro na API de RSVP:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

// 2. NOVO MÉTODO GET: Verifica se o usuário já tem sessão e traz o status atualizado do Neon
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('guest_session');

    if (!session || !session.value) {
      return NextResponse.json({ loggedIn: false });
    }

    const convite = await prisma.convite.findUnique({
      where: { codigo: session.value },
    });

    if (!convite) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      guest: {
        codigo: convite.codigo,
        nome: convite.nomeExibicao,
        maxAcompanhantes: convite.maxAcompanhantes,
        confirmado: convite.confirmado,
        qtdConfirmados: convite.qtdConfirmados
      }
    });
  } catch (error) {
    console.error('Erro ao recuperar sessão RSVP:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}