import { stringify } from 'csv-stringify';
import { NextRequest, NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Récupérer tous les utilisateurs avec leurs emails
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                plan: true,
                createdAt: true
            }
        });

        // Préparer les données pour le CSV
        const csvData = users.map(user => ({
            id: user.id,
            email: user.email,
            username: user.username,
            plan: user.plan,
            createdAt: user.createdAt.toISOString()
        }));

        // Créer un flux CSV
        const stringifier = stringify({
            header: true,
            columns: [
                'id',
                'email',
                'username',
                'plan',
                'createdAt'
            ]
        });

        // Générer le contenu CSV
        const csvContent = await new Promise<string>((resolve, reject) => {
            const chunks: string[] = [];

            stringifier.on('data', (chunk) => chunks.push(chunk));
            stringifier.on('end', () => resolve(chunks.join('')));
            stringifier.on('error', reject);

            csvData.forEach(user => stringifier.write(user));
            stringifier.end();
        });

        // Retourner la réponse CSV
        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=users_emails.csv'
            }
        });

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