import { NextResponse } from 'next/server';

import { pusherServer } from '@/pusher';

// Variable globale pour suivre le nombre d'utilisateurs
let activeUsers = 0;

export async function GET() {
    return NextResponse.json({ count: activeUsers });
}

export async function POST() {
    activeUsers++;
    // Envoi de la mise à jour à tous les clients
    await pusherServer.trigger('presence-channel', 'user-update', { count: activeUsers });
    return NextResponse.json({ success: true, count: activeUsers });
}

export async function DELETE() {
    activeUsers = Math.max(0, activeUsers - 1); // Éviter les nombres négatifs

    // Envoi de la mise à jour à tous les clients
    await pusherServer.trigger('presence-channel', 'user-update', { count: activeUsers });

    return NextResponse.json({ success: true, count: activeUsers });
}