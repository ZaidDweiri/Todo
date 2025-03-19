import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId, isAuthenticated } from "@/lib/auth";

/**
 * GET /api/tasks/[id]
 * 
 * Fetch a specific task by ID.
 * - Ensures the task belongs to the authenticated user for security.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Step 1: Await params to access properties
    const { id: taskId } = await context.params;

    // Step 2: Check if the user is authenticated
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "You must be logged in to view a task" }, { status: 401 });
    }

    // Step 3: Get the current user's ID
    const userId = await getCurrentUserId();

    // Step 4: Fetch the task from the database
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // Step 5: Handle task not found
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 6: Ensure the task belongs to the authenticated user
    if (task.userId !== userId) {
      return NextResponse.json({ error: "You don't have permission to view this task" }, { status: 403 });
    }

    // Step 7: Return the task data
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

/**
 * PUT /api/tasks/[id]
 * 
 * Update a specific task by ID.
 * - Ensures the task belongs to the authenticated user for security.
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Step 1: Await params to access properties
    const { id: taskId } = await context.params;

    // Step 2: Check if the user is authenticated
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "You must be logged in to update a task" }, { status: 401 });
    }

    // Step 3: Get the current user's ID
    const userId = await getCurrentUserId();

    // Step 4: Fetch the task from the database
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // Step 5: Handle task not found
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 6: Ensure the task belongs to the authenticated user
    if (existingTask.userId !== userId) {
      return NextResponse.json({ error: "You don't have permission to update this task" }, { status: 403 });
    }

    // Step 7: Parse the request body for updates
    const body = await request.json();

    // Step 8: Validate the status field if provided
    const validStatuses = ["pending", "in-progress", "completed"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Status must be one of: pending, in-progress, completed" }, { status: 400 });
    }

    // Step 9: Update the task in the database
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title !== undefined ? body.title.trim() : undefined,
        description: body.description !== undefined ? (body.description ? body.description.trim() : null) : undefined,
        status: body.status !== undefined ? body.status : undefined,
      },
    });

    // Step 10: Return the updated task
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

/**
 * DELETE /api/tasks/[id]
 * 
 * Delete a specific task by ID.
 * - Ensures the task belongs to the authenticated user for security.
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Step 1: Await params to access properties
    const { id: taskId } = await context.params;

    // Step 2: Check if the user is authenticated
    if (!isAuthenticated()) {
      return NextResponse.json({ error: "You must be logged in to delete a task" }, { status: 401 });
    }

    // Step 3: Get the current user's ID
    const userId = await getCurrentUserId();

    // Step 4: Fetch the task from the database
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    // Step 5: Handle task not found
    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Step 6: Ensure the task belongs to the authenticated user
    if (existingTask.userId !== userId) {
      return NextResponse.json({ error: "You don't have permission to delete this task" }, { status: 403 });
    }

    // Step 7: Delete the task from the database
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Step 8: Return a success message
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
