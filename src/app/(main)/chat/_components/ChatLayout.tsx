import { MagicCard } from "@/components/animated/magic-ui/magic-card"
import React from "react";

export const ChatLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MagicCard className="max-h-[calc(100vh-80px)] rounded-xl bg-card">
        {children}
    </MagicCard>
)
