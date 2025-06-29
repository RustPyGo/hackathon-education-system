'use client';

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProject } from '@/service/project/api';
import { BookOpen, Brain, FileText, MessageSquare, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

export default function HomePage() {
    const router = useRouter();
    const [hasFiles, setHasFiles] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);
    const [title, setTitle] = React.useState('');
    const [duration, setDuration] = React.useState('');
    const [files, setFiles] = React.useState<File[]>([]);

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

    const progressSteps = ['Uploading PDF', 'Processing', 'Generating Results'];

    const handleFilesChange = React.useCallback((uploadedFiles: File[]) => {
        setFiles(uploadedFiles);
        setHasFiles(uploadedFiles.length > 0);
    }, []);

    const handleSubmit = React.useCallback(async () => {
        if (!title.trim() || !duration.trim() || files.length === 0) {
            toast.error(
                'Please fill in all required fields and upload at least one PDF file'
            );
            return;
        }

        setLoading(true);
        setCurrentStep(0);

        try {
            setCurrentStep(1);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setCurrentStep(2);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            await createProject(title, duration, files);
            setCurrentStep(3);
            await new Promise((resolve) => setTimeout(resolve, 500));

            toast.success('Project created successfully!');

            if (result.projectId) {
                router.push(`/project/${result.projectId}`);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
            setCurrentStep(0);
        }
    }, [title, duration, files, router]);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-16 relative">
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
                            <CardContent className="space-y-6 flex flex-col items-center">
                                <div className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Project Title
                                        </Label>
                                        <Input
                                            id="title"
                                            type="text"
                                            placeholder="Enter project title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="duration">
                                            Exam Duration (minutes)
                                        </Label>
                                        <Input
                                            id="duration"
                                            type="number"
                                            placeholder="Enter duration in minutes"
                                            value={duration}
                                            onChange={(e) =>
                                                setDuration(e.target.value)
                                            }
                                            className="w-full"
                                            min="1"
                                            max="300"
                                        />
                                    </div>
                                </div>

                                <PdfDropZone
                                    onFilesChange={handleFilesChange}
                                />
                                {hasFiles && (
                                    <>
                                        {loading && (
                                            <div className="w-full max-w-xs mb-4">
                                                <ProgressIndicator
                                                    steps={progressSteps}
                                                    currentStep={currentStep}
                                                />
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            onClick={handleSubmit}
                                            className="bg-white hover:bg-gray-50 mt-4"
                                            disabled={
                                                loading ||
                                                !title.trim() ||
                                                !duration.trim()
                                            }
                                        >
                                            {loading
                                                ? 'Đang xử lý...'
                                                : 'Submit'}
                                        </Button>
                                    </>
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
                </div>
            </div>
        </>
    );
}
