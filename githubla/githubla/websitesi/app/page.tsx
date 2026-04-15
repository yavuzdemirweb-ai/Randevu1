import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section style={{ paddingTop: '3rem' }}>
        <div className="container" style={{ display: 'grid', gap: '2rem', alignItems: 'center', gridTemplateColumns: '1.2fr 1fr' }}>
          <div>
            <span className="label">YAVUZ KUAFÖR</span>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: 1.02, margin: '1rem 0' }}>
              Tarzınızı Yenileyin, Kendinizi Şımartın.
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: 590, fontSize: '1.05rem' }}>
              Modern kesim, özel boyama, sakal tasarımı ve bakım hizmetleriyle YAVUZ Kuaför'de yeni bir görünüm kazan. Online randevu al, hizmet seç ve anında planla.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
              <Link href="/hizmetler" className="button button-primary">
                Hizmetler
              </Link>
              <Link href="/randevu" className="button button-secondary">
                Randevu Al
              </Link>
            </div>
          </div>
          <div style={{ borderRadius: 32, overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.25)' }}>
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80" alt="Kuaför salonu" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>
      <section>
        <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {[
            { title: 'Hizmet Paketi', description: 'Saç kesimi, boyama ve bakım hizmetlerinde uzman kuaförler.' },
            { title: 'Online Randevu', description: 'Kolayca hizmet seç ve uygun saati hemen ayır.' },
            { title: 'Profesyonel Ekip', description: 'Deneyimli stilistler ile modern ve şık sonuçlar.' },
          ].map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p style={{ color: 'var(--muted)', marginTop: '0.85rem' }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="card">
            <h2>Kuaförde Yeni Deneyim</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
              YAVUZ Kuaför, şık tasarım, profesyonel hizmet ve hızlı randevu sistemini bir araya getiriyor. İster saç kesimi ister özel bakım arzulayın, burası sizin için hazır.
            </p>
          </div>
          <div className="card">
            <h2>Hemen Randevu Al</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
              Online randevu formunu doldurarak saatinizi ayırın. Seçtiğiniz hizmetler, fiyat haznesi ve toplam tutar sistem tarafından otomatik hesaplanır.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
