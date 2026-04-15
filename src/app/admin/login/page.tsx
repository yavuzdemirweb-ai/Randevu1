// src/app/admin/login/page.tsx
"use client";
import { useState } from 'react';
import { Scissors } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin_password123") {
      // Set a cookie or local storage (Simple for prototype)
      localStorage.setItem("admin_auth", "true");
      window.location.href = "/admin/dashboard";
    } else {
      setError("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md w-full space-y-8 p-10 bg-zinc-900 rounded-3xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Scissors className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">ADMİN PANELİ</h2>
          <p className="text-gray-500 mt-2">Yavuz Kuaför Yönetim Paneli</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <input
              type="text"
              required
              className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              required
              className="w-full bg-zinc-950 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-600/20"
          >
            Giriş Yap
          </button>

          <p className="mt-4 text-center text-sm text-gray-400">
            Admin parolasını unuttuysanız, bu arayüzden sıfırlama desteklenmiyor. Lütfen yetkili kişiye başvurun.
          </p>
        </form>
      </div>
    </div>
  );
}
