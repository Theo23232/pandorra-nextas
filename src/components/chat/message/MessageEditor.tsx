'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'

interface MessageEditorProps {
    initialContent: string,
    messageId: string,
    onSave: (content: string, id: string) => void
    onCancel: () => void
}

export function MessageEditor({
                                  initialContent,
                                  onSave,
                                  onCancel,
    messageId
                              }: MessageEditorProps) {
    const { t } = useTranslation()
    const [content, setContent] = useState(initialContent)

    return (
        <div className="ml-auto w-fit max-w-xl rounded-3xl bg-muted p-2">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-0 bg-transparent p-2"
            />
            <div className="flex justify-end gap-2 p-2">
                <Button variant="outline" size="sm" onClick={onCancel}>
                    {t('Cancel')}
                </Button>
                <Button size="sm" onClick={() =>  onSave(content, messageId)}>
                    {t('Save')}
                </Button>
            </div>
        </div>
    )
}
