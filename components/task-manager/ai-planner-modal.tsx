"use client"

import { X, Sparkles, Send, Clock, Target, Zap } from "lucide-react"
import Image from "next/image"

interface AIPlannerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIPlannerModal({ isOpen, onClose }: AIPlannerModalProps) {
  if (!isOpen) return null

  const suggestedTasks = [
    { time: "09:00", task: "Revisar emails importantes", priority: "alta", duration: "30 min" },
    { time: "10:00", task: "Reunión de equipo", priority: "media", duration: "1h" },
    { time: "12:00", task: "Almuerzo y descanso", priority: "baja", duration: "1h" },
    { time: "14:00", task: "Trabajo profundo en proyecto", priority: "alta", duration: "2h" },
    { time: "16:30", task: "Revisar tareas pendientes", priority: "media", duration: "30 min" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-[2rem] max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header con imagen */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
            alt="Mountains"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Asistente IA
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Planear mi semana</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-10rem)]">
          {/* AI Chat bubble */}
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="bg-secondary/80 rounded-2xl rounded-tl-sm px-4 py-3">
                <p className="text-sm text-foreground leading-relaxed">
                  Hola, he analizado tus tareas pendientes y tu calendario. Aqui tienes mi sugerencia para organizar tu semana de forma productiva.
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block ml-1">Ahora</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2 flex-shrink-0">
              <Target className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium">5 tareas</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2 flex-shrink-0">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">5h total</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-3 py-2 flex-shrink-0">
              <Zap className="w-4 h-4 text-chart-4" />
              <span className="text-xs font-medium">2 prioridad alta</span>
            </div>
          </div>

          {/* Suggested schedule */}
          <div className="mb-6">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Plan sugerido para hoy
            </h3>
            <div className="space-y-2">
              {suggestedTasks.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-card rounded-2xl p-3 border border-border/50"
                >
                  <div className="w-12 text-center">
                    <span className="text-xs font-medium text-muted-foreground">{item.time}</span>
                  </div>
                  <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary/60 to-primary/20" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.task}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        item.priority === 'alta' 
                          ? 'bg-destructive/10 text-destructive' 
                          : item.priority === 'media'
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.duration}</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-border" />
                </div>
              ))}
            </div>
          </div>

          {/* AI suggestions */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 mb-6 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Consejo de IA</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Te recomiendo empezar con las tareas de alta prioridad en la manana, cuando tu energia es mayor. Deja las reuniones para despues del almuerzo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="px-6 py-4 border-t border-border bg-background/80 backdrop-blur-sm safe-area-bottom">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 bg-secondary/60 rounded-2xl px-4 py-3">
              <input 
                type="text"
                placeholder="Preguntale algo a la IA..."
                className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            <button className="px-3 py-1.5 bg-secondary/60 rounded-full text-xs text-foreground whitespace-nowrap">
              Ajustar horarios
            </button>
            <button className="px-3 py-1.5 bg-secondary/60 rounded-full text-xs text-foreground whitespace-nowrap">
              Agregar descansos
            </button>
            <button className="px-3 py-1.5 bg-secondary/60 rounded-full text-xs text-foreground whitespace-nowrap">
              Mas tareas
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex gap-3 safe-area-bottom">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground"
          >
            Cancelar
          </button>
          <button className="flex-1 py-3.5 rounded-2xl bg-primary text-sm font-medium text-primary-foreground">
            Aplicar plan
          </button>
        </div>
      </div>
    </div>
  )
}
