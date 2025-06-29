'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Mail, MoreHorizontal, Search } from 'lucide-react';
import { useState } from 'react';

const users = [
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
    {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        role: 'Instructor',
        status: 'Active',
        projects: 8,
        progress: 92,
        joinDate: '2023-11-20',
        avatar: '/placeholder.svg?height=32&width=32',
    },
    {
        id: 3,
        name: 'Carol Davis',
        email: 'carol@example.com',
        role: 'Student',
        status: 'Inactive',
        projects: 1,
        progress: 45,
        joinDate: '2024-02-10',
        avatar: '/placeholder.svg?height=32&width=32',
    },
    {
        id: 4,
        name: 'David Wilson',
        email: 'david@example.com',
        role: 'Student',
        status: 'Active',
        projects: 5,
        progress: 78,
        joinDate: '2024-01-08',
        avatar: '/placeholder.svg?height=32&width=32',
    },
    {
        id: 5,
        name: 'Eva Brown',
        email: 'eva@example.com',
        role: 'Admin',
        status: 'Active',
        projects: 12,
        progress: 100,
        joinDate: '2023-09-15',
        avatar: '/placeholder.svg?height=32&width=32',
    },
];

export function UserManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const pageCount = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        User Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage learners, instructors, and administrators
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        A list of all users in your learning system
                    </CardDescription>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-8"
                            />
                        </div>
                    </div>
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
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={
                                                        user.avatar ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {user.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
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
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === 'Admin'
                                                    ? 'default'
                                                    : user.role === 'Instructor'
                                                    ? 'secondary'
                                                    : 'outline'
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.status === 'Active'
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
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
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    Edit Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    View Progress
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Deactivate User
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
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    href="#"
                                    aria-disabled={page === 1}
                                />
                            </PaginationItem>
                            {Array.from({ length: pageCount }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={page === i + 1}
                                        href="#"
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(pageCount, p + 1)
                                        )
                                    }
                                    href="#"
                                    aria-disabled={page === pageCount}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </CardContent>
            </Card>
        </div>
    );
}
