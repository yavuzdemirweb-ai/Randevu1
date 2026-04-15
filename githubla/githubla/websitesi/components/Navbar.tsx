'use client';

import Link from 'next/link';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Anasayfa' },
  { href: '/hizmetler', label: 'Hizmetler' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/randevu', label: 'Randevu' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header style={{ background: 'rgba(16,16,16,0.92)', position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto', padding: '1rem 1.5rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)', fontWeight: 700, fontSize: '1.05rem' }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>Y</span>
          YAVUZ Kuaför
        </Link>

        <button onClick={() => setOpen(!open)} style={{ display: 'none' }} aria-label="Menüyü aç"></button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} style={{ color: 'var(--muted)', fontWeight: 600 }}>
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="button button-secondary">
            Giriş Yap
          </Link>
          <Link href="/admin/login" className="button button-secondary">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
