"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Check, Flame, Star, Sparkles, Droplets, Dumbbell, Camera, Utensils, Footprints } from "lucide-react"
import Image from "next/image"
import { WaterTracker } from "./habits/water-tracker"
import { ExerciseTracker } from "./habits/exercise-tracker"
import { CaloriesTracker } from "./habits/calories-tracker"
import { FoodTracker } from "./habits/food-tracker"
import { StepsTracker } from "./habits/steps-tracker"

interface HabitsScreenProps {
  onBack?: () => void
}

interface MainHabit {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  bgColor: string
  progress: number
  target: string
  current: string
  streak: number
}

interface SecondaryHabit {
  id: string
  name: string
  emoji: string
  streak: number
  completedToday: boolean
  color: string
}

type ActiveScreen = "main" | "water" | "exercise" | "calories" | "food" | "steps"

export function HabitsScreen({ onBack }: HabitsScreenProps) {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("main")
  const [showAddHabit, setShowAddHabit] = useState(false)
  const [newHabitName, setNewHabitName] = useState("")

  const [mainHabits] = useState<MainHabit[]>([
    {
      id: "water",
      name: "Agua",
      icon: <Droplets className="w-5 h-5" />,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      progress: 37.5,
      target: "8 vasos",
      current: "3/8",
      streak: 5
    },
    {
      id: "exercise",
      name: "Ejercicio",
      icon: <Dumbbell className="w-5 h-5" />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      progress: 0,
      target: "1 rutina",
      current: "0/1",
      streak: 8
    },
    {
      id: "calories",
      name: "Calorias",
      icon: <Camera className="w-5 h-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      progress: 72.5,
      target: "2000 kcal",
      current: "1450",
      streak: 12
    },
    {
      id: "food",
      name: "Comidas",
      icon: <Utensils className="w-5 h-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      progress: 60,
      target: "5 registros",
      current: "3/5",
      streak: 15
    },
    {
      id: "steps",
      name: "Pasos",
      icon: <Footprints className="w-5 h-5" />,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      progress: 68.4,
      target: "10,000",
      current: "6,842",
      streak: 3
    }
  ])

  const [secondaryHabits, setSecondaryHabits] = useState<SecondaryHabit[]>([
    {
      id: "1",
      name: "Meditar",
      emoji: "🧘",
      streak: 12,
      completedToday: true,
      color: "from-purple-500/20 to-purple-500/5"
    },
    {
      id: "2",
      name: "Leer 30 min",
      emoji: "📚",
      streak: 24,
      completedToday: false,
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      id: "3",
      name: "Journaling",
      emoji: "✍️",
      streak: 3,
      completedToday: false,
      color: "from-pink-500/20 to-pink-500/5"
    }
  ])

  const toggleSecondaryHabit = (id: string) => {
    setSecondaryHabits(secondaryHabits.map(h => 
      h.id === id ? { ...h, completedToday: !h.completedToday } : h
    ))
  }

  const addSecondaryHabit = () => {
    if (newHabitName.trim()) {
      const colors = [
        "from-purple-500/20 to-purple-500/5",
        "from-blue-500/20 to-blue-500/5",
        "from-pink-500/20 to-pink-500/5",
        "from-teal-500/20 to-teal-500/5",
        "from-rose-500/20 to-rose-500/5"
      ]
      const newHabit: SecondaryHabit = {
        id: Date.now().toString(),
        name: newHabitName,
        emoji: "✨",
        streak: 0,
        completedToday: false,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
      setSecondaryHabits([...secondaryHabits, newHabit])
      setNewHabitName("")
      setShowAddHabit(false)
    }
  }

  const completedMainToday = mainHabits.filter(h => h.progress >= 100).length
  const completedSecondaryToday = secondaryHabits.filter(h => h.completedToday).length
  const totalCompleted = completedMainToday + completedSecondaryToday
  const totalHabits = mainHabits.length + secondaryHabits.length

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"]
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1

  const handleMainHabitClick = (habitId: string) => {
    setActiveScreen(habitId as ActiveScreen)
  }

  // Render sub-screens
  if (activeScreen === "water") {
    return <WaterTracker onBack={() => setActiveScreen("main")} />
  }
  if (activeScreen === "exercise") {
    return <ExerciseTracker onBack={() => setActiveScreen("main")} />
  }
  if (activeScreen === "calories") {
    return <CaloriesTracker onBack={() => setActiveScreen("main")} />
  }
  if (activeScreen === "food") {
    return <FoodTracker onBack={() => setActiveScreen("main")} />
  }
  if (activeScreen === "steps") {
    return <StepsTracker onBack={() => setActiveScreen("main")} />
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header image */}
      <div className="relative h-44 overflow-hidden">
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
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Racha max</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">24 dias</p>
          </div>
          <div className="flex-1 bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Hoy</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{totalCompleted}/{totalHabits}</p>
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
                  {index === adjustedToday && <span className="text-xs font-medium">{totalCompleted}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main habits */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Habitos principales
        </h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {mainHabits.map(habit => (
            <button
              key={habit.id}
              onClick={() => handleMainHabitClick(habit.id)}
              className="bg-card rounded-2xl p-4 border border-border/50 text-left transition-all active:scale-98"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${habit.bgColor} flex items-center justify-center ${habit.color}`}>
                  {habit.icon}
                </div>
                {habit.streak > 0 && (
                  <div className="flex items-center gap-0.5 text-orange-500">
                    <Flame className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{habit.streak}</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-medium text-foreground mb-1">{habit.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{habit.current} de {habit.target}</p>
              
              {/* Progress bar */}
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    habit.id === "water" ? "bg-sky-500" :
                    habit.id === "exercise" ? "bg-orange-500" :
                    habit.id === "calories" ? "bg-amber-500" :
                    habit.id === "food" ? "bg-emerald-500" :
                    "bg-violet-500"
                  }`}
                  style={{ width: `${habit.progress}%` }}
                />
              </div>
            </button>
          ))}
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
                Llevas 5 dias bebiendo al menos 6 vasos de agua. Te faltan solo 3 vasos para completar hoy. Tu racha de lectura es impresionante con 24 dias!
              </p>
            </div>
          </div>
        </div>

        {/* Secondary habits */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Habitos secundarios
          </h3>
          <button 
            onClick={() => setShowAddHabit(true)}
            className="text-xs text-primary font-medium flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Agregar
          </button>
        </div>
        
        <div className="space-y-2">
          {secondaryHabits.map(habit => (
            <div 
              key={habit.id}
              className={`bg-gradient-to-r ${habit.color} rounded-xl p-3 border border-border/30`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSecondaryHabit(habit.id)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    habit.completedToday 
                      ? 'bg-primary shadow-md shadow-primary/30' 
                      : 'bg-card border border-border'
                  }`}
                >
                  {habit.completedToday ? (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <span className="text-base">{habit.emoji}</span>
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`text-sm font-medium ${habit.completedToday ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {habit.name}
                  </p>
                </div>

                {habit.streak > 0 && (
                  <div className="flex items-center gap-0.5 text-orange-500">
                    <Flame className="w-3 h-3" />
                    <span className="text-[10px] font-medium">{habit.streak}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add habit modal */}
        {showAddHabit && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50">
            <div className="bg-card w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
              <h3 className="text-lg font-semibold text-foreground mb-4">Nuevo habito secundario</h3>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Nombre del habito..."
                className="w-full bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddHabit(false)}
                  className="flex-1 py-3 border border-border rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={addSecondaryHabit}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
