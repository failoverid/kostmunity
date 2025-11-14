"use client";

import Link from "next/link";
import { Home, Building2, ImageIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import Image from "next/image";

// Data Dummy untuk Lost & Found
const items = [
  { id: 1, nama: "Kunci Motor", status: "Ditemukan" },
  { id: 2, nama: "Dompet Coklat", status: "Ditemukan" },
  { id: 3, nama: "Helm Bogo", status: "Ditemukan" },
  { id: 4, nama: "Charger Laptop", status: "Ditemukan" },
];

// Komponen Card untuk setiap item
const LostItemCard = ({ item }: { item: (typeof items)[0] }) => (
  <Card className="bg-gray-700 border-gray-600 rounded-lg shadow-md overflow-hidden">
    <div className="w-full h-32 bg-gray-600 flex items-center justify-center">
      <ImageIcon className="w-12 h-12 text-gray-500" />
    </div>
    <CardContent className="p-3">
      <h3 className="font-semibold truncate">{item.nama}</h3>
      <span className="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
        {item.status}
      </span>
    </CardContent>
  </Card>
);

export default function LostFoundPage() {
  return (
    // Layout Gelap
    <div className="min-h-screen bg-gray-800 text-white">
      {/* Konten utama yang bisa di-scroll */}
      <main className="p-4 space-y-4 max-w-lg mx-auto pb-24">

        {/* 1. Header */}
        <div className="sticky top-0 z-50 flex items-center pt-8 gap-2 pb-8 bg-gray border-b border-black-500 justify-center shadow-xl rounded-lg">
            <Image src="/kostmunity-logo.png" alt="Kostmunity Logo" width={29.97} height={35.19} className="filter invert"/>
            <h1 className="text-2xl font-bold text-white-800">
            Kostmunity
            </h1>
            <div className="flex flex-col items-start"> {/* <--- items-start di sini */}
            <p className="text-sm text-white-650 font-semibold m-0 leading-3 mt-1">Admin</p> {/* <--- mt-1 di sini */}
            <p className="text-sm text-white-800 font-bold m-0 leading-3">Dashboard</p>
            </div>
        </div>

        {/* 2. Konten Halaman */}
        <Card className="bg-[##404040] rounded-lg shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <div className="space-y-2">

            <h2 className="text-xl font-bold text-white">Lost and Found</h2>
            <p className="text-sm text-gray-400">Kost Kurnia</p>
            </div>
          </CardHeader>
          <CardContent className="p-4 bg-[##404040]">
            {/* 3. Grid Item */}
            <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
                <LostItemCard key={item.id} item={item} />
            ))}
            </div>
          </CardContent>
        </Card>
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
