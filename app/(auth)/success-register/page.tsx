"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessRegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect setelah 3 detik
    const timer = setTimeout(() => {
      router.push("/dashboard"); // Ganti dengan rute dashboard Anda
    }, 3000); // 3 detik

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDF9ED] p-4 text-center">
      <div className="relative h-24 w-24 mb-4">
        <Image src="/logo.png" alt="Kostmunity Logo" fill objectFit="contain" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Berhasil Registrasi</h1>
      <p className="text-lg text-gray-600">di Akun Kostmunity.</p>
      <p className="text-xl font-semibold mt-4 text-gray-800">kostmunity.</p>
    </div>
  );
}
