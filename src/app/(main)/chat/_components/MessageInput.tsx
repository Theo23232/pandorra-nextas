"use client"

import React from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {Globe , Send , Search , StopCircle , Loader} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {MagicCard} from "@/components/animated/magic-ui/magic-card";



export const MessageInput: React.FC<{
    value: string
    onChange: (v: string) => void
    onSend: () => void
    onStop: () => void
    isStreaming: boolean
    isLoading?: boolean
    useWebSearch: boolean
    setUseWebSearch: (v: boolean) => void
}> = ({
          value,
          onChange,
          onSend,
          onStop,
          isStreaming,
          isLoading,
          useWebSearch,
          setUseWebSearch,
      }) => (
    <MagicCard className="flex flex-col p-4 shadow-none mx-auto max-w-3xl bg-card">
        <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="max-h-48 w-full resize-none overflow-y-auto border-0 bg-transparent pt-2 text-base shadow-none focus-visible:ring-0"
            placeholder={
                useWebSearch
                    ? "Ask me anything with web search..."
                    : "Type your message..."
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
                                onPressedChange={setUseWebSearch}
                                className={`mr-2 h-8 border border-border px-2 ${
                                    useWebSearch
                                        ? "border-primary bg-blue-500/20 text-primary hover:bg-blue-500/40 hover:text-primary"
                                        : ""
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
                    onClick={onSend}
                    className="flex h-8 w-10 items-center justify-center p-0"
                >
                    {useWebSearch ? <Search size={20} /> : <Send size={20} />}
                </Button>
            )}
        </div>
    </MagicCard>
)

