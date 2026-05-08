import Countdown from '../src/components/Countdown';
import Navbar from '../src/components/Navbar';

export default function Home() {
  
  // Link direto para o local na Paupina
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=R.+Paisagística,+530+-+Paupina,+Fortaleza+-+CE,+60872-492";

  return (
    <main className="min-h-screen bg-[#f3f2ee] text-stone-800 selection:bg-stone-200">
      <Navbar />

      {/* HERO SECTION - Com Parallax Suave */}
      <section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070')] bg-cover bg-center bg-fixed">
            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>

        <div className="relative z-20 text-center text-white flex flex-col items-center -mt-45">
          <div className="relative mb-4 animate-in fade-in zoom-in duration-1000">
            <img 
              src="/monograma.png" 
              alt="Monograma J&E" 
              className="h-64 md:h-80 w-auto object-contain brightness-0 invert drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" 
            />
          </div>
        </div>

        {/* CURVA NA BASE - Mais profunda para abraçar o timer */}
        <div 
          className="absolute bottom-0 w-[150%] h-[250px] bg-[#f3f2ee] z-10"
          style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
        />
      </section>

      {/* TEMPORIZADOR INTEGRADO À CURVA (Sem o "caixote") */}
      <section className="relative z-20 -mt-40 md:-mt-52 pb-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-stone-400 uppercase tracking-[0.5em] text-[10px] mb-12 font-bold drop-shadow-sm">
            O tempo para o nosso "Sim"
          </p>
          
          <div className="transform transition-transform hover:scale-105 duration-700">
            <Countdown />
          </div>

          <div className="mt-12 flex flex-col items-center">
             <p className="text-stone-500 font-serif italic text-xl">28 de Agosto de 2026 • Fortaleza, CE</p>
             <div className="w-px h-16 bg-gradient-to-b from-stone-300 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* SEÇÃO LOCALIZAÇÃO - Com o botão funcional */}
      <section id="local" className="pb-36 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h3 className="text-5xl font-serif italic leading-tight">O Local do Sim</h3>
            <p className="text-stone-600 leading-relaxed font-light text-xl">
              A Paupina nos espera com sua brisa e charme para o dia mais importante de nossas vidas. 
              Preparamos um espaço que é a nossa cara para receber quem amamos.
            </p>
            <div className="space-y-4">
               <div>
                  <p className="font-bold text-xs uppercase tracking-[0.2em] text-stone-900">Endereço Exato</p>
                  <p className="text-stone-500 font-serif italic text-lg mt-1">
                    R. Paisagística, 530 - Paupina<br/>Fortaleza - CE, 60872-492
                  </p>
               </div>
            </div>
            
            {/* BOTÃO COM AÇÃO REAL */}
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 bg-stone-900 text-white text-[12px] uppercase tracking-widest hover:bg-stone-700 transition-all rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Abrir no Google Maps
            </a>
          </div>

          {/* MAPA COM BORDA ARREDONDADA ORGÂNICA */}
          <div className="aspect-video rounded-[2rem] shadow-2xl overflow-hidden border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.0825310650993!2d-38.4891461!3d-3.8342416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74ec8c3c1e289%3A0x6b3b271d440097c0!2sR.%20Paisag%C3%ADstica%2C%20530%20-%20Paupina%2C%20Fortaleza%20-%20CE!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-100 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10 flex flex-col items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-700"></div>
            
            <img 
              src="/monograma.png" 
              alt="Monograma J&E" 
              className="relative z-10 h-32 md:h-40 w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
            
          <p className="text-[12px] tracking-[0.5em] opacity-40 font-light">
            #CASAMENTOJOAOEESTER
          </p>

          <div className="pt-12 border-t border-white/10 w-full text-[9px] opacity-30 tracking-[0.2em] font-medium">
            PROJETADO E DESENVOLVIDO POR JOÃO PEDRO © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}