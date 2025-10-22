import SidebarLink from "@/components/SidebarLink";  // ✅ default import
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@repo/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/30 backdrop-blur">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            PracSphere
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink href="/dashboard">Dashboard</SidebarLink>
          <SidebarLink href="/dashboard/tasks">Tasks</SidebarLink>
          <SidebarLink href="/dashboard/analytics">Analytics</SidebarLink>
          <SidebarLink href="/dashboard/profile">Profile</SidebarLink>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <ThemeToggle />
          <form action="/api/auth/logout" method="POST">
            <Button variant="outline" className="px-3 py-1.5 rounded-xl text-sm">Logout</Button>
          </form>
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-40
                           border-b border-gray-200 dark:border-gray-800
                           bg-white/80 dark:bg-black/30 backdrop-blur">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action="/api/auth/logout" method="POST">
              <Button>Logout</Button>
            </form>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
