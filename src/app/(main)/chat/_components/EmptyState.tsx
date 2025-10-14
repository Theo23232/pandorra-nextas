"use client"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Megaphone } from "lucide-react"
import Bounce from "@/components/animated/uibeats/bounce";
import React from "react";





export const EmptyState: React.FC<{ username?: string }> = ({ username }) => (
    <Bounce once>
        <div className="flex flex-col items-center justify-center text-center gap-4">
            <h1 className="font-inter text-[40px] font-semibold leading-[78px] text-black md:text-[50px] dark:text-[#FDFDFD]">
                Hello,{" "}
                <span className="ml-2 bg-gradient-to-r from-[#CC00FF] to-[#0099FF] bg-clip-text text-transparent">
          {username}
        </span>
            </h1>
            <Alert className="max-w-md border border-border">
                <Megaphone className="h-4 w-4" />
                <AlertTitle>Announcement!</AlertTitle>
                <AlertDescription>
                    Pandorra chat currently costs 1 credit per message but will soon be
                    free and unlimited.
                </AlertDescription>
            </Alert>
        </div>
    </Bounce>
)

