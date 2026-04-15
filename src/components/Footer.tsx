// src/components/Footer.tsx
import {  } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold tracking-tighter text-white">YAVUZ <span className="text-amber-500 underline underline-offset-4">KUAFÖR</span></h2>
          <p className="text-gray-400 max-w-sm leading-relaxed">
            Banaz'ın kalbinde, modern ve geleneksel kuaförlük hizmetlerini premium bir deneyimle buluşturuyoruz. Sadece saçınızı değil, tarzınızı da şekillendiriyoruz.
          </p>
          <div className="flex space-x-4 pt-4">
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-amber-600 transition-colors">
            </a>
            <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-amber-600 transition-colors">
            </a>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-500">İletişim</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-gray-400">
              <span>Cumhuriyet Mah. Atatürk Cad. <br /> Banaz, Uşak</span>
            </li>
            <li className="flex items-center space-x-3 text-gray-400">
              <span>+90 5XX XXX XX XX</span>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-500">Çalışma Saatleri</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="flex justify-between">
              <span>Pazartesi - Cumartesi</span>
              <span>09:00 - 20:00</span>
            </li>
            <li className="flex justify-between text-amber-500/80 font-medium">
              <span>Pazar</span>
              <span>Kapalı</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
      </div>
    </footer>
  );
}
