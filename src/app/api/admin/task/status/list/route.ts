import { NextRequest, NextResponse } from 'next/server';

import { TaskStatus } from '@/actions/task.actions';

export async function GET(req: NextRequest) {
  try {
    const status = await TaskStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
