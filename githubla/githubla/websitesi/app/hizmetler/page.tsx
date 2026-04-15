import prisma from '@/lib/prisma';
import ServiceCard from '@/components/ServiceCard';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: {
      category: true,
    },
  });

  return (
    <div>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
          <span className="label">Hizmetlerimiz</span>
          <h1>YAVUZ Kuaför Hizmetleri</h1>
          <p style={{ maxWidth: 720, color: 'var(--muted)' }}>
            Saç kesimi, boyama, mobilya, sakal bakımı ve cilt dostu bakımlar. Tüm hizmetlerimiz profesyonel ekip tarafından titizlikle sunulur.
          </p>
        </div>
      </section>
      <section>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              description={service.description}
              price={service.price}
              duration={service.duration}
              image={service.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
