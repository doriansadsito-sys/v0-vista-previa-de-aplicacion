"use client"

import { useState } from "react"
import { ArrowLeft, Play, Clock, Flame, ChevronRight, Dumbbell, Sparkles, RotateCcw, Check } from "lucide-react"

interface ExerciseTrackerProps {
  onBack?: () => void
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  muscle: string
  image: string
  completed: boolean
}

interface Routine {
  id: string
  name: string
  duration: string
  calories: number
  level: string
  exercises: Exercise[]
  aiOptimized: boolean
}

export function ExerciseTracker({ onBack }: ExerciseTrackerProps) {
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])

  const routines: Routine[] = [
    {
      id: "1",
      name: "Full Body Express",
      duration: "25 min",
      calories: 280,
      level: "Intermedio",
      aiOptimized: true,
      exercises: [
        { id: "e1", name: "Sentadillas", sets: 3, reps: "12-15", muscle: "Piernas", image: "/exercises/squats.jpg", completed: false },
        { id: "e2", name: "Flexiones", sets: 3, reps: "10-12", muscle: "Pecho", image: "/exercises/pushups.jpg", completed: false },
        { id: "e3", name: "Plancha", sets: 3, reps: "30 seg", muscle: "Core", image: "/exercises/plank.jpg", completed: false },
        { id: "e4", name: "Lunges", sets: 3, reps: "10 c/pierna", muscle: "Piernas", image: "/exercises/lunges.jpg", completed: false },
        { id: "e5", name: "Mountain Climbers", sets: 3, reps: "20 seg", muscle: "Cardio", image: "/exercises/mountain.jpg", completed: false },
      ]
    },
    {
      id: "2",
      name: "Core Destroyer",
      duration: "20 min",
      calories: 200,
      level: "Avanzado",
      aiOptimized: true,
      exercises: [
        { id: "e6", name: "Crunches", sets: 4, reps: "20", muscle: "Abdomen", image: "/exercises/crunches.jpg", completed: false },
        { id: "e7", name: "Plancha Lateral", sets: 3, reps: "30 seg c/lado", muscle: "Oblicuos", image: "/exercises/side-plank.jpg", completed: false },
        { id: "e8", name: "Bicycle Crunches", sets: 3, reps: "20", muscle: "Abdomen", image: "/exercises/bicycle.jpg", completed: false },
        { id: "e9", name: "Leg Raises", sets: 3, reps: "15", muscle: "Abdomen bajo", image: "/exercises/leg-raises.jpg", completed: false },
      ]
    },
    {
      id: "3",
      name: "Upper Body Power",
      duration: "30 min",
      calories: 320,
      level: "Intermedio",
      aiOptimized: true,
      exercises: [
        { id: "e10", name: "Flexiones Diamante", sets: 3, reps: "10", muscle: "Triceps", image: "/exercises/diamond.jpg", completed: false },
        { id: "e11", name: "Pike Push-ups", sets: 3, reps: "8-10", muscle: "Hombros", image: "/exercises/pike.jpg", completed: false },
        { id: "e12", name: "Dips en Silla", sets: 3, reps: "12", muscle: "Triceps", image: "/exercises/dips.jpg", completed: false },
        { id: "e13", name: "Superman", sets: 3, reps: "15", muscle: "Espalda", image: "/exercises/superman.jpg", completed: false },
        { id: "e14", name: "Flexiones Inclinadas", sets: 3, reps: "12", muscle: "Pecho", image: "/exercises/incline.jpg", completed: false },
      ]
    },
    {
      id: "4",
      name: "Leg Day Intenso",
      duration: "35 min",
      calories: 380,
      level: "Avanzado",
      aiOptimized: true,
      exercises: [
        { id: "e15", name: "Jump Squats", sets: 4, reps: "15", muscle: "Cuadriceps", image: "/exercises/jump-squat.jpg", completed: false },
        { id: "e16", name: "Bulgarian Split", sets: 3, reps: "10 c/pierna", muscle: "Piernas", image: "/exercises/bulgarian.jpg", completed: false },
        { id: "e17", name: "Glute Bridge", sets: 4, reps: "15", muscle: "Gluteos", image: "/exercises/bridge.jpg", completed: false },
        { id: "e18", name: "Calf Raises", sets: 4, reps: "20", muscle: "Pantorrillas", image: "/exercises/calf.jpg", completed: false },
        { id: "e19", name: "Wall Sit", sets: 3, reps: "45 seg", muscle: "Cuadriceps", image: "/exercises/wall-sit.jpg", completed: false },
      ]
    }
  ]

  const toggleExercise = (exerciseId: string) => {
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(completedExercises.filter(id => id !== exerciseId))
    } else {
      setCompletedExercises([...completedExercises, exerciseId])
    }
  }

  // Exercise illustration component
  const ExerciseIllustration = ({ exercise }: { exercise: Exercise }) => {
    const illustrations: Record<string, JSX.Element> = {
      "Sentadillas": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="20" r="12" fill="#FCD34D" />
          <line x1="50" y1="32" x2="50" y2="55" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="55" x2="35" y2="80" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="55" x2="65" y2="80" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="40" x2="30" y2="50" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="40" x2="70" y2="50" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <path d="M30 85 Q50 75 70 85" stroke="#10B981" strokeWidth="3" fill="none" />
        </svg>
      ),
      "Flexiones": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="25" cy="35" r="10" fill="#FCD34D" />
          <line x1="35" y1="38" x2="75" y2="45" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="48" x2="25" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="45" y1="50" x2="40" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="75" y1="45" x2="85" y2="55" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="85" y1="55" x2="85" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <rect x="20" y="70" width="70" height="4" rx="2" fill="#6B7280" />
        </svg>
      ),
      "Plancha": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="20" cy="40" r="10" fill="#FCD34D" />
          <line x1="30" y1="43" x2="80" y2="50" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="25" y1="53" x2="25" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="80" y1="50" x2="80" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <rect x="15" y="70" width="75" height="4" rx="2" fill="#6B7280" />
        </svg>
      ),
      "Lunges": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="18" r="10" fill="#FCD34D" />
          <line x1="50" y1="28" x2="50" y2="50" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="50" x2="30" y2="80" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="50" x2="70" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="70" x2="70" y2="85" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="38" x2="35" y2="45" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="50" y1="38" x2="65" y2="45" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ),
      "Mountain Climbers": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="25" cy="30" r="10" fill="#FCD34D" />
          <line x1="35" y1="35" x2="70" y2="50" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="30" y1="45" x2="45" y2="65" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="55" y1="55" x2="30" y2="75" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="50" x2="85" y2="70" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <path d="M35 75 L85 75" stroke="#10B981" strokeWidth="2" strokeDasharray="5,5" />
        </svg>
      ),
      "Crunches": (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="35" cy="35" r="10" fill="#FCD34D" />
          <path d="M45 40 Q60 50 70 70" stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round" />
          <line x1="70" y1="70" x2="85" y2="60" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="70" y1="70" x2="85" y2="80" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <line x1="40" y1="48" x2="50" y2="35" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          <rect x="15" y="75" width="70" height="4" rx="2" fill="#6B7280" />
        </svg>
      ),
    }

    return illustrations[exercise.name] || (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="25" r="12" fill="#FCD34D" />
        <line x1="50" y1="37" x2="50" y2="60" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="60" x2="35" y2="85" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="60" x2="65" y2="85" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="45" x2="30" y2="55" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="45" x2="70" y2="55" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        <Dumbbell className="w-6 h-6 text-primary absolute bottom-2 right-2" />
      </svg>
    )
  }

  if (activeRoutine) {
    const completedCount = completedExercises.length
    const totalExercises = activeRoutine.exercises.length
    const progress = (completedCount / totalExercises) * 100

    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 pt-12 pb-6 px-6">
          <button 
            onClick={() => {
              setActiveRoutine(null)
              setCompletedExercises([])
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            {activeRoutine.aiOptimized && (
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> IA Optimizada
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-white">{activeRoutine.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {activeRoutine.duration}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" /> {activeRoutine.calories} cal
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Progreso</span>
              <span>{completedCount}/{totalExercises} ejercicios</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Ejercicios de la rutina
          </h3>
          
          <div className="space-y-3">
            {activeRoutine.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.includes(exercise.id)
              return (
                <div 
                  key={exercise.id}
                  className={`bg-card rounded-2xl p-4 border transition-all duration-300 ${
                    isCompleted ? 'border-green-500/50 bg-green-500/5' : 'border-border/50'
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Exercise illustration */}
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-green-500/10' : 'bg-orange-500/10'
                    }`}>
                      <ExerciseIllustration exercise={exercise} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-medium ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {index + 1}. {exercise.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {exercise.muscle}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleExercise(exercise.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-secondary text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs">{index + 1}</span>}
                        </button>
                      </div>
                      
                      <div className="flex gap-4 mt-3">
                        <div className="text-center">
                          <p className="text-lg font-semibold text-foreground">{exercise.sets}</p>
                          <p className="text-[10px] text-muted-foreground">SERIES</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-foreground">{exercise.reps}</p>
                          <p className="text-[10px] text-muted-foreground">REPS</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Finish button */}
          {completedCount === totalExercises && (
            <button 
              onClick={() => {
                setActiveRoutine(null)
                setCompletedExercises([])
              }}
              className="w-full mt-6 py-4 bg-green-500 text-white font-medium rounded-2xl flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Completar Rutina
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 pt-12 pb-8 px-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-sm text-white/90">Rutinas optimizadas con IA</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Ejercicio</h1>
        <p className="text-sm text-white/80 mt-1">Rutinas personalizadas para tu nivel</p>
      </div>

      <div className="px-6 py-4 -mt-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <p className="text-2xl font-semibold text-foreground">12</p>
            <p className="text-[10px] text-muted-foreground">SESIONES</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <p className="text-2xl font-semibold text-foreground">3.2k</p>
            <p className="text-[10px] text-muted-foreground">CALORIAS</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <p className="text-2xl font-semibold text-foreground">5h</p>
            <p className="text-[10px] text-muted-foreground">TIEMPO</p>
          </div>
        </div>

        {/* AI recommendation */}
        <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-4 mb-6 border border-orange-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Recomendacion IA</p>
              <p className="text-xs text-muted-foreground mt-1">
                Basado en tu historial, hoy es ideal para una sesion de core. Llevas 2 dias sin trabajar abdomen.
              </p>
            </div>
          </div>
        </div>

        {/* Routines */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Rutinas disponibles
        </h3>
        
        <div className="space-y-3">
          {routines.map(routine => (
            <button
              key={routine.id}
              onClick={() => setActiveRoutine(routine)}
              className="w-full bg-card rounded-2xl p-4 border border-border/50 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground">{routine.name}</p>
                    {routine.aiOptimized && (
                      <Sparkles className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {routine.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {routine.calories} cal
                    </span>
                    <span className="px-2 py-0.5 bg-secondary rounded-full text-[10px]">
                      {routine.level}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {routine.exercises.length} ejercicios
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Generate new routine */}
        <button className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Generar rutina personalizada
        </button>
      </div>
    </div>
  )
}
