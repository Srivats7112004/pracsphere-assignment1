import { connectDB, TaskModel } from "@repo/db";
import { getSessionUser } from "@/lib/auth";
import { Card } from "@repo/ui";
import ChartsClient from "./ChartsClient";
import dayjs from "dayjs";

interface Task {
  _id: string;
  title: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  tags?: string[];
  createdAt: Date;
  dueDate?: Date;
}

type ChartPoint = { date: string; total: number; open: number; done: number };
type PrioritySlice = { name: "low" | "medium" | "high"; value: number };
type TagSlice = { name: string; value: number };

export default async function AnalyticsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  await connectDB();

  // ✅ Proper type-safe cast from Mongoose .lean()
  const tasks = (await TaskModel.find({ userId: user.uid }).lean()) as unknown as Task[];

  // Generate last 7 days of task creation trend
  const last7 = [...Array(7)].map((_, i) =>
    dayjs().startOf("day").subtract(6 - i, "day")
  );

  const trend: ChartPoint[] = last7.map((d) => {
    const matches = tasks.filter((t) => dayjs(t.createdAt).isSame(d, "day"));
    const open = matches.filter((t) => !t.completed).length;
    const done = matches.length - open;
    return { date: d.format("DD MMM"), total: matches.length, open, done };
  });

  // Priority distribution
  const priorityCounts: Record<"low" | "medium" | "high", number> = {
    low: 0,
    medium: 0,
    high: 0,
  };

  for (const t of tasks) {
    const p: "low" | "medium" | "high" = t.priority || "medium";
    priorityCounts[p] = (priorityCounts[p] || 0) + 1;
  }

  const priority: PrioritySlice[] = (["low", "medium", "high"] as const).map(
    (p) => ({
      name: p,
      value: priorityCounts[p],
    })
  );

  // Tag distribution
  const tagCounts: Record<string, number> = {};
  for (const t of tasks) {
    (t.tags || []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }

  const tags: TagSlice[] = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // KPI summary
  const kpis = {
    total: tasks.length,
    done: tasks.filter((t) => t.completed).length,
    open: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && t.dueDate && dayjs(t.dueDate).isBefore(dayjs(), "day")
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-semibold">{kpis.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Open</p>
          <p className="text-2xl font-semibold text-amber-600">{kpis.open}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-semibold text-emerald-600">{kpis.done}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">Overdue</p>
          <p className="text-2xl font-semibold text-rose-600">{kpis.overdue}</p>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800">
        <h2 className="font-semibold mb-3">Last 7 days</h2>
        <ChartsClient trend={trend} priority={priority} tags={tags} />
      </Card>
    </div>
  );
}
