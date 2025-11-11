"use client";

import Link from "next/link";
import { Home, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import Image from "next/image";

// Data Dummy untuk Tagihan
const tagihan = [
  { id: 1, nama: "Budi Santoso", total: "1.500K", sisa: "0K", status: "Lunas" },
  { id: 2, nama: "Citra Lestari", total: "1.500K", sisa: "1.500K", status: "Belum Lunas" },
  { id: 3, nama: "Doni Hidayat", total: "1.200K", sisa: "0K", status: "Lunas" },
  { id: 4, nama: "Eka Wijaya", total: "1.200K", sisa: "1.200K", status: "Belum Lunas" },
  { id: 5, nama: "Fajar Nugroho", total: "1.200K", sisa: "0K", status: "Lunas" },
];

// Komponen Badge Status (Reusable)
const StatusBadge = ({ status }: { status: "Lunas" | "Belum Lunas" }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full
    ${status === "Lunas"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
    }`}
  >
    {status}
  </span>
);

// Komponen Baris untuk setiap tagihan
const BillingRow = ({ item }: { item: (typeof tagihan)[0] }) => (
  <div className="grid grid-cols-4 gap-2 items-center text-sm p-3 bg-white rounded-lg shadow-sm">
    <span className="truncate">{item.nama}</span>
    <span className="text-right text-gray-600">{item.total}</span>
    <span className="text-right font-medium">{item.sisa}</span>
    <div className="flex justify-end">
      <StatusBadge status={item.status} />
    </div>
  </div>
);

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
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
        <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">Manajemen Tagihan</h2>
              <p className="text-sm text-gray-500">Oktober 2025</p>
            </div>
            <Button size="sm" className="bg-gray-800 text-white rounded-md text-xs px-3 py-1 h-auto">
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50">
            {/* Header Tabel */}
            <div className="grid grid-cols-4 gap-2 text-xs font-bold text-gray-500 mb-2 px-3">
              <span>Nama</span>
              <span className="text-right">Total</span>
              <span className="text-right">Sisa</span>
              <span className="text-right">Status</span>
            </div>
            {/* Isi Tabel */}
            <div className="space-y-2">
              {tagihan.map((item) => (
                <BillingRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

      </main>

      {/* Floating Action Button (FAB) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button
          asChild
          className="bg-gray-800 text-white rounded-full shadow-lg h-14 w-32 text-base font-semibold"
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
