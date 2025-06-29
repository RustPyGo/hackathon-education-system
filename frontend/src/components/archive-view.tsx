'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/service/project';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { getArchivedProjects, getArchivedUsers } from '@/service/archive-api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';

export function ArchiveView() {
    const [tab, setTab] = useState<'projects' | 'users'>('projects');
    const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
    const [archivedUsers, setArchivedUsers] = useState<any[]>([]);

    // Pagination state
    const [projectPage, setProjectPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const pageSize = 5;

    // Paginated data
    const paginatedProjects = archivedProjects.slice(
        (projectPage - 1) * pageSize,
        projectPage * pageSize
    );
    const paginatedUsers = archivedUsers.slice(
        (userPage - 1) * pageSize,
        userPage * pageSize
    );
    const projectPageCount = Math.ceil(archivedProjects.length / pageSize);
    const userPageCount = Math.ceil(archivedUsers.length / pageSize);

    // Revive handlers
    const handleReviveProject = (id: string) => {
        setArchivedProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success('Project revived!', {
            description: (
                <span className="text-green-600 font-semibold">
                    Project {id} has been restored.
                </span>
            ),
            className: 'text-green-800 font-semibold',
        });
        // TODO: Optionally add to active projects
    };
    const handleReviveUser = (id: number) => {
        setArchivedUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success('User revived!', {
            description: (
                <span className="text-green-600 font-semibold">
                    User {id} has been restored.
                </span>
            ),
            className: 'text-green-800 font-semibold',
        });
        // TODO: Optionally add to active users
    };

    useEffect(() => {
        getArchivedProjects().then(setArchivedProjects);
        getArchivedUsers().then(setArchivedUsers);
    }, []);

    return (
        <div className="p-4">
            <div className="flex gap-2 mb-4">
                <button
                    className={`px-3 py-1 rounded ${
                        tab === 'projects'
                            ? 'bg-primary text-white'
                            : 'bg-muted'
                    }`}
                    onClick={() => setTab('projects')}
                >
                    Projects
                </button>
                <button
                    className={`px-3 py-1 rounded ${
                        tab === 'users' ? 'bg-primary text-white' : 'bg-muted'
                    }`}
                    onClick={() => setTab('users')}
                >
                    Users
                </button>
            </div>
            {tab === 'projects' ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Archived Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {archivedProjects.length === 0 ? (
                            <div className="text-muted-foreground">
                                No archived projects.
                            </div>
                        ) : (
                            <>
                                <ul className="space-y-2">
                                    {paginatedProjects.map((project) => (
                                        <li
                                            key={project.id}
                                            className="border-b pb-2 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {project.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    {project.overview?.length >
                                                    40
                                                        ? project.overview.slice(
                                                              0,
                                                              40
                                                          ) + '...'
                                                        : project.overview}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Created:{' '}
                                                    {new Date(
                                                        project.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-700 border-green-500 hover:bg-green-50"
                                                onClick={() =>
                                                    handleReviveProject(
                                                        project.id
                                                    )
                                                }
                                            >
                                                Revive
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    setProjectPage((p) =>
                                                        Math.max(1, p - 1)
                                                    )
                                                }
                                                href="#"
                                                aria-disabled={
                                                    projectPage === 1
                                                }
                                            />
                                        </PaginationItem>
                                        {Array.from(
                                            { length: projectPageCount },
                                            (_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        isActive={
                                                            projectPage ===
                                                            i + 1
                                                        }
                                                        href="#"
                                                        onClick={() =>
                                                            setProjectPage(
                                                                i + 1
                                                            )
                                                        }
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    setProjectPage((p) =>
                                                        Math.min(
                                                            projectPageCount,
                                                            p + 1
                                                        )
                                                    )
                                                }
                                                href="#"
                                                aria-disabled={
                                                    projectPage ===
                                                    projectPageCount
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Archived Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {archivedUsers.length === 0 ? (
                            <div className="text-muted-foreground">
                                No archived users.
                            </div>
                        ) : (
                            <>
                                <ul className="space-y-2">
                                    {paginatedUsers.map((user) => (
                                        <li
                                            key={user.id}
                                            className="border-b pb-2 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground mb-1">
                                                    {user.email}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Role: {user.role}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Joined: {user.joinDate}
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-green-700 border-green-500 hover:bg-green-50"
                                                onClick={() =>
                                                    handleReviveUser(user.id)
                                                }
                                            >
                                                Revive
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                                <Pagination className="mt-4">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    setUserPage((p) =>
                                                        Math.max(1, p - 1)
                                                    )
                                                }
                                                href="#"
                                                aria-disabled={userPage === 1}
                                            />
                                        </PaginationItem>
                                        {Array.from(
                                            { length: userPageCount },
                                            (_, i) => (
                                                <PaginationItem key={i}>
                                                    <PaginationLink
                                                        isActive={
                                                            userPage === i + 1
                                                        }
                                                        href="#"
                                                        onClick={() =>
                                                            setUserPage(i + 1)
                                                        }
                                                    >
                                                        {i + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    setUserPage((p) =>
                                                        Math.min(
                                                            userPageCount,
                                                            p + 1
                                                        )
                                                    )
                                                }
                                                href="#"
                                                aria-disabled={
                                                    userPage === userPageCount
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
