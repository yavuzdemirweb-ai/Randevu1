// src/app/hizmetler/page.tsx
import prisma from "@/lib/prisma";
import { Scissors, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: { category: true }
  });
  
  const categories = Array.from(new Set(services.map(s => s.category.name)));

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase font-display">
            HİZMET <span className="text-amber-500">LİSTEMİZ</span>
          </h1>
          <p className="text-gray-400">Her detayında kaliteyi hissedeceğiniz hizmetlerimiz.</p>
        </div>

        {categories.map((categoryName) => (
          <div key={categoryName} className="mb-20">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-amber-600 rounded-full"></span>
              {categoryName} Hizmetleri
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.filter(s => s.category.name === categoryName).map((service) => (
                <div 
                  key={service.id}
                  className="p-8 bg-zinc-900 border border-white/5 rounded-3xl hover:border-amber-500/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-amber-500 transition-colors">{service.name}</h3>
                    <span className="text-2xl font-black text-white">{service.price} ₺</span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Clock className="w-4 h-4 text-amber-500" /> {service.duration} dk
                    </span>
                    <Link 
                      href="/randevu" 
                      className="text-sm font-bold flex items-center gap-2 text-amber-500 hover:gap-3 transition-all"
                    >
                      Randevu Al <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="bg-amber-600 rounded-3xl p-12 text-center space-y-6 shadow-2xl shadow-amber-600/20">
          <h2 className="text-3xl md:text-4xl font-black text-white">TARZINIZI YAVUZ KUAFÖR İLE YENİLEYİN</h2>
          <p className="text-amber-100 max-w-2xl mx-auto text-lg">Hemen şimdi online randevunuzu oluşturun, size özel zaman dilimini ayıralım.</p>
          <Link 
            href="/randevu" 
            className="inline-block px-12 py-4 bg-white text-amber-600 rounded-full text-lg font-bold hover:bg-zinc-100 transition-all transform hover:-translate-y-1"
          >
            Online Randevu Al
          </Link>
        </div>
      </div>
    </div>
  );
}
