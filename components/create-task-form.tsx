"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Task } from "@/types/task"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { PlusCircle, Loader2, Clock, CheckCircle2, CircleAlert, CalendarIcon, AlertCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"

interface CreateTaskFormProps {
  onTaskCreated: (task: Task) => void
}

export default function CreateTaskForm({ onTaskCreated }: CreateTaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState(1)
  const [formTab, setFormTab] = useState("basic")
  const [charCount, setCharCount] = useState(0)
  const [formTouched, setFormTouched] = useState(false)

  const MAX_DESCRIPTION_LENGTH = 500

  useEffect(() => {
    setCharCount(description.length)
  }, [description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Title is required", {
        description: "Please enter a title for your task",
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          status,
          dueDate,
          priority,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const newTask = await response.json()
      onTaskCreated(newTask)

      // Reset form
      setTitle("")
      setDescription("")
      setStatus("pending")
      setDueDate(undefined)
      setPriority(1)
      setFormTouched(false)

      toast.success("Task created successfully", {
        description: "Your new task has been added to your list",
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task", {
        description: "Please try again or contact support if the issue persists",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("pending")
    setDueDate(undefined)
    setPriority(1)
    setFormTouched(false)
    toast("Form reset", {
      description: "All fields have been cleared",
    })
  }

  // Status badge and icon mapping
  const statusConfig = {
    pending: {
      badge: (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Pending
        </Badge>
      ),
      icon: <CircleAlert className="h-4 w-4 text-yellow-500 mr-2" />,
      color: "bg-yellow-100",
    },
    "in-progress": {
      badge: (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          In Progress
        </Badge>
      ),
      icon: <Clock className="h-4 w-4 text-blue-500 mr-2" />,
      color: "bg-blue-100",
    },
    completed: {
      badge: (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Completed
        </Badge>
      ),
      icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />,
      color: "bg-green-100",
    },
  }

  // Priority level labels
  const getPriorityLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Low"
      case 2:
        return "Medium"
      case 3:
        return "High"
      default:
        return "Low"
    }
  }

  const getPriorityColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-700"
      case 2:
        return "bg-yellow-100 text-yellow-700"
      case 3:
        return "bg-red-100 text-red-700"
      default:
        return "bg-green-100 text-green-700"
    }
  }

  const handleInputChange = () => {
    if (!formTouched) setFormTouched(true)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="shadow-lg border-slate-200 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500"></div>
        <CardHeader className="pb-3 bg-slate-50">
          <CardTitle className="text-xl font-semibold flex items-center">
            <PlusCircle className="mr-2 h-5 w-5 text-primary" />
            Create New Task
          </CardTitle>
          <CardDescription>Add a new task to your project and track its progress</CardDescription>
        </CardHeader>

        <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details & Options</TabsTrigger>
            </TabsList>
          </div>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="m-0">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-medium text-sm flex items-center">
                      Task Title <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        handleInputChange()
                      }}
                      required
                      className="focus-visible:ring-primary transition-shadow"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description" className="font-medium text-sm">
                        Description <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                      </Label>
                      <span
                        className={cn(
                          "text-xs",
                          charCount > MAX_DESCRIPTION_LENGTH ? "text-red-500" : "text-muted-foreground",
                        )}
                      >
                        {charCount}/{MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
                        handleInputChange()
                      }}
                      rows={4}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      className="resize-none focus-visible:ring-primary transition-shadow"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="font-medium text-sm">
                      Status
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <div
                          key={key}
                          onClick={() => {
                            setStatus(key)
                            handleInputChange()
                          }}
                          className={cn(
                            "flex items-center justify-center p-2 rounded-md cursor-pointer border transition-all",
                            status === key
                              ? `${config.color} border-2 border-primary/50`
                              : "bg-background hover:bg-slate-50 border-slate-200",
                          )}
                        >
                          {config.icon}
                          <span className="text-sm font-medium">
                            {key === "in-progress" ? "In Progress" : key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="details" className="m-0">
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="font-medium text-sm">
                      Due Date <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dueDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={(date) => {
                            setDueDate(date)
                            handleInputChange()
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium text-sm">Priority Level</Label>
                      <div className="mt-2">
                        <Slider
                          defaultValue={[priority]}
                          max={3}
                          min={1}
                          step={1}
                          onValueChange={(value) => {
                            setPriority(value[0])
                            handleInputChange()
                          }}
                          className="py-4"
                        />
                        <div className="flex justify-between items-center mt-1">
                          <Badge className={cn("font-medium", getPriorityColor(priority))}>
                            {getPriorityLabel(priority)} Priority
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {priority === 1 && "Less urgent tasks"}
                            {priority === 2 && "Moderately important"}
                            {priority === 3 && "Critical tasks"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6 bg-slate-50 mt-4">
              <Button
                type="submit"
                className="w-full sm:w-2/3 transition-all"
                disabled={isSubmitting || !title.trim()}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Task...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Task
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-1/3"
                onClick={resetForm}
                disabled={isSubmitting || !formTouched}
              >
                Reset Form
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
    </motion.div>
  )
}

