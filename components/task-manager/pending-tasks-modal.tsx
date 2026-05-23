"use client"

import { X, Sparkles, Check, Clock, Filter, ChevronRight } from "lucide-react"
import Image from "next/image"

interface PendingTasksModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PendingTasksModal({ isOpen, onClose }: PendingTasksModalProps) {
  if (!isOpen) return null

  const pendingTasks = [
    { 
      id: 1, 
      title: "Completar presentacion del proyecto", 
      category: "Trabajo", 
      priority: "alta", 
      dueDate: "Hoy",
      aiSuggestion: "Dividir en 3 subtareas para mejor seguimiento"
    },
    { 
      id: 2, 
      title: "Llamar al doctor para cita", 
      category: "Personal", 
      priority: "media", 
      dueDate: "Manana",
      aiSuggestion: null
    },
    { 
      id: 3, 
      title: "Revisar propuesta de cliente", 
      category: "Trabajo", 
      priority: "alta", 
      dueDate: "Hoy",
      aiSuggestion: "Esta tarea lleva 3 dias pendiente"
    },
    { 
      id: 4, 
      title: "Comprar regalo de cumpleanos", 
      category: "Personal", 
      priority: "baja", 
      dueDate: "En 3 dias",
      aiSuggestion: null
    },
    { 
      id: 5, 
      title: "Actualizar documentacion", 
      category: "Trabajo", 
      priority: "media", 
      dueDate: "Esta semana",
      aiSuggestion: "Puedo ayudarte a generar un borrador"
    },
  ]

  const filters = ["Todas", "Hoy", "Prioridad alta", "Atrasadas"]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-[2rem] max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header con imagen */}
        <div className="relative h-36 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
            alt="Calm nature"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {pendingTasks.length} pendientes
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Revisar pendientes</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-9rem)]">
          {/* AI insight */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 mb-5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Analisis de IA</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tienes 2 tareas de alta prioridad para hoy. Te recomiendo empezar por la presentacion del proyecto ya que tiene dependencias.
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-6 px-6">
            {filters.map((filter, index) => (
              <button 
                key={index}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap ${
                  index === 0 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary/60 text-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
            <button className="p-1.5 rounded-full bg-secondary/60">
              <Filter className="w-3.5 h-3.5 text-foreground" />
            </button>
          </div>

          {/* Tasks list */}
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div 
                key={task.id}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <button className="w-5 h-5 rounded-full border-2 border-border mt-0.5 flex-shrink-0 hover:border-primary transition-colors" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {task.category}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          task.priority === 'alta' 
                            ? 'bg-destructive/10 text-destructive' 
                            : task.priority === 'media'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* AI Suggestion for this task */}
                {task.aiSuggestion && (
                  <div className="px-4 py-2.5 bg-primary/5 border-t border-primary/10 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <p className="text-[10px] text-primary/80 flex-1">{task.aiSuggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mt-6 mb-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Acciones rapidas con IA
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 p-3 bg-secondary/40 rounded-2xl">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Priorizar automatico</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-secondary/40 rounded-2xl">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium">Reprogramar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex gap-3 safe-area-bottom border-t border-border pt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground"
          >
            Cerrar
          </button>
          <button className="flex-1 py-3.5 rounded-2xl bg-primary text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            Marcar revisadas
          </button>
        </div>
      </div>
    </div>
  )
}
