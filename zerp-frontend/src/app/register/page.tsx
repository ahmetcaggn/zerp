"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fakeRegister } from "@/lib/fakeAuth";
import AuthShell from "@/components/AuthShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";


export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Şifreler Eşleşmedi!");
      return;
    }

    setLoading(true);
    try {
      //1 sn sonra true dönecek
      const res = await fakeRegister(username, email, password);
      if (!res.ok) {
        setError(res.message ?? "Register failed");
        return;
      }
      router.push("/login");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <section className="auth-card">
        <h1 className="auth-title">Kayıt Ol</h1>

        <form className="form" onSubmit={handleSubmit} autoComplete="off">
          <div className="field">
            <label>Kullanıcı Adı</label>
            <div className="input-row">
              <span className="icon"><span className="icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              </span>
              <input
                name="username"
                autoComplete="off"
                type="text"
                placeholder="yourname"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>E-Posta</label>
            <div className="input-row">
              <span className="icon"><span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              </span>
              <input
                name="email"
                autoComplete="off"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Şifre</label>
            <div className="input-row">
              <span className="icon"><span className="icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              </span>
              <input
                name="password"
                autoComplete="new-password"
                type="password"
                placeholder="En az 6 karakter"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Şifreni Doğrula</label>
            <div className="input-row">
              <span className="icon"><span className="icon">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              </span>
              <input
                name="confirmPassword"
                autoComplete="new-password"
                type="password"
                placeholder="Şifreni tekrar gir"
                minLength={6}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && <p style={{ color: "salmon", margin: 0 }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Oluşturuluyor..." : "Hesap Oluştur"}
          </button>

          <p className="auth-sub" style={{ marginTop: 12, marginBottom: 0 }}>
            Zaten bir hesabın var mı? <Link href="/login">Giriş Yap</Link>
          </p>
        </form>
      </section>
    </AuthShell>
  );
}
