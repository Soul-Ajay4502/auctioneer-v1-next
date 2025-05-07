'use client'

import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                            <Link href={item.url}>
                                {item.icon && <item.icon className="text-slate-700 w-4 h-4" />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
