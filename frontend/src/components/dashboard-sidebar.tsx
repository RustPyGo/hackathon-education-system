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
    setActiveView?: (view: string) => void;
}

export function DashboardSidebar({
    activeView,
    setActiveView,
}: DashboardSidebarProps) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-2">
                    <Link href="/">
                        <img
                            src="/QLearning-logo-bigger.svg"
                            alt="QLearning Logo"
                            className="h-14 w-14 cursor-pointer"
                        />
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
