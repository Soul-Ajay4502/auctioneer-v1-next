'use client'

import * as React from 'react'
import {
    BotMessageSquare,
    NotepadText,
    Trophy,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton, SidebarRail } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/auth.store'
// This is sample data.
const staticData = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/app',
            icon: BotMessageSquare,
            isActive: true,
        },
        {
            title: 'Leagues',
            url: '/app/leagues',
            icon: NotepadText,
        },

    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const user = useAuthStore((state) => state.user)
    const data = {
        ...staticData,
        user: {
            name: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
            email: user?.email ?? '',
            avatar: user?.img_url || '',
        },
    }

    return (
        <Sidebar collapsible="icon" variant="floating" {...props}>
            <SidebarHeader >
                <SidebarMenuButton>
                    <Trophy className="h-6 w-6" /> <div className='text-sm font-bold'> Auctioneer</div>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="mt-3">
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
