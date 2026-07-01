import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    // 1. Verifica se já existem presentes para não duplicar sem querer
    await prisma.presente.deleteMany({});

    // 2. A sua lista de presentes únicos
    const presentesBase = [
      { url: 'faqueiro.jpg', nome: 'Faqueiro Tramontina', valor: 72, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-riSwUbvGAf-72,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540572.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510Xm0jmExVDi63047394' },
      { url: 'escorredor.jpeg', nome: 'Escorredor de Louça', valor: 102, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-jerUKFtDeu-102,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406102.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510e3zWT1dE516304FF37' },
      { url: 'potes_mantimento.jpeg', nome: 'Potes de Mantimento', valor: 140, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-aEjfQtwD8p-140,00', pix: '00020126330014BR.GOV.BCB.PIX0111042161123585204000053039865406140.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510SVGn57vgoz6304425F' },
      { url: 'porta_talheres.jpg', nome: 'Porta Talheres', valor: 103, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-4MjNUgrJMM-103,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406103.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510rs1WWOjnKS63041E8A' },
      { url: 'toalhas.jpg', nome: 'Jogo de Toalhas', valor: 89, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-vktIEEB6CB-89,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540589.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510hOlOEGeiTb630459D0' },
      { url: 'prato_raso.jpg', nome: 'Conjunto 6 Pratos Raso Roma', valor: 136, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-898XZwbL4B-136,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406136.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510S4fpxXoYi16304D83E' },
      { url: 'prato_fundo.jpg', nome: 'Conjunto 6 Pratos Fundo Roma', valor: 146, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-HPt7B1zUiX-146,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406146.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510mqgqBQGrE3630494CB' },
      { url: 'mop.jpg', nome: 'Mop lava e seca', valor: 130, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-wou2lX63bn-130,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406130.005802BR5924Joao Pedro Soares Matias6009SAO PAULO621405109yXGsMUI1k6304C4BB' },
      { url: 'porta_tempero.jpg', nome: 'Kit Potes Porta Tempero', valor: 90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-NS2AjcViVT-90,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540590.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510ZHSoeYAROh63042A48' },
      { url: 'ferro.jpg', nome: 'Ferro de passar a vapor', valor: 180, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-wEXgiD0r0e-180,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406180.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510PPytHuMqdP63042162' },
      { url: 'aspirador.jpeg', nome: 'Aspirador de pó Philco', valor: 189, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-nFfVuKkr22-189,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406189.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510aXxdPutLcX6304016E' },
      { url: 'utensilios.jpeg', nome: 'Jogo de utensílios Tramontina', valor: 170, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-7CjvhGp807-170,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406170.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510sqe00qjIht6304977E' },
      { url: 'garrafa.jpeg', nome: 'Garrafa térmica de Café', valor: 60, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-IdvUP6rVLc-60,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540560.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510Jw6kWnPkGb630480A4' },
      { url: 'lixeiras.jpg', nome: 'Kit de Lixeiras', valor: 60, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-lG7pxdRHRa-60,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540560.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510AAMHlvbAJz63042A34' },
      { url: 'cortina.jpeg', nome: 'Cortina para Sala', valor: 130, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-d1lecSDeGN-130,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406130.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510W7dDKcOtIE6304D886' },
      { url: 'jarra.jpg', nome: 'Conjunto Jarra com 6 copos', valor: 112, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-c12v8ETrWG-112,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406112.005802BR5924Joao Pedro Soares Matias6009SAO PAULO621405101LbVKCMmjr630470B5' },
      { url: 'tabua.jpg', nome: 'Tábua De Madeira Tramontina', valor: 75, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-EDRsPJleen-75,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540575.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510Pnd6Odr8GJ63046D0C' },
      { url: 'panela_pressao.jpg', nome: 'Panela de pressão Cerâmica', valor: 201, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-JKmKOhL9pL-201,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406201.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510y11CTkuLZq6304C280' },
      { url: 'formas.jpg', nome: 'Conjunto de formas antiaderente', valor: 104, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-AIEInKb7wt-104,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406104.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510ENt3F3ynvR63045E31' },
      { url: 'bowls.jpg', nome: 'Kit 6 bowls de cerâmica', valor: 79, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-92JMfZvLvT-79,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540579.005802BR5924Joao Pedro Soares Matias6009SAO PAULO621405105OMMN9pbmM63040C9E' },
      { url: 'lencol.jpg', nome: 'Lençol Casal com Elástico 400 Fios', valor: 49, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-8P7SL25pM6-49,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540549.005802BR5924Joao Pedro Soares Matias6009SAO PAULO621405102pEjwqHj7w63049482' },
      { url: 'batedeira.jpg', nome: 'Batedeira Planetária Mondial', valor: 335, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-kfvNmOrxvU-335,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406335.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510CYFiHI36nV6304498C' },
      { url: 'tabua_pao.jpg', nome: 'Tábua de Pão', valor: 49.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-KgJDIcgXx6-49,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540549.905802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510GjzCULBeLw6304367C' },
      { url: 'mixer.jpg', nome: 'Mixer 3 em 1', valor: 159.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-eRtiXmCbqy-159,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406159.905802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510twcAO2mpnw6304B38A' },
      { url: 'xicara.jpg', nome: 'Conjunto 6 xícaras de café', valor: 129.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-yLCVWm64ie-129,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406129.905802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510EJdjq7QEcJ63049B8D' },
      { url: 'potes_hermeticos.jpg', nome: 'Kit potes herméticos', valor: 130, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-MGaPdu37Ye-130,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406130.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510jrSL9mmMS8630453B3' },
      { url: 'travesseiro.jpg', nome: 'Kit travesseiros 4 unidades', valor: 142, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-TUPekedkbX-142,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406142.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510tRX69NauNg6304659C' },
      { url: 'cama.jpg', nome: 'Jogo de cama casal', valor: 78.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-VyGmZCfwpm-78,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540578.905802BR5924Joao Pedro Soares Matias6009SAO PAULO6214051091cDnSge4B6304664D' },
      { url: 'banheiro.jpg', nome: 'Kit Banheiro', valor: 49.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-5NgyjumY3S-49,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540549.905802BR5924Joao Pedro Soares Matias6009SAO PAULO621405104wZqzr7yyy63047162' },
      { url: 'air_fryer.jpg', nome: 'Air Fryer Oster', valor: 385, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-iCvqEeO0cb-385,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406385.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510mcQNHLPxr163047B6B' },
      { url: 'ventilador.jpg', nome: 'Ventilador', valor: 175, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-Tr9RvPgshP-175,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406175.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510vezGF9e5rI6304641F' },
      { url: 'sanduicheira.jpg', nome: 'Sanduicheira', valor: 62.90, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-TjT5zzwoTO-62,90', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540562.905802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510EpWQ1xxmvM6304FF41' },
      { url: 'facas.jpg', nome: 'Conjunto de Facas', valor: 113, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-iPuuGCJvq5-113,00', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406113.005802BR5924Joao Pedro Soares Matias6009SAO PAULO621405104CrI2YlTBt6304A781' },
      { url: 'cesto.jpg', nome: 'Cesto de bambu', valor: 95.15, credito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-SikjqYfrMB-95,15', pix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f71520400005303986540595.155802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510gzEy06YEW963045BD4' },
    ];

    // O Array final que será enviado para o banco
    const dadosParaInserir = [];

    // Formata os presentes base
    for (const p of presentesBase) {
      dadosParaInserir.push({
        nome: p.nome,
        imagemUrl: `/presentes/${p.url}`, // Define o caminho automático da pasta public
        valor: p.valor,
        linkCredito: p.credito,
        linkPix: p.pix
      });
    }

    // 3. Multiplicando a Geladeira (5 Cotas)
    for (let i = 1; i <= 5; i++) {
      dadosParaInserir.push({
        nome: `Parcelinha Geladeira (Cota ${i}/5)`,
        imagemUrl: '/presentes/geladeira.jpg',
        valor: 404,
        linkCredito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-ELh4zaKhSA-404,00',
        linkPix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406404.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510SxuTCdosJR6304D749'
      });
    }

    // 4. Multiplicando o Fogão (4 Cotas)
    for (let i = 1; i <= 4; i++) {
      dadosParaInserir.push({
        nome: `Parcela Fogão 4 bocas Atlas (Cota ${i}/4)`,
        imagemUrl: '/presentes/fogao.jpg',
        valor: 500,
        linkCredito: 'https://link.infinitepay.io/emily-silva-pratas/VC1D-MxwrTOGThj-500,00',
        linkPix: '00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f715204000053039865406500.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510YmgOOyLh7O6304EA90'
      });
    }

    // 5. Salva tudo de uma vez no banco de dados!
    await prisma.presente.createMany({
      data: dadosParaInserir
    });

    return NextResponse.json({ 
      success: true, 
      message: `Sucesso! Foram inseridos ${dadosParaInserir.length} presentes na sua lista.` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar os presentes' }, { status: 500 });
  }
}