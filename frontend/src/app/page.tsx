'use client';

import type React from 'react';

import FeatureCard from '@/components/feature-card';
import { PdfDropZone } from '@/components/pdf-drop-zone';
import ProgressIndicator from '@/components/progress-indicator';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { extractPdfTitle, validatePdfFile } from '@/lib/pdf-utils';
import {
    BookOpen,
    Brain,
    CheckCircle,
    FileText,
    MessageSquare,
    Upload,
    X,
    Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface PendingFile {
    file: File;
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    projectId?: string;
    error?: string;
}

const featureCards = [
    {
        icon: <BookOpen className="h-6 w-6 text-blue-600" />,
        iconBg: 'bg-blue-100',
        title: 'Smart Overview',
        subtitle: 'AI extracts key concepts from PDF documents',
    },
    {
        icon: <Zap className="h-6 w-6 text-green-600" />,
        iconBg: 'bg-green-100',
        title: 'Flash Cards',
        subtitle: 'Auto-generated flashcards for effective memorization',
    },
    {
        icon: <MessageSquare className="h-6 w-6 text-purple-600" />,
        iconBg: 'bg-purple-100',
        title: 'AI Chat',
        subtitle:
            'Ask questions about your content and get detailed explanations',
    },
    {
        icon: <Brain className="h-6 w-6 text-orange-600" />,
        iconBg: 'bg-orange-100',
        title: 'Quiz Generation',
        subtitle: 'Create custom question packs to test your knowledge',
    },
];

export default function HomePage() {
    const [selectedFiles, setSelectedFiles] = useState<PendingFile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [processingStep, setProcessingStep] = useState(0);

    const pdfSteps = [
        'Uploading PDF files',
        'Processing documents',
        'Generating overviews',
        'Creating question packs',
    ];

    const [isDragOverPage, setIsDragOverPage] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const handleFileSelect = (file: File) => {
        const newFile: PendingFile = {
            file,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            status: 'pending',
        };
        setSelectedFiles((prev) => [...prev, newFile]);
    };

    const handleMultipleFileSelect = (files: File[]) => {
        const newFiles: PendingFile[] = files.map((file) => ({
            file,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            status: 'pending',
        }));
        setSelectedFiles((prev) => [...prev, ...newFiles]);
    };

    const handlePageDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragCounter((prev) => prev + 1);

        // Check if dragged items contain files
        if (e.dataTransfer.types.includes('Files')) {
            setIsDragOverPage(true);
        }
    }, []);

    const handlePageDragLeave = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragCounter((prev) => prev - 1);

            // Only hide overlay when all drag events have left
            if (dragCounter <= 1) {
                setIsDragOverPage(false);
            }
        },
        [dragCounter]
    );

    const handlePageDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
    }, []);

    const handlePageDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOverPage(false);
        setDragCounter(0);

        const files = Array.from(e.dataTransfer.files);
        const pdfFiles = files.filter((file) => validatePdfFile(file));
        const oversizedFiles = pdfFiles.filter(
            (file) => file.size > 10 * 1024 * 1024
        );
        const validFiles = pdfFiles.filter(
            (file) => file.size <= 10 * 1024 * 1024
        );

        if (pdfFiles.length === 0) {
            toast.error('Please drop valid PDF files');
            return;
        }

        if (oversizedFiles.length > 0) {
            toast.warning(
                `${oversizedFiles.length} file(s) skipped (over 10MB limit). ${validFiles.length} files added.`
            );
        }

        if (validFiles.length > 0) {
            handleMultipleFileSelect(validFiles);

            if (validFiles.length === 1) {
                toast.success(
                    "PDF file ready! Click 'Create Learning Project' to continue."
                );
            } else {
                toast.success(
                    `${validFiles.length} PDF files ready! Click 'Create Learning Projects' to continue.`
                );
            }
        }
    }, []);

    return (
        <>
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16 relative"
                onDragEnter={handlePageDragEnter}
                onDragLeave={handlePageDragLeave}
                onDragOver={handlePageDragOver}
                onDrop={handlePageDrop}
            >
                {/* Global Drag Overlay */}
                {isDragOverPage && (
                    <div className="fixed inset-0 z-50 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center border-2 border-dashed border-blue-400">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="h-10 w-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Drop PDF Files Here
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Release to create learning projects from your
                                PDF documents
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                                <Upload className="h-4 w-4" />
                                <span>
                                    Supports multiple PDFs up to 10MB each
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white p-4 rounded-full shadow-lg">
                                <FileText className="h-12 w-12 text-blue-500" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            AI Learning Platform
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Transform PDF documents into interactive learning
                            experiences with AI-generated flashcards, quizzes,
                            and intelligent chat assistance.
                            <span className="block mt-2 text-lg text-blue-600 font-medium">
                                💡 Tip: Drag multiple PDF files anywhere on this
                                page to get started instantly!
                            </span>
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-16">
                        <Card className="shadow-xl border-0">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">
                                    Create Learning Projects
                                </CardTitle>
                                <CardDescription>
                                    Upload PDF documents to generate interactive
                                    learning content
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <PdfDropZone
                                    onFileSelect={handleFileSelect}
                                    onMultipleFileSelect={
                                        handleMultipleFileSelect
                                    }
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                />

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs">
                                                    !
                                                </span>
                                            </div>
                                            <p className="text-red-700 font-medium">
                                                Error
                                            </p>
                                        </div>
                                        <p className="text-red-600 text-sm mt-1">
                                            {error}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                            onClick={() => setError('')}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                        <ProgressIndicator
                                            steps={pdfSteps}
                                            currentStep={processingStep}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                        id="features"
                    >
                        {featureCards.map((item) => (
                            <FeatureCard
                                key={item.title}
                                icon={item.icon}
                                iconBg={item.iconBg}
                                title={item.title}
                                subtitle={item.subtitle}
                            />
                        ))}
                    </div>

                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard')}
                            className="bg-white hover:bg-gray-50"
                        >
                            View My Projects
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
