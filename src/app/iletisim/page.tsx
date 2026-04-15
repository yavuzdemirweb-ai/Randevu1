// src/app/iletisim/page.tsx
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase font-display">
            BİZE <span className="text-amber-500">ULAŞIN</span>
          </h1>
          <p className="text-gray-400">Her türlü soru ve randevu talebi için yanınızdayız.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 bg-zinc-900 border border-white/5 rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">Telefon</h3>
            <p className="text-gray-400">+90 5XX XXX XX XX</p>
          </div>
          
          <div className="p-10 bg-zinc-900 border border-white/5 rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">Adres</h3>
            <p className="text-gray-400">Cumhuriyet Mah. Atatürk Cad. <br /> Banaz, Uşak</p>
          </div>

          <div className="p-10 bg-zinc-900 border border-white/5 rounded-3xl space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold">Çalışma Saatleri</h3>
            <p className="text-gray-400">Pzt - Cmt: 09:00 - 20:00 <br /> Pazar: Kapalı</p>
          </div>
        </div>

        {/* Placeholder for Map */}
        <div className="mt-16 h-96 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-zinc-950"></div>
           <div className="relative z-10 text-center space-y-4">
              <MapPin className="w-12 h-12 text-amber-500 mx-auto" />
              <p className="text-gray-400 font-medium">Harita Servisi Banaz/Uşak Konumunda Yüklenecek</p>
           </div>
        </div>
      </div>
    </div>
  );
}
