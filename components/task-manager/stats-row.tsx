"use client"

interface StatsCardProps {
  label: string
  value: number
  color?: "default" | "accent" | "muted"
}

function StatsCard({ label, value, color = "default" }: StatsCardProps) {
  const colorClasses = {
    default: "text-foreground",
    accent: "text-accent",
    muted: "text-muted-foreground"
  }

  return (
    <div className="bg-card rounded-2xl p-4 min-w-[100px] shadow-sm border border-border/50">
      <p className={`text-3xl font-semibold ${colorClasses[color]}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

interface StatsRowProps {
  stats: {
    pending: number
    completed: number
    highPriority: number
    overdue: number
  }
}

export function StatsRow({ stats }: StatsRowProps) {
  return (
    <section className="px-6 py-4">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Resumen
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        <StatsCard label="Pendientes" value={stats.pending} />
        <StatsCard label="Completadas" value={stats.completed} color="muted" />
        <StatsCard label="Prioridad alta" value={stats.highPriority} color="accent" />
        <StatsCard label="Vencidas" value={stats.overdue} color="accent" />
      </div>
    </section>
  )
}
