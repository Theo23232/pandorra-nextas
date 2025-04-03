import { NextResponse } from 'next/server';

import { currentUser } from '@/lib/current-user';
import { pusherServer } from '@/pusher';

// Map pour stocker les dernières activités des utilisateurs
// En production, vous voudriez utiliser Redis ou une autre solution persistante
const userLastActive = new Map<string, number>();

// Délai après lequel un utilisateur est considéré comme inactif (15 minutes)
const INACTIVE_THRESHOLD = 15 * 60 * 1000;

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        // Mettre à jour l'horodatage de dernière activité
        userLastActive.set(user.id, Date.now());

        // Diffuser l'événement d'activité à tous les clients
        await pusherServer.trigger('presence-app', 'user-activity-update', {
            activeUserCount: getActiveUserCount()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Activity update error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'activité" },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Nettoyer les entrées obsolètes
    const now = Date.now();
    for (const [userId, lastActive] of userLastActive.entries()) {
        if (now - lastActive > INACTIVE_THRESHOLD) {
            userLastActive.delete(userId);
        }
    }

    return NextResponse.json({
        activeUserCount: getActiveUserCount()
    });
}

// Fonction d'aide pour obtenir le nombre d'utilisateurs actifs
function getActiveUserCount() {
    // Nettoyer les entrées obsolètes
    const now = Date.now();
    for (const [userId, lastActive] of userLastActive.entries()) {
        if (now - lastActive > INACTIVE_THRESHOLD) {
            userLastActive.delete(userId);
        }
    }

    return userLastActive.size;
}