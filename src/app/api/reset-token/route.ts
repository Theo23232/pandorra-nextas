import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Récupérer tous les utilisateurs avec leurs emails
        const users = await prisma.user.updateMany({
            where: {
                plan: "Free"
            }, data: {
                jeton: 0
            }
        });

        return NextResponse.json({})

    } catch (error) {
        console.error('Erreur lors de l\'export des emails:', error);
        return NextResponse.json({
            message: 'Erreur lors de la récupération des emails',
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}