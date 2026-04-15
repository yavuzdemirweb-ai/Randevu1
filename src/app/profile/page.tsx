"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Calendar, CheckCircle2, ClipboardList, Mail, MessageCircle, ShieldCheck, Settings2 } from "lucide-react";

type UserInfo = {
  name: string;
  email: string;
  password: string;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  services?: Array<{ id: string; service?: { name?: string } }>;
};

type MessageItem = {
  id: string;
  subject: string;
  preview: string;
  date: string;
  status: string;
};

const formatStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Beklemede';
    case 'CONFIRMED':
      return 'Onaylandı';
    case 'COMPLETED':
      return 'Tamamlandı';
    case 'CANCELLED':
      return 'İptal edildi';
    default:
      return status;
  }
};

const initialMessages: MessageItem[] = [
  {
    id: '1',
    subject: 'Randevu Onayı',
    preview: 'Randevunuz başarıyla alındı. Tarih ve saat bilgilerini buradan takip edebilirsiniz.',
    date: '10 Nisan 2026',
    status: 'Okundu',
  },
  {
    id: '2',
    subject: 'Hatırlatma',
    preview: 'Randevunuza 1 gün kaldı. Lütfen zamanında gelmeyi unutmayın.',
    date: '9 Nisan 2026',
    status: 'Okunmadı',
  },
];

