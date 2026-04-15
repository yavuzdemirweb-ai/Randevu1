"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Lock, Mail, User } from "lucide-react";

type UserInfo = {
  name: string;
  email: string;
  password: string;
  secretQuestion?: string;
  secretAnswer?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user_auth');
    if (storedUser) {
      setLoggedUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_auth');
    setLoggedUser(null);
    setSuccess(true);
    setMessage('Çıkış yapıldı. Tekrar giriş yapmak isterseniz aşağıdaki formu kullanabilirsiniz.');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setSuccess(false);
      setMessage('Lütfen eposta ve parola giriniz.');
      return;
    }

    const storedUser = localStorage.getItem('user_auth');
    if (!storedUser) {
      setSuccess(false);
      setMessage('Bu e-posta ile kayıtlı hesap bulunamadı. Lütfen önce kayıt olun.');
      return;
    }

    const parsedUser = JSON.parse(storedUser) as UserInfo;
    if (parsedUser.email !== email) {
      setSuccess(false);
      setMessage('Bu e-posta ile kayıtlı hesap bulunamadı. Lütfen doğru e-posta kullanın.');
      return;
    }

    if (parsedUser.password !== password) {
      setSuccess(false);
      setMessage('Girilen şifre yanlış. Lütfen tekrar deneyin.');
      return;
    }

    setLoggedUser(parsedUser);
    setSuccess(true);
    setMessage('Giriş başarılı! Profil sayfanıza yönlendiriliyorsunuz...');

    setTimeout(() => {
      router.push('/profile');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-10 shadow-2xl shadow-black/30">
          <div className="mb-10 text-center">
            <p className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold mb-3">Kullanıcı Girişi</p>
            <h1 className="text-4xl md:text-5xl font-black text-white">Hesabınızla giriş yapın</h1>
            <p className="mt-4 text-gray-400">Randevu alırken bilgileriniz kolayca dolsun. Giriş yapmasanız da rezervasyon yapabilirsiniz.</p>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-6">
              <p className="text-gray-300">Hesabınız yok mu? Hemen bir hesap oluşturup randevularınızı, mesajlarınızı ve hesabınızı kolayca yönetebilirsiniz.</p>
              <Link
                href="/register"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-500"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>

          {loggedUser ? (
            <div className="space-y-8">
              <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Hesabım</p>
                    <Link href="/profile" className="inline-flex items-center gap-2 text-3xl font-black text-white hover:text-amber-300 transition">
                      {loggedUser.name}
                      <ArrowRight className="w-5 h-5 text-amber-500" />
                    </Link>
                    <p className="mt-2 text-gray-400">Hesabınız aktif. Profil sayfanızdan aldığınız hizmetleri ve mesajlarınızı görüntüleyebilirsiniz.</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                      href="/profile"
                      className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-500"
                    >
                      Profilime Git
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      <User className="mr-2 w-4 h-4 text-amber-500" />
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-amber-500">Hesabınız</p>
                    <p className="mt-2 text-white text-lg font-semibold">{loggedUser.email}</p>
                  </div>
                  <p className="text-sm text-gray-400">Profil bilgileriniz burada saklanır.</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@domain.com"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Parola</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolanızı girin"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              {message && (
                <div className={`rounded-2xl px-4 py-3 text-sm ${success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-amber-500"
              >
                Giriş Yap
              </button>
              <div className="mt-4 text-center text-sm">
                <Link href="/forgot-password" className="text-amber-500 hover:text-amber-400">
                  Şifremi unuttum
                </Link>
              </div>
            </form>
          )}

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-gray-400">
            <p>Randevu almak için login olmak zorunlu değildir. <Link href="/randevu" className="text-amber-500 hover:text-amber-400">Hemen randevu al</Link> veya giriş yaparak hesabınızı yönetin.</p>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-zinc-950/80 p-8">
            <p className="text-amber-500 uppercase tracking-[0.35em] text-xs font-bold mb-3">Admin Girişi</p>
            <h2 className="text-3xl font-black text-white">Yönetici paneline geç</h2>
            <p className="mt-2 text-gray-400">Bu bölümden yönetici hesabıyla admin paneline giriş yapabilirsiniz.</p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center rounded-full bg-amber-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-amber-500"
              >
                Admin Girişi Yap
              </Link>
              <p className="text-sm text-gray-400">Yönetici kullanıcı adı ve parolası ile giriş sağlanır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
