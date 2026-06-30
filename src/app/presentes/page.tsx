'use client';
import { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ExternalLink, CreditCard, Gift, QrCode, X, Copy, Check } from 'lucide-react';
import QRCode from 'react-qr-code'; // <-- Nova importação do QR Code!

// Nossa lista agora com o seu primeiro card recebendo os links reais de teste
const listaDePresentes = [
  {
    id: 1,
    titulo: "Air Fryer Essencial",
    descricao: "Para não queimarmos o jantar logo no primeiro mês.",
    preco: "R$ 10,00", // Ajustei o preço provisório para bater com o seu link de teste!
    linkLoja: "https://amazon.com.br", 
    linkInfinitePay: "https://link.infinitepay.io/emily-silva-pratas/VC1B-16gEbdSzLN-10,00", 
    codigoPix: "00020126580014BR.GOV.BCB.PIX0136c1c1742d-38b8-49e8-a51d-7b9f0e326f7152040000530398654041.005802BR5924Joao Pedro Soares Matias6009SAO PAULO62140510ZBIx9QRtGM6304B475", 
    placeholderBg: "bg-gradient-to-br from-pastel-blush/80 to-pastel-butter/80",
  },
  {
    id: 2,
    titulo: "Jogo de Panelas Antiaderente",
    descricao: "O sonho de consumo de todo jovem adulto.",
    preco: "R$ 420,00",
    linkLoja: "https://magazineluiza.com.br",
    linkInfinitePay: "https://infinitepay.io/link...",
    codigoPix: "00020101021126580014br.gov.bcb.pix0136codigo-ficticio-panelas-420...",
    placeholderBg: "bg-gradient-to-br from-pastel-sage/80 to-pastel-blush/80",
  },
  {
    id: 3,
    titulo: "Aspirador Robô",
    descricao: "Nosso futuro melhor amigo na limpeza da casa nova.",
    preco: "R$ 800,00",
    linkLoja: "https://amazon.com.br",
    linkInfinitePay: "https://infinitepay.io/link...",
    codigoPix: "00020101021126580014br.gov.bcb.pix0136codigo-ficticio-aspirador-800...",
    placeholderBg: "bg-gradient-to-br from-pastel-lavender/80 to-pastel-sage/80",
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function PresentesPage() {
  const [presenteSelecionado, setPresenteSelecionado] = useState<typeof listaDePresentes[0] | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleCopiarPix = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar', err);
    }
  };

  return (
    <main className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-4">
            <Gift size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif italic text-pastel-texto">
            Nossa Lista
          </h1>
          <p className="text-pastel-texto/70 text-sm md:text-base font-sans font-light max-w-2xl mx-auto leading-relaxed">
            Sua presença é o nosso maior presente! Mas se quiser nos ajudar a montar nosso cantinho, 
            você pode escolher a forma mais confortável para nos presentear.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {listaDePresentes.map((item) => (
            <motion.div 
              key={item.id}
              variants={cardVariants}
              className="bg-[#FCFAF8]/90 backdrop-blur-xl rounded-[32px] p-5 shadow-[0_8px_30px_rgba(74,68,63,0.06)] border border-white flex flex-col group hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-full aspect-square rounded-[24px] ${item.placeholderBg} mb-6 relative overflow-hidden flex items-center justify-center`}>
                 <Gift size={48} className="text-white/50" strokeWidth={1} />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="text-xl font-serif italic text-pastel-texto mb-2">
                  {item.titulo}
                </h3>
                <p className="text-pastel-texto/60 text-xs font-sans font-light leading-relaxed mb-4 flex-1">
                  {item.descricao}
                </p>
                <div className="text-pastel-blush font-sans font-bold text-lg mb-6 tracking-wide">
                  {item.preco}
                </div>

                <div className="space-y-2 mt-auto">
                  <button 
                    onClick={() => setPresenteSelecionado(item)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-pastel-sage text-white rounded-2xl font-sans font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-pastel-sage/90 transition-all shadow-sm cursor-pointer"
                  >
                    <QrCode size={16} />
                    Pagar com Pix
                  </button>

                  <div className="flex gap-2 w-full">
                    <a 
                      href={item.linkInfinitePay}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-pastel-texto/10 text-pastel-texto/80 rounded-2xl font-sans font-bold uppercase tracking-[0.05em] text-[9px] hover:bg-[#FCFAF8] hover:text-pastel-texto transition-all"
                    >
                      <CreditCard size={14} />
                      Cartão
                    </a>
                    <a 
                      href={item.linkLoja}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-transparent text-pastel-texto/60 rounded-2xl font-sans font-bold uppercase tracking-[0.05em] text-[9px] hover:text-pastel-texto transition-all"
                    >
                      <ExternalLink size={14} />
                      Ver na Loja
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {presenteSelecionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm"
            onClick={() => setPresenteSelecionado(null)} 
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#FCFAF8] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border border-white relative flex flex-col items-center text-center"
            >
              <button 
                onClick={() => setPresenteSelecionado(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-pastel-texto/5 text-pastel-texto/50 hover:text-pastel-texto hover:bg-pastel-texto/10 transition-colors cursor-pointer"
              >
                <X size={18} strokeWidth={2} />
              </button>

              <div className="w-12 h-12 rounded-full bg-pastel-sage/20 text-pastel-sage flex items-center justify-center mb-4 mt-2">
                <QrCode size={24} />
              </div>

              <h4 className="font-serif italic text-2xl text-pastel-texto mb-1">
                {presenteSelecionado.titulo}
              </h4>
              <div className="text-pastel-blush font-bold font-sans text-xl mb-6">
                {presenteSelecionado.preco}
              </div>

              {/* Aqui a MÁGICA acontece: A biblioteca desenha o SVG do QR Code */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-pastel-texto/10 mb-6 flex justify-center w-full">
                <QRCode
                  value={presenteSelecionado.codigoPix}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#4a443f" // A nossa cor pastel-texto para ficar elegante!
                  level="Q" // Qualidade do QR (M ou Q é ótimo)
                  className="w-40 h-40"
                />
              </div>

              <p className="text-xs text-pastel-texto/60 font-sans mb-4">
                Abra o app do seu banco e escaneie o código acima, ou copie o código abaixo:
              </p>

              <button
                onClick={() => handleCopiarPix(presenteSelecionado.codigoPix)}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-sans font-bold uppercase tracking-[0.1em] text-[11px] transition-all cursor-pointer ${
                  copiado 
                    ? 'bg-pastel-sage text-white shadow-md' 
                    : 'bg-pastel-blush text-white hover:bg-pastel-blush/90 shadow-sm'
                }`}
              >
                {copiado ? (
                  <>
                    <Check size={16} />
                    Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copiar Código Pix
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}