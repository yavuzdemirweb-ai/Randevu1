// src/components/Navbar.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Scissors, Calendar, LogIn, LogOut } from 'lucide-react';

type UserInfo = {
  name: string;
  email: string;
};

export default function Navbar() {
  const [appointmentCount, setAppointmentCount] = useState<number>(0);
  const [appointments, setAppointments] = useState<Array<any>>([]);
  const [nextAppointment, setNextAppointment] = useState<{ date: string; time: string } | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (!res.ok) return;

      const data = await res.json();
      const activeAppointments = Array.isArray(data)
        ? data.filter((item) => item.status !== 'CANCELLED')
        : [];

      setAppointments(activeAppointments);
      setAppointmentCount(activeAppointments.length);

      if (activeAppointments.length > 0) {
        const upcoming = activeAppointments
          .slice()
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        setNextAppointment({
          date: upcoming.date.split('T')[0],
          time: upcoming.time,
        });
      } else {
        setNextAppointment(null);
      }
    } catch (error) {
      console.error('Navbar appointment fetch error:', error);
    }
  };

  useEffect(() => {
    setShowBadge(window.location.pathname === '/');

    const storedUser = localStorage.getItem('user_auth');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user_auth');
      }
    }

    const storedAdminAuth = localStorage.getItem('admin_auth');
    setAdminLoggedIn(storedAdminAuth === 'true');

    fetchAppointments();
  }, []);

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'CONFIRMED':
        return 'Randevunuz oluşturuldu';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'CANCELLED':
        return 'İptal edildi';
      default:
        return status;
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const res = await fetch('/api/appointments/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Randevu iptal edilemedi.');
        return;
      }

      await fetchAppointments();
    } catch (error) {
      console.error('Cancel appointment error:', error);
      alert('Randevu iptal edilirken bir hata oluştu.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_auth');
    localStorage.removeItem('admin_auth');
    setUser(null);
    setAdminLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Scissors className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold tracking-tighter text-white">YAVUZ <span className="text-amber-500 underline underline-offset-4">KUAFÖR</span></span>
            </Link>
          </div>

          {showBadge && appointmentCount > 0 && (
            <div className="hidden md:flex items-center gap-3">
              <div
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="inline-flex items-center gap-2 bg-amber-600/10 border border-amber-600/20 px-4 py-2 rounded-full text-amber-200 text-xs font-semibold transition-all duration-200 group-hover:bg-amber-500/10">
                  <Calendar className="w-4 h-4" />
                  <span>Randevunuz var</span>
                </div>
                <span className="absolute -top-3 -right-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black border border-amber-200">
                  {appointmentCount}
                </span>

                <div className={`absolute left-1/2 top-full mt-4 w-[520px] -translate-x-1/2 rounded-3xl border border-white/10 bg-zinc-950/95 p-5 shadow-2xl shadow-black/40 transition-all duration-200 ${isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'}`}>
                  <div className="mb-5 text-center">
                    <Calendar className="mx-auto mb-3 w-12 h-12 text-amber-400 animate-bounce" />
                    <p className="text-lg font-bold uppercase tracking-[0.28em] text-white">Randevu Durumunuz</p>
                    <p className="mt-2 text-sm text-gray-300">Aşağıda randevularınızın durumunu ve seçilen hizmetleri görebilirsiniz.</p>
                  </div>
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <span className="rounded-full bg-amber-500 px-3 py-1 text-sm font-black text-black">{appointmentCount} Adet</span>
                  </div>

                  {appointments.length > 0 ? (
                    <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                      {appointments.map((appointment, index) => {
                        const serviceTotal = appointment.services?.reduce((sum: number, item: any) => sum + (item.price ?? 0), 0) ?? 0;
                        return (
                          <div key={appointment.id ?? index} className="rounded-3xl bg-zinc-900/90 border border-white/10 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
                              <div>
                                <p className="text-sm font-semibold text-white">{new Date(appointment.date).toLocaleDateString('tr-TR')} • {appointment.time}</p>
                                <p className="text-xs text-gray-400">{formatStatusText(appointment.status)}</p>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${appointment.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border border-red-500/20' : 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/20'}`}>
                                {formatStatusText(appointment.status)}
                              </span>
                            </div>

                            <div className="text-sm font-semibold text-white mb-3">Alınan Hizmetler</div>
                            <ul className="space-y-2 text-sm text-gray-300">
                              {appointment.services?.map((item: any) => (
                                <li key={item.id} className="flex justify-between gap-4 list-disc list-inside pl-3">
                                  <span>{item.service?.name ?? 'Bilinmeyen hizmet'}</span>
                                  <span className="text-amber-300">{item.price?.toFixed(0) ?? 0} ₺</span>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                              <div className="flex items-center justify-between text-sm text-gray-300">
                                <span>Hizmet Toplamı</span>
                                <span className="text-white font-semibold">{serviceTotal.toFixed(0)} ₺</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-white font-semibold">
                                <span>Toplam Ödenecek Tutar</span>
                                <span>{serviceTotal.toFixed(0)} ₺</span>
                              </div>
                            </div>

                            {appointment.status !== 'CANCELLED' ? (
                              <button
                                type="button"
                                onClick={() => cancelAppointment(appointment.id)}
                                className="mt-4 inline-flex items-center justify-center rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-red-400"
                              >
                                Randevuyu İptal Et
                              </button>
                            ) : (
                              <div className="mt-4 text-sm text-red-300">Bu randevu daha önce iptal edildi.</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Henüz randevunuz yok.</p>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-400">Admin panelinde randevu durumunuz güncellendiği zaman burada da görünür.</p>
                    {!(user || adminLoggedIn) ? (
                      <Link href="/login" className="rounded-full bg-amber-600 px-4 py-2 text-sm font-bold uppercase text-black transition hover:bg-amber-500">
                        Hesap Aç
                      </Link>
                    ) : (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200">Girişli</span>
                    )}
                  </div>
                </div>
              </div>
              {nextAppointment && (
                <span className="text-xs text-gray-400">
                  Sonraki: {nextAppointment.date} {nextAppointment.time}
                </span>
              )}
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4 text-base font-medium">
            <Link href="/" className="px-3 py-2 rounded-full text-white transition-all duration-200 hover:text-white hover:bg-amber-600/20 active:scale-95">Anasayfa</Link>
            <Link href="/hizmetler" className="px-3 py-2 rounded-full text-gray-300 transition-all duration-200 hover:text-white hover:bg-amber-600/20 active:scale-95">Hizmetler</Link>
            <Link href="/hakkimizda" className="px-3 py-2 rounded-full text-gray-300 transition-all duration-200 hover:text-white hover:bg-amber-600/20 active:scale-95">Hakkımızda</Link>
            <Link href="/iletisim" className="px-3 py-2 rounded-full text-gray-300 transition-all duration-200 hover:text-white hover:bg-amber-600/20 active:scale-95">İletişim</Link>
            <Link
              href="/randevu"
              className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-600/20"
            >
              Randevu Al
            </Link>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {(user || adminLoggedIn) ? (
              <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-3 text-sm text-gray-200">
                {user ? (
                  <>
                    <p className="font-semibold text-white text-base">{user.name}</p>
                    <p className="truncate text-amber-200/90 text-sm">{user.email}</p>
                  </>
                ) : (
                  <p className="font-semibold text-white text-base">Admin Girişli</p>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white/5 border border-amber-500/20 text-amber-100 px-3 py-2 rounded-full text-xs transition-all duration-200 hover:bg-amber-500/10 active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Giriş Yap
              </Link>
            )}
            <Link
              href="/randevu"
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-full text-xs transition-all"
            >
              Randevu Al
            </Link>
          </div>
        </div>

      </div>
    </nav>
    <div className="fixed top-20 right-4 z-50 hidden md:block">
      <div className="rounded-3xl border border-white/10 bg-zinc-900/90 p-4 shadow-2xl shadow-black/40 max-w-[320px] text-right">
        {(user || adminLoggedIn) ? (
          <div className="space-y-2">
            {user ? (
              <>
                <p className="text-sm font-semibold text-white">Merhaba, {user.name}</p>
                <p className="text-sm text-amber-200">{user.email}</p>
              </>
            ) : (
              <p className="text-sm font-semibold text-white">Admin Girişli</p>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-500"
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-base font-semibold text-white">Giriş yap veya kayıt ol</p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-500"
            >
              Giriş Yap
            </Link>
          </div>
        )}
      </div>
    </div>
  </> 
  );
}
