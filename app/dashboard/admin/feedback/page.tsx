"use client";

import Link from "next/link";
import { Home, Building2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

// Data Dummy untuk Aduan
const feedback = [
  { id: 1, tanggal: "01/01/25 | 13:30", aduan: "Air di kamar mandi B-05 mati...", status: "Baru Ditanggapi" },
  { id: 2, tanggal: "01/01/25 | 10:15", aduan: "Lampu koridor lantai 2 mati...", status: "Baru Ditanggapi" },
  { id: 3, tanggal: "31/12/24 | 08:00", aduan: "Internet lambat sekali...", status: "Selesai" },
];

// Komponen Badge Status (Reusable)
const FeedbackStatusBadge = ({ status }: { status: string }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
    ${status === "Baru Ditanggapi"
      ? "bg-orange-200 text-orange-800"
      : "bg-green-200 text-green-800"
    }`}
  >
    {status}
  </span>
);

// Komponen Card untuk setiap aduan
const FeedbackCard = ({ item }: { item: (typeof feedback)[0] }) => (
  <Card className="bg-gray-700 border-gray-600 rounded-lg shadow-md overflow-hidden">
    <CardContent className="p-3 flex gap-3">
      {/* Image Placeholder */}
      <div className="w-20 h-20 bg-gray-600 rounded-md flex-shrink-0 flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-gray-500" />
      </div>
      {/* Konten Aduan */}
      <div className="flex flex-col justify-between space-y-1">
        <span className="text-xs text-gray-400">{item.tanggal}</span>
        <p className="text-sm font-medium leading-tight">{item.aduan}</p>
        <div className="flex">
          <FeedbackStatusBadge status={item.status} />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function FeedbackPage() {
  return (
    // Layout Gelap
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Konten utama yang bisa di-scroll */}
      <main className="p-4 space-y-4 max-w-lg mx-auto pb-24">

        {/* 1. Header */}
        <div className="flex items-center justify-center pt-8  gap-2">
          <Image src="/kostmunity-logo.png" alt="Kostmunity Logo" width={29.97} height={35.19} />
            <h1 className="text-2xl font-bold text-gray-800">
            Kostmunity
          </h1>
          <div className="flex flex-col items-start"> {/* <--- items-start di sini */}
            <p className="text-sm text-gray-500 m-0 leading-3 mt-1">Admin</p> {/* <--- mt-1 di sini */}
            <p className="text-sm text-gray-800 font-bold m-0 leading-3">Dashboard</p>
          </div>
        </div>

        {/* 2. Konten Halaman */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Aduan dan Feedback</h2>
          <p className="text-sm text-gray-400">Kost Kurnia</p>
        </div>

        {/* 3. Daftar Aduan */}
        <div className="space-y-3">
          {feedback.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>

      </main>

      {/* Floating Action Button (FAB) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button
          asChild
          className="bg-gray-200 text-gray-800 rounded-full shadow-lg h-14 w-32 text-base font-semibold hover:bg-white"
        >
          <Link href="/dashboard/admin">
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
        </Button>
      </nav>
    </div>
  );
}
