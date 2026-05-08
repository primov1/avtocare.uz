'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';
import {AuthProvider} from "../lib/auth";
import {ToastProvider} from "../components/ui/Toast";

export function Providers({children}: { children: React.ReactNode }) {
    // FIX: create QueryClient inside component so it's not shared across requests
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000, // 1 min
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
        </QueryClientProvider>
    );
}
