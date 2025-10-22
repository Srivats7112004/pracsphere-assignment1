"use client";

import { useMemo, useState } from "react";
import { Card, Input } from "@repo/ui";
import TaskRowClient from "./tasks/TaskRowClient";

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

export default function SearchTasksClient({ tasks }: { tasks: TaskPlain[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tasks.slice(0, 8); // show top 8 on dashboard
    return tasks.filter((t) => {
      const hay = [
        t.title,
        t.description || "",
        ...(t.tags || []),
        t.priority,
        t.completed ? "done" : "open",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q, tasks]);

  return (
    <>
      <Card className="p-4">
        <Input
          placeholder="Search tasks by title, tags, priority…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-6 text-center dark:bg-gray-900/60 dark:border-gray-800">
          <p className="font-medium">No tasks match your search.</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TaskRowClient key={t.id} task={t} />
          ))}
        </div>
      )}
    </>
  );
}
