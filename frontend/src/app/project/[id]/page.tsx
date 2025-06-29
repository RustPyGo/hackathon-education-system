'use client';

import { FileCard } from '@/components/file-card';
import LoadingSpinner from '@/components/loading-spinner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { fetchOverview, fetchPdfFiles } from '@/service/overview/api';
import type { Overview3 as Overview } from '@/service/overview/type';
import { Brain } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProjectIdPage() {
    // State cho overview
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loadingOverview, setLoadingOverview] = useState(true);
    // State cho danh sách file PDF đã import (giả lập)
    const [pdfFiles, setPdfFiles] = useState<{ label: string; url: string }[]>(
        []
    );

    const { id } = useParams();

    useEffect(() => {
        fetchOverview(id as string).then((data) => {
            setOverview(data);
            setLoadingOverview(false);
        });
        fetchPdfFiles().then((files) => setPdfFiles(files));
    }, []);

    console.log(overview);

    return (
        <div className="space-y-3 mt-3">
            <div className="max-w-3xl mx-auto px-4">
                {/* AI Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            AI-Generated Overview
                        </CardTitle>
                        <CardDescription>
                            Key concepts and insights extracted from the content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loadingOverview ? (
                            <div className="text-center py-8">
                                <LoadingSpinner
                                    size="md"
                                    text="Generating overview..."
                                />
                            </div>
                        ) : (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    {overview?.summary}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Danh sách các file PDF đã import */}
            <div className="max-w-3xl mx-auto px-4">
                <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {pdfFiles.map((file, idx) => (
                        <FileCard key={idx} label={file.label} url={file.url} />
                    ))}
                </div>
            </div>
            {/* Some card should be use later */}
            {/* <div className="grid md:grid-cols-3 gap-4">
                <Card
                    className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveSection('chat')}
                >
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-semibold mb-2">
                            AI Learning Assistant
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Ask questions and get detailed explanations
                        </p>
                        <Button size="sm" className="w-full">
                            Start Conversation
                        </Button>
                    </CardContent>
                </Card>

                <Card
                    className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveSection('flashcards')}
                >
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Smart Flashcards</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            {flashCards.length} cards ready for study
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            Study Now
                        </Button>
                    </CardContent>
                </Card>

                <Card
                    className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={startQuizModeSelection}
                >
                    <CardContent className="pt-6">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Brain className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold mb-2">Knowledge Quiz</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Test your understanding
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                        >
                            Take Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div> */}
        </div>
    );
}

export default ProjectIdPage;
