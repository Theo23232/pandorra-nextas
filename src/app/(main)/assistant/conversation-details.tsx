"use client"

import { format } from 'date-fns';
import { BotIcon, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { MagicCard } from '@/components/animated/magic-ui/magic-card';
import { Separator } from '@/components/nyxb/separator';
import { Badge } from '@/components/tremor/ui/badge';
import { CardContent, CardTitle } from '@/components/tremor/ui/card';
import { getVoiceNameById } from '@/lib/elevenlabs/voiceList';
import { Transcript } from '@prisma/client';

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ConversationDetailsProps {
  conversationId: string
}

export function ConversationDetails({
  conversationId,
}: ConversationDetailsProps) {
  const { data, error } = useSWR("/api/assistant", fetcher)
  const [conversation, setConversation] = useState<any>(null)
  const { t } = useTranslation()
  useEffect(() => {
    if (data && data.agents) {
      const conv = data.agents
        .flatMap((agent: any) => agent.Conversation)
        .find((c: any) => c.id === conversationId)
      setConversation(conv)
    }
  }, [data, conversationId])

  if (error) return <div>{t(`Failed to load conversation details`)}</div>
  if (!data || !conversation) return <div>{t(`Loading...`)}</div>

  return (
    <MagicCard gradientSize={700} className="w-full max-w-4xl p-6">
      <CardTitle className="mb-2">
        {t(`Conversation with`)} {getVoiceNameById(conversation.agent.voiceId)}
      </CardTitle>
      <CardContent className="grid gap-6 p-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t(`Duration`)}
            </p>
            <span className="flex items-center justify-start text-2xl font-bold">
              {conversation.callDurationSecs}{" "}
              <img src="/coin.png" className="ml-0.5 h-5 w-auto" />
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t(`Messages`)}
            </p>
            <p className="text-2xl font-bold">{conversation.messageCount}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t(`Status`)}
            </p>
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  conversation.call_successful === "true" ? "success" : "error"
                }
              >
                {conversation.call_successful === "true"
                  ? t(`Successful`)
                  : t(`Interrupted`)}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {t(`Created`)}
            </p>
            <p className="text-sm">
              {format(new Date(conversation.createdAt), "PPpp")}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="mb-4 text-lg font-semibold">{t(`Transcript`)}</h3>
          <div className="flex h-fit flex-col rounded-md border py-4">
            {conversation.Transcript.map(
              (transcript: Transcript, index: number) => (
                <div
                  key={index}
                  className={`my-2 rounded-lg p-4 ${
                    transcript.role === "agent"
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-grow space-y-1">
                      <p className="flex items-center gap-2 text-sm font-medium">
                        {transcript.role === "agent" ? (
                          <BotIcon className="h-5 w-5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                        ) : (
                          <User className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400" />
                        )}
                        <span
                          className={`${
                            transcript.role === "agent"
                              ? "text-blue-500 dark:text-blue-400"
                              : "text-green-500 dark:text-green-400"
                          }`}
                        >
                          {transcript.role === "agent"
                            ? getVoiceNameById(conversation.agent.voiceId)
                            : t(`User`)}
                        </span>
                      </p>
                      <p className="text-sm">{transcript.message}</p>
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </CardContent>
    </MagicCard>
  )
}
