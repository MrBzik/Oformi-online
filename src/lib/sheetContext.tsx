"use client";
import { createContext, useContext, useState } from "react";

type SheetContextType = {
    isOpen: boolean;
    openSheet: () => void;
    closeSheet: () => void;
    connected: boolean;
    mobileInChannel: boolean;
    setMobileInChannel: (isInChannel: boolean) => void;
    setConnected: (isConnected: boolean) => void;
    hasMessages: boolean;
    setHasMessages: (hasMessages: boolean) => void;
    chatUserId: string | null;
    setChatUserId: (chatUserId: string) => void;
};

const SheetContext = createContext<SheetContextType | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [connected, setConnected] = useState(false);
    const [hasMessages, setHasMessages] = useState(false);
    const [mobileInChannel, setMobileInChannel] = useState(false);
    const [chatUserId, setChatUserId] = useState<string | null>(null);
    return (
        <SheetContext.Provider
            value={{
                isOpen,
                connected,
                hasMessages,
                mobileInChannel,
                chatUserId,
                openSheet: () => setIsOpen(true),
                closeSheet: () => setIsOpen(false),
                setConnected: (isConnected: boolean) => setConnected(isConnected),
                setHasMessages: (hasMessages: boolean) => setHasMessages(hasMessages),
                setMobileInChannel: (isMobileInChannel: boolean) => setMobileInChannel(isMobileInChannel),
                setChatUserId: (userId : string) => setChatUserId(userId),
            }}>
    {children}
    </SheetContext.Provider>
);
}

export function useSheet() {
    const ctx = useContext(SheetContext);
    if (!ctx) throw new Error("useSheet must be used inside SheetProvider");
    return ctx;
}
