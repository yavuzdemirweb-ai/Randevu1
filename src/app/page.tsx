// src/app/page.tsx
import Hero from "@/components/Hero";
import prisma from "@/lib/prisma";
import { Scissors, Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const featuredServices = await prisma.service.findMany({
    take: 3,
  });

  return (
    <div className="bg-zinc-950">
      <Hero />

      {/* Services Preview */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 uppercase font-display">
            Öne Çıkan <span className="text-amber-500">Hizmetlerimiz</span>
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div 
              key={service.id}
              className="group p-8 bg-zinc-900/50 border border-white/5 rounded-3xl hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-amber-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 transition-colors">
                <Scissors className="w-7 h-7 text-amber-500 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white">{service.price} ₺</span>
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {service.duration} dk
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/hizmetler" 
            className="inline-flex items-center gap-2 text-amber-500 font-semibold hover:gap-4 transition-all"
          >
            Tüm Hizmetleri Gör <span>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              BANAZ'DA <br />
              <span className="text-amber-500">PREMIUM</span> DENEYİM
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Yavuz Kuaför olarak sadece saç kesimi yapmıyoruz. Sizin için rahatlatıcı, modern ve kendinizi özel hissedeceğiniz bir ortam sunuyoruz. Hijyen ve kalite bizim için ilk sıradadır.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-600/20 rounded-lg"><Star className="w-5 h-5 text-amber-500" /></div>
                <div>
                  <h4 className="font-bold">Uzman Kadro</h4>
                  <p className="text-xs text-gray-500">Yılların tecrübesi</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-600/20 rounded-lg"><Clock className="w-5 h-5 text-amber-500" /></div>
                <div>
                  <h4 className="font-bold">Zaman Yönetimi</h4>
                  <p className="text-xs text-gray-500">Randevunuza sadığız</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group">
             {/* Instead of image, we use a styled div with a gradient and an icon */}
             <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-zinc-900 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                <Scissors className="w-32 h-32 text-amber-500/20 rotate-12" />
             </div>
             <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 text-amber-500 mb-2">
                   <MapPin className="w-4 h-4" />
                   <span className="text-xs font-bold uppercase tracking-widest">Banaz, Uşak</span>
                </div>
                <h3 className="text-2xl font-bold">Modern Salon Konsepti</h3>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
