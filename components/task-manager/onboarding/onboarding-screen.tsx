"use client"

import { useState } from "react"
import { ArrowRight, Sparkles, CheckCircle2, Target, Calendar, Brain } from "lucide-react"
import Image from "next/image"

interface OnboardingScreenProps {
  onComplete: () => void
}

const onboardingSteps = [
  {
    id: 1,
    title: "Bienvenido a Tasky",
    subtitle: "Tu asistente de productividad personal",
    description: "Organiza tu vida con inteligencia artificial. Tasky aprende de tus habitos para ayudarte a ser mas productivo.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Planifica con IA",
    subtitle: "Deja que la IA organice tu dia",
    description: "Nuestra IA analiza tus tareas y crea horarios optimizados basados en tu energia y disponibilidad.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    icon: Brain,
  },
  {
    id: 3,
    title: "Construye habitos",
    subtitle: "Pequenos pasos, grandes cambios",
    description: "Rastrea tus habitos diarios, mantén tus rachas y alcanza tus metas con recordatorios inteligentes.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
    icon: Target,
  },
  {
    id: 4,
    title: "Todo listo",
    subtitle: "Empieza a ser mas productivo",
    description: "Tu espacio de trabajo esta configurado. Comienza agregando tu primera tarea o deja que la IA te guie.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80",
    icon: CheckCircle2,
  },
]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Image section */}
      <div className="relative h-[55vh] overflow-hidden">
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        
        {/* Skip button */}
        {!isLastStep && (
          <button 
            onClick={handleSkip}
            className="absolute top-14 right-6 text-sm text-white/80 font-medium"
          >
            Omitir
          </button>
        )}

        {/* Icon overlay */}
        <div className="absolute bottom-8 left-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-3">
            <step.icon className="w-7 h-7 text-primary" />
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="flex-1 px-6 py-6 flex flex-col">
        {/* Progress indicators */}
        <div className="flex gap-2 mb-6">
          {onboardingSteps.map((_, index) => (
            <div 
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index <= currentStep ? 'bg-primary' : 'bg-secondary'
              }`}
            />
          ))}
        </div>

        {/* Text content */}
        <div className="flex-1">
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-2">
            {step.subtitle}
          </p>
          <h1 className="text-2xl font-semibold text-foreground mb-3 text-balance">
            {step.title}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
            {step.description}
          </p>

          {/* Feature highlights for last step */}
          {isLastStep && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-foreground">Planificacion inteligente</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <Target className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground">Seguimiento de habitos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl">
                <Sparkles className="w-5 h-5 text-chart-4" />
                <span className="text-sm text-foreground">Sugerencias de IA</span>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <button 
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 mt-6 active:scale-[0.98] transition-transform"
        >
          {isLastStep ? "Comenzar" : "Continuar"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
