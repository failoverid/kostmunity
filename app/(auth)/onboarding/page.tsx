"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-client"; // Pastikan path ini benar!
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OnboardingPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Untuk Register
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

const handleLogin = async () => {
    setLoading(true);
    setError(null);

    // LOGIKA DINONAKTIFKAN SEMENTARA
    alert("UI Tombol Login Berfungsi! (Firebase dinonaktifkan)");
    setLoading(false);

    /*
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect ke dasbor setelah login
    } catch (err: any) {
      setError(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
    */
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    // LOGIKA DINONAKTIFKAN SEMENTARA
    alert("UI Tombol Register Berfungsi! (Firebase dinonaktifkan)");
    setLoading(false);

    /*
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/success-register"); // Redirect ke halaman sukses register
    } catch (err: any) {
      setError(err.message);
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[#FDF9ED]"> {/* Warna background dari mockup */}
      <Card className="w-full max-w-sm rounded-lg shadow-md bg-white p-6"> {/* Card disesuaikan */}
        <CardHeader className="flex flex-col items-center space-y-2">
          <div className="relative h-16 w-16">
            <Image src="/logo.png" alt="Kostmunity Logo" fill objectFit="contain" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Masuk</CardTitle>
          <CardDescription className="text-center text-gray-600">
            {/* Tagline dari mockup */}
            Masuklah untuk mengelola & membuat kamar kos kamu terlihat menarik.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1"> {/* TabsList disesuaikan */}
              <TabsTrigger value="login" className="data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=inactive]:bg-transparent rounded-md text-sm font-medium transition-all duration-200">
                Masuk
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-orange-400 data-[state=active]:text-white data-[state=inactive]:bg-transparent rounded-md text-sm font-medium transition-all duration-200">
                Daftar
              </TabsTrigger>
            </TabsList>

            {/* TAB LOGIN */}
            <TabsContent value="login" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-sm font-medium">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-login" className="text-sm font-medium">Password</Label>
                <Input
                  id="password-login"
                  type="password"
                  placeholder="Min 6 Karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-colors duration-200"
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </TabsContent>

            {/* TAB REGISTER */}
            <TabsContent value="register" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username-register" className="text-sm font-medium">Username</Label>
                <Input
                  id="username-register"
                  type="text"
                  placeholder="usernamekamu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register" className="text-sm font-medium">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register" className="text-sm font-medium">Password</Label>
                <Input
                  id="password-register"
                  type="password"
                  placeholder="Min 6 Karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md border border-gray-300 p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition-colors duration-200"
              >
                {loading ? "Memproses..." : "Daftar"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
