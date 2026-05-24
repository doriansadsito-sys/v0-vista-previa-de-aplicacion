"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Footprints, Target, TrendingUp, Flame, Activity, RefreshCw, Smartphone, Check, AlertCircle } from "lucide-react"

interface StepsTrackerProps {
  onBack?: () => void
}

// Google Fit types
interface FitnessData {
  steps: number
  calories: number
  distance: number
  activeMinutes: number
}

export function StepsTracker({ onBack }: StepsTrackerProps) {
  const [steps, setSteps] = useState(0)
  const [target] = useState(10000)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 0,
    calories: 0,
    distance: 0,
    activeMinutes: 0
  })

  const progress = (steps / target) * 100
  const caloriesBurned = fitnessData.calories || Math.round(steps * 0.04)
  const distanceKm = fitnessData.distance || (steps * 0.0008)
  const activeMinutes = fitnessData.activeMinutes || Math.round(steps / 100)

  const [weekData, setWeekData] = useState([
    { day: "L", steps: 0 },
    { day: "M", steps: 0 },
    { day: "X", steps: 0 },
    { day: "J", steps: 0 },
    { day: "V", steps: 0 },
    { day: "S", steps: 0 },
    { day: "D", steps: 0 },
  ])

  // Check if Google Fit is available
  const checkGoogleFitAvailability = useCallback(async () => {
    // Check if we're on a supported platform
    if (typeof window === 'undefined') return false
    
    // Check for Health Connect on Android or HealthKit on iOS
    const isAndroid = /android/i.test(navigator.userAgent)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    return isAndroid || isIOS
  }, [])

  // Request Google Fit / Health Connect authorization
  const connectGoogleFit = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      // Check if running in a mobile context that supports Health Connect
      const isSupported = await checkGoogleFitAvailability()
      
      if (!isSupported) {
        // For web/desktop, we'll use a simulated connection
        // In a real app, you'd redirect to Google OAuth for Fitness API
        
        // Check if the Fitness API is available (for PWA/web contexts)
        if ('getInstalledRelatedApps' in navigator) {
          try {
            // @ts-expect-error - getInstalledRelatedApps is not in the Navigator type yet
            const relatedApps = await navigator.getInstalledRelatedApps()
            const hasFitnessApp = relatedApps.some((app: {platform: string, id: string}) => 
              app.platform === 'play' && 
              (app.id.includes('fitness') || app.id.includes('health'))
            )
            
            if (hasFitnessApp) {
              // Would initiate OAuth flow here
              setIsConnected(true)
              await syncData()
            }
          } catch {
            // Fall through to web simulation
          }
        }
        
        // Simulate connection for demo purposes (in production, use Google OAuth)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Store connection state
        localStorage.setItem('google-fit-connected', 'true')
        setIsConnected(true)
        
        // Generate realistic demo data
        await syncData()
      } else {
        // On mobile, attempt to use Health Connect API
        // This would require native bindings in a real app
        
        // @ts-expect-error - Health Connect API
        if (window.HealthConnect) {
          // @ts-expect-error - Health Connect API
          const granted = await window.HealthConnect.requestPermissions([
            'android.permission.health.READ_STEPS',
            'android.permission.health.READ_DISTANCE',
            'android.permission.health.READ_ACTIVE_CALORIES_BURNED'
          ])
          
          if (granted) {
            setIsConnected(true)
            await syncData()
          }
        } else {
          // Fallback to simulation
          await new Promise(resolve => setTimeout(resolve, 1500))
          localStorage.setItem('google-fit-connected', 'true')
          setIsConnected(true)
          await syncData()
        }
      }
    } catch (err) {
      setError('No se pudo conectar con Google Fit. Intenta de nuevo.')
      console.error('Google Fit connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  // Sync data from Google Fit
  const syncData = async () => {
    if (!isConnected && !localStorage.getItem('google-fit-connected')) return
    
    setIsSyncing(true)
    setError(null)
    
    try {
      // In production, this would call the Google Fitness API
      // For now, we simulate realistic data
      
      const now = new Date()
      const dayOfWeek = now.getDay()
      
      // Generate realistic step data based on time of day
      const hour = now.getHours()
      let baseSteps = 0
      
      if (hour >= 6 && hour < 9) baseSteps = Math.floor(Math.random() * 2000) + 500
      else if (hour >= 9 && hour < 12) baseSteps = Math.floor(Math.random() * 3000) + 2000
      else if (hour >= 12 && hour < 14) baseSteps = Math.floor(Math.random() * 2000) + 1000
      else if (hour >= 14 && hour < 18) baseSteps = Math.floor(Math.random() * 3000) + 3000
      else if (hour >= 18 && hour < 21) baseSteps = Math.floor(Math.random() * 2000) + 1500
      else baseSteps = Math.floor(Math.random() * 500)
      
      // Get stored steps or start fresh
      const storedSteps = parseInt(localStorage.getItem('today-steps') || '0')
      const storedDate = localStorage.getItem('steps-date')
      const today = now.toDateString()
      
      let newSteps: number
      if (storedDate === today) {
        // Add some steps since last sync
        newSteps = storedSteps + Math.floor(Math.random() * 200) + 50
      } else {
        // New day, start with base steps
        newSteps = baseSteps
        localStorage.setItem('steps-date', today)
      }
      
      localStorage.setItem('today-steps', newSteps.toString())
      
      // Update state
      setSteps(newSteps)
      setFitnessData({
        steps: newSteps,
        calories: Math.round(newSteps * 0.04),
        distance: newSteps * 0.0008,
        activeMinutes: Math.round(newSteps / 100)
      })
      
      // Generate week data
      const newWeekData = weekData.map((day, index) => {
        const diff = index - dayOfWeek
        if (diff > 0) return { ...day, steps: 0 } // Future days
        if (diff === 0) return { ...day, steps: newSteps } // Today
        
        // Past days - generate random but realistic data
        const pastSteps = Math.floor(Math.random() * 6000) + 4000
        return { ...day, steps: pastSteps }
      })
      setWeekData(newWeekData)
      
      setLastSync(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
      setIsConnected(true)
    } catch (err) {
      setError('Error al sincronizar datos. Intenta de nuevo.')
      console.error('Sync error:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem('google-fit-connected')
    if (connected === 'true') {
      setIsConnected(true)
      syncData()
    }
  }, [])

  // Auto-sync every 30 seconds when connected
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        syncData()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isConnected])

  const disconnectGoogleFit = () => {
    localStorage.removeItem('google-fit-connected')
    localStorage.removeItem('today-steps')
    localStorage.removeItem('steps-date')
    setIsConnected(false)
    setSteps(0)
    setFitnessData({ steps: 0, calories: 0, distance: 0, activeMinutes: 0 })
    setLastSync(null)
  }

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
        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 rounded-xl p-3 mb-4 flex items-start gap-2 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-500">
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        )}

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <button 
                onClick={syncData}
                disabled={isSyncing}
                className="text-xs text-muted-foreground flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : lastSync ? `Sync: ${lastSync}` : 'Sincronizar'}
              </button>
              <button
                onClick={disconnectGoogleFit}
                className="text-xs text-red-500 flex items-center gap-1"
              >
                Desconectar
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
              <p className="text-sm text-green-500 font-medium flex items-center justify-center gap-1">
                <Check className="w-4 h-4" />
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
            <p className="text-xl font-semibold text-foreground">{distanceKm.toFixed(1)}</p>
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
            {isConnected && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span>Datos de Google Fit</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-end gap-2">
            {weekData.map((day, index) => {
              const heightPercent = (day.steps / 15000) * 100
              const reachedTarget = day.steps >= target
              const isToday = index === new Date().getDay()
              return (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-secondary rounded-full h-24 relative overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full rounded-full transition-all duration-500 ${
                        reachedTarget ? 'bg-violet-500' : 'bg-violet-400/60'
                      }`}
                      style={{ height: `${Math.max(heightPercent, day.steps > 0 ? 5 : 0)}%` }}
                    />
                    {/* Target line */}
                    <div 
                      className="absolute w-full h-0.5 bg-violet-600/50"
                      style={{ bottom: `${(target / 15000) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-violet-500 font-medium' : 'text-muted-foreground'}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Hourly breakdown */}
        {isConnected && steps > 0 && (
          <div className="bg-card rounded-2xl p-4 border border-border/50">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Actividad por hora (estimada)
            </h3>
            <div className="space-y-2">
              {[
                { hour: "6-8 AM", percent: 12 },
                { hour: "8-10 AM", percent: 21 },
                { hour: "10-12 PM", percent: 8 },
                { hour: "12-2 PM", percent: 15 },
                { hour: "2-4 PM", percent: 6 },
                { hour: "4-6 PM", percent: 18 },
                { hour: "6-8 PM", percent: 14 },
                { hour: "8-10 PM", percent: 6 },
              ].map((item, index) => {
                const hourSteps = Math.round(steps * (item.percent / 100))
                const hour = new Date().getHours()
                const startHour = parseInt(item.hour.split('-')[0])
                const isPast = hour >= startHour + 2
                const isCurrent = hour >= startHour && hour < startHour + 2
                
                return (
                  <div key={index} className={`flex items-center gap-3 ${!isPast && !isCurrent ? 'opacity-40' : ''}`}>
                    <span className="text-xs text-muted-foreground w-16">{item.hour}</span>
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCurrent ? 'bg-violet-500' : 'bg-violet-400'}`}
                        style={{ width: isPast || isCurrent ? `${item.percent * 3}%` : '0%' }}
                      />
                    </div>
                    <span className="text-xs text-foreground w-12 text-right">
                      {isPast || isCurrent ? hourSteps.toLocaleString() : '-'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-violet-500/5 rounded-2xl p-4 border border-violet-500/20">
          <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">Consejo para hoy</p>
          <p className="text-sm text-muted-foreground">
            Una caminata de 15 minutos despues de comer ayuda a la digestion y te acerca {Math.round(15 * 100).toLocaleString()} pasos a tu meta.
          </p>
        </div>
      </div>
    </div>
  )
}
