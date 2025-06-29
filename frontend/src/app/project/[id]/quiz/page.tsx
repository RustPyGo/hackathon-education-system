'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BookOpen, Brain, Clock, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Quiz Mode
                </h2>
                <p className="text-gray-600">
                    Select how you&apos;d like to take your quiz
                </p>
            </div>

            <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-300">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-xl text-green-700">
                            Practice Mode
                        </CardTitle>
                        <CardDescription>
                            Learn as you go with immediate feedback
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 py-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <RotateCcw className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>
                                    Wrong answers are retried at the end
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Brain className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>
                                    Immediate feedback after each question
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <span>
                                    No time pressure, learn at your pace
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() =>
                                router.push(`${window.location.href}/practice`)
                            }
                            className="cursor-pointer w-full bg-green-600 hover:bg-green-700"
                        >
                            Start Practice Mode
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="h-8 w-8 text-blue-600" />
                        </div>
                        <CardTitle className="text-xl text-blue-700">
                            Exam Mode
                        </CardTitle>
                        <CardDescription>
                            Test your knowledge under exam conditions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 py-4">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span>Timed assessment with final results</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Brain className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span>No feedback until quiz completion</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span>One attempt per question</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() =>
                                router.push(`${window.location.href}/exam`)
                            }
                            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700"
                        >
                            Start Exam Mode
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
