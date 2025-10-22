"use client";
import { useRouter } from "next/navigation";

export function useTasks() {
  const router = useRouter();
  const add = async (title: string) => {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title })
    });
    router.refresh();
  };
  return { add };
}
