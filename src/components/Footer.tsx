'use client';

export default function Footer() {
    return (
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
    )
}