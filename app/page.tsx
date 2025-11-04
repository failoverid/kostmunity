// === app/page.tsx ===
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase-client";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";

type Mode = "login" | "register";

const errorMap: Record<string, string> = {
  "auth/invalid-email": "Email tidak valid.",
  "auth/missing-password": "Password wajib diisi.",
  "auth/weak-password": "Password terlalu lemah (min 6 karakter).",
  "auth/email-already-in-use": "Email sudah terdaftar.",
  "auth/invalid-credential": "Email atau password salah.",
  "auth/user-not-found": "Pengguna tidak ditemukan.",
  "auth/wrong-password": "Password salah.",
};

export default function Page() {
  const [mode, setMode] = useState<Mode>("login");
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  async function handleRegister() {
    setErr(null); setSuccess(null);
    if (!email || !pw || !name) { setErr("Nama, email, password wajib."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pw);
      await updateProfile(cred.user, { displayName: name });
      setSuccess("Registrasi sukses. Kamu bisa langsung login.");
      setMode("login");
      setPw("");
    } catch (e: any) {
      setErr(errorMap[e?.code] ?? "Gagal registrasi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setErr(null); setSuccess(null);
    if (!email || !pw) { setErr("Email dan password wajib."); return; }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      setSuccess("Login sukses.");
    } catch (e: any) {
      setErr(errorMap[e?.code] ?? "Gagal login.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setErr(null); setSuccess(null);
    await signOut(auth);
  }

  return (
    <div className="container">
      <h1>Next.js + Firebase Auth</h1>

      {!user ? (
        <div className="card">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>{mode === "login" ? "Login" : "Register"}</h3>
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(null); setSuccess(null); }}
              style={{ background: "#fff", color: "#111827" }}
            >
              {mode === "login" ? "Ke Register" : "Ke Login"}
            </button>
          </div>

          {mode === "register" && (
            <div style={{ marginTop: 12 }}>
              <label>Nama</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" />
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.com" />
          </div>

          <div style={{ marginTop: 12 }}>
            <label>Password</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="min 6 karakter" />
          </div>

          {err && <div className="error">{err}</div>}
          {success && <div className="success">{success}</div>}

          <div style={{ marginTop: 14 }}>
            {mode === "login" ? (
              <button disabled={loading} onClick={handleLogin}>
                {loading ? "Memproses..." : "Login"}
              </button>
            ) : (
              <button disabled={loading} onClick={handleRegister}>
                {loading ? "Memproses..." : "Register"}
              </button>
            )}
          </div>

          <hr />
          <small className="muted">Aktifkan Email/Password di Firebase Console → Authentication → Sign-in method.</small>
        </div>
      ) : (
        <div className="card">
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{user.displayName ?? user.email}</div>
            <div className="success" style={{ marginTop: 6 }}>Kamu sudah masuk ke firebase</div>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
