'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/service/project';
import {
    BookOpen,
    Brain,
    Calendar,
    FileText,
    MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export const ProjectCard = (project: Project) => {
    const router = useRouter();

    return (
        <Card
            className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white hover:scale-105 transform"
            onClick={() => {
                router.push(`/project/${project.id}`);
            }}
        >
            <CardHeader>
                <CardTitle className="px-0 aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                        <FileText className="h-20 w-20 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="absolute top-3 right-3">
                        <Badge className="bg-blue-500 text-white border-blue-600 shadow-lg">
                            <FileText className="h-3 w-3 mr-1" />
                            PDF
                        </Badge>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    {formatDistanceToNow(project.createdAt)}
                </div>

                <h3 className="font-bold text-gray-900 mb-3 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {project.overview || 'Processing overview...'}
                </p>

                <div className="flex gap-2 flex-wrap">
                    <Badge
                        variant="secondary"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
                    >
                        <BookOpen className="h-3 w-3 mr-1" />
                        Cards
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="text-xs bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                        <Brain className="h-3 w-3 mr-1" />
                        Quiz
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};
