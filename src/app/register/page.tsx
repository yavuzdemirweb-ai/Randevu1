"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";

type UserInfo = {
  name: string;
  email: string;
  password: string;
  secretQuestion: string;
  secretAnswer: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword || !secretQuestion || !secretAnswer) {
      setSuccess(false);
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    if (password !== confirmPassword) {
      setSuccess(false);
      setMessage('Parolalar eşleşmiyor.');
      return;
    }

    const userInfo: UserInfo = { name, email, password, secretQuestion, secretAnswer };
    localStorage.setItem('user_auth', JSON.stringify(userInfo));

    setSuccess(true);
    setMessage('Kayıt başarılı! Hesabınız oluşturuldu, sizi profil sayfanıza yönlendiriyoruz.');

    setTimeout(() => {
      router.push('/profile');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-10 shadow-2xl shadow-black/30">
          <div className="mb-10 text-center">
            <p className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold mb-3">Yeni Hesap</p>
            <h1 className="text-4xl md:text-5xl font-black text-white">Hesap Oluşturun</h1>
            <p className="mt-4 text-gray-400">Hesabınızı oluşturarak randevularınızı ve profilinizi daha kolay yönetin.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-white outline-none transition focus:border-amber-500"
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Gizli Soru</label>
              <input
                type="text"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                placeholder="Örn: İlk evcil hayvanınızın adı nedir?"
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 px-4 text-white outline-none transition focus:border-amber-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Gizli Cevap</label>
              <input
                type="text"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                placeholder="Cevabınızı buraya yazın"
                className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 px-4 text-white outline-none transition focus:border-amber-500"
              />
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-4 text-sm text-gray-400">
              <p>Şifrenizi unuttuğunuzda bu gizli soru ve cevap ile hesabınızı yeniden alabilirsiniz.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Parola Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolanızı tekrar girin"
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
              Kayıt Ol
            </button>
          </form>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            <p>
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-amber-500 hover:text-amber-400">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
