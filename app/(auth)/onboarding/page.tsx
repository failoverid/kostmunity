"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client"; // Pastikan path ini benar!
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Import Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  // --- STATE BARU UNTUK MENGGANTI TAMPILAN ---
  const [view, setView] = useState<'member' | 'admin'>('member');

  // State yang sudah ada
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fungsi untuk menangani login, kini menerima peran (role)
  const handleLogin = async (loginRole: 'member' | 'admin') => {
    setLoading(true);
    setError(null);

    // LOGIKA DINONAKTIFKAN SEMENTARA
    alert(`UI Tombol Login ${loginRole} Berfungsi! (Firebase dinonaktifkan)`);
    setLoading(false);

    /*
    try {
      // Anda bisa membedakan logika login di sini
      // if (loginRole === 'admin') { ... } else { ... }
      await signInWithEmailAndPassword(auth, username, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
    */
  };

  // Fungsi untuk mengganti view DAN mereset input
  const toggleView = () => {
    const newView = view === 'member' ? 'admin' : 'member';
    setView(newView);

    // Reset state saat ganti view
    setUsername("");
    setPassword("");
    setError(null);
    setShowPassword(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FDF9ED] p-8 text-gray-800">
      {/* 1. Konten Utama (Form) */}
      <main className="flex-grow flex flex-col justify-center w-full max-w-sm mx-auto">

        {/* --- Judul dan Subjudul Dibuat Dinamis --- */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-2">
            Masuk
            {view === 'admin' && (
              <span className="text-2xl font-normal text-orange-600 ml-2">
                untuk Admin Kos
              </span>
            )}
          </h1>
          {view === 'member' && (
            <p className="text-gray-600">
              Masukkan username dan password akun kalian yang sudah diberikan oleh pemilik kos
            </p>
          )}
        </div>

        {/* Form Inputs (Tetap sama untuk kedua view) */}
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white p-6 text-base focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-gray-300 bg-white p-6 text-base focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        {/* Tombol Aksi */}
        <div className="mt-10 space-y-4">
          <Button
            onClick={() => handleLogin(view)} // Kirim 'view' sebagai peran
            disabled={loading || !username || !password}
            className="w-full rounded-full bg-[#C7C6B8] py-6 text-base font-semibold text-gray-600 hover:bg-[#B0AF9F] disabled:bg-[#C7C6B8]/80 disabled:text-gray-500"
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>

          {/* Separator "atau" */}
          <div className="flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-400">atau</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* --- Tombol Toggle Dibuat Dinamis --- */}
          <Button
            variant="outline"
            className="w-full rounded-full border border-gray-400 bg-transparent py-6 text-base font-semibold text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={toggleView} // Gunakan fungsi toggleView
          >
            {/* Teks tombol berubah berdasarkan state 'view' */}
            {view === 'member' ? 'Masuk sebagai Admin Kos' : 'Masuk sebagai Member Kos'}
          </Button>

          {/* --- Link Daftar (Hanya Muncul di View Admin) --- */}
          {view === 'admin' && (
            <p className="text-center text-sm text-gray-600 pt-2">
              Belum Memiliki Akun Admin?{' '}
              <button
                onClick={() => router.push('/register-admin')} // Arahkan ke rute register admin
                className="font-semibold text-red-500 hover:underline"
              >
                Daftar
              </button>
            </p>
          )}
        </div>
      </main>

      {/* 2. Footer (Logo) */}
      <footer className="flex-shrink-0 flex flex-col items-center justify-center pt-8">
        <Image src="/kostmunity-logo.png" alt="Kostmunity Logo" width={50} height={50} />
        <span className="text-xl font-bold text-gray-800 mt-2">kostmunity.</span>
      </footer>
    </div>
  );
}
