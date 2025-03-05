import { NextRequest, NextResponse } from 'next/server';

import { sortTaskStatus } from '@/actions/task.actions';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { status, newOrder } = body;

    // Validate the input
    if (typeof status !== "string" || typeof newOrder !== "number") {
      return NextResponse.json(
        {
          error:
            "Invalid input. Status must be a string and newOrder must be a number.",
        },
        { status: 400 }
      );
    }

    // Call the sortTaskStatus function with the parsed parameters
    await sortTaskStatus(status, newOrder);

    // Return a success response
    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error sorting task status:", error);
    return NextResponse.json(
      { error: "An error occurred while sorting task status" },
      { status: 500 }
    );
  }
}
