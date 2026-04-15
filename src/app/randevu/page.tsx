// src/app/randevu/page.tsx
import prisma from "@/lib/prisma";
import BookingFlow from "@/components/BookingFlow";

export const dynamic = 'force-dynamic';

export default async function BookingPage() {
  const servicesData = await prisma.service.findMany({
    include: { category: true }
  });

  const services = servicesData.map(s => ({
    ...s,
    category: s.category.name
  }));

  return (
    <div className="min-h-screen pt-32 pb-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase font-display">
            RANDEVU <span className="text-amber-500">AL</span>
          </h1>
          <p className="text-gray-400">Dilediğiniz hizmetleri seçin, size en uygun zamanı belirleyin.</p>
        </div>
        
        <BookingFlow services={services} />
      </div>
    </div>
  );
}
