"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Check, Flame, Star, Sparkles } from "lucide-react"
import Image from "next/image"

interface HabitsScreenProps {
  onBack?: () => void
}

interface Habit {
  id: string
  name: string
  emoji: string
  streak: number
  completedToday: boolean
  target: number
  completed: number
  color: string
}

export function HabitsScreen({ onBack }: HabitsScreenProps) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Meditar",
      emoji: "🧘",
      streak: 12,
      completedToday: true,
      target: 7,
      completed: 5,
      color: "from-chart-2/30 to-chart-2/10"
    },
    {
      id: "2",
      name: "Ejercicio",
      emoji: "💪",
      streak: 8,
      completedToday: false,
      target: 7,
      completed: 3,
      color: "from-accent/30 to-accent/10"
    },
    {
      id: "3",
      name: "Leer 30 min",
      emoji: "📚",
      streak: 24,
      completedToday: true,
      target: 7,
      completed: 6,
      color: "from-primary/30 to-primary/10"
    },
    {
      id: "4",
      name: "Agua 8 vasos",
      emoji: "💧",
      streak: 5,
      completedToday: false,
      target: 8,
      completed: 4,
      color: "from-chart-1/30 to-chart-1/10"
    },
    {
      id: "5",
      name: "Journaling",
      emoji: "✍️",
      streak: 3,
      completedToday: false,
      target: 7,
      completed: 2,
      color: "from-chart-4/30 to-chart-4/10"
    }
  ])

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completedToday: !h.completedToday } : h
    ))
  }

  const completedToday = habits.filter(h => h.completedToday).length
  const totalHabits = habits.length
  const longestStreak = Math.max(...habits.map(h => h.streak))

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"]
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1 // Adjust for Monday start

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
          alt="Yoga meditation"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        
        {/* Back button */}
        <button 
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Add button */}
        <button className="absolute top-12 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </button>

        {/* Title */}
        <div className="absolute bottom-4 left-6 right-6">
          <h1 className="text-2xl font-semibold text-foreground">Mis Habitos</h1>
          <p className="text-sm text-muted-foreground">Construye la mejor version de ti</p>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Stats row */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Racha maxima</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{longestStreak} dias</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-chart-4" />
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{completedToday}/{totalHabits}</p>
          </div>
        </div>

        {/* Week progress */}
        <div className="bg-card rounded-2xl p-4 border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Esta semana</h3>
            <span className="text-xs text-primary font-medium">75% completado</span>
          </div>
          <div className="flex justify-between">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className={`text-[10px] ${index === adjustedToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {day}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index < adjustedToday 
                    ? 'bg-primary/20' 
                    : index === adjustedToday
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}>
                  {index < adjustedToday && <Check className="w-4 h-4 text-primary" />}
                  {index === adjustedToday && <span className="text-xs font-medium">{completedToday}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-4 mb-6 border border-primary/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground mb-1">Insight de IA</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu mejor momento para meditar es en la manana. Has mantenido tu racha de lectura por 24 dias. Sigue asi!
              </p>
            </div>
          </div>
        </div>

        {/* Habits list */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Habitos diarios
        </h3>
        <div className="space-y-3">
          {habits.map(habit => (
            <div 
              key={habit.id}
              className={`bg-gradient-to-r ${habit.color} rounded-2xl p-4 border border-border/30`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    habit.completedToday 
                      ? 'bg-primary shadow-lg shadow-primary/30' 
                      : 'bg-card border-2 border-border'
                  }`}
                >
                  {habit.completedToday ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <span className="text-lg">{habit.emoji}</span>
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${habit.completedToday ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {habit.name}
                    </p>
                    {habit.streak >= 7 && (
                      <div className="flex items-center gap-0.5 text-accent">
                        <Flame className="w-3 h-3" />
                        <span className="text-[10px] font-medium">{habit.streak}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/70 rounded-full transition-all duration-500"
                        style={{ width: `${(habit.completed / habit.target) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {habit.completed}/{habit.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add new habit button */}
        <button className="w-full mt-4 py-3.5 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar nuevo habito
        </button>
      </div>
    </div>
  )
}
