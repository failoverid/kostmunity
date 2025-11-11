"use client";

import Link from "next/link";
import {
  Home,
  Building2,
  Plus,
  MessageSquare,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import Image from "next/image";

// Data Dummy untuk Member
const members = [
  { id: 1, nama: "Budi Santoso", kamar: "A-01", status: "Aktif" },
  { id: 2, nama: "Citra Lestari", kamar: "A-02", status: "Aktif" },
  { id: 3, nama: "Doni Hidayat", kamar: "B-05", status: "Aktif" },
  { id: 4, nama: "Eka Wijaya", kamar: "C-10", status: "Aktif" },
  { id: 5, nama: "Fajar Nugroho", kamar: "C-11", status: "Aktif" },
];

// Komponen Baris untuk setiap member
const MemberRow = ({ member }: { member: (typeof members)[0] }) => (
  <div className="grid grid-cols-5 gap-2 items-center text-sm p-2 bg-white rounded-lg shadow-sm">
    <span className="truncate">{member.nama}</span>
    <span className="text-center">{member.kamar}</span>
    <div className="flex justify-center">
      <Button variant="outline" size="icon" className="h-8 w-8">
        <MessageSquare className="w-4 h-4" />
      </Button>
    </div>
    <div className="flex justify-center">
      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
        {member.status}
      </span>
    </div>
    <div className="flex justify-center space-x-1">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
        <Pencil className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Konten utama yang bisa di-scroll (diberi padding bawah) */}
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
              <h2 className="text-lg font-semibold">Manajemen Member</h2>
              <p className="text-sm text-gray-500">Oktober 2025</p>
            </div>
            <Button size="sm" className="bg-gray-800 text-white rounded-md text-xs px-3 py-1 h-auto">
              <Plus className="w-4 h-4 mr-1" />
              Tambah
            </Button>
          </CardHeader>
          <CardContent className="p-4 bg-gray-50">
            {/* Header Tabel */}
            <div className="grid grid-cols-5 gap-2 text-xs font-bold text-gray-500 mb-2 px-2">
              <span>Nama</span>
              <span className="text-center">Kamar</span>
              <span className="text-center">G-Kontak</span>
              <span className="text-center">Status</span>
              <span className="text-center">Edit</span>
            </div>
            {/* Isi Tabel */}
            <div className="space-y-2">
              {members.map((member) => (
                <MemberRow key={member.id} member={member} />
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
