'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function ClientLayout({ children, defaultOpen }: { children: ReactNode; defaultOpen: boolean }) {
    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset className="overflow-hidden">{children}</SidebarInset>
        </SidebarProvider>
    )
}
