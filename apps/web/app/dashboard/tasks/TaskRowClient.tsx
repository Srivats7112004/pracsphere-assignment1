"use client";
import { useEffect, useState } from "react";
import { Card, Button, Input } from "@repo/ui";
import { useRouter } from "next/navigation";

type TaskPlain = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate: string | null; // ISO
  tags: string[];
  createdAt: string; // ISO
};

export default function TaskRowClient({ task }: { task: TaskPlain }) {
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);

  const overdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  async function toggle() {
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    router.refresh();
  }

  async function remove() {
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800 hover:shadow-lg transition">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            {/* chips */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                  task.completed
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                }`}
              >
                {task.completed ? "Done" : "Open"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs border ${
                  task.priority === "high"
                    ? "border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800"
                    : task.priority === "low"
                    ? "border-sky-300 text-sky-700 bg-sky-50 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800"
                    : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                }`}
              >
                {task.priority}
              </span>
              {overdue && (
                <span className="text-xs text-rose-600 dark:text-rose-300">
                  Overdue
                </span>
              )}
            </div>

            {/* title/description */}
            <div className="mt-2">
              <p className="font-medium break-words">{task.title}</p>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {task.dueDate
                  ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
                  : "No due date"}
                {task.tags?.length ? ` • ${task.tags.join(", ")}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={toggle}>
              {task.completed ? "Undo" : "Complete"}
            </Button>
            <Button onClick={() => setEditorOpen(true)}>Edit</Button>
            <Button variant="destructive" onClick={remove}>
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* --- Editor Modal (Card) --- */}
      {editorOpen && (
        <TaskEditModal
          task={task}
          onClose={() => setEditorOpen(false)}
          onSaved={() => {
            setEditorOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

/* ---------------- Editor Modal Component ---------------- */
function TaskEditModal({
  task,
  onClose,
  onSaved,
}: {
  task: TaskPlain;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [priority, setPriority] = useState<TaskPlain["priority"]>(
    task.priority
  );
  const [due, setDue] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ""
  );
  const [tags, setTags] = useState(task.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // close on ESC
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save() {
    setSaving(true);
    setErr(null);
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: desc,
        priority,
        dueDate: due || null,
        tags,
      }),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Failed to save");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* card */}
      <Card className="relative z-10 w-full max-w-xl p-5 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="grid gap-3">
          <div>
            <label className="text-sm block mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm block mb-1">Description</label>
            <textarea
              className="w-full rounded-xl border px-3 py-2 h-24 bg-white dark:bg-transparent dark:border-gray-800"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-sm block mb-1">Priority</label>
              <select
                className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-transparent dark:border-gray-800"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm block mb-1">Due date</label>
              <Input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm block mb-1">Tags</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. work, ui, urgent"
              />
            </div>
          </div>
        </div>

        {err && <p className="mt-3 text-sm text-rose-500">{err}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
