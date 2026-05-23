"use client"

import { X, Sparkles, Plus, Tag, Calendar, Clock, Flag, Folder, ChevronDown } from "lucide-react"
import Image from "next/image"

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  if (!isOpen) return null

  const projectTemplates = [
    { name: "En blanco", icon: Plus, color: "bg-secondary" },
    { name: "Trabajo", icon: Folder, color: "bg-primary/20" },
    { name: "Personal", icon: Tag, color: "bg-accent/20" },
    { name: "Estudio", icon: Calendar, color: "bg-chart-2/20" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-[2rem] max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header con imagen */}
        <div className="relative h-36 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80"
            alt="Japanese temple"
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
            <h2 className="text-xl font-semibold text-foreground">Nuevo proyecto</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-9rem)]">
          {/* Project name input */}
          <div className="mb-5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Nombre del proyecto
            </label>
            <input 
              type="text"
              placeholder="Mi nuevo proyecto"
              className="w-full bg-secondary/60 rounded-2xl px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* AI Suggestion */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 mb-5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground mb-1">Sugerencia de IA</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Basado en tus proyectos anteriores, te sugiero crear subtareas automaticamente y establecer recordatorios semanales.
                </p>
                <button className="mt-2 text-xs text-primary font-medium">
                  Aplicar sugerencias
                </button>
              </div>
            </div>
          </div>

          {/* Templates */}
          <div className="mb-5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 block">
              Plantilla
            </label>
            <div className="grid grid-cols-4 gap-2">
              {projectTemplates.map((template, index) => (
                <button 
                  key={index}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border ${index === 0 ? 'border-primary bg-primary/5' : 'border-border'}`}
                >
                  <div className={`w-10 h-10 rounded-xl ${template.color} flex items-center justify-center`}>
                    <template.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <span className="text-[10px] font-medium text-foreground">{template.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-5">
            <button className="w-full flex items-center justify-between bg-secondary/40 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Flag className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium">Prioridad</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">Media</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between bg-secondary/40 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-chart-2/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-chart-2" />
                </div>
                <span className="text-sm font-medium">Fecha limite</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">Sin fecha</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between bg-secondary/40 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">Recordatorio</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">Desactivado</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* AI auto-generate tasks toggle */}
          <div className="flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Generar tareas con IA</p>
                <p className="text-[10px] text-muted-foreground">La IA creara subtareas automaticamente</p>
              </div>
            </div>
            <div className="w-11 h-6 bg-primary rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-6 flex gap-3 safe-area-bottom border-t border-border pt-4">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border text-sm font-medium text-muted-foreground"
          >
            Cancelar
          </button>
          <button className="flex-1 py-3.5 rounded-2xl bg-primary text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Crear proyecto
          </button>
        </div>
      </div>
    </div>
  )
}