const tabs = [
  { key: 'hesap', label: 'Hesap Bilgileri', icon: ShieldCheck },
  { key: 'randevu', label: 'Randevularım', icon: Calendar },
  { key: 'mesaj', label: 'Mesajlarım', icon: MessageCircle },
  { key: 'duzenle', label: 'Hesap Bilgilerimi Değiştir', icon: Settings2 },
  { key: 'sifremiUnuttum', label: 'Şifremi Unuttum', icon: Mail },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hesap');
  const [messages] = useState<MessageItem[]>(initialMessages);
  const [emailValue, setEmailValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'success' | 'error' | null>(null);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetStatus, setResetStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_auth');
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser) as UserInfo;
    setUser(parsedUser);
    setEmailValue(parsedUser.email);

    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setAppointments(data.filter((item) => item.customerEmail === parsedUser.email));
        }
      } catch (error) {
        console.error('Profile appointment fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateAccount = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!currentPassword) {
      setFormStatus('error');
      setFormMessage('Lütfen mevcut şifrenizi girin.');
      return;
    }

    if (currentPassword !== user.password) {
      setFormStatus('error');
      setFormMessage('Mevcut şifreniz hatalı.');
      return;
    }

    const updatedUser: UserInfo = {
      ...user,
      email: emailValue,
      password: newPassword || user.password,
    };

    localStorage.setItem('user_auth', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setNewPassword('');
    setCurrentPassword('');
    setFormStatus('success');
    setFormMessage('Hesap bilgilerinizi başarıyla güncellediniz.');
  };

  const handleResetPassword = (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!resetEmail) {
      setResetStatus('error');
      setResetMessage('Lütfen e-posta adresinizi girin.');
      return;
    }

    if (resetEmail !== user.email) {
      setResetStatus('error');
      setResetMessage('Girilen e-posta kayıtlı kullanıcı ile eşleşmiyor.');
      return;
    }

    setResetStatus('success');
    setResetMessage('Şifre sıfırlama isteğiniz alındı. E-posta adresinize bir bağlantı gönderildi (simülasyon).');
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-10 shadow-2xl shadow-black/30">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold mb-3">HESABIM</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">Kullanıcı Hesabım</h1>
              <p className="mt-4 text-gray-400">Burada hesap bilgilerinizi, randevularınızı ve mesajlarınızı yönetebilirsiniz.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-600 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-500"
            >
              <ArrowLeft className="w-4 h-4" />
              Giriş Sayfasına Dön
            </Link>
          </div>

          {!user ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8 text-center">
              <p className="text-lg font-semibold text-white">Henüz giriş yapmadınız.</p>
              <p className="mt-3 text-gray-400">Profil sayfanızı görmek için lütfen giriş yapın.</p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-bold text-black transition hover:bg-amber-500"
              >
                Giriş Yap
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
              <aside className="space-y-5 rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-6">
                <div className="rounded-3xl bg-amber-500/10 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-300">Hesap Özeti</p>
                  <h2 className="mt-4 text-2xl font-black text-white">{user.name}</h2>
                  <p className="mt-1 text-sm text-gray-400">{user.email}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    <span>Toplam Randevu: {appointments.length}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <ClipboardList className="w-5 h-5 text-amber-500" />
                    <span>Mesajlar: {messages.length}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`w-full text-left rounded-3xl px-5 py-4 transition ${activeTab === tab.key ? 'bg-amber-600/15 border border-amber-500/20 text-white' : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-amber-300" />
                          <span className="font-semibold">{tab.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="space-y-6">
                {activeTab === 'hesap' && (
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Hesap Bilgileri</p>
                        <h2 className="text-3xl font-black text-white">Kişisel bilgileriniz</h2>
                        <p className="mt-2 text-gray-400">E-posta adresiniz ve profil adınız bu alanda görünür.</p>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">Aktif Hesap</span>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
                        <p className="text-sm uppercase tracking-[0.28em] text-gray-400">Adınız</p>
                        <p className="mt-3 text-lg font-semibold text-white">{user.name}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-6">
                        <p className="text-sm uppercase tracking-[0.28em] text-gray-400">E-posta</p>
                        <p className="mt-3 text-lg font-semibold text-white">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'randevu' && (
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Randevularım</p>
                        <h2 className="text-3xl font-black text-white">Geçmiş ve planlanan randevular</h2>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">{appointments.length} adet</span>
                    </div>

                    <div className="mt-8 space-y-4">
                      {loading ? (
                        <p className="text-gray-400">Randevular yükleniyor...</p>
                      ) : appointments.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-900/80 p-8 text-center text-gray-400">
                          Henüz randevunuz bulunmuyor.
                        </div>
                      ) : (
                        appointments.map((appointment) => (
                          <div key={appointment.id} className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                              <div>
                                <p className="text-sm text-gray-400">Randevu Tarihi</p>
                                <p className="mt-2 text-lg font-semibold text-white">{new Date(appointment.date).toLocaleDateString('tr-TR')} • {appointment.time}</p>
                              </div>
                              <span className="rounded-full bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-200">{formatStatusText(appointment.status)}</span>
                            </div>

                            <div className="mt-5">
                              <p className="text-sm font-semibold text-white mb-3">Hizmetler</p>
                              <ul className="space-y-2 text-sm text-gray-300">
                                {appointment.services?.map((item) => (
                                  <li key={item.id} className="list-disc list-inside">
                                    {item.service?.name ?? 'Bilinmeyen hizmet'}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'mesaj' && (
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Mesajlarım</p>
                        <h2 className="text-3xl font-black text-white">Gelen kutusu</h2>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">{messages.length} mesaj</span>
                    </div>

                    <div className="mt-8 space-y-4">
                      {messages.map((messageItem) => (
                        <div key={messageItem.id} className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-gray-400">{messageItem.date}</p>
                              <h3 className="mt-2 text-lg font-semibold text-white">{messageItem.subject}</h3>
                            </div>
                            <span className="rounded-full bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-200">{messageItem.status}</span>
                          </div>
                          <p className="mt-4 text-gray-300">{messageItem.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'duzenle' && (
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Hesap Bilgilerini Düzenle</p>
                        <h2 className="text-3xl font-black text-white">E-posta ve şifrenizi güncelleyin</h2>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">Güvenli</span>
                    </div>

                    <form onSubmit={handleUpdateAccount} className="mt-8 space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-300">E-posta</label>
                          <input
                            type="email"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-4 text-white outline-none transition focus:border-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300">Mevcut Şifre</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-2 w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-4 text-white outline-none transition focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300">Yeni Şifre</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Yeni bir şifre girin"
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-4 text-white outline-none transition focus:border-amber-500"
                        />
                      </div>

                      {formMessage && (
                        <div className={`rounded-2xl px-4 py-3 text-sm ${formStatus === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                          {formMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="rounded-full bg-amber-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-amber-500"
                      >
                        Bilgilerimi Güncelle
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'sifremiUnuttum' && (
                  <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Şifremi Unuttum</p>
                        <h2 className="text-3xl font-black text-white">Şifre sıfırlama yardımı</h2>
                        <p className="mt-2 text-gray-400">Kayıtlı e-posta adresinizi girerek şifre sıfırlama talebi oluşturabilirsiniz.</p>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">Hemen</span>
                    </div>

                    <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300">Kayıtlı E-posta</label>
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="ornek@domain.com"
                          className="mt-2 w-full rounded-3xl border border-white/10 bg-zinc-950/90 px-4 py-4 text-white outline-none transition focus:border-amber-500"
                        />
                      </div>

                      {resetMessage && (
                        <div className={`rounded-2xl px-4 py-3 text-sm ${resetStatus === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                          {resetMessage}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="rounded-full bg-amber-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-amber-500"
                      >
                        Şifre Sıfırlama Talebi Gönder
                      </button>
                    </form>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
