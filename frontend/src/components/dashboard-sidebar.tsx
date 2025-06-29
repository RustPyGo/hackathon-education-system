'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import { BookOpen, Home, Users } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
    {
        title: 'Overview',
        icon: Home,
        id: 'overview',
        href: '/admin/overview',
    },
    {
        title: 'Users',
        icon: Users,
        id: 'users',
        href: '/admin/user',
    },
    {
        title: 'Projects',
        icon: BookOpen,
        id: 'projects',
        href: '/admin/project',
    },
];

interface DashboardSidebarProps {
    activeView: string;
}

export function DashboardSidebar({ activeView }: DashboardSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-2">
                    <Link href="/">
                        <span className="text-2xl font-bold text-primary cursor-pointer block select-none">
                            QLearning
                        </span>
                    </Link>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <Link
                                        href={item.href}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <SidebarMenuButton
                                            isActive={activeView === item.id}
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
