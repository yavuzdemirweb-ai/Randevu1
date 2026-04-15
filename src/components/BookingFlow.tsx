// src/components/BookingFlow.tsx
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Calendar, Clock, User, Phone, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string | null;
}

export default function BookingFlow({ services }: { services: Service[] }) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [loggedUser, setLoggedUser] = useState<{ name: string; email: string } | null>(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  
  // Get today's date in YYYY-MM-DD format
  const getTodayStr = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState("");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_auth');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setLoggedUser(parsed);
        if (parsed.name) {
          setCustomerInfo((prev) => ({ ...prev, name: prev.name || parsed.name }));
        }
      } catch {
        localStorage.removeItem('user_auth');
      }
    }

    const storedAdminAuth = localStorage.getItem('admin_auth');
    setAdminLoggedIn(storedAdminAuth === 'true');
  }, []);

  const fetchBookedTimes = async (selectedDate: string) => {
    try {
      const res = await fetch(`/api/appointments/available-times?date=${selectedDate}`);
      const data = await res.json();
      if (res.ok) {
        setBookedTimes(data.bookedTimes);
      }
    } catch (error) {
      console.error("Error fetching booked times:", error);
    }
  };

  // Initial fetch for today
  useEffect(() => {
    fetchBookedTimes(getTodayStr());
  }, []);

  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setTime(""); // Reset time when date changes
    if (newDate) {
      fetchBookedTimes(newDate);
    }
  };

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log("Submitting booking:", {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      date,
      time,
      services: selectedServices.map(s => s.id)
    });
    
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerInfo.name,
          customerPhone: customerInfo.phone,
          date,
          time,
          services: selectedServices.map(s => s.id),
          totalAmount: totalPrice
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Booking successful:", data);
        setIsSuccess(true);
      } else {
        console.error("Booking failed:", data.error || "Unknown error");
        alert(data.error || "Randevu oluşturulamadı. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Booking fetch error:", error);
      alert("Bir bağlantı hatası oluştu. Lütfen internetinizi kontrol edip tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (adminLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4">
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-12 text-center">
          <h2 className="text-4xl font-black text-amber-400 mb-4">Yönetici randevu alamaz</h2>
          <p className="text-gray-200 text-lg mb-3">Bu alana sadece site yöneticileri için onay ve yönetim işlemleri için erişim sağlanmıştır.</p>
          <p className="text-gray-400">Admin olarak randevu oluşturamazsınız. Lütfen müşteri hesabıyla giriş yapın veya çıkış yaparak normal randevu sürecini kullanın.</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 space-y-6 bg-zinc-900/50 border border-amber-500/20 rounded-3xl p-12"
      >
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold">Randevunuz Alındı!</h2>
        <p className="text-gray-400">Yavuz Kuaför'ü tercih ettiğiniz için teşekkürler. Randevunuz başarıyla oluşturuldu. Sizi bekliyoruz!</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-amber-600 rounded-full font-bold"
        >
          Anasayfaya Dön
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {loggedUser && (
        <div className="mb-6 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
          <p className="text-sm font-semibold">{loggedUser.name} olarak giriş yaptınız.</p>
          <p className="text-xs text-amber-200/90">Randevu bilgilerinizi kaydetmek için girişli kalabilirsiniz, ancak giriş olmadan da rezervasyon yapabilirsiniz.</p>
        </div>
      )}
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-12 px-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-gray-500'}`}>
              {s === 1 && <Scissors className="w-5 h-5" />}
              {s === 2 && <Calendar className="w-5 h-5" />}
              {s === 3 && <User className="w-5 h-5" />}
            </div>
            {s < 3 && <div className={`w-12 sm:w-24 h-1 mx-2 rounded ${step > s ? 'bg-amber-600' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer select-none ${selectedServices.find(s => s.id === service.id) ? 'bg-amber-600/10 border-amber-500' : 'bg-zinc-900 border-white/5 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{service.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.duration} dakika</p>
                    </div>
                    <span className="font-black text-amber-500">{service.price} ₺</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center p-6 bg-zinc-900 border-t border-white/10 rounded-b-2xl">
              <div>
                <p className="text-gray-500 text-sm">Toplam Tutar</p>
                <p className="text-2xl font-black">{totalPrice} ₺</p>
              </div>
              <button 
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
                className="bg-amber-600 disabled:opacity-50 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-amber-500 transition-colors"
              >
                Devam Et <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 bg-zinc-900 p-8 rounded-3xl border border-white/5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest">Tarih Seçin</label>
                  <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">ileri tarihli randevu oluşturabilirsiniz</span>
                </div>
                <motion.div 
                  className="relative"
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => {
                      handleDateChange(e.target.value);
                    }}
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none focus:border-amber-500 transition-colors text-white scheme-dark"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 text-amber-600 pointer-events-none" />
                </motion.div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest">Saat Seçin</label>
                <motion.select 
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                  whileTap={{ x: [-5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none focus:border-amber-500 transition-colors appearance-none text-white"
                >
                  <option value="">Saat Seçiniz</option>
                  {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map(t => (
                    <option 
                      key={t} 
                      value={t} 
                      disabled={bookedTimes.includes(t)}
                      className={bookedTimes.includes(t) ? "text-red-500" : ""}
                      style={bookedTimes.includes(t) ? { color: '#ef4444' } : {}}
                    >
                      {t} {bookedTimes.includes(t) ? "(bu saate randevu alınamaz)" : ""}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/5">
              <button onClick={() => setStep(1)} className="text-gray-400 font-bold px-6 py-2">Geri Dön</button>
              <button 
                disabled={!date || !time}
                onClick={() => setStep(3)}
                className="bg-amber-600 disabled:opacity-50 px-8 py-3 rounded-full font-bold transition-colors"
              >
                Son Adım
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 bg-zinc-900 p-8 rounded-3xl border border-white/5"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest">Ad Soyad</label>
                  <input 
                    type="text" 
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="Örn: Yavuz Yılmaz"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-400 uppercase tracking-widest">Telefon Numarası</label>
                  <input 
                    type="tel" 
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    placeholder="05XX XXX XX XX"
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="p-6 bg-amber-600/5 rounded-2xl border border-amber-600/20 space-y-4">
                <h4 className="font-bold border-b border-amber-600/10 pb-2">Randevu Özeti</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tarih / Saat:</span>
                  <span className="text-white font-medium">{date} / {time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Hizmetler:</span>
                  <span className="text-white font-medium text-right">{selectedServices.map(s => s.name).join(', ')}</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t border-amber-600/10 pt-4">
                   <span>Toplam:</span>
                   <span className="text-amber-500">{totalPrice} ₺</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-white/5">
              <button onClick={() => setStep(2)} className="text-gray-400 font-bold px-6 py-2">Geri Dön</button>
              <button 
                onClick={handleSubmit}
                disabled={!customerInfo.name || !customerInfo.phone || isSubmitting}
                className="bg-amber-600 disabled:opacity-50 px-12 py-3 rounded-full font-bold hover:bg-amber-500 transition-all shadow-xl shadow-amber-600/20"
              >
                {isSubmitting ? "Onaylanıyor..." : "Randevuyu Onayla"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
