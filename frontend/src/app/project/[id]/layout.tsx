'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ProjectSidebar } from '@/components/project-sidebar';
import type { Project } from '@/service/overview/type';
import { useEffect, useState } from 'react';
import { fetchProject } from '@/service/overview/api';

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [project, setProject] = useState<Project | null>(null);

    useEffect(() => {
        fetchProject('12345').then((proj) => setProject(proj));
    }, []);

    return (
        <SidebarProvider>
            {project && <ProjectSidebar project={project} />}
            <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
