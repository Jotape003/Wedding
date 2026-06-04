import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Pega o cookie que a nossa API de RSVP gera
  const session = request.cookies.get('guest_session');

  // Definimos as rotas que exigem convite obrigatoriamente
  const rotasRestritas = ['/presentes', '/local', '/mural'];

  const pathname = request.nextUrl.pathname;

  // Se o usuário tentar acessar uma rota restrita E NÃO tiver o cookie
  if (rotasRestritas.some(rota => pathname.startsWith(rota)) && !session) {
    // Redireciona ele de volta para a Home (/) com um aviso na URL
    return NextResponse.redirect(new URL('/?error=unauthorized', request.url));
  }

  return NextResponse.next();
}

// Configura o middleware para rodar apenas nas páginas (evita arquivos estáticos/imagens)
export const config = {
  matcher: ['/presentes/:path*', '/local/:path*', '/mural/:path*'],
};