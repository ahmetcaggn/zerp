// src/lib/fakeAuth.ts
export type AuthResult = { ok: boolean; message?: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fakeLogin(email: string, password: string): Promise<AuthResult> {
  await sleep(1000); // 1 saniye bekle 
  // Şimdilik her şeyi başarılı sayıyoruz:
  return { ok: true, message: "Login successful" };
}

export async function fakeRegister(name: string, email: string, password: string): Promise<AuthResult> {
  await sleep(1000); // 1 saniye bekle
  return { ok: true, message: "Register successful" };
}
