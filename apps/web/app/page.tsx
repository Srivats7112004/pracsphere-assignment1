import Link from "next/link";
import { Button } from "@repo/ui";
import ThemeToggle from "@/components/ThemeToggle";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-[#0c0c0c] dark:via-[#121212] dark:to-[#0c0c0c] flex flex-col">
      <header className="flex items-center justify-between px-8 py-4 backdrop-blur-md bg-white/70 dark:bg-black/40 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
          PracSphere
        </h1>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <h2 className="text-4xl sm:text-6xl font-bold mb-4 leading-tight">
          Organize. Focus. <span className="text-blue-600 dark:text-indigo-400">Achieve.</span>
        </h2>
        <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-8">
          A modern task manager designed for students and teams. Track goals, manage priorities,
          and stay productive — all in one place.
        </p>
        <div className="flex gap-4">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              Demo Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <footer className="text-center py-6 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} PracSphere. All rights reserved.
      </footer>
    </main>
  );
}
