'use client'

import { Globe, Loader, Search, Send, StopCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTextareaResize } from '@/hooks/use-textarea-resize'
import React from "react";

interface ChatInputProps {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isLoading: boolean
    isStreaming: boolean
    onStop: () => void
    useWebSearch: boolean
    onWebSearchToggle: (value: boolean) => void
    disabled?: boolean
}

export function ChatInput({
                              value,
                              onChange,
                              onSubmit,
                              isLoading,
                              isStreaming,
                              onStop,
                              useWebSearch,
                              onWebSearchToggle,
                              disabled = false,
                          }: ChatInputProps) {
    const { textareaRef, handleResize } = useTextareaResize()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value)
        handleResize()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onChange('')
            onSubmit()
        }
    }

    return (
        <div className="flex flex-col">
            <Textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent pt-2 text-base shadow-none focus-visible:ring-0"
                placeholder={
                    useWebSearch
                        ? 'Ask me anything with web search...'
                        : 'Type your message...'
                }
                rows={1}
            />
            <div className="flex w-full items-end justify-between">
                <div className="mb-2 flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Toggle
                                    aria-label="Toggle web search"
                                    pressed={useWebSearch}
                                    onPressedChange={onWebSearchToggle}
                                    disabled={disabled}
                                    className={`mr-2 h-8 border border-border px-2 ${
                                        useWebSearch
                                            ? 'border-primary bg-blue-500/20 text-primary hover:bg-blue-500/40 hover:text-primary'
                                            : ''
                                    }`}
                                >
                                    <Globe className="mr-1 h-4 w-4" />
                                    Web
                                </Toggle>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Enable web search for up-to-date information</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {isLoading && !isStreaming ? (
                    <Button
                        type="button"
                        onClick={onStop}
                        className="flex h-8 w-10 items-center justify-center p-0"
                    >
                        <Loader className="animate-spin" size={20} />
                    </Button>
                ) : isStreaming ? (
                    <Button
                        type="button"
                        onClick={onStop}
                        className="flex h-8 w-10 items-center justify-center p-0"
                    >
                        <StopCircle size={20} />
                    </Button>
                ) : (
                    <Button
                        onClick={onSubmit}
                        disabled={disabled || !value.trim()}
                        className="flex h-8 w-10 items-center justify-center p-0"
                    >
                        {useWebSearch ? <Search size={20} /> : <Send size={20} />}
                    </Button>
                )}
            </div>
        </div>
    )
}
