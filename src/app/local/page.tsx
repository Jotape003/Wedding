export default function LocalPage() {
  return (
    <main className="bg-[#f3f2ee] min-h-screen px-6">
      <div className="max-w-6xl mx-auto space-y-16 relative z-10 -mt-32">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-serif italic text-stone-800">O Local do Sim</h1>
          <p className="text-stone-500 uppercase tracking-widest text-xs">Paupina, Fortaleza - Ceará</p>
        </header>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="prose prose-stone font-light text-stone-600 text-lg">
              <p>O local foi escolhido com muito carinho para que pudéssemos celebrar ao ar livre, sentindo a brisa de Fortaleza.</p>
              <p>A cerimônia e a recepção acontecerão no mesmo local, para que vocês possam aproveitar cada minuto da festa conosco.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
              <h4 className="font-bold text-stone-900 uppercase text-xs tracking-widest mb-4">Endereço</h4>
              <p className="text-stone-500 font-serif italic">R. Paisagística, 530 - Paupina<br/>Fortaleza - CE, 60872-492</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=R.+Paisagística,+530+-+Paupina,+Fortaleza+-+CE"
                target="_blank"
                className="inline-block mt-6 px-8 py-3 bg-stone-900 text-white rounded-full text-[10px] uppercase tracking-widest"
              >
                Como Chegar
              </a>
            </div>
          </div>

          <div className="aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.0827116773536!2d-38.4908643!3d-3.8567119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c74f5728a8d9b1%3A0xc3f345862d64a275!2sR.%20Paisag%C3%ADstica%2C%20530%20-%20Paupina%2C%20Fortaleza%20-%20CE%2C%2060872-492!5e0!3m2!1spt-BR!2sbr!4v1715000000000!5m2!1spt-BR!2sbr" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" 
            />
          </div>
        </div>
      </div>
    </main>
  );
}