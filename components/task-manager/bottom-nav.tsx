"use client"

import { Home, Calendar, Plus, Heart, User } from "lucide-react"

export type NavTab = "home" | "calendar" | "projects" | "habits" | "profile"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

interface BottomNavProps {
  activeTab?: NavTab
  onTabChange?: (tab: NavTab) => void
}

export function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 px-2 pb-6 pt-2 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        <NavItem 
          icon={<Home className="w-5 h-5" />} 
          label="Inicio" 
          active={activeTab === "home"}
          onClick={() => onTabChange?.("home")}
        />
        <NavItem 
          icon={<Calendar className="w-5 h-5" />} 
          label="Calendario"
          active={activeTab === "calendar"}
          onClick={() => onTabChange?.("calendar")}
        />
        
        {/* FAB - Add button */}
        <div className="flex-1 flex justify-center">
          <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 -translate-y-4 active:scale-95 transition-transform">
            <Plus className="w-6 h-6 text-primary-foreground" />
          </button>
        </div>
        
        <NavItem 
          icon={<Heart className="w-5 h-5" />} 
          label="Hábitos"
          active={activeTab === "habits"}
          onClick={() => onTabChange?.("habits")}
        />
        <NavItem 
          icon={<User className="w-5 h-5" />} 
          label="Perfil"
          active={activeTab === "profile"}
          onClick={() => onTabChange?.("profile")}
        />
      </div>
    </nav>
  )
}
