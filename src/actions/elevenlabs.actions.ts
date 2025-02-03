"use server"
import { SA } from '@/lib/safe-ation';
import { prisma } from '@/prisma';

export const generateFX = SA(
  async (user, prompt: string, url: string): Promise<any> => {
    await prisma.fX.create({
      data: {
        userId: user.id,
        prompt,
        url,
      },
    })
  },
)

export const generateTTS = SA(
  async (
    user,
    prompt: string,
    url: string,
    lang: string,
    voice: string,
  ): Promise<any> => {
    await prisma.tTS.create({
      data: {
        userId: user.id,
        prompt,
        url,
        lang,
        voice,
      },
    })
  },
)

export const generateVoiceChange = SA(
  async (user, url: string, voice: string): Promise<any> => {
    await prisma.voiceChange.create({
      data: {
        userId: user.id,
        url,
        voice,
      },
    })
  },
)
