import Link from 'next/link';

interface ServiceCardProps {
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export default function ServiceCard({ name, description, price, duration, image }: ServiceCardProps) {
  return (
    <article className="card" style={{ padding: '1rem' }}>
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: '1rem' }}>
        <img src={image} alt={name} style={{ width: '100%', height: 220, objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '0.7rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{name}</h3>
        <span className="label">{price} TL</span>
      </div>
      <p style={{ color: 'var(--muted)' }}>{description}</p>
      <p style={{ marginTop: '1rem', fontWeight: 600, color: 'var(--text)' }}>Süre: {duration} dk</p>
      <Link href="/randevu" className="button button-primary" style={{ marginTop: '1rem' }}>
        Randevu Al
      </Link>
    </article>
  );
}
