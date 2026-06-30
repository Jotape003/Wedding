import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    // Verifica se a família já existe para não duplicar
    const existe = await prisma.familia.findUnique({
      where: { codigoAcesso: 'LUCINHA2026' }
    });

    if (existe) {
      return NextResponse.json({ message: 'A Família teste já existe no banco!' });
    }

    // Cria a família e os 4 convidados de uma vez só
    const novaFamilia = await prisma.familia.create({
      data: {
        nomeExibicao: 'Dona Lucinha e Família',
        codigoAcesso: 'LUCINHA2026',
        convidados: {
          create: [
            { nome: 'Dona Lucinha' },
            { nome: 'Marta' },
            { nome: 'Núbia' },
            { nome: 'Lucas' }
          ]
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Família criada com sucesso! Pode ir testar o RSVP.',
      codigoParaTestar: novaFamilia.codigoAcesso
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar dados de teste' }, { status: 500 });
  }
}