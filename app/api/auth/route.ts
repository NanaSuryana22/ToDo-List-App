import { NextResponse } from "next/server";
import { users } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, email, password } = body;

  // Cari user berdasarkan email
  let user = users.find((u) => u.email === email);

  if (user) {
    // Jika user sudah ada, proses Login
    if (user.password !== password) {
      return NextResponse.json({ error: "Password salah!" }, { status: 401 });
    }
  } else {
    // Jika belum ada, proses Register (Simpan fullName, email, dan password)
    user = {
      id: Date.now().toString(),
      fullName: fullName || email.split("@")[0], // Fallback jika fullName kosong
      email,
      password,
    };
    users.push(user);
  }

  // Kembalikan data user ke frontend
  return NextResponse.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  });
}
