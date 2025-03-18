"use client"

import type { Task } from "@/types/task"
import TaskItem from "@/components/task-item"
import { Skeleton } from "@/components/ui/skeleton"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (taskId: string) => void
}

export default function TaskList({ tasks, isLoading, onTaskUpdate, onTaskDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium">No tasks yet</h3>
        <p className="text-muted-foreground mt-1">Create a new task to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onTaskUpdate} onDelete={onTaskDelete} />
      ))}
    </div>
  )
}

