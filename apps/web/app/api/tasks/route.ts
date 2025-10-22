import { NextRequest, NextResponse } from "next/server";
import { connectDB, TaskModel } from "@repo/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json([], { status: 200 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status"); // all|open|done
    const priority = searchParams.get("priority"); // low|medium|high
    const tag = searchParams.get("tag")?.trim();

    const filter: any = { userId: user.uid };
    if (status === "open") filter.completed = false;
    if (status === "done") filter.completed = true;
    if (priority) filter.priority = priority;
    if (tag) filter.tags = tag;
    if (q) filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } }
    ];

    await connectDB();
    const tasks = await TaskModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(tasks);
  } catch (e: any) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { title, description, priority, dueDate, tags } = body || {};
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    await connectDB();
    const saved = await TaskModel.create({
      userId: user.uid,
      title: title.trim(),
      description: description?.trim() || "",
      priority: ["low", "medium", "high"].includes(priority) ? priority : "medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: Array.isArray(tags)
        ? tags.map((t: string) => t.trim()).filter(Boolean)
        : (typeof tags === "string" ? tags.split(",").map((t: string)=>t.trim()).filter(Boolean) : [])
    });

    return NextResponse.json(saved, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
