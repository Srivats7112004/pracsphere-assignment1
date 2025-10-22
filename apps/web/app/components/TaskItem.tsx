"use client";
import { Card, Button } from "@repo/ui";

function StatusPill({ done }: { done: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
        done ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
             : "bg-amber-50 text-amber-700 border border-amber-200"
      }`}
    >
      {done ? "Done" : "Open"}
    </span>
  );
}

export default function TaskItem({ task }: { task: any }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-medium">{task.title}</p>
          <p className="text-sm text-gray-600">
            {new Date(task.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <StatusPill done={!!task.completed} />
          <Button disabled>{task.completed ? "View" : "Open"}</Button>
        </div>
      </div>
    </Card>
  );
}
