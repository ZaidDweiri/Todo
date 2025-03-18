import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserId, isAuthenticated } from "@/lib/auth";

/**
 * GET /api/tasks
 *
 * Fetches all tasks for the currently logged-in user.
 * This route is protected - only authenticated users can access their tasks.
 */
export async function GET() {
  try {
    // Step 1: Check if the user is authenticated
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: "You must be logged in to view tasks" },
        { status: 401 }
      );
    }

    // Step 2: Get the current user ID from Clerk authentication
    const userId = await getCurrentUserId(); // Await the Promise

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 401 }
      );
    }

    // Step 3: Fetch all tasks belonging to the current user from the database
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Step 4: Return the tasks as JSON
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

/**
 * POST /api/tasks
 *
 * Creates a new task for the currently logged-in user.
 * Requires title in the request body. Description is optional.
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Check if the user is authenticated
    if (!isAuthenticated()) {
      return NextResponse.json(
        { error: "You must be logged in to create tasks" },
        { status: 401 }
      );
    }

    // Step 2: Get the current user ID from Clerk authentication
    const userId = await getCurrentUserId(); // Await the Promise

    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found" },
        { status: 401 }
      );
    }

    // Step 3: Parse the request body to get task data
    const body = await request.json();

    // Step 4: Validate the required fields
    if (!body.title || body.title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Step 5: Validate the status field if provided
    const validStatuses = ["pending", "in-progress", "completed"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Status must be one of: pending, in-progress, completed" },
        { status: 400 }
      );
    }

    // Step 6: Create a new task in the database
    const task = await prisma.task.create({
      data: {
        title: body.title.trim(),
        description: body.description ? body.description.trim() : null,
        status: body.status || "pending",
        userId, // Now userId is a string
      },
    });

    // Step 7: Return the created task with a 201 Created status
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
