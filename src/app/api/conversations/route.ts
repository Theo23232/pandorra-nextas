import {NextRequest , NextResponse} from 'next/server';


import { currentUser } from '@/lib/current-user';
import {chatService} from "@/features/injection";



export async  function GET() {
  try{
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated", }, { status: 403 })
    const conversations = await chatService.getUserConversations(user.id);

    return NextResponse.json(conversations)
  }catch (error) {
    console.error(error);
    return NextResponse.json(
        { success: false, message: "Failed to fetch conversations", status: 500 },
    )
  }
}

