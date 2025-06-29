'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getProjects, Project } from '@/service/project';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, BookOpen, Search, Plus, MoreHorizontal } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from '@/components/ui/pagination';

export function ProjectManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // For user table
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Alice Johnson',
            email: 'alice@example.com',
            role: 'Student',
            status: 'Active',
            projects: 3,
            progress: 85,
            joinDate: '2024-01-15',
            avatar: '/placeholder.svg?height=32&width=32',
        },
        // ...add more users as needed
    ]);
    const [view, setView] = useState<'projects' | 'users'>('projects');
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const fileDownloadRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        setLoading(true);
        getProjects()
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to load projects');
                setLoading(false);
            });
    }, []);

    const filteredProjects = useMemo(
        () =>
            projects.filter(
                (project) =>
                    project.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    project.overview
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            ),
        [projects, searchTerm]
    );

    // Pagination state
    const [projectPage, setProjectPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const pageSize = 5;

    // Paginated data
    const paginatedProjects = filteredProjects.slice(
        (projectPage - 1) * pageSize,
        projectPage * pageSize
    );
    const paginatedUsers = users.slice(
        (userPage - 1) * pageSize,
        userPage * pageSize
    );
    const projectPageCount = Math.ceil(filteredProjects.length / pageSize);
    const userPageCount = Math.ceil(users.length / pageSize);

    // Project handlers
    const handleProjectMenu = (project: Project, action: string) => {
        setSelectedRow(project);
        if (action === 'details') setShowDetails(true);
        if (action === 'edit') {
            setEditData({ title: project.title, overview: project.overview });
            setShowEdit(true);
        }
        if (action === 'export') {
            const dataStr =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(project, null, 2));
            if (fileDownloadRef.current) {
                fileDownloadRef.current.setAttribute('href', dataStr);
                fileDownloadRef.current.setAttribute(
                    'download',
                    `${project.title}.json`
                );
                fileDownloadRef.current.click();
            }
            toast.success('Project exported!');
        }
        if (action === 'archive') {
            setProjects((prev) => prev.filter((p) => p.id !== project.id));
            toast('Project archived', {
                description: (
                    <span className="text-green-700 font-bold">
                        {project.title}
                    </span>
                ),
            });
        }
    };
    // User handlers
    const handleUserMenu = (user: any, action: string) => {
        setSelectedRow(user);
        if (action === 'details') setShowDetails(true);
        if (action === 'edit') {
            setEditData({ name: user.name, email: user.email });
            setShowEdit(true);
        }
        if (action === 'export') {
            const dataStr =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify(user, null, 2));
            if (fileDownloadRef.current) {
                fileDownloadRef.current.setAttribute('href', dataStr);
                fileDownloadRef.current.setAttribute(
                    'download',
                    `${user.name}.json`
                );
                fileDownloadRef.current.click();
            }
            toast.success('User exported!');
        }
        if (action === 'archive') {
            setUsers((prev) => prev.filter((u) => u.id !== user.id));
            toast('User archived', {
                description: (
                    <span className="text-green-700 font-bold">
                        {user.name}
                    </span>
                ),
            });
        }
    };

    return (
        <div className="space-y-6 mt-3">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Project Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage learning projects and courses
                    </p>
                </div>
            </div>
            {/* Move search input out of the card */}
            {view === 'projects' && (
                <div className="flex items-center space-x-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            )}
            {view === 'projects' ? (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Learning Projects
                            </CardTitle>
                            <CardDescription className="text-lg text-foreground font-semibold mt-1">
                                Manage and monitor all learning projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="py-8 text-center text-muted-foreground">
                                    Loading...
                                </div>
                            ) : error ? (
                                <div className="py-8 text-center text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Project</TableHead>
                                                <TableHead>Overview</TableHead>
                                                <TableHead>
                                                    Created At
                                                </TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedProjects.map(
                                                (project) => (
                                                    <TableRow key={project.id}>
                                                        <TableCell>
                                                            <div className="font-medium">
                                                                {project.title}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-muted-foreground">
                                                                {project
                                                                    .overview
                                                                    .length > 60
                                                                    ? project.overview.slice(
                                                                          0,
                                                                          60
                                                                      ) + '...'
                                                                    : project.overview}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                project.createdAt
                                                            ).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleProjectMenu(
                                                                                project,
                                                                                'details'
                                                                            )
                                                                        }
                                                                    >
                                                                        View
                                                                        Details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleProjectMenu(
                                                                                project,
                                                                                'edit'
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                        Project
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleProjectMenu(
                                                                                project,
                                                                                'export'
                                                                            )
                                                                        }
                                                                    >
                                                                        Export
                                                                        Data
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        className="text-red-600"
                                                                        onClick={() =>
                                                                            handleProjectMenu(
                                                                                project,
                                                                                'archive'
                                                                            )
                                                                        }
                                                                    >
                                                                        Archive
                                                                        Project
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
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
                </>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription className="text-foreground font-medium">
                            Manage users in your system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Projects</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                {/* Avatar and name/email */}
                                                <div>
                                                    <div className="font-medium">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.status}</TableCell>
                                        <TableCell>{user.projects}</TableCell>
                                        <TableCell>{user.progress}%</TableCell>
                                        <TableCell>{user.joinDate}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleUserMenu(
                                                                user,
                                                                'details'
                                                            )
                                                        }
                                                    >
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleUserMenu(
                                                                user,
                                                                'edit'
                                                            )
                                                        }
                                                    >
                                                        Edit User
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleUserMenu(
                                                                user,
                                                                'export'
                                                            )
                                                        }
                                                    >
                                                        Export Data
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() =>
                                                            handleUserMenu(
                                                                user,
                                                                'archive'
                                                            )
                                                        }
                                                    >
                                                        Archive User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
                                                isActive={userPage === i + 1}
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
                                                Math.min(userPageCount, p + 1)
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
                    </CardContent>
                </Card>
            )}
            <a ref={fileDownloadRef} style={{ display: 'none' }} />
            {/* Details Modal */}
            {showDetails && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-2">
                            {view === 'projects'
                                ? selectedRow.title
                                : selectedRow.name}
                        </h2>
                        <p className="mb-2 text-muted-foreground">
                            {view === 'projects'
                                ? selectedRow.overview
                                : selectedRow.email}
                        </p>
                        <p className="mb-4 text-xs">
                            {view === 'projects'
                                ? `Created: ${new Date(
                                      selectedRow.createdAt
                                  ).toLocaleString()}`
                                : `Joined: ${selectedRow.joinDate}`}
                        </p>
                        <Button onClick={() => setShowDetails(false)}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
            {/* Edit Modal */}
            {showEdit && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-2">
                            Edit {view === 'projects' ? 'Project' : 'User'}
                        </h2>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                {view === 'projects' ? 'Title' : 'Name'}
                            </label>
                            <Input
                                value={
                                    view === 'projects'
                                        ? editData.title
                                        : editData.name
                                }
                                onChange={(e) =>
                                    setEditData((prev: any) => ({
                                        ...prev,
                                        [view === 'projects'
                                            ? 'title'
                                            : 'name']: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                {view === 'projects' ? 'Overview' : 'Email'}
                            </label>
                            {view === 'projects' ? (
                                <textarea
                                    className="w-full border rounded p-2 text-sm"
                                    rows={4}
                                    value={editData.overview}
                                    onChange={(e) =>
                                        setEditData((prev: any) => ({
                                            ...prev,
                                            overview: e.target.value,
                                        }))
                                    }
                                />
                            ) : (
                                <Input
                                    value={editData.email}
                                    onChange={(e) =>
                                        setEditData((prev: any) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                />
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => {
                                    if (view === 'projects') {
                                        setProjects((prev) =>
                                            prev.map((p) =>
                                                p.id === selectedRow.id
                                                    ? { ...p, ...editData }
                                                    : p
                                            )
                                        );
                                    } else {
                                        setUsers((prev) =>
                                            prev.map((u) =>
                                                u.id === selectedRow.id
                                                    ? { ...u, ...editData }
                                                    : u
                                            )
                                        );
                                    }
                                    setShowEdit(false);
                                    setSelectedRow(null);
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setShowEdit(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
