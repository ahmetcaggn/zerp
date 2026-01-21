"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fakeLogin } from "@/lib/fakeAuth";
import AuthShell from "@/components/AuthShell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fakeLogin(email, password);
      if (!res.ok) {
        setError(res.message ?? "Login failed");
        return;
      }

      // şimdilik sadece gösterim: remember true/false
      // ileride token saklama mantığı eklenecek
      router.push("/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <section className="auth-card">
        <h1 className="auth-title">Giriş Yap</h1>

        <form className="form" onSubmit={handleSubmit} autoComplete="off">
          <div className="field">
            <label>E-Posta</label>
            <div className="input-row">
              <span className="icon"><FontAwesomeIcon icon={faEnvelope} /></span>
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
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Beni Hatırla</span>
            </label>

            {/* Şimdilik sadece link, backend yok */}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Şifremi Unuttum?
            </a>
          </div>

          {error && <p style={{ color: "salmon", margin: 0 }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>

          <p className="auth-sub" style={{ marginTop: 12, marginBottom: 0 }}>
            Henüz bir hesabın yok mu? <Link href="/register">Kayıt Ol!</Link>
          </p>
        </form>
      </section>
    </AuthShell>
  );
}
