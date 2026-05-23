"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface ActionCardProps {
  title: string
  subtitle: string
  imageUrl: string
  onClick?: () => void
  wide?: boolean
}

function ActionCard({ title, subtitle, imageUrl, onClick, wide = false }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 ${wide ? "w-56" : "w-40"} h-48 rounded-3xl overflow-hidden group`}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1">
          {subtitle}
        </p>
        <h3 className="text-white text-sm font-medium leading-tight">
          {title}
        </h3>
        <div className="flex items-center gap-1 mt-2 text-white/70">
          <span className="text-[10px] uppercase tracking-wider">Ver mas</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </button>
  )
}

export type ActionType = "planner" | "project" | "pending" | "focus"

interface QuickActionsProps {
  onActionClick?: (action: ActionType) => void
}

const actions: Array<{
  title: string
  subtitle: string
  imageUrl: string
  action: ActionType
  wide?: boolean
}> = [
  {
    title: "Planear mi semana",
    subtitle: "Organizacion",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    action: "planner",
    wide: true
  },
  {
    title: "Nuevo proyecto",
    subtitle: "Crear",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80",
    action: "project"
  },
  {
    title: "Revisar pendientes",
    subtitle: "Tareas",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    action: "pending"
  },
  {
    title: "Enfoque profundo",
    subtitle: "Productividad",
    imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80",
    action: "focus"
  }
]

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <section className="py-4">
      <div className="px-6 flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Acciones rapidas
        </h2>
        <button className="text-xs text-primary font-medium">
          Ver todas
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 px-6 scrollbar-hide">
        {actions.map((action, index) => (
          <ActionCard 
            key={index} 
            title={action.title}
            subtitle={action.subtitle}
            imageUrl={action.imageUrl}
            wide={action.wide}
            onClick={() => onActionClick?.(action.action)}
          />
        ))}
      </div>
    </section>
  )
}
