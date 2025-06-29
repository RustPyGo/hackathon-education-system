// This file renders the admin dashboard layout, including the sidebar
// Remove 'use client' from layout, make it a server component

import React from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Just render the sidebar and children
    // Provide a dummy setActiveView to satisfy the prop type, but do not pass any real function from server to client
    return (
        <SidebarProvider>
            <DashboardSidebar
                activeView={''}
                setActiveView={undefined as any}
            />
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
