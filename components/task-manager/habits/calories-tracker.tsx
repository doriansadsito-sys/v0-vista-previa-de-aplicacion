"use client"

import { useState, useRef } from "react"
import { ArrowLeft, Camera, Sparkles, AlertCircle, Plus, Flame, TrendingUp, X, Loader2 } from "lucide-react"

interface CaloriesTrackerProps {
  onBack?: () => void
}

interface FoodEntry {
  id: string
  name: string
  calories: number
  time: string
  image?: string
}

export function CaloriesTracker({ onBack }: CaloriesTrackerProps) {
  const [todayCalories, setTodayCalories] = useState(1450)
  const [target] = useState(2000)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [analyzedFood, setAnalyzedFood] = useState<{ name: string; calories: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [entries, setEntries] = useState<FoodEntry[]>([
    { id: "1", name: "Avena con frutas", calories: 320, time: "8:30 AM" },
    { id: "2", name: "Ensalada cesar", calories: 450, time: "1:00 PM" },
    { id: "3", name: "Manzana", calories: 95, time: "4:00 PM" },
    { id: "4", name: "Pollo a la plancha", calories: 585, time: "7:30 PM" },
  ])

  const progress = (todayCalories / target) * 100
  const remaining = target - todayCalories

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsAnalyzing(true)
      // Simular analisis de IA
      setTimeout(() => {
        const foods = [
          { name: "Sandwich de pollo", calories: 380 },
          { name: "Pasta con salsa", calories: 520 },
          { name: "Hamburguesa", calories: 650 },
          { name: "Pizza (2 rebanadas)", calories: 540 },
          { name: "Tacos (3 piezas)", calories: 480 },
          { name: "Sushi roll", calories: 350 },
        ]
        const randomFood = foods[Math.floor(Math.random() * foods.length)]
        setAnalyzedFood(randomFood)
        setIsAnalyzing(false)
        setShowResult(true)
      }, 2000)
    }
  }

  const addAnalyzedFood = () => {
    if (analyzedFood) {
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        name: analyzedFood.name,
        calories: analyzedFood.calories,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      }
      setEntries([...entries, newEntry])
      setTodayCalories(todayCalories + analyzedFood.calories)
      setShowResult(false)
      setAnalyzedFood(null)
    }
  }

  const weekData = [
    { day: "L", calories: 1850, target: 2000 },
    { day: "M", calories: 2100, target: 2000 },
    { day: "X", calories: 1920, target: 2000 },
    { day: "J", calories: 1780, target: 2000 },
    { day: "V", calories: 2050, target: 2000 },
    { day: "S", calories: todayCalories, target: 2000 },
    { day: "D", calories: 0, target: 2000 },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange}
        className="hidden" 
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 pt-12 pb-8 px-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-white" />
          <span className="text-sm text-white/90">Analisis con IA</span>
        </div>
        <h1 className="text-2xl font-semibold text-white">Calorias</h1>
        <p className="text-sm text-white/80 mt-1">Escanea tu comida para estimar calorias</p>
      </div>

      <div className="px-6 py-4 -mt-4">
        {/* Disclaimer */}
        <div className="bg-amber-500/10 rounded-xl p-3 mb-4 flex items-start gap-2 border border-amber-500/20">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">
            Las calorias son <strong>aproximadas</strong> y estimadas por IA. Para calculos precisos, consulta con un nutriologo.
          </p>
        </div>

        {/* Main tracker card */}
        <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg mb-6">
          {/* Circular progress */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * Math.min(progress, 100)) / 100}
                className={`transition-all duration-500 ${
                  progress > 100 ? 'text-red-500' : 'text-amber-500'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{todayCalories}</span>
              <span className="text-xs text-muted-foreground">de {target} kcal</span>
            </div>
          </div>

          {/* Remaining */}
          <div className="text-center mb-6">
            {remaining > 0 ? (
              <p className="text-sm text-muted-foreground">
                Te quedan <span className="text-amber-500 font-semibold">{remaining}</span> kcal
              </p>
            ) : (
              <p className="text-sm text-red-500">
                Excediste tu meta por <span className="font-semibold">{Math.abs(remaining)}</span> kcal
              </p>
            )}
          </div>

          {/* Scan button */}
          <button 
            onClick={handlePhotoCapture}
            disabled={isAnalyzing}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analizando comida...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Escanear comida
              </>
            )}
          </button>
        </div>

        {/* Analysis result modal */}
        {showResult && analyzedFood && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-card rounded-3xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Resultado del analisis</h3>
                <button onClick={() => setShowResult(false)} className="text-muted-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-amber-500/10 rounded-2xl p-4 mb-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{analyzedFood.name}</p>
                  <p className="text-2xl font-bold text-amber-500">{analyzedFood.calories} kcal</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 text-center">
                Esta es una estimacion aproximada basada en IA
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResult(false)}
                  className="flex-1 py-3 border border-border rounded-xl text-sm font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={addAnalyzedFood}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-medium"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Promedio</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">1,940</p>
            <p className="text-xs text-muted-foreground">kcal/dia</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Esta semana</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">97%</p>
            <p className="text-xs text-muted-foreground">en meta</p>
          </div>
        </div>

        {/* Week chart */}
        <div className="bg-card rounded-2xl p-4 border border-border/50 mb-6">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Esta semana</h3>
          <div className="flex justify-between items-end gap-2">
            {weekData.map((day, index) => {
              const heightPercent = (day.calories / 2500) * 100
              const isOverTarget = day.calories > day.target
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-secondary rounded-full h-20 relative overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                        isOverTarget ? 'bg-red-400' : 'bg-amber-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Target line */}
                    <div 
                      className="absolute w-full h-0.5 bg-amber-600/50"
                      style={{ bottom: `${(day.target / 2500) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${index === 5 ? 'text-amber-500 font-medium' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's entries */}
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Registro de hoy
        </h3>
        <div className="space-y-2">
          {entries.map(entry => (
            <div key={entry.id} className="bg-card rounded-xl p-3 border border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <span className="text-lg">
                    {entry.name.includes("Avena") ? "🥣" : 
                     entry.name.includes("Ensalada") ? "🥗" :
                     entry.name.includes("Manzana") ? "🍎" :
                     entry.name.includes("Pollo") ? "🍗" : "🍽️"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.time}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-amber-500">{entry.calories} kcal</p>
            </div>
          ))}
        </div>

        {/* Add manual */}
        <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar manualmente
        </button>
      </div>
    </div>
  )
}
