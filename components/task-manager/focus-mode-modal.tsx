"use client"

import { X, Sparkles, Brain, Headphones, Moon, Pause, Play, RotateCcw } from "lucide-react"
import Image from "next/image"

interface FocusModeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FocusModeModal({ isOpen, onClose }: FocusModeModalProps) {
  if (!isOpen) return null

  const focusModes = [
    { name: "Pomodoro", duration: "25 min", icon: Brain, color: "from-destructive/20 to-accent/20" },
    { name: "Flow profundo", duration: "90 min", icon: Brain, color: "from-primary/20 to-chart-2/20" },
    { name: "Descanso activo", duration: "15 min", icon: Pause, color: "from-chart-2/20 to-chart-4/20" },
  ]

  const ambientSounds = [
    { name: "Lluvia", active: true },
    { name: "Bosque", active: false },
    { name: "Cafeteria", active: false },
    { name: "Silencio", active: false },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 bg-background rounded-t-[2rem] max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header con imagen */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80"
            alt="Lake mountains"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                Modo productividad
              </span>
            </div>
            <h2 className="text-xl font-semibold text-foreground">Enfoque profundo</h2>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(92vh-11rem)]">
          {/* AI recommendation */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 mb-5 border border-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground mb-1">Recomendacion de IA</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Basado en tu historial, tu mejor rendimiento es entre las 10am-12pm. Te sugiero una sesion de enfoque profundo de 90 minutos ahora.
                </p>
              </div>
            </div>
          </div>

          {/* Timer display */}
          <div className="flex flex-col items-center py-6 mb-5">
            <div className="relative w-48 h-48">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * 0.25}
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
              {/* Timer text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-foreground">25:00</span>
                <span className="text-xs text-muted-foreground mt-1">minutos</span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-4 mt-4">
              <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Play className="w-6 h-6 text-primary-foreground ml-1" />
              </button>
              <button className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Moon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Focus modes */}
          <div className="mb-5">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Modos de enfoque
            </h3>
            <div className="space-y-2">
              {focusModes.map((mode, index) => (
                <button 
                  key={index}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl border ${
                    index === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                    <mode.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">{mode.name}</p>
                    <p className="text-[10px] text-muted-foreground">{mode.duration}</p>
                  </div>
                  {index === 0 && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient sounds */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Sonido ambiente
              </h3>
              <Headphones className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              {ambientSounds.map((sound, index) => (
                <button 
                  key={index}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium ${
                    sound.active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary/60 text-foreground'
                  }`}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current task */}
          <div className="bg-secondary/40 rounded-2xl p-4 mb-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Tarea actual</p>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-primary" />
              <p className="text-sm font-medium text-foreground flex-1">Completar presentacion del proyecto</p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-[10px] text-primary">La IA bloqueara notificaciones durante el enfoque</p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="px-6 pb-6 safe-area-bottom border-t border-border pt-4">
          <button className="w-full py-3.5 rounded-2xl bg-primary text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
            <Brain className="w-4 h-4" />
            Iniciar enfoque
          </button>
        </div>
      </div>
    </div>
  )
}
