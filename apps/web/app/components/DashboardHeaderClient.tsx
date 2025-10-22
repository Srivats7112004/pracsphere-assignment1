"use client";
import { useAuth } from "@repo/utils";
import { ProfileMenu } from "@repo/ui";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeaderClient() {
  const { me, logout } = useAuth();
  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      {me ? <ProfileMenu name={me.name} email={me.email} onLogout={logout} /> : null}
    </div>
  );
}
