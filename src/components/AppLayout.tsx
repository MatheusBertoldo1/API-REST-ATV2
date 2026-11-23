import { NavLink, Outlet } from "react-router-dom"

import { cn } from "@/lib/utils"

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <span className="text-lg font-bold">Darkhorse</span>
          <nav>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              Orçamentos
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
