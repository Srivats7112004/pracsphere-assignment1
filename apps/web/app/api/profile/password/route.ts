import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { connectDB, UserModel } from "@repo/db";
import { comparePassword, hashPassword } from "@repo/utils";

export async function POST(req: NextRequest) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { current, next } = await req.json().catch(() => ({}));
  if (!current || !next || String(next).length < 6) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await connectDB();
  const user = await UserModel.findById(u.uid);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await comparePassword(current, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Current password incorrect" }, { status: 400 });

  user.passwordHash = await hashPassword(next);
  await user.save();

  return NextResponse.json({ ok: true });
}
