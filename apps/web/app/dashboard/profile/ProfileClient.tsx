"use client";
import { useState } from "react";
import { Card, Button, Input } from "@repo/ui";

export default function ProfileClient({ name: initial }: { name: string }) {
  const [name, setName] = useState(initial);
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function saveName() {
    setMsg(null);
    const r = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setMsg(r.ok ? "✅ Name updated" : (await r.json()).error || "Failed");
  }

  async function changePass() {
    setMsg(null);
    const r = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: n1, next: n2 }),
    });
    setMsg(r.ok ? "✅ Password changed" : (await r.json()).error || "Failed");
    if (r.ok) {
      setN1("");
      setN2("");
    }
  }

  return (
    <>
      <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800">
        <h2 className="font-semibold mb-3">Update name</h2>
        <div className="space-y-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={saveName}>Save</Button>
        </div>
      </Card>

      <Card className="p-4 dark:bg-gray-900/60 dark:border-gray-800 md:col-span-2">
        <h2 className="font-semibold mb-3">Change password</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Current password</label>
            <Input
              type="password"
              value={n1}
              onChange={(e) => setN1(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm block mb-1">New password</label>
            <Input
              type="password"
              value={n2}
              onChange={(e) => setN2(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={changePass}>Update password</Button>
          {msg && <p className="text-sm opacity-80">{msg}</p>}
        </div>
      </Card>
    </>
  );
}
