export function Header({ children }: { children: React.ReactNode }) {
  return <header className="sticky top-0 bg-white/70 backdrop-blur border-b px-6 py-4">{children}</header>;
}
