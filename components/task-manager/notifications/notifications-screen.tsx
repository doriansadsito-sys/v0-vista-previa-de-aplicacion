"use client"

import { ArrowLeft, Bell, Check, Sparkles, Calendar, Flag, MessageCircle } from "lucide-react"

interface NotificationsScreenProps {
  onBack?: () => void
}

interface Notification {
  id: string
  type: "ai" | "task" | "reminder" | "social"
  title: string
  message: string
  time: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "ai",
    title: "Sugerencia de IA",
    message: "Tu tarea 'Presentacion del proyecto' lleva 3 dias pendiente. ¿Quieres que la reprograme?",
    time: "Hace 5 min",
    read: false
  },
  {
    id: "2",
    type: "task",
    title: "Tarea completada",
    message: "Has completado 'Revisar propuesta de diseño'. ¡Buen trabajo!",
    time: "Hace 1 hora",
    read: false
  },
  {
    id: "3",
    type: "reminder",
    title: "Recordatorio",
    message: "Tienes una reunion en 30 minutos: Llamada con cliente",
    time: "Hace 2 horas",
    read: true
  },
  {
    id: "4",
    type: "ai",
    title: "Insight de productividad",
    message: "Esta semana has completado un 15% mas de tareas que la anterior. ¡Sigue asi!",
    time: "Ayer",
    read: true
  },
  {
    id: "5",
    type: "social",
    title: "Nuevo comentario",
    message: "Carlos ha comentado en el proyecto 'Rediseno web'",
    time: "Ayer",
    read: true
  },
  {
    id: "6",
    type: "task",
    title: "Tarea vencida",
    message: "La tarea 'Enviar reporte mensual' ha vencido",
    time: "Hace 2 dias",
    read: true
  },
]

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "ai": return Sparkles
      case "task": return Check
      case "reminder": return Calendar
      case "social": return MessageCircle
      default: return Bell
    }
  }

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "ai": return "bg-primary/10 text-primary"
      case "task": return "bg-chart-2/20 text-chart-2"
      case "reminder": return "bg-accent/20 text-accent"
      case "social": return "bg-chart-4/20 text-chart-4"
      default: return "bg-secondary text-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-card flex items-center justify-center shadow-sm border border-border"
            >
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Notificaciones</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} sin leer</p>
              )}
            </div>
          </div>
          <button className="text-xs text-primary font-medium">
            Marcar todas
          </button>
        </div>
      </header>

      {/* Notifications list */}
      <div className="px-6 py-2">
        {/* Unread section */}
        {unreadCount > 0 && (
          <>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Nuevas
            </h3>
            <div className="space-y-3 mb-6">
              {notifications.filter(n => !n.read).map(notification => {
                const Icon = getIcon(notification.type)
                return (
                  <div 
                    key={notification.id}
                    className="bg-card rounded-2xl p-4 border border-primary/20 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{notification.title}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{notification.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.type === "ai" && (
                          <div className="flex gap-2 mt-3">
                            <button className="px-3 py-1.5 bg-primary rounded-lg text-[10px] font-medium text-primary-foreground">
                              Aceptar
                            </button>
                            <button className="px-3 py-1.5 bg-secondary rounded-lg text-[10px] font-medium text-muted-foreground">
                              Ignorar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Earlier section */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Anteriores
        </h3>
        <div className="space-y-3">
          {notifications.filter(n => n.read).map(notification => {
            const Icon = getIcon(notification.type)
            return (
              <div 
                key={notification.id}
                className="bg-card/50 rounded-2xl p-4 border border-border/50"
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 opacity-60 ${getIconColor(notification.type)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-muted-foreground">{notification.title}</p>
                      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
