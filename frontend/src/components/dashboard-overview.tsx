import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Clock } from 'lucide-react';

const stats = [
    {
        title: 'Total Users',
        value: '2,847',
        change: '+12%',
        icon: Users,
        description: 'Active learners',
    },
    {
        title: 'Learning Projects',
        value: '156',
        change: '+8%',
        icon: BookOpen,
        description: 'Available courses',
    },
    {
        title: 'Study Hours',
        value: '12,450',
        change: '+23%',
        icon: Clock,
        description: 'This month',
    },
];

const recentProjects = [
    {
        name: 'React Fundamentals',
        students: 245,
    },
    {
        name: 'JavaScript Mastery',
        students: 189,
    },
    {
        name: 'Python for Beginners',
        students: 156,
    },
    {
        name: 'Data Structures',
        students: 98,
    },
];

export function DashboardOverview() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your learning
                        platform.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">
                                    {stat.change}
                                </span>{' '}
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Learning Projects</CardTitle>
                        <CardDescription>
                            Overview of your most active learning projects
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentProjects.map((project) => (
                            <div
                                key={project.name}
                                className="flex items-center justify-between space-x-4"
                            >
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {project.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {project.students} students enrolled
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Common tasks and shortcuts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm hover:bg-accent">
                                <Users className="h-4 w-4" />
                                <div>
                                    <div className="font-medium">
                                        Add New User
                                    </div>
                                    <div className="text-muted-foreground">
                                        Create a new learner account
                                    </div>
                                </div>
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm hover:bg-accent">
                                <BookOpen className="h-4 w-4" />
                                <div>
                                    <div className="font-medium">
                                        Create Project
                                    </div>
                                    <div className="text-muted-foreground">
                                        Start a new learning project
                                    </div>
                                </div>
                            </button>
                            <button className="flex items-center gap-2 rounded-lg border p-3 text-left text-sm hover:bg-accent">
                                <TrendingUp className="h-4 w-4" />
                                <div>
                                    <div className="font-medium">
                                        View Analytics
                                    </div>
                                    <div className="text-muted-foreground">
                                        Check detailed reports
                                    </div>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
