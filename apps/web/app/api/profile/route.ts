import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { connectDB, UserModel } from "@repo/db";

export async function PATCH(req: NextRequest) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json().catch(() => ({}));
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  await connectDB();
  await UserModel.updateOne({ _id: u.uid }, { $set: { name: name.trim() } });
  return NextResponse.json({ ok: true });
}
