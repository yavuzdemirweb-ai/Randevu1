// src/components/Hero.tsx
"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-zinc-800 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-sm font-medium tracking-widest uppercase">
            Banaz'ın Modern Yüzü
          </span>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-tight">
            TARZINIZI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              YENİDEN KEŞFEDİN
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed font-light">
            Yavuz Kuaför ile profesyonel dokunuşlar, modern kesimler ve size özel bakım ritüelleriyle tanışın. Banaz'daki en seçkin erkek kuaför deneyimi.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/randevu" 
              className="w-full sm:w-auto px-12 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-lg font-bold transition-all shadow-xl shadow-amber-600/30 transform hover:-translate-y-1"
            >
              Hemen Randevu Al
            </Link>
            <Link 
              href="/hizmetler" 
              className="w-full sm:w-auto px-12 py-4 border border-white/10 hover:bg-white/5 text-white rounded-full text-lg font-bold transition-all"
            >
              Hizmetleri İncele
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent"></div>
    </section>
  );
}
