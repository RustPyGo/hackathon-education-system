import { Hero, HeroDescription, HeroTitle } from '@/components/hero';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getProjects } from '@/service/project';
import {
    BookOpen,
    Brain,
    Calendar,
    Clock,
    FileText,
    MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default async function Page() {
    const projects = await getProjects();
    const router = useRouter();

    return (
        <div className="space-y-6 p-6">
            <Hero>
                <HeroTitle className="text-rose-500">Project List</HeroTitle>
                <HeroDescription>
                    Explore all projects created by people around the work
                </HeroDescription>
            </Hero>
            <div>
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Your Projects
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Recently updated
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <Card
                                key={project.id}
                                className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden bg-white hover:scale-105 transform"
                                onClick={() =>
                                    router.push(`/projects/${project.id}`)
                                }
                            >
                                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                                        <FileText className="h-20 w-20 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                                    </div>

                                    {/* Enhanced Content Type Badge */}
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-blue-500 text-white border-blue-600 shadow-lg">
                                            <FileText className="h-3 w-3 mr-1" />
                                            PDF
                                        </Badge>
                                    </div>

                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white rounded-full p-3 shadow-lg">
                                                <BookOpen className="h-6 w-6 text-gray-700" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Calendar className="h-4 w-4" />
                                        {/* {getTimeAgo(project.created_at)} */}
                                    </div>

                                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                                        {project.overview ||
                                            'Processing overview...'}
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
