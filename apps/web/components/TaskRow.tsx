"use client";
import { useState } from "react";
import { Button, Card, Input } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function TaskRow({ task }: { task: any }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  async function toggle() {
    await fetch(`/api/tasks/${task._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: !task.completed }) });
    router.refresh();
  }

  async function remove() {
    await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
    router.refresh();
  }

  async function save() {
    await fetch(`/api/tasks/${task._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) });
    setEditing(false);
    router.refresh();
  }

  const overdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
              task.completed ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                              : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
            }`}>
              {task.completed ? "Done" : "Open"}
            </span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
              task.priority === "high" ? "border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
              : task.priority === "low" ? "border-sky-300 text-sky-700 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
              : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
            }`}>
              {task.priority}
            </span>
            {overdue && <span className="text-xs text-rose-600 dark:text-rose-300">Overdue</span>}
          </div>

          <div className="mt-2">
            {editing ? (
              <div className="flex items-center gap-2">
                <Input value={title} onChange={e=>setTitle(e.target.value)} />
                <Button onClick={save}>Save</Button>
                <Button onClick={()=>{ setEditing(false); setTitle(task.title); }}>Cancel</Button>
              </div>
            ) : (
              <p className="font-medium break-words">{task.title}</p>
            )}
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date"}
              {task.tags?.length ? ` • ${task.tags.join(", ")}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={toggle}>{task.completed ? "Undo" : "Complete"}</Button>
          <Button onClick={()=>setEditing(v=>!v)}>Edit</Button>
          <Button onClick={remove}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}
