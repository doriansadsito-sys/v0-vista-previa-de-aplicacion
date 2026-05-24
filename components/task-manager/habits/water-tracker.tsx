"use client"

import { useState } from "react"
import { ArrowLeft, Droplets, Plus, Minus, Target, TrendingUp } from "lucide-react"

interface WaterTrackerProps {
  onBack?: () => void
}

export function WaterTracker({ onBack }: WaterTrackerProps) {
  const [glasses, setGlasses] = useState(3)
  const target = 8
  const progress = (glasses / target) * 100

  const addGlass = () => {
    if (glasses < 12) setGlasses(glasses + 1)
  }

  const removeGlass = () => {
    if (glasses > 0) setGlasses(glasses - 1)
  }

  const weekData = [
    { day: "L", glasses: 8, target: 8 },
    { day: "M", glasses: 7, target: 8 },
    { day: "X", glasses: 8, target: 8 },
    { day: "J", glasses: 6, target: 8 },
    { day: "V", glasses: 5, target: 8 },
    { day: "S", glasses: glasses, target: 8 },
    { day: "D", glasses: 0, target: 8 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 pt-12 pb-8 px-6">
        <button 
          onClick={onBack}
          className="absolute top-12 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="text-center mt-8">
          <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white">Hidratacion</h1>
          <p className="text-sm text-white/80 mt-1">Meta diaria: {target} vasos de agua</p>
        </div>
      </div>

      <div className="px-6 py-6 -mt-4">
        {/* Main tracker card */}
        <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg mb-6">
          {/* Circular progress */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={553}
                strokeDashoffset={553 - (553 * progress) / 100}
                className="text-sky-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-foreground">{glasses}</span>
              <span className="text-sm text-muted-foreground">de {target} vasos</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8">
            <button 
              onClick={removeGlass}
              disabled={glasses === 0}
              className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
            >
              <Minus className="w-6 h-6 text-foreground" />
            </button>
            <button 
              onClick={addGlass}
              disabled={glasses >= 12}
              className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-sky-500/30"
            >
              <Plus className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Quick add */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setGlasses(Math.min(12, glasses + num))}
                className="px-4 py-2 rounded-full bg-sky-500/10 text-sky-600 text-sm font-medium"
              >
                +{num} vaso{num > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-sky-500" />
              <span className="text-xs text-muted-foreground">Progreso</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{Math.round(progress)}%</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Racha</span>
            </div>
            <p className="text-2xl font-semibold text-foreground">5 dias</p>
          </div>
        </div>

        {/* Week chart */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Esta semana</h3>
          <div className="flex justify-between items-end gap-2">
            {weekData.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-secondary rounded-full h-24 relative overflow-hidden">
                  <div 
                    className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                      day.glasses >= day.target ? 'bg-sky-500' : 'bg-sky-400/60'
                    }`}
                    style={{ height: `${(day.glasses / day.target) * 100}%` }}
                  />
                </div>
                <span className={`text-xs ${index === 5 ? 'text-sky-500 font-medium' : 'text-muted-foreground'}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-sky-500/5 rounded-2xl p-4 border border-sky-500/20">
          <p className="text-xs font-medium text-sky-600 mb-1">Consejo del dia</p>
          <p className="text-sm text-muted-foreground">
            Bebe un vaso de agua al despertar para activar tu metabolismo y rehidratar tu cuerpo despues de dormir.
          </p>
        </div>
      </div>
    </div>
  )
}
