'use client';

import { ProjectSidebar } from '@/components/project-sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { fetchProject } from '@/service/overview/api';
import type { Project } from '@/service/overview/type';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeSection] = useState('overview');
    const [project, setProject] = useState<Project | null>(null);

    const params = useParams();

    useEffect(() => {
        fetchProject(params.id as string).then((proj) => setProject(proj));
    }, [params.id]);

    return (
        <SidebarProvider>
            {project && (
                <ProjectSidebar
                    project={project}
                    activeSection={activeSection}
                />
            )}
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
