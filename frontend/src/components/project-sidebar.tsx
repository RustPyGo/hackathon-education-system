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
import type { Project } from '@/service/overview/type';
import { BookOpen, Brain, FileText, MessageSquare, Trophy } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

interface ProjectSidebarProps extends React.ComponentProps<typeof Sidebar> {
    project: Project;
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
    const pathname = usePathname();
    // navigationItems should be memoized to avoid warning
    const navigationItems = React.useMemo(
        () => [
            {
                id: 'overview',
                title: 'Overview',
                icon: FileText,
                description: 'PDF content and AI summary',
                href: `/project/${project.id}/`,
            },
            {
                id: 'chat',
                title: 'AI Chat',
                icon: MessageSquare,
                description: 'Ask questions about content',
                href: `/project/${project.id}/chat`,
            },
            {
                id: 'flashcards',
                title: 'Flashcards',
                icon: BookOpen,
                description: 'Study with AI-generated cards',
                href: `/project/${project.id}/flashcards`,
            },
            {
                id: 'quiz',
                title: 'Quiz',
                icon: Brain,
                description: 'Test your knowledge',
                href: `/project/${project.id}/quiz`,
            },
            {
                id: 'rankings',
                title: 'Rankings',
                icon: Trophy,
                description: 'View project leaderboard',
                href: `/project/${project.id}/ranking`,
            },
        ],
        [project.id]
    );
    const selectedSection = React.useMemo(() => {
        const found = navigationItems.find((item) => {
            const itemHref = item.href.replace(/\/$/, '');
            const path = pathname.replace(/\/$/, '');
            return path === itemHref;
        });
        return found ? found.id : 'overview';
    }, [pathname, navigationItems]);

    return (
        <Sidebar variant="inset">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-3 px-4 py-3"></div>
                <div className="px-4 pb-4">
                    <h2 className="font-semibold text-sm text-foreground mb-1">
                        {project.title || 'Learning Project'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                        Created{' '}
                        {new Date(project.created_at).toLocaleDateString()}
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <Link href={item.href} className="w-full">
                                        <SidebarMenuButton
                                            isActive={
                                                selectedSection === item.id
                                            }
                                            className="flex flex-col items-start h-auto py-3 w-full"
                                        >
                                            <div className="flex items-center gap-3 w-full">
                                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                                <div className="flex-1 text-left">
                                                    <div className="font-medium text-sm">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
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
