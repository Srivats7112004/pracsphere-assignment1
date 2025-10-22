import { Card, Button } from "@repo/ui";
import { connectDB, TaskModel } from "@repo/db";
import { getSessionUser } from "@/lib/auth";
import Link from "next/link";
import SearchTasksClient from "./SearchTasksClient";

type TaskPlain = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  tags: string[];
  createdAt: string;
};

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) return null;

  await connectDB();
  const raw = await TaskModel.find({ userId: user.uid })
    .sort({ createdAt: -1 })
    .lean();

  const tasks: TaskPlain[] = raw.map((t: any) => ({
    id: String(t._id),
    title: t.title ?? "",
    description: t.description ?? "",
    completed: !!t.completed,
    priority: (t.priority as "low" | "medium" | "high") ?? "medium",
    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
    tags: Array.isArray(t.tags) ? t.tags : [],
    createdAt: new Date(t.createdAt).toISOString(),
  }));

  const done = tasks.filter((t) => t.completed).length;
  const pending = tasks.length - done;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold">Welcome, {user.name}</h1>
        <Link href="/dashboard/tasks">
          <Button className="rounded-2xl">New Task</Button>
        </Link>
      </div>

      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-3 mb-10">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Tasks
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {tasks.length}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Completed
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
            {done}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Pending
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
            {pending}
          </p>
        </Card>
      </section>

      {/* Search + List (client-side filter; no navigation needed) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tasks</h2>
          <Link href="/dashboard/tasks" className="text-sm underline hover:opacity-80">
            Manage in Tasks
          </Link>
        </div>
        <SearchTasksClient tasks={tasks} />
      </section>
    </>
  );
}
