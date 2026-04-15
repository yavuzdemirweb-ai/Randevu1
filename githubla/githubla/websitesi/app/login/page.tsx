'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('İşlem gerçekleştiriliyor...');

    const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email: form.email, password: form.password } : form;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      setMessage(mode === 'login' ? 'Giriş başarılı.' : 'Kayıt başarılı. Giriş sayfasına yönlendirildiniz.');
      if (mode === 'register') {
        setMode('login');
      }
    } else {
      setMessage(result.error || 'Bir hata oluştu.');
    }
  };

  return (
    <div>
      <section>
        <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
          <span className="label">Kullanıcı Girişi</span>
          <h1>{mode === 'login' ? 'Hesabınıza Girin' : 'Yeni Hesap Oluşturun'}</h1>
          <p style={{ maxWidth: 720, color: 'var(--muted)' }}>
            YAVUZ Kuaför'de hizmetlerinizi kolayca takip edin, randevularınızı görün ve online işlemlerinizden yararlanın.
          </p>
        </div>
      </section>
      <section>
        <div className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button type="button" className="button button-secondary" style={{ flex: 1 }} onClick={() => setMode('login')}>
              Giriş
            </button>
            <button type="button" className="button button-secondary" style={{ flex: 1 }} onClick={() => setMode('register')}>
              Kayıt
            </button>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            {mode === 'register' ? (
              <label>
                Adınız
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
            ) : null}
            <label>
              E-posta
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Şifre
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </label>
            {mode === 'register' ? (
              <label>
                Telefon
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
            ) : null}
            <button type="submit" className="button button-primary">
              {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
            {message ? <p>{message}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
