"use client"

import { useState } from "react"
import { Header } from "@/components/task-manager/header"
import { StatsRow } from "@/components/task-manager/stats-row"
import { QuickActions, ActionType } from "@/components/task-manager/quick-actions"
import { TaskList } from "@/components/task-manager/task-list"
import { BottomNav, NavTab } from "@/components/task-manager/bottom-nav"
import { AIPlannerModal } from "@/components/task-manager/ai-planner-modal"
import { NewProjectModal } from "@/components/task-manager/new-project-modal"
import { PendingTasksModal } from "@/components/task-manager/pending-tasks-modal"
import { FocusModeModal } from "@/components/task-manager/focus-mode-modal"
import { HabitsScreen } from "@/components/task-manager/habits-screen"
import { OnboardingScreen } from "@/components/task-manager/onboarding/onboarding-screen"
import { ProfileScreen } from "@/components/task-manager/profile/profile-screen"
import { NotificationsScreen } from "@/components/task-manager/notifications/notifications-screen"

export default function TaskManagerHome() {
  const [activeModal, setActiveModal] = useState<ActionType | null>(null)
  const [activeTab, setActiveTab] = useState<NavTab>("home")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const handleActionClick = (action: ActionType) => {
    setActiveModal(action)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  // Show Onboarding for first-time users
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <OnboardingScreen onComplete={() => setShowOnboarding(false)} />
      </div>
    )
  }

  // Show Notifications Screen
  if (showNotifications) {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto">
        <NotificationsScreen onBack={() => setShowNotifications(false)} />
      </div>
    )
  }

  // Show Profile Screen
  if (activeTab === "profile") {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        <ProfileScreen onBack={() => setActiveTab("home")} />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  // Show Habits Screen
  if (activeTab === "habits") {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto relative">
        <HabitsScreen onBack={() => setActiveTab("home")} />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      {/* Main content area with scroll */}
      <div className="pb-28 overflow-y-auto">
        <Header 
          userName="Maria" 
          pendingTasks={4} 
          onNotificationsClick={() => setShowNotifications(true)}
        />
        
        <StatsRow 
          stats={{
            pending: 4,
            completed: 12,
            highPriority: 2,
            overdue: 1
          }}
        />

        <QuickActions onActionClick={handleActionClick} />
        
        <TaskList />
      </div>

      {/* Fixed bottom navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <AIPlannerModal isOpen={activeModal === "planner"} onClose={closeModal} />
      <NewProjectModal isOpen={activeModal === "project"} onClose={closeModal} />
      <PendingTasksModal isOpen={activeModal === "pending"} onClose={closeModal} />
      <FocusModeModal isOpen={activeModal === "focus"} onClose={closeModal} />
    </div>
  )
}
