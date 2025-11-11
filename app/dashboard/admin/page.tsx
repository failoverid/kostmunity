"use client";

// Import ikon dari lucide-react
import {
  Home,
  Pencil,
  Plus,
  ArrowRight,
  LogOut,
  Building2
} from "lucide-react";
// Import komponen shadcn/ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";

/**
 * Komponen Helper untuk baris placeholder abu-abu
 * Ini membantu agar kode utama tetap bersih
 */
const PlaceholderRow = ({ cols = 3 }: { cols: number }) => {
  let gridClass = "grid-cols-3"; // default
  if (cols === 2) gridClass = "grid-cols-2";
  if (cols === 4) gridClass = "grid-cols-4";

  return (
    <div className={`grid ${gridClass} gap-4 items-center`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
      ))}
    </div>
  );
};

/**
 * Komponen Helper untuk Card "Lihat Selengkapnya"
 */
const SeeMoreLink = () => (
  <Link
    href="#"
    className="flex items-center justify-end text-sm text-blue-600 hover:underline pt-4"
  >
    Lihat Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
  </Link>
);


// --- Komponen Halaman Utama Dashboard Admin ---
export default function AdminDashboardPage() {
  return (
    // Background abu-abu muda untuk seluruh halaman
    <div className="min-h-screen bg-gray-100 text-gray-800">

      {/* Konten utama yang bisa di-scroll
        --- DITAMBAHKAN PADDING BAWAH (pb-24) ---
        Ini penting agar tombol Sign Out tidak tertutup FAB
      */}
      <main className="p-4 space-y-6 max-w-lg mx-auto pb-24">

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

        {/* 2. Nama Kost */}
        <Card className="bg-white rounded-lg shadow-sm">
          <CardContent className="p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Kost Kurnia</h2>
            <Button variant="ghost" size="icon">
              <Pencil className="w-5 h-5 text-gray-500" />
            </Button>
          </CardContent>
        </Card>

        {/* 3. Grid Statistik Atas */}
        <div className="grid grid-cols-3 gap-3">
          <StatBox title="Kamar Terisi" value="10" />
          <StatBox title="Tagihan Bulan Ini" value="8" />
          <StatBox title="Jumlah Aduan" value="3" />
        </div>

        {/* 4. Manajemen Member */}
        <ManagementCard title="Manajemen Member">
          {/* Header Tabel */}
          <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500 mb-3 px-1">
            <span>Nama</span>
            <span>Kamar</span>
            <span>Status</span>
          </div>
          {/* Isi Placeholder */}
          <div className="space-y-3">
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
            <PlaceholderRow cols={3} />
          </div>
          <SeeMoreLink />
        </ManagementCard>

        {/* 5. Manajemen Tagihan */}
        <ManagementCard title="Manajemen Tagihan">
          {/* Header Tabel */}
          <div className="grid grid-cols-4 gap-2 text-xs sm:text-sm font-medium text-gray-500 mb-3 px-1">
            <span>Nama</span>
            <span>Total</span>
            <span>Status</span>
            <span>Jatuh Tempo</span>
          </div>
          {/* Isi Placeholder */}
          <div className="space-y-3">
            <PlaceholderRow cols={4} />
            {/* Baris "Lunas" sesuai wireframe */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
              <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-center">
                Lunas
              </span>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <PlaceholderRow cols={4} />
            <PlaceholderRow cols={4} />
          </div>
          <SeeMoreLink />
        </ManagementCard>

        {/* 6. Manajemen Layanan */}
        <ManagementCard title="Manajemen Layanan">
          {/* Header Tabel */}
          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500 mb-3 px-1">
            <span>Nama</span>
            <span>Kontak</span>
          </div>
          {/* Isi Placeholder */}
          <div className="space-y-3">
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
            <PlaceholderRow cols={2} />
          </div>
          <SeeMoreLink />
        </ManagementCard>

        {/* 7. Grid Statistik Bawah */}
        <div className="grid grid-cols-2 gap-4">
          <BottomStatBox title="Lost and Found" count={5} />
          <BottomStatBox title="Aduan atau Feedback" count={3} />
        </div>

        {/* 8. Tombol Sign Out */}
        <div className="text-center pt-4 pb-8">
          <Button variant="link" className="text-gray-600 hover:text-red-500">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

      </main> {/* --- AKHIR DARI KONTEN SCROLLABLE --- */}


      {/* --- 9. FLOATING ACTION BUTTON (FAB) ---
        Tombol Home yang mengambang
      */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button
          className="bg-gray-800 text-white rounded-full shadow-lg h-14 w-32 text-base font-semibold"
          onClick={() => alert("Ke Halaman Home!")} // Ganti dengan router.push('/')
        >
          <Home className="w-5 h-5 mr-2" />
          Home
        </Button>
      </nav>

    </div>
  );
}


// --- KOMPONEN HELPER (Tidak berubah) ---

// Box Statistik Atas (Gelap)
const StatBox = ({ title, value }: { title: string, value: string }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
    <p className="text-xs text-gray-300 truncate">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

// Card Manajemen (Putih)
const ManagementCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      <Button size="sm" className="bg-gray-800 text-white rounded-md text-xs px-3 py-1 h-auto">
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
    </CardHeader>
    <CardContent className="p-4">
      {children}
    </CardContent>
  </Card>
);

// Box Statistik Bawah (Gelap, dengan link)
const BottomStatBox = ({ title, count }: { title: string, count: number }) => (
  <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md relative">
    {/* Badge Angka */}
    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
      {count}
    </span>
    <h3 className="font-semibold mb-3 pr-6">{title}</h3>
    <Link href="#" className="flex items-center text-xs text-gray-300 hover:underline">
      Lihat Selengkapnya <ArrowRight className="w-3 h-3 ml-1" />
    </Link>
  </div>
);
