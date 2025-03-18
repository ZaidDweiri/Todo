import { NextResponse } from "next/server"

/**
 * GET /api/test
 *
 * A simple test endpoint to verify the API is working.
 * This endpoint is not protected and can be accessed without authentication.
 */
export async function GET() {
  return NextResponse.json({ message: "API is working!" })
}

