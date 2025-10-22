// packages/ui/src/ProfileMenu.tsx
"use client";
import { useState, useRef, useEffect } from "react";

export function ProfileMenu({ name, email, onLogout }: { name: string; email: string; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as any)) setOpen(false); };
    document.addEventListener("click", onDoc); return () => document.removeEventListener("click", onDoc);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} className="rounded-full border px-3 py-1">{name?.[0]?.toUpperCase() || "U"}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white p-3 shadow-md">
          <div className="mb-2">
            <p className="font-medium">{name}</p>
            <p className="text-xs opacity-70">{email}</p>
          </div>
          <button onClick={onLogout} className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50">Logout</button>
        </div>
      )}
    </div>
  );
}
