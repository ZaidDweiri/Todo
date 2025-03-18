export interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

