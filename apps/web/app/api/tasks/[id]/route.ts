import { NextRequest, NextResponse } from "next/server";
import { connectDB, TaskModel } from "@repo/db";
import { getSessionUser } from "@/lib/auth";
import { isValidObjectId } from "mongoose";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const patch = await req.json().catch(() => ({}));
    await connectDB();
    const updated = await TaskModel.findOneAndUpdate(
      { _id: id, userId: user.uid },
      patch,
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    await connectDB();
    await TaskModel.deleteOne({ _id: id, userId: user.uid });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
