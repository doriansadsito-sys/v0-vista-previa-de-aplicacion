"use client"

import { useState } from "react"
import { Check, Flag, MoreHorizontal } from "lucide-react"

interface Task {
  id: string
  title: string
  dueTime?: string
  priority: "low" | "medium" | "high"
  completed: boolean
  category: string
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
}

function TaskItem({ task, onToggle }: TaskItemProps) {
  const priorityColors = {
    low: "bg-muted",
    medium: "bg-primary/20",
    high: "bg-accent/30"
  }

  return (
    <div className={`flex items-center gap-4 p-4 bg-card rounded-2xl border border-border/50 shadow-sm transition-all duration-200 ${task.completed ? "opacity-60" : ""}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          task.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary/50"
        }`}
      >
        {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-foreground ${task.completed ? "line-through text-muted-foreground" : ""}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{task.category}</span>
          {task.dueTime && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{task.dueTime}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {task.priority === "high" && (
          <Flag className="w-4 h-4 text-accent" />
        )}
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
        <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
          <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Revisar propuesta de diseño",
    dueTime: "10:00 AM",
    priority: "high",
    completed: false,
    category: "Trabajo"
  },
  {
    id: "2",
    title: "Llamar al cliente de marketing",
    dueTime: "2:00 PM",
    priority: "medium",
    completed: false,
    category: "Reuniones"
  },
  {
    id: "3",
    title: "Actualizar portfolio personal",
    priority: "low",
    completed: true,
    category: "Personal"
  },
  {
    id: "4",
    title: "Enviar reporte semanal",
    dueTime: "5:00 PM",
    priority: "high",
    completed: false,
    category: "Trabajo"
  },
  {
    id: "5",
    title: "Planificar vacaciones",
    priority: "low",
    completed: false,
    category: "Personal"
  }
]

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const pendingTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <section className="px-6 py-4 flex-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Hoy
        </h2>
        <span className="text-xs text-muted-foreground">
          {pendingTasks.length} pendientes
        </span>
      </div>
      
      <div className="space-y-3">
        {pendingTasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} />
        ))}
        
        {completedTasks.length > 0 && (
          <>
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">Completadas</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} />
            ))}
          </>
        )}
      </div>
    </section>
  )
}
