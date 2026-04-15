// src/app/hakkimizda/page.tsx
import { Scissors, Award, Clock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase font-display">
              BANAZ'IN <br />
              <span className="text-amber-500">USTA ELLERİ</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Yavuz Kuaför, Uşak'ın Banaz ilçesinde erkek kuaförlüğü standartlarını yukarı taşımak amacıyla kuruldu. Yılların tecrübesini modern tekniklerle birleştirerek, her müşterimize kendisini özel hissettirecek bir deneyim sunuyoruz.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Sadece bir saç kesimi değil, bir tarz oluşturma merkeziyiz. Hijyenik ortamımız, profesyonel ekipmanlarımız ve güler yüzlü hizmet anlayışımızla Banaz'ın en çok tercih edilen erkek kuaförü olmaktan gurur duyuyoruz.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-8 bg-zinc-900 border border-white/5 rounded-3xl space-y-4">
              <Award className="w-10 h-10 text-amber-500" />
              <h3 className="font-bold text-xl text-white">Kalite</h3>
              <p className="text-gray-500 text-sm">En iyi markalar ve ürünler.</p>
            </div>
            <div className="p-8 bg-amber-600/10 border border-amber-600/20 rounded-3xl space-y-4">
              <Users className="w-10 h-10 text-amber-500" />
              <h3 className="font-bold text-xl text-white">Deneyim</h3>
              <p className="text-gray-500 text-sm">Usta ellerden profesyonel hizmet.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
