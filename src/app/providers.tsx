'use client';

import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "@/providers/AuthProvider";

export function Providers({ children }: any) {
    const queryClient = new QueryClient();

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </AuthProvider>
    );
}