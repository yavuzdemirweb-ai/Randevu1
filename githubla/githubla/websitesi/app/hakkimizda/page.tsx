export default function AboutPage() {
  return (
    <div>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
          <span className="label">Hakkımızda</span>
          <h1>YAVUZ Kuaför</h1>
          <p style={{ maxWidth: 720, color: 'var(--muted)' }}>
            YAVUZ Kuaför, modern stil, özenli hizmet ve müşteri memnuniyetini ön planda tutan bir salon olarak hizmet veriyor. Kaliteli ürünler ve deneyimli ekip ile her ziyaretinizde en iyi görünümü sunmak için buradayız.
          </p>
        </div>
      </section>
      <section>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <h2>Uzman Ekip</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
              Deneyimli stilistlerimiz; saç kesimi, boya, bakım ve sakal tasarımında size özel öneriler sunar.
            </p>
          </div>
          <div className="card">
            <h2>Kaliteli Hizmet</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
              Sıcak bir ortam, doğru ürün seçimi ve titiz uygulama ile müşteri memnuniyetini garanti ediyoruz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
