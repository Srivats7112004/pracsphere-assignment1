import { connectDB, TaskModel } from "@repo/db";
import { getSessionUser } from "@/lib/auth";
import { Card, Button } from "@repo/ui";
import TaskFormClient from "./TaskFormClient";
import TaskFiltersClient from "./TaskFiltersClient";
import TaskRowClient from "./TaskRowClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type TaskPlain = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null;      // ISO or null
  tags: string[];
  createdAt: string;           // ISO
};

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getSessionUser();
  if (!user) return null;

  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q.trim() : undefined;
  const status = typeof params.status === "string" ? params.status : "all";
  const priority = typeof params.priority === "string" ? params.priority : undefined;

  const filter: any = { userId: user.uid };
  if (status === "open") filter.completed = false;
  if (status === "done") filter.completed = true;
  if (priority) filter.priority = priority;
  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  await connectDB();
  const raw = await TaskModel.find(filter).sort({ createdAt: -1 }).lean();

  // 👇 shape to JSON-serializable props
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <a href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </a>
      </div>

      <TaskFormClient />
      <TaskFiltersClient />

      {tasks.length === 0 ? (
        <Card className="p-6 text-center dark:bg-gray-900/60 dark:border-gray-800">
          <p className="font-medium">No tasks match your filters.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Try clearing filters or create a new task above.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((t) => (
            <TaskRowClient key={t.id} task={t} />
          ))}
        </div>
      )}
    </div>
  );
}
