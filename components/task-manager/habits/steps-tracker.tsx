"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Footprints, Target, TrendingUp, Flame, Activity, RefreshCw, Smartphone } from "lucide-react"

interface StepsTrackerProps {
  onBack?: () => void
}

export function StepsTracker({ onBack }: StepsTrackerProps) {
  const [steps, setSteps] = useState(6842)
  const [target] = useState(10000)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const progress = (steps / target) * 100
  const caloriesBurned = Math.round(steps * 0.04)
  const distanceKm = (steps * 0.0008).toFixed(1)
  const activeMinutes = Math.round(steps / 100)

  const weekData = [
    { day: "L", steps: 8500 },
    { day: "M", steps: 12300 },
    { day: "X", steps: 7800 },
    { day: "J", steps: 9200 },
    { day: "V", steps: 11000 },
    { day: "S", steps: steps },
    { day: "D", steps: 0 },
  ]

  const connectGoogleFit = () => {
    setIsConnecting(true)
    // Simular conexion con Google Fit / Health Connect
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
      setLastSync(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
      // Simular datos reales
      setSteps(7234 + Math.floor(Math.random() * 500))
    }, 2000)
  }

  const syncData = () => {
    if (isConnected) {
      setIsConnecting(true)
      setTimeout(() => {
        setSteps(prev => prev + Math.floor(Math.random() * 200))
        setLastSync(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
        setIsConnecting(false)
      }, 1000)
    }
  }

  // Simular actualizacion automatica cada 30 segundos
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setSteps(prev => prev + Math.floor(Math.random() * 50))
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 pt-12 pb-8 px-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="flex items-center gap-2 mb-2">
          <Footprints className="w-5 h-5 text-white" />
          {isConnected && (
            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Google Fit conectado
            </span>
          )}
        </div>
        <h1 className="text-2xl font-semibold text-white">Pasos</h1>
        <p className="text-sm text-white/80 mt-1">Meta diaria: {target.toLocaleString()} pasos</p>
      </div>

      <div className="px-6 py-4 -mt-4">
        {/* Connection card */}
        {!isConnected && (
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-violet-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Conecta Google Fit</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Sincroniza automaticamente tus pasos desde tu telefono o reloj inteligente usando Google Fit / Health Connect.
                </p>
                <button 
                  onClick={connectGoogleFit}
                  disabled={isConnecting}
                  className="w-full py-3 bg-violet-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      Conectar Google Fit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main tracker card */}
        <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-lg mb-6">
          {/* Circular progress */}
          <div className="relative w-48 h-48 mx-auto mb-4">
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
                strokeDashoffset={553 - (553 * Math.min(progress, 100)) / 100}
                className="text-violet-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Footprints className="w-6 h-6 text-violet-500 mb-1" />
              <span className="text-4xl font-bold text-foreground">{steps.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">de {target.toLocaleString()}</span>
            </div>
          </div>

          {/* Sync info */}
          {isConnected && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <button 
                onClick={syncData}
                disabled={isConnecting}
                className="text-xs text-muted-foreground flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                {lastSync ? `Sincronizado: ${lastSync}` : 'Sincronizar'}
              </button>
            </div>
          )}

          {/* Remaining */}
          <div className="text-center">
            {steps < target ? (
              <p className="text-sm text-muted-foreground">
                Te faltan <span className="text-violet-500 font-semibold">{(target - steps).toLocaleString()}</span> pasos
              </p>
            ) : (
              <p className="text-sm text-green-500 font-medium">
                Meta completada! +{(steps - target).toLocaleString()} pasos extra
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <div className="w-8 h-8 mx-auto rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-xl font-semibold text-foreground">{caloriesBurned}</p>
            <p className="text-[10px] text-muted-foreground">CALORIAS</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <div className="w-8 h-8 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl font-semibold text-foreground">{distanceKm}</p>
            <p className="text-[10px] text-muted-foreground">KILOMETROS</p>
          </div>
          <div className="bg-card rounded-2xl p-3 border border-border/50 text-center">
            <div className="w-8 h-8 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-xl font-semibold text-foreground">{activeMinutes}</p>
            <p className="text-[10px] text-muted-foreground">MINUTOS</p>
          </div>
        </div>

        {/* Week chart */}
        <div className="bg-card rounded-2xl p-4 border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Esta semana</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+12% vs semana pasada</span>
            </div>
          </div>
          <div className="flex justify-between items-end gap-2">
            {weekData.map((day, index) => {
              const heightPercent = (day.steps / 15000) * 100
              const reachedTarget = day.steps >= target
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-secondary rounded-full h-24 relative overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                        reachedTarget ? 'bg-violet-500' : 'bg-violet-400/60'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Target line */}
                    <div 
                      className="absolute w-full h-0.5 bg-violet-600/50"
                      style={{ bottom: `${(target / 15000) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${index === 5 ? 'text-violet-500 font-medium' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hourly breakdown */}
        <div className="bg-card rounded-2xl p-4 border border-border/50">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Actividad por hora
          </h3>
          <div className="space-y-2">
            {[
              { hour: "6-8 AM", steps: 1200, percent: 12 },
              { hour: "8-10 AM", steps: 2100, percent: 21 },
              { hour: "10-12 PM", steps: 800, percent: 8 },
              { hour: "12-2 PM", steps: 1500, percent: 15 },
              { hour: "2-4 PM", steps: 600, percent: 6 },
              { hour: "4-6 PM", steps: 642, percent: 6 },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{item.hour}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${item.percent * 3}%` }}
                  />
                </div>
                <span className="text-xs text-foreground w-12 text-right">{item.steps}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-violet-500/5 rounded-2xl p-4 border border-violet-500/20">
          <p className="text-xs font-medium text-violet-600 mb-1">Consejo para hoy</p>
          <p className="text-sm text-muted-foreground">
            Una caminata de 15 minutos despues de comer ayuda a la digestion y te acerca {Math.round(15 * 100).toLocaleString()} pasos a tu meta.
          </p>
        </div>
      </div>
    </div>
  )
}
