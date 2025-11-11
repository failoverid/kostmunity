"use client";

import Link from "next/link";
import {
  Home,
  Building2,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";

// Data Dummy untuk Layanan
const services = [
  { id: 1, nama: "Laundry Kiloan", kontak: "0812-3456-7890" },
  { id: 2, nama: "Catering Sehat", kontak: "0821-4455-6677" },
  { id: 3, nama: "Servis AC", kontak: "0855-1122-3344" },
  { id: 4, nama: "Tukang Galon", kontak: "0877-9988-7766" },
];

// Komponen Baris untuk setiap layanan
const ServiceRow = ({ service }: { service: (typeof services)[0] }) => (
  <div className="grid grid-cols-3 gap-4 items-center text-sm p-3 bg-white rounded-lg shadow-sm">
    <span className="truncate col-span-1">{service.nama}</span>
    <span className="text-gray-600 col-span-1">{service.kontak}</span>
    <div className="flex justify-end space-x-1 col-span-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
        <Pencil className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Konten utama yang bisa di-scroll */}
      <main className="p-4 space-y-4 max-w-lg mx-auto pb-24">

        {/* 1. Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-800 text-white rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Kostmunity</h1>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        </div>

        {/* 2. Konten Halaman */}
        <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">Manajemen Layanan</h2>
              <p className="text-sm text-gray-500">Kost Kurnia</p>
            </div>
            <Button size="sm" className="bg-gray-800 text-white rounded-md text-xs px-3 py-1 h-auto">
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50">
            {/* Header Tabel */}
            <div className="grid grid-cols-3 gap-4 text-xs font-bold text-gray-500 mb-2 px-3">
              <span className="col-span-1">Nama</span>
              <span className="col-span-1">Kontak</span>
              <span className="text-right col-span-1">Edit</span>
            </div>
            {/* Isi Tabel */}
            <div className="space-y-2">
              {services.map((service) => (
                <ServiceRow key={service.id} service={service} />
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
