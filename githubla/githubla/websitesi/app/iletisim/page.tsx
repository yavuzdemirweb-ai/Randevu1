'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Gönderiliyor...');

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      setStatus('Mesajınız iletildi. En kısa sürede dönüş yapılacaktır.');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
          <span className="label">İletişim</span>
          <h1>Bizimle İletişime Geçin</h1>
          <p style={{ maxWidth: 720, color: 'var(--muted)' }}>
            YAVUZ Kuaför randevu, hizmetler veya özel talepler için buradayız. Aşağıdaki formu doldurun, size en kısa sürede geri dönelim.
          </p>
        </div>
      </section>
      <section>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="card">
            <h2>İletişim Bilgileri</h2>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
              Adres: Merkez Mah. Kuaför Sok. No: 12, İstanbul
            </p>
            <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
              Telefon: 0555 123 45 67
            </p>
            <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
              E-posta: info@yavuzkuafor.com
            </p>
          </div>
          <form className="card" onSubmit={handleSubmit}>
            <label>
              Adınız
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              E-posta
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Mesajınız
              <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </label>
            <button type="submit" className="button button-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Gönder
            </button>
            {status ? <p style={{ marginTop: '1rem' }}>{status}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
