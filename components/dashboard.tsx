"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { UserButton } from "@clerk/nextjs"
import TaskList from "@/components/task-list"
import CreateTaskForm from "@/components/create-task-form"
import type { Task } from "@/types/task"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks")
        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        toast.error("Failed to load tasks. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [toast])

  // Add a new task to the list
  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  // Update a task in the list
  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
  }

  // Remove a task from the list
  const removeTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </header>
      <main className="container px-4 py-6 w-full md:py-8">
        <div className="grid gap-6 md:grid-cols-[1fr_300px]  w-full lg:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <TaskList tasks={tasks} isLoading={isLoading} onTaskUpdate={updateTask} onTaskDelete={removeTask} />
          </div>
          <div className="w-96">
            <h2 className="text-xl font-semibold">Add New Task</h2>
            <CreateTaskForm onTaskCreated={addTask} />
          </div>
        </div>
      </main>
    </div>
  )
}

