// apps/web/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { connectDB, UserModel } from "@repo/db";
import { comparePassword, signSession } from "@repo/utils";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing creds" }, { status: 400 });
    }

    if (!process.env.AUTH_SECRET) {
      return NextResponse.json({ error: "Server misconfig: AUTH_SECRET missing" }, { status: 500 });
    }

    await connectDB();
    const user = await UserModel.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = await signSession(
      { uid: user._id.toString(), name: user.name, email: user.email },
      process.env.AUTH_SECRET
    );

    const res = NextResponse.json({ ok: true });
    res.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // localhost-friendly
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Login failed" }, { status: 500 });
  }
}
