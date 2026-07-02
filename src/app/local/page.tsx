'use client';

import { MapPin } from "lucide-react";

export default function LocalPage() {
  return (
    <main className="min-h-screen px-6 pt-12 pb-24 relative overflow-hidden">
      
      {/* ─── LUZES MÁGICAS DE FUNDO ─── */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pastel-sage/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pastel-butter/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* ─── CABEÇALHO (Agora com o texto incluído) ─── */}
        <header className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm text-pastel-blush mb-2">
            <MapPin size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-pastel-texto">
            O Local do Sim
          </h1>
          <p className="text-pastel-sage uppercase tracking-[0.3em] text-[11px] font-bold font-sans">
            Paupina, Fortaleza - Ceará
          </p>
          
          {/* Novo Texto Centralizado */}
          <p className="text-pastel-texto/60 text-sm md:text-base font-sans font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Aqui será o local que escolhemos pra iniciar nosso novo capítulo. O endereço completo está no mapa abaixo, lembrando que nossa festa e cerimônia serão no mesmo lugar 💗. 
            Dica: salvem o local com antecedência pra não ter perigo de se perder 🗾!
          </p>
        </header>

        {/* ─── CONTEÚDO PRINCIPAL (Lado a Lado) ─── */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* ─── CARD DE ENDEREÇO (Glassmorphism) ─── */}
          <div className="relative bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-[0_8px_30px_rgba(74,68,63,0.05)] border border-white/80 overflow-hidden group w-full">
            {/* Detalhe decorativo na lateral do card */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-pastel-sage opacity-80" />
            
            <h4 className="font-bold text-pastel-texto/50 uppercase text-[10px] tracking-[0.3em] mb-4 font-sans">
              Endereço - Chácara Encanto das Annas
            </h4>
            
            <p className="text-pastel-texto font-serif italic text-2xl md:text-3xl leading-relaxed">
              R. Paisagística, 530 - Paupina<br/>
              <span className="text-pastel-texto/60 text-lg font-sans not-italic font-light mt-2 block">
                Fortaleza - CE, 60872-492
              </span>
            </p>
            
            <a 
              href="https://www.google.com/maps/search/?api=1&query=R.+Paisagística,+530+-+Paupina,+Fortaleza+-+CE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-10 px-8 py-4 bg-pastel-sage text-white rounded-full text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] shadow-md hover:bg-pastel-sage/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Como Chegar
            </a>
          </div>

          {/* ─── MAPA GOOGLE ─── */}
          <div className="aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(74,68,63,0.08)] border-[8px] border-white/80 relative bg-pastel-fundo group w-full h-full min-h-[300px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.0827116773536!2d-38.4908643!3d-3.8567119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74f5728a8d9b1%3A0xc3f345862d64a275!2sR.%20Paisag%C3%ADstica%2C%20530%20-%20Paupina%2C%20Fortaleza%20-%20CE%2C%2060872-492!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              className="opacity-90 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            />
          </div>
          
        </div>
      </div>
    </main>
  );
}