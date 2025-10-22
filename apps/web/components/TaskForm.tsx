"use client";
import { useState } from "react";
import { Button, Input, Card } from "@repo/ui";
import { useRouter, useSearchParams } from "next/navigation";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"low"|"medium"|"high">("medium");
  const [due, setDue] = useState<string>("");
  const [tags, setTags] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();

  async function submit() {
    setErr(null);
    const res = await fetch("/api/tasks?" + sp.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description: desc, priority,
        dueDate: due || undefined,
        tags
      })
    });
    if (res.ok) {
      setTitle(""); setDesc(""); setTags(""); setDue("");
      setPriority("medium");
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error || "Failed to create task");
    }
  }

  return (
    <Card className="p-4 space-y-3 dark:bg-gray-900/60 dark:border-gray-800">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm block mb-1">Title</label>
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" />
        </div>
        <div>
          <label className="text-sm block mb-1">Priority</label>
          <select
            className="w-full rounded-xl border px-3 py-2 bg-white dark:bg-transparent dark:border-gray-800"
            value={priority} onChange={e=>setPriority(e.target.value as any)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm block mb-1">Description</label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 h-20 bg-white dark:bg-transparent dark:border-gray-800"
            value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Optional notes..." />
        </div>
        <div>
          <label className="text-sm block mb-1">Due Date</label>
          <Input type="date" value={due} onChange={e=>setDue(e.target.value)} />
        </div>
        <div>
          <label className="text-sm block mb-1">Tags</label>
          <Input value={tags} onChange={e=>setTags(e.target.value)} placeholder="e.g. work, ui, urgent" />
        </div>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex justify-end">
        <Button onClick={submit}>Add Task</Button>
      </div>
    </Card>
  );
}
