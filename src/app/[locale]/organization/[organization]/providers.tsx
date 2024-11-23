'use client';

import { OrganizationProvider } from "@/providers/OrganizationProvider";

export function Providers({ children }: any) {
    return (
        <OrganizationProvider>
            {children}
        </OrganizationProvider>
    );
}