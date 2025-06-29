'use client';

import { BookOpen, Brain, FileText, MessageSquare, Zap } from 'lucide-react';
import * as React from 'react';

import FeatureCard from '@/components/feature-card';
import { PdfDropZone } from '@/components/pdf-drop-zone';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ProgressIndicator from '@/components/progress-indicator';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [hasFiles, setHasFiles] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(0);

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
                                <PdfDropZone
                                    onFilesChange={(files) =>
                                        setHasFiles(files.length > 0)
                                    }
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
                                            onClick={async () => {
                                                setLoading(true);
                                                setCurrentStep(0);
                                                // Animate progress bar
                                                for (
                                                    let i = 0;
                                                    i < progressSteps.length;
                                                    i++
                                                ) {
                                                    setCurrentStep(i);
                                                    await new Promise((res) =>
                                                        setTimeout(res, 400)
                                                    );
                                                }
                                                setLoading(false);
                                                router.push('/project');
                                            }}
                                            className="bg-white hover:bg-gray-50 mt-4"
                                            disabled={loading}
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
