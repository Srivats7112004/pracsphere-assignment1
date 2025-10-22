"use client";
import { useEffect, useState } from "react";

export type Me = { name: string; email: string } | null;

export function useAuth() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/me", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (mounted) setMe(d); })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    location.assign("/login");
  };

  return { me, loading, logout };
}
