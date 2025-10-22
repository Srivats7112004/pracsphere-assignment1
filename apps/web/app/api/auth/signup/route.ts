import { NextResponse } from "next/server";
import { connectDB, UserModel } from "@repo/db";
import { hashPassword } from "@repo/utils";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    await connectDB();
    const exists = await UserModel.findOne({ email }).lean();
    if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });
    const passwordHash = await hashPassword(password);
    const user = await UserModel.create({ name, email, passwordHash });
    return NextResponse.json({ _id: user._id.toString(), name, email }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Signup failed" }, { status: 500 });
  }
}
