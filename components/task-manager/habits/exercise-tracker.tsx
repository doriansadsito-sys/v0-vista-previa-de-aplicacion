"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, Play, Pause, Clock, Flame, ChevronRight, Dumbbell, Sparkles, RotateCcw, Check, Timer, SkipForward, Volume2, VolumeX } from "lucide-react"

interface ExerciseTrackerProps {
  onBack?: () => void
}

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  duration?: number // seconds for timed exercises
  muscle: string
  instructions: string[]
  isTimeBased: boolean
}

interface Routine {
  id: string
  name: string
  duration: string
  calories: number
  level: string
  exercises: Exercise[]
  aiOptimized: boolean
  description: string
}

type WorkoutState = 'idle' | 'exercise' | 'rest' | 'complete'

export function ExerciseTracker({ onBack }: ExerciseTrackerProps) {
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null)
  const [workoutState, setWorkoutState] = useState<WorkoutState>('idle')
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const [repCount, setRepCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [restTime, setRestTime] = useState(30)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const routines: Routine[] = [
    {
      id: "1",
      name: "Full Body Express",
      duration: "25 min",
      calories: 280,
      level: "Intermedio",
      aiOptimized: true,
      description: "Rutina completa para todo el cuerpo, ideal para dias con poco tiempo.",
      exercises: [
        { 
          id: "e1", 
          name: "Sentadillas", 
          sets: 3, 
          reps: "15", 
          muscle: "Piernas",
          isTimeBased: false,
          instructions: [
            "Pies separados al ancho de hombros",
            "Baja como si fueras a sentarte",
            "Rodillas no pasan la punta de los pies",
            "Espalda recta, pecho arriba"
          ]
        },
        { 
          id: "e2", 
          name: "Flexiones", 
          sets: 3, 
          reps: "12", 
          muscle: "Pecho",
          isTimeBased: false,
          instructions: [
            "Manos al ancho de hombros",
            "Cuerpo en linea recta",
            "Baja hasta que el pecho casi toque el suelo",
            "Codos a 45 grados del cuerpo"
          ]
        },
        { 
          id: "e3", 
          name: "Plancha", 
          sets: 3, 
          reps: "45 seg", 
          duration: 45,
          muscle: "Core",
          isTimeBased: true,
          instructions: [
            "Antebrazos en el suelo",
            "Cuerpo en linea recta",
            "Aprieta el abdomen",
            "No dejes caer la cadera"
          ]
        },
        { 
          id: "e4", 
          name: "Zancadas", 
          sets: 3, 
          reps: "10 c/pierna", 
          muscle: "Piernas",
          isTimeBased: false,
          instructions: [
            "Da un paso largo hacia adelante",
            "Rodilla trasera casi toca el suelo",
            "Rodilla delantera a 90 grados",
            "Mantén el torso erguido"
          ]
        },
        { 
          id: "e5", 
          name: "Mountain Climbers", 
          sets: 3, 
          reps: "30 seg", 
          duration: 30,
          muscle: "Cardio",
          isTimeBased: true,
          instructions: [
            "Posicion de plancha alta",
            "Lleva rodillas al pecho alternando",
            "Mantén el ritmo constante",
            "Core siempre activado"
          ]
        },
      ]
    },
    {
      id: "2",
      name: "Core Destroyer",
      duration: "20 min",
      calories: 200,
      level: "Avanzado",
      aiOptimized: true,
      description: "Entrena tu abdomen con esta rutina intensa y efectiva.",
      exercises: [
        { 
          id: "e6", 
          name: "Crunches", 
          sets: 4, 
          reps: "20", 
          muscle: "Abdomen",
          isTimeBased: false,
          instructions: [
            "Acostado boca arriba",
            "Rodillas flexionadas, pies en el suelo",
            "Manos detras de la cabeza",
            "Levanta solo los hombros"
          ]
        },
        { 
          id: "e7", 
          name: "Plancha Lateral", 
          sets: 3, 
          reps: "30 seg c/lado", 
          duration: 30,
          muscle: "Oblicuos",
          isTimeBased: true,
          instructions: [
            "Apoyate sobre un antebrazo",
            "Cuerpo en linea recta lateral",
            "Cadera elevada",
            "No dejes que la cadera baje"
          ]
        },
        { 
          id: "e8", 
          name: "Bicycle Crunches", 
          sets: 3, 
          reps: "20", 
          muscle: "Abdomen",
          isTimeBased: false,
          instructions: [
            "Acostado con manos en la nuca",
            "Codo toca rodilla opuesta",
            "Alterna lados con movimiento de pedaleo",
            "Mantén la espalda baja pegada al suelo"
          ]
        },
        { 
          id: "e9", 
          name: "Leg Raises", 
          sets: 3, 
          reps: "15", 
          muscle: "Abdomen bajo",
          isTimeBased: false,
          instructions: [
            "Acostado con manos bajo los gluteos",
            "Piernas juntas y estiradas",
            "Sube las piernas a 90 grados",
            "Baja lento sin tocar el suelo"
          ]
        },
        { 
          id: "e10", 
          name: "Plancha con Toques", 
          sets: 3, 
          reps: "40 seg", 
          duration: 40,
          muscle: "Core",
          isTimeBased: true,
          instructions: [
            "Posicion de plancha alta",
            "Toca hombro opuesto con cada mano",
            "Alterna sin mover la cadera",
            "Mantén el core activado"
          ]
        },
      ]
    },
    {
      id: "3",
      name: "HIIT Cardio Blast",
      duration: "15 min",
      calories: 250,
      level: "Intermedio",
      aiOptimized: true,
      description: "Quema calorias rapidamente con intervalos de alta intensidad.",
      exercises: [
        { 
          id: "e11", 
          name: "Jumping Jacks", 
          sets: 3, 
          reps: "45 seg", 
          duration: 45,
          muscle: "Cardio",
          isTimeBased: true,
          instructions: [
            "De pie con pies juntos",
            "Salta abriendo piernas y brazos",
            "Vuelve a la posicion inicial",
            "Mantén un ritmo constante"
          ]
        },
        { 
          id: "e12", 
          name: "Burpees", 
          sets: 3, 
          reps: "10", 
          muscle: "Full Body",
          isTimeBased: false,
          instructions: [
            "De pie, baja a cuclillas",
            "Lanza los pies atras a plancha",
            "Haz una flexion",
            "Salta explosivamente con brazos arriba"
          ]
        },
        { 
          id: "e13", 
          name: "High Knees", 
          sets: 3, 
          reps: "30 seg", 
          duration: 30,
          muscle: "Cardio",
          isTimeBased: true,
          instructions: [
            "Corre en el lugar",
            "Lleva rodillas al pecho",
            "Brazos en movimiento de carrera",
            "Maxima velocidad posible"
          ]
        },
        { 
          id: "e14", 
          name: "Jump Squats", 
          sets: 3, 
          reps: "12", 
          muscle: "Piernas",
          isTimeBased: false,
          instructions: [
            "Posicion de sentadilla",
            "Baja profundo",
            "Salta explosivamente",
            "Aterriza suave en sentadilla"
          ]
        },
      ]
    },
    {
      id: "4",
      name: "Upper Body Strength",
      duration: "30 min",
      calories: 320,
      level: "Intermedio",
      aiOptimized: true,
      description: "Fortalece brazos, pecho y espalda sin necesidad de equipo.",
      exercises: [
        { 
          id: "e15", 
          name: "Flexiones Diamante", 
          sets: 3, 
          reps: "10", 
          muscle: "Triceps",
          isTimeBased: false,
          instructions: [
            "Manos juntas formando un diamante",
            "Codos pegados al cuerpo",
            "Baja el pecho hacia las manos",
            "Extiende completamente"
          ]
        },
        { 
          id: "e16", 
          name: "Pike Push-ups", 
          sets: 3, 
          reps: "10", 
          muscle: "Hombros",
          isTimeBased: false,
          instructions: [
            "Posicion de V invertida",
            "Caderas arriba, piernas estiradas",
            "Baja la cabeza hacia el suelo",
            "Empuja hacia arriba"
          ]
        },
        { 
          id: "e17", 
          name: "Dips en Silla", 
          sets: 3, 
          reps: "12", 
          muscle: "Triceps",
          isTimeBased: false,
          instructions: [
            "Manos en el borde de una silla",
            "Piernas estiradas al frente",
            "Baja flexionando los codos",
            "Sube hasta extender brazos"
          ]
        },
        { 
          id: "e18", 
          name: "Superman Hold", 
          sets: 3, 
          reps: "30 seg", 
          duration: 30,
          muscle: "Espalda",
          isTimeBased: true,
          instructions: [
            "Boca abajo en el suelo",
            "Brazos y piernas estirados",
            "Levanta brazos y piernas del suelo",
            "Manten la posicion"
          ]
        },
        { 
          id: "e19", 
          name: "Flexiones Anchas", 
          sets: 3, 
          reps: "12", 
          muscle: "Pecho",
          isTimeBased: false,
          instructions: [
            "Manos mas anchas que los hombros",
            "Cuerpo en linea recta",
            "Baja el pecho al suelo",
            "Enfocate en estirar el pecho"
          ]
        },
      ]
    }
  ]

  // Play sound effect
  const playSound = useCallback((type: 'tick' | 'complete' | 'start') => {
    if (!soundEnabled) return
    
    // Create audio context for simple beeps
    try {
      const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      switch (type) {
        case 'tick':
          oscillator.frequency.value = 800
          gainNode.gain.value = 0.1
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.1)
          break
        case 'complete':
          oscillator.frequency.value = 1200
          gainNode.gain.value = 0.2
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.3)
          break
        case 'start':
          oscillator.frequency.value = 600
          gainNode.gain.value = 0.15
          oscillator.start()
          oscillator.stop(audioContext.currentTime + 0.2)
          break
      }
    } catch (e) {
      // Audio not supported
    }
  }, [soundEnabled])

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 4 && prev > 1) playSound('tick')
          return prev - 1
        })
      }, 1000)
    } else if (timeRemaining === 0 && isTimerRunning) {
      setIsTimerRunning(false)
      playSound('complete')
      
      if (workoutState === 'exercise') {
        // Move to rest or next exercise
        handleExerciseComplete()
      } else if (workoutState === 'rest') {
        // Start next set or exercise
        startNextSet()
      }
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isTimerRunning, timeRemaining, workoutState, playSound])

  const getCurrentExercise = () => {
    if (!activeRoutine) return null
    return activeRoutine.exercises[currentExerciseIndex]
  }

  const startWorkout = () => {
    setWorkoutState('exercise')
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    setRepCount(0)
    setCompletedExercises([])
    
    const exercise = activeRoutine?.exercises[0]
    if (exercise?.isTimeBased && exercise.duration) {
      setTimeRemaining(exercise.duration)
      setIsTimerRunning(true)
      playSound('start')
    }
  }

  const handleExerciseComplete = () => {
    const exercise = getCurrentExercise()
    if (!exercise || !activeRoutine) return

    if (currentSet < exercise.sets) {
      // Start rest period
      setWorkoutState('rest')
      setTimeRemaining(restTime)
      setIsTimerRunning(true)
    } else {
      // Move to next exercise
      setCompletedExercises([...completedExercises, exercise.id])
      
      if (currentExerciseIndex < activeRoutine.exercises.length - 1) {
        setCurrentExerciseIndex(prev => prev + 1)
        setCurrentSet(1)
        setRepCount(0)
        
        const nextExercise = activeRoutine.exercises[currentExerciseIndex + 1]
        if (nextExercise.isTimeBased && nextExercise.duration) {
          setWorkoutState('rest')
          setTimeRemaining(restTime)
          setIsTimerRunning(true)
        } else {
          setWorkoutState('exercise')
        }
      } else {
        // Workout complete
        setWorkoutState('complete')
        playSound('complete')
      }
    }
  }

  const startNextSet = () => {
    setCurrentSet(prev => prev + 1)
    setRepCount(0)
    setWorkoutState('exercise')
    
    const exercise = getCurrentExercise()
    if (exercise?.isTimeBased && exercise.duration) {
      setTimeRemaining(exercise.duration)
      setIsTimerRunning(true)
      playSound('start')
    }
  }

  const addRep = () => {
    setRepCount(prev => prev + 1)
    playSound('tick')
  }

  const completeSet = () => {
    handleExerciseComplete()
  }

  const skipExercise = () => {
    if (!activeRoutine) return
    
    const exercise = getCurrentExercise()
    if (exercise) {
      setCompletedExercises([...completedExercises, exercise.id])
    }
    
    if (currentExerciseIndex < activeRoutine.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setCurrentSet(1)
      setRepCount(0)
      setIsTimerRunning(false)
      
      const nextExercise = activeRoutine.exercises[currentExerciseIndex + 1]
      if (nextExercise.isTimeBased && nextExercise.duration) {
        setTimeRemaining(nextExercise.duration)
      }
    } else {
      setWorkoutState('complete')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Exercise illustration component with better visuals
  const ExerciseIllustration = ({ exercise, isActive }: { exercise: Exercise; isActive?: boolean }) => {
    const baseColor = isActive ? "#10B981" : "#6B7280"
    const skinColor = "#FCD34D"
    
    const illustrations: Record<string, JSX.Element> = {
      "Sentadillas": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="25" r="15" fill={skinColor} />
          <rect x="50" y="40" width="20" height="30" rx="5" fill={baseColor} />
          <path d="M55 70 L45 100" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
          <path d="M65 70 L75 100" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
          <path d="M50 50 L35 65" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M70 50 L85 65" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M30 105 L90 105" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      "Flexiones": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="25" cy="45" r="12" fill={skinColor} />
          <path d="M37 48 L95 55" stroke={baseColor} strokeWidth="10" strokeLinecap="round" />
          <path d="M30 60 L25 85" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M50 62 L45 85" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M95 55 L100 75" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M10 90 L110 90" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      "Plancha": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="20" cy="50" r="12" fill={skinColor} />
          <path d="M32 53 L100 60" stroke={baseColor} strokeWidth="10" strokeLinecap="round" />
          <path d="M25 65 L25 85" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M100 60 L100 85" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M10 90 L110 90" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
          {isActive && (
            <text x="60" y="35" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">HOLD</text>
          )}
        </svg>
      ),
      "Zancadas": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="20" r="12" fill={skinColor} />
          <rect x="52" y="32" width="16" height="25" rx="4" fill={baseColor} />
          <path d="M56 57 L35 95" stroke={baseColor} strokeWidth="7" strokeLinecap="round" />
          <path d="M64 57 L85 75 L85 95" stroke={baseColor} strokeWidth="7" strokeLinecap="round" />
          <path d="M52 42 L40 55" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
          <path d="M68 42 L80 55" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
        </svg>
      ),
      "Mountain Climbers": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="25" cy="35" r="12" fill={skinColor} />
          <path d="M37 40 L85 55" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
          <path d="M30 52 L55 75" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M55 55 L30 80" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M85 55 L100 75" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          {isActive && (
            <>
              <circle cx="55" cy="75" r="5" fill="#10B981" opacity="0.5" />
              <circle cx="30" cy="80" r="5" fill="#10B981" opacity="0.5" />
            </>
          )}
        </svg>
      ),
      "Crunches": (
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="45" cy="40" r="12" fill={skinColor} />
          <path d="M55 48 Q70 60 80 80" stroke={baseColor} strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M80 80 L95 70" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M80 80 L95 90" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
          <path d="M48 52 L60 40" stroke={baseColor} strokeWidth="5" strokeLinecap="round" />
          <path d="M20 95 L100 95" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    }

    return illustrations[exercise.name] || (
      <svg viewBox="0 0 120 120" className="w-full h-full">
        <circle cx="60" cy="30" r="15" fill={skinColor} />
        <rect x="48" y="45" width="24" height="35" rx="5" fill={baseColor} />
        <path d="M52 80 L45 110" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
        <path d="M68 80 L75 110" stroke={baseColor} strokeWidth="8" strokeLinecap="round" />
        <path d="M48 55 L30 70" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M72 55 L90 70" stroke={baseColor} strokeWidth="6" strokeLinecap="round" />
      </svg>
    )
  }

  // Active workout view
  if (activeRoutine && workoutState !== 'idle') {
    const exercise = getCurrentExercise()
    const totalExercises = activeRoutine.exercises.length
    const progress = ((completedExercises.length / totalExercises) * 100)

    if (workoutState === 'complete') {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Rutina Completada!</h1>
          <p className="text-muted-foreground text-center mb-6">
            Excelente trabajo! Completaste {totalExercises} ejercicios.
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
            <div className="bg-card rounded-2xl p-4 border border-border/50 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{activeRoutine.calories}</p>
              <p className="text-xs text-muted-foreground">calorias</p>
            </div>
            <div className="bg-card rounded-2xl p-4 border border-border/50 text-center">
              <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xl font-bold text-foreground">{activeRoutine.duration}</p>
              <p className="text-xs text-muted-foreground">duracion</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveRoutine(null)
              setWorkoutState('idle')
            }}
            className="w-full max-w-xs py-4 bg-green-500 text-white font-medium rounded-2xl"
          >
            Finalizar
          </button>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className={`pt-12 pb-6 px-6 ${
          workoutState === 'rest' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-orange-500 to-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => {
                setActiveRoutine(null)
                setWorkoutState('idle')
                setIsTimerRunning(false)
              }}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">
              {workoutState === 'rest' ? 'Descanso' : `Ejercicio ${currentExerciseIndex + 1}/${totalExercises}`}
            </p>
            <h1 className="text-2xl font-bold text-white">
              {workoutState === 'rest' ? 'Descansa!' : exercise?.name}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {workoutState === 'rest' 
                ? `Siguiente: ${activeRoutine.exercises[currentExerciseIndex + (currentSet >= (exercise?.sets || 0) ? 1 : 0)]?.name || 'Fin'}`
                : `Serie ${currentSet} de ${exercise?.sets}`
              }
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          {workoutState === 'rest' ? (
            // Rest view
            <div className="text-center py-8">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-secondary"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={553}
                    strokeDashoffset={553 - (553 * (timeRemaining / restTime))}
                    className="text-blue-500 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-foreground">{formatTime(timeRemaining)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsTimerRunning(false)
                  startNextSet()
                }}
                className="py-3 px-8 bg-blue-500 text-white font-medium rounded-xl"
              >
                Saltar descanso
              </button>
            </div>
          ) : (
            // Exercise view
            <>
              {/* Exercise illustration */}
              <div className="bg-card rounded-3xl p-6 border border-border/50 mb-6">
                <div className="w-40 h-40 mx-auto mb-4">
                  {exercise && <ExerciseIllustration exercise={exercise} isActive={isTimerRunning} />}
                </div>

                {exercise?.isTimeBased ? (
                  // Timer for time-based exercises
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-secondary"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={352}
                          strokeDashoffset={352 - (352 * (timeRemaining / (exercise.duration || 1)))}
                          className="text-orange-500 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{formatTime(timeRemaining)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${
                          isTimerRunning ? 'bg-orange-500/20 text-orange-500' : 'bg-orange-500 text-white'
                        }`}
                      >
                        {isTimerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => {
                          setTimeRemaining(exercise.duration || 0)
                          setIsTimerRunning(false)
                        }}
                        className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center"
                      >
                        <RotateCcw className="w-5 h-5 text-foreground" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Rep counter for rep-based exercises
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Repeticiones</p>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <span className="text-5xl font-bold text-foreground">{repCount}</span>
                      <span className="text-2xl text-muted-foreground">/ {exercise?.reps}</span>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={addRep}
                        className="flex-1 max-w-[150px] py-4 bg-orange-500 text-white font-medium rounded-xl flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        +1 Rep
                      </button>
                      <button
                        onClick={completeSet}
                        className="flex-1 max-w-[150px] py-4 bg-green-500 text-white font-medium rounded-xl flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Serie
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-card rounded-2xl p-4 border border-border/50 mb-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Instrucciones</h3>
                <ul className="space-y-2">
                  {exercise?.instructions.map((instruction, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skip button */}
              <button
                onClick={skipExercise}
                className="w-full py-3 border border-border rounded-xl text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"
              >
                <SkipForward className="w-4 h-4" />
                Saltar ejercicio
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Routine selection view
  if (activeRoutine && workoutState === 'idle') {
    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 pt-12 pb-6 px-6">
          <button 
            onClick={() => setActiveRoutine(null)}
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
          <p className="text-sm text-white/80 mt-1">{activeRoutine.description}</p>
          <div className="flex items-center gap-4 mt-3 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {activeRoutine.duration}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-4 h-4" /> {activeRoutine.calories} cal
            </span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {activeRoutine.level}
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {activeRoutine.exercises.length} Ejercicios
          </h3>
          
          <div className="space-y-3 mb-6">
            {activeRoutine.exercises.map((exercise, index) => (
              <div 
                key={exercise.id}
                className="bg-card rounded-2xl p-4 border border-border/50"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <ExerciseIllustration exercise={exercise} />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {index + 1}. {exercise.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {exercise.muscle}
                    </p>
                    
                    <div className="flex gap-4 mt-2">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{exercise.sets}</p>
                        <p className="text-[10px] text-muted-foreground">SERIES</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">{exercise.reps}</p>
                        <p className="text-[10px] text-muted-foreground">{exercise.isTimeBased ? 'TIEMPO' : 'REPS'}</p>
                      </div>
                    </div>
                  </div>

                  {exercise.isTimeBased && (
                    <div className="flex items-center">
                      <Timer className="w-5 h-5 text-orange-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={startWorkout}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-2xl flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Comenzar Rutina
          </button>
        </div>
      </div>
    )
  }

  // Routine list view
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
        <p className="text-sm text-white/80 mt-1">Rutinas con temporizador y contador de reps</p>
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
                  <p className="text-xs text-muted-foreground mb-2">{routine.description}</p>
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
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
