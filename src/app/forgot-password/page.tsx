"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";

type UserInfo = {
  name: string;
  email: string;
  password: string;
  secretQuestion: string;
  secretAnswer: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [secretQuestion, setSecretQuestion] = useState("");
  const [storedUser, setStoredUser] = useState<UserInfo | null>(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleEmailCheck = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      setSuccess(false);
      setMessage('Lütfen kayıtlı e-posta adresinizi girin.');
      return;
    }

    const stored = localStorage.getItem('user_auth');
    if (!stored) {
      setSuccess(false);
      setMessage('Henüz kayıtlı kullanıcı bulunamadı. Önce kayıt olun.');
      return;
    }

    const parsedUser = JSON.parse(stored) as UserInfo;
    if (parsedUser.email !== email) {
      setSuccess(false);
      setMessage('Bu e-posta ile kayıtlı kullanıcı bulunamadı. Doğru e-posta girin.');
      return;
    }

    setStoredUser(parsedUser);
    setSecretQuestion(parsedUser.secretQuestion || 'Gizli soru bulunamadı.');
    setStep(2);
    setMessage('');
  };

  const handleReset = (event: React.FormEvent) => {
    event.preventDefault();

    if (!storedUser) {
      setSuccess(false);
      setMessage('Lütfen önce kayıtlı e-postanızı doğrulayın.');
      return;
    }

    if (!secretAnswer || !newPassword || !confirmPassword) {
      setSuccess(false);
      setMessage('Lütfen tüm alanları doldurun.');
      return;
    }

    if (secretAnswer.trim().toLowerCase() !== storedUser.secretAnswer.trim().toLowerCase()) {
      setSuccess(false);
      setMessage('Gizli cevap eşleşmiyor. Lütfen tekrar deneyin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSuccess(false);
      setMessage('Yeni parolalar eşleşmiyor.');
      return;
    }

    const updatedUser: UserInfo = {
      ...storedUser,
      password: newPassword,
    };

    localStorage.setItem('user_auth', JSON.stringify(updatedUser));
    setSuccess(true);
    setMessage('Şifre başarıyla güncellendi. Lütfen yeni bilgilerle giriş yapın.');

    setTimeout(() => {
      router.push('/login');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-zinc-900/80 p-10 shadow-2xl shadow-black/30">
          <div className="mb-10 text-center">
            <p className="text-amber-500 uppercase tracking-[0.4em] text-xs font-bold mb-3">Şifremi Unuttum</p>
            <h1 className="text-4xl md:text-5xl font-black text-white">Hesabınızı Kurtarın</h1>
            <p className="mt-4 text-gray-400">Kayıtlı e-posta ve gizli sorunuz ile yeni parola oluşturabilirsiniz.</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailCheck} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Kayıtlı E-posta</label>
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

              {message && (
                <div className={`rounded-2xl px-4 py-3 text-sm ${success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-amber-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-amber-500"
              >
                Gizli Soruyu Göster
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Gizli Soru</label>
                <input
                  type="text"
                  value={secretQuestion}
                  readOnly
                  className="w-full rounded-3xl border border-white/10 bg-zinc-950/80 py-4 px-4 text-white outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Gizli Cevap</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    value={secretAnswer}
                    onChange={(e) => setSecretAnswer(e.target.value)}
                    placeholder="Gizli cevabınızı girin"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Yeni Parola</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Yeni parolanızı girin"
                    className="w-full rounded-3xl border border-white/10 bg-zinc-950/90 py-4 pl-12 pr-4 text-white outline-none transition focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Yeni Parola Tekrar</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni parolanızı tekrar girin"
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
                Yeni Parola Oluştur
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
            <p>
              Hesabınızı hatırladınız mı?{' '}
              <Link href="/login" className="text-amber-500 hover:text-amber-400">
                Giriş yapın
              </Link>
            </p>
            <p className="mt-3">
              Henüz hesabınız yoksa{' '}
              <Link href="/register" className="text-amber-500 hover:text-amber-400">
                kayıt olabilirsiniz.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
