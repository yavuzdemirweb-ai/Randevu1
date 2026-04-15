'use client';
import { useEffect, useMemo, useState } from 'react';
import AppointmentSummary from '@/components/AppointmentSummary';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function AppointmentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', notes: '' });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => setServices([]));
  }, []);

  const selectedServices = useMemo(
    () => services.filter((service) => selected[service.id]),
    [services, selected]
  );

  const subtotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const toggleService = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.date || selectedServices.length === 0) {
      setMessage('Lütfen tüm alanları doldurun ve en az bir hizmet seçin.');
      return;
    }

    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        date: form.date,
        notes: form.notes,
        serviceIds: selectedServices.map((service) => service.id),
      }),
    });

    if (response.ok) {
      setMessage('Randevunuz başarıyla oluşturuldu. Teşekkür ederiz!');
      setForm({ name: '', email: '', phone: '', date: '', notes: '' });
      setSelected({});
    } else {
      setMessage('Randevu kaydedilirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
          <span className="label">Randevu</span>
          <h1>Online Randevu Sistemi</h1>
          <p style={{ maxWidth: 720, color: 'var(--muted)' }}>
            Bu alandan seçtiğiniz hizmetlere göre randevunuzu planlayın. Toplam tutar ve KDV otomatik hesaplanır.
          </p>
        </div>
      </section>
      <section>
        <div className="grid" style={{ gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
          <div>
            <div className="card">
              <h2>Hizmet Seçimi</h2>
              <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {services.map((service) => (
                  <label key={service.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!selected[service.id]} onChange={() => toggleService(service.id)} />
                    <div>
                      <strong>{service.name}</strong>
                      <p style={{ margin: '0.35rem 0 0', color: 'var(--muted)' }}>{service.description}</p>
                      <p style={{ margin: '0.5rem 0 0', color: 'var(--text)' }}>{service.price} TL · {service.duration} dk</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h2>Randevu Bilgileri</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                <label>
                  Adınız
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </label>
                <label>
                  E-posta
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </label>
                <label>
                  Telefon
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </label>
                <label>
                  Tarih
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </label>
                <label>
                  Notlar
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </label>
                <button type="submit" className="button button-primary">Randevu Al</button>
                {message ? <p>{message}</p> : null}
              </form>
            </div>
          </div>
          <div>
            <AppointmentSummary subtotal={subtotal} tax={tax} total={total} />
            <div className="card" style={{ marginTop: '1.5rem' }}>
              <h3>Seçilen Hizmetler</h3>
              {selectedServices.length === 0 ? (
                <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Henüz hizmet seçmediniz.</p>
              ) : (
                <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0, display: 'grid', gap: '0.85rem' }}>
                  {selectedServices.map((service) => (
                    <li key={service.id} style={{ padding: '0.9rem', background: 'rgba(255,255,255,.03)', borderRadius: 16 }}>
                      <strong>{service.name}</strong>
                      <p style={{ margin: '0.45rem 0 0', color: 'var(--muted)' }}>{service.price} TL</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
