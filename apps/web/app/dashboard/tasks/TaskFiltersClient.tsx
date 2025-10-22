"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, Input, Button } from "@repo/ui";

export default function TaskFiltersClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();

  const [q, setQ] = useState(sp.get("q") || "");
  const [status, setStatus] = useState(sp.get("status") || "all");
  const [priority, setPriority] = useState(sp.get("priority") || "");

  useEffect(() => {
    setQ(sp.get("q") || "");
    setStatus(sp.get("status") || "all");
    setPriority(sp.get("priority") || "");
  }, [sp]);

  const apply = useCallback(() => {
    const next = new URLSearchParams(sp);
    q ? next.set("q", q) : next.delete("q");
    status && status !== "all" ? next.set("status", status) : next.delete("status");
    priority ? next.set("priority", priority) : next.delete("priority");
    router.replace(`${path}?${next.toString()}`);
    router.refresh();
  }, [q, status, priority, router, path, sp]);

  const reset = () => {
    setQ("");
    setStatus("all");
    setPriority("");
    router.replace(path);
    router.refresh();
  };

  return (
    <Card className="p-4 space-y-3 dark:bg-gray-900/60 dark:border-gray-800">
      <div className="grid md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <Input
            placeholder="Search title, description, tags…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select
          className="rounded-xl border px-3 py-2 bg-white dark:bg-transparent dark:border-gray-800"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="done">Done</option>
        </select>
        <select
          className="rounded-xl border px-3 py-2 bg-white dark:bg-transparent dark:border-gray-800"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Priority (any)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <Button onClick={apply}>Apply</Button>
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
    </Card>
  );
}
