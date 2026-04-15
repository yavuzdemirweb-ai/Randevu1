"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { User, Plus, RefreshCcw, BellRing } from 'lucide-react';

type ServiceItem = {
  service: {
    name: string;
    price: number;
  };
};

type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  totalAmount: number;
  status: string;
  services: ServiceItem[];
};

type AdminService = {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  image?: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
};

type Category = {
  id: string;
  name: string;
  services: AdminService[];
};

type Props = {
  appointments: Appointment[];
};

const statusOptions = [
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'CONFIRMED', label: 'Onaylandı' },
  { value: 'COMPLETED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal Et' },
];

const formatStatusText = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Beklemede';
    case 'CONFIRMED':
      return 'Onaylandı';
    case 'COMPLETED':
      return 'Tamamlandı';
    case 'CANCELLED':
      return 'İptal Edildi';
    default:
      return status;
  }
};

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 880;
    gainNode.gain.value = 0.12;
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.18);
  } catch (error) {
    console.error('Ses çalma hatası:', error);
  }
};

export default function AdminDashboardClient({ appointments }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [appointmentsState, setAppointmentsState] = useState<Appointment[]>(appointments);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'services'>('dashboard');
  const [statusMessage, setStatusMessage] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceMessage, setServiceMessage] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategoryId, setNewServiceCategoryId] = useState('');
  const [newServiceCategoryName, setNewServiceCategoryName] = useState('');

  const countRef = useRef<number>(appointments.length);

  useEffect(() => {
    const adminAuth = localStorage.getItem("admin_auth");
    setAllowed(adminAuth === "true");
  }, []);

  useEffect(() => {
    countRef.current = appointmentsState.length;
  }, [appointmentsState]);

  useEffect(() => {
    if (activeSection === 'services') {
      fetchAdminServices();
    }
  }, [activeSection]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/appointments');
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;

        if (data.length > countRef.current) {
          playNotificationSound();
        }

        setAppointmentsState(data.map((apt: any) => ({ ...apt, date: apt.date })));
        countRef.current = data.length;
      } catch (error) {
        console.error('Randevu güncelleme hatası:', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchAdminServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      if (!res.ok) {
        setServiceMessage('Hizmetler yüklenirken bir sorun oluştu.');
        return;
      }
      const data = await res.json();
      setCategories(data.categories || []);
      setServiceMessage('Hizmetler yüklendi.');
    } catch (error) {
      console.error('Admin service fetch error:', error);
      setServiceMessage('Hizmetler yüklenirken bir hata oluştu.');
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      setStatusMessage('');
      const res = await fetch('/api/appointments/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatusMessage(data.error || 'Durum güncellenemedi.');
        return;
      }

      setAppointmentsState((prev) => prev.map((item) => (item.id === id ? { ...item, status: data.status } : item)));
      setStatusMessage('Randevu durumu başarıyla güncellendi.');
    } catch (error) {
      console.error('Appointment status update error:', error);
      setStatusMessage('Durum güncellenirken hata oluştu.');
    }
  };

  const updateServiceField = (serviceId: string, field: 'name' | 'price' | 'categoryId', value: string) => {
    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        services: category.services.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                [field]: field === 'price' ? Number(value) : value,
                ...(field === 'categoryId' ? { categoryId: value } : {}),
              }
            : service
        ),
      }))
    );
  };

  const handleServiceUpdate = async (service: AdminService) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: service.name,
          price: service.price,
          categoryId: service.categoryId,
          categoryName: service.category.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServiceMessage(data.error || 'Hizmet güncellenemedi.');
        return;
      }

      setServiceMessage('Hizmet başarıyla güncellendi.');
      fetchAdminServices();
    } catch (error) {
      console.error('Service update error:', error);
      setServiceMessage('Hizmet güncellenirken hata oluştu.');
    }
  };

  const handleCreateService = async () => {
    if (!newServiceName || !newServicePrice || (!newServiceCategoryId && !newServiceCategoryName)) {
      setServiceMessage('Lütfen yeni hizmet için tüm gerekli alanları doldurun.');
      return;
    }

    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newServiceName,
          price: Number(newServicePrice),
          categoryId: newServiceCategoryId || undefined,
          categoryName: newServiceCategoryName || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServiceMessage(data.error || 'Yeni hizmet oluşturulamadı.');
        return;
      }

      setServiceMessage('Yeni hizmet başarıyla oluşturuldu.');
      setNewServiceName('');
      setNewServicePrice('');
      setNewServiceCategoryId('');
      setNewServiceCategoryName('');
      fetchAdminServices();
    } catch (error) {
      console.error('Create service error:', error);
      setServiceMessage('Yeni hizmet oluşturulurken hata oluştu.');
    }
  };

  if (allowed === null) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-10 text-white shadow-xl">
          Yükleniyor...
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-24">
        <div className="max-w-3xl w-full rounded-[2rem] border border-red-500/20 bg-red-500/10 p-12 text-center shadow-2xl shadow-black/30">
          <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-4">Erişim reddedildi</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Bu alana giriş yetkiniz yok</h1>
          <p className="text-gray-300 mb-8">Admin paneline erişim için lütfen yönetici hesabıyla giriş yapın. Bu bölüm sadece yetkili kullanıcılar içindir.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-400"
            >
              Admin Giriş Sayfasına Git
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-amber-500 hover:text-amber-500"
            >
              Kullanıcı Girişine Dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold mb-3">Admin Yönetimi</p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveSection('dashboard')}
                  className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] transition ${activeSection === 'dashboard' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('services')}
                  className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] transition ${activeSection === 'services' ? 'bg-amber-500 text-black' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  Güncelleme Yap
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <BellRing className="w-5 h-5 text-amber-400" />
              <span>Yeni randevu algılanırsa sesli uyarı çalacaktır.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black text-white">ADMİN <span className="text-amber-500">DASHBOARD</span></h1>
            <p className="text-gray-500">Gelen randevular ve hizmet yönetimini burada takip edebilirsiniz.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-6 bg-zinc-900 rounded-2xl border border-white/5 text-center">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Toplam Randevu</p>
              <p className="text-3xl font-black text-white mt-1">{appointmentsState.length}</p>
            </div>
            <div className="p-6 bg-amber-600/10 rounded-2xl border border-amber-600/20 text-center">
              <p className="text-xs text-amber-500 font-bold uppercase tracking-wider">Bugün</p>
              <p className="text-3xl font-black text-white mt-1">
                {appointmentsState.filter(a => new Date(a.date).toLocaleDateString('tr-TR') === new Date().toLocaleDateString('tr-TR')).length}
              </p>
            </div>
          </div>
        </div>

        {activeSection === 'dashboard' ? (
          <>
            <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900 border-b border-white/5">
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Müşteri</th>
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">İletişim</th>
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Tarih/Saat</th>
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Hizmetler</th>
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Tutar</th>
                    <th className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentsState.map((apt) => (
                    <tr key={apt.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-500" />
                          </div>
                          <span className="font-bold">{apt.customerName}</span>
                        </div>
                      </td>
                      <td className="p-6 text-gray-400 font-medium">{apt.customerPhone}</td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold">{new Date(apt.date).toLocaleDateString('tr-TR')}</span>
                          <span className="text-xs text-gray-500">{apt.time}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-wrap gap-2">
                          {apt.services.map((s, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10 text-gray-400">
                              {s.service.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-6 font-black text-amber-500">{apt.totalAmount} ₺</td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <select
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-sm text-white outline-none transition focus:border-amber-500"
                          >
                            {statusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <span className="text-[11px] text-gray-400">{formatStatusText(apt.status)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {appointmentsState.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-500 font-medium">Henüz randevu bulunmuyor.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {statusMessage && (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                {statusMessage}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Hizmet Yönetimi</p>
                  <h2 className="text-3xl font-black text-white">Kategorilere göre hizmetleri güncelle</h2>
                  <p className="mt-2 text-gray-400">Aşağıdan mevcut hizmetleri düzenleyebilir veya yeni hizmet ekleyebilirsiniz.</p>
                </div>
                <button
                  type="button"
                  onClick={fetchAdminServices}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <RefreshCcw className="w-4 h-4 text-amber-400" />
                  Yenile
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {categories.length === 0 ? (
                <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8 text-center text-gray-400">
                  Hizmet verisi bulunamadı. Lütfen sayfayı yenileyin.
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-amber-500 font-bold">Kategori</p>
                        <h3 className="text-2xl font-black text-white">{category.name}</h3>
                      </div>
                      <span className="rounded-full bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">{category.services.length} hizmet</span>
                    </div>

                    <div className="mt-6 space-y-4">
                      {category.services.map((service) => (
                        <div key={service.id} className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 grid gap-4 md:grid-cols-[1fr_1fr] items-end">
                          <div className="space-y-3">
                            <label className="text-sm text-gray-300">Hizmet Adı</label>
                            <input
                              type="text"
                              value={service.name}
                              onChange={(e) => updateServiceField(service.id, 'name', e.target.value)}
                              className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm text-gray-300">Fiyat</label>
                            <input
                              type="number"
                              value={service.price}
                              onChange={(e) => updateServiceField(service.id, 'price', e.target.value)}
                              className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                            />
                          </div>
                          <div className="space-y-3 md:col-span-2">
                            <label className="text-sm text-gray-300">Kategori</label>
                            <select
                              value={service.categoryId}
                              onChange={(e) => updateServiceField(service.id, 'categoryId', e.target.value)}
                              className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                            >
                              {categories.map((categoryOption) => (
                                <option key={categoryOption.id} value={categoryOption.id}>
                                  {categoryOption.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleServiceUpdate(service)}
                            className="rounded-full bg-amber-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-500 md:col-span-2"
                          >
                            Güncelle
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Yeni Hizmet Ekle</p>
                  <h3 className="text-2xl font-black text-white">Yeni hizmet kaydı oluştur</h3>
                </div>
                <span className="text-sm text-gray-400">Kategori seçin veya yeni kategori girin.</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Hizmet Adı</label>
                  <input
                    type="text"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    placeholder="Örn: Saç Kesimi"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Fiyat</label>
                  <input
                    type="number"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    placeholder="250"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Mevcut Kategori</label>
                  <select
                    value={newServiceCategoryId}
                    onChange={(e) => setNewServiceCategoryId(e.target.value)}
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                  >
                    <option value="">Kategori seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Yeni Kategori</label>
                  <input
                    type="text"
                    value={newServiceCategoryName}
                    onChange={(e) => setNewServiceCategoryName(e.target.value)}
                    placeholder="Örn: Saç Bakımı"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-3 px-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateService}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-500"
              >
                <Plus className="w-4 h-4" />
                Hizmet Ekle
              </button>
            </div>

            {serviceMessage && (
              <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
                {serviceMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
