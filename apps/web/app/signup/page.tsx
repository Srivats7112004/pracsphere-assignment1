"use client";
import { useState } from "react";
import { Card, Input, Button } from "@repo/ui";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) location.assign("/login");
    else setErr((await res.json()).error || "Signup failed");
  }

  return (
    <main className="min-h-[80vh] grid place-items-center p-6">
      <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md">
        <Card className="p-6 md:p-8 dark:bg-gray-900/60 dark:border-gray-800">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Create account</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start organizing your tasks in seconds
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div>
              <label className="text-sm block mb-1">Name</label>
              <Input placeholder="Jane Doe" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm block mb-1">Email</label>
              <Input placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm block mb-1">Password</label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <Button onClick={submit} className="w-full">Create account</Button>
          </div>

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link className="underline" href="/login">Sign in</Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
