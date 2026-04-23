'use client';

import { SessionProvider } from "next-auth/react";
import { CartDrawer } from '@/components/CartDrawer';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
            <CartDrawer />
        </SessionProvider>
    )
}
