"use client";
import { createContext, useContext, useState } from "react";

type SheetContextType = {
    isOpen: boolean;
    openSheet: () => void;
    closeSheet: () => void;
};

const SheetContext = createContext<SheetContextType | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SheetContext.Provider
            value={{
        isOpen,
            openSheet: () => setIsOpen(true),
            closeSheet: () => setIsOpen(false),
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
