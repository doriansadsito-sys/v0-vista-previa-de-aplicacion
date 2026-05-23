"use client"

import { Bell, Search } from "lucide-react"

interface HeaderProps {
  userName: string
  pendingTasks: number
  onNotificationsClick?: () => void
}

export function Header({ userName, pendingTasks, onNotificationsClick }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <header className="px-6 pt-14 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{getGreeting()}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {userName}
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            {pendingTasks} tareas pendientes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button 
            onClick={onNotificationsClick}
            className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border relative"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
