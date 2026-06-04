export default function Hero() {
    return (
        <section className="relative h-[95vh] flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070')" }}
        >
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative z-20 text-center text-white flex flex-col items-center -mt-40">
          <img 
            src="/monograma.png" 
            alt="Monograma J&E" 
            className="h-64 md:h-80 w-auto object-contain brightness-0 invert drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] mb-6" 
          />
        </div>

        <div 
          className="absolute bottom-0 w-[150%] h-[250px] bg-[#f3f2ee] z-10"
          style={{ clipPath: 'ellipse(50% 100% at 50% 100%)' }}
        />
      </section>
    )
}