"use client"

import { ArrowLeft, Settings, ChevronRight, Moon, Bell, Lock, HelpCircle, LogOut, Sparkles, Award, Calendar } from "lucide-react"
import Image from "next/image"

interface ProfileScreenProps {
  onBack?: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const stats = [
    { label: "Tareas completadas", value: "248", icon: Calendar },
    { label: "Racha actual", value: "12 dias", icon: Award },
    { label: "Nivel de productividad", value: "Pro", icon: Sparkles },
  ]

  const menuItems = [
    { icon: Moon, label: "Apariencia", value: "Claro", group: "preferencias" },
    { icon: Bell, label: "Notificaciones", value: "", group: "preferencias" },
    { icon: Lock, label: "Privacidad", value: "", group: "preferencias" },
    { icon: HelpCircle, label: "Ayuda y soporte", value: "", group: "otros" },
    { icon: LogOut, label: "Cerrar sesion", value: "", group: "otros", destructive: true },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with cover image */}
      <div className="relative h-36 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <button 
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <button className="absolute top-12 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Profile info */}
      <div className="px-6 -mt-12 relative">
        <div className="flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/80 to-primary overflow-hidden border-4 border-background shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-xl font-semibold text-foreground">Maria Garcia</h1>
            <p className="text-sm text-muted-foreground">@maria.garcia</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mt-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Resumen de IA</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Has aumentado tu productividad un 23% este mes. Tu mejor dia es el miercoles y tu hora mas productiva es las 10am.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-2xl p-3 border border-border/50 text-center">
              <div className="w-8 h-8 rounded-xl bg-secondary mx-auto mb-2 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <p className="text-lg font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="mt-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Preferencias
          </h3>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {menuItems.filter(item => item.group === "preferencias").map((item, index, arr) => (
              <button 
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3.5 ${index < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-foreground/70" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground text-left">{item.label}</span>
                {item.value && (
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Otros
          </h3>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            {menuItems.filter(item => item.group === "otros").map((item, index, arr) => (
              <button 
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3.5 ${index < arr.length - 1 ? 'border-b border-border/50' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.destructive ? 'bg-destructive/10' : 'bg-secondary'}`}>
                  <item.icon className={`w-4 h-4 ${item.destructive ? 'text-destructive' : 'text-foreground/70'}`} />
                </div>
                <span className={`flex-1 text-sm font-medium text-left ${item.destructive ? 'text-destructive' : 'text-foreground'}`}>
                  {item.label}
                </span>
                <ChevronRight className={`w-4 h-4 ${item.destructive ? 'text-destructive/50' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Version */}
        <p className="text-center text-[10px] text-muted-foreground mt-6">
          Tasky v1.0.0 - Hecho con ❤️
        </p>
      </div>
    </div>
  )
}
