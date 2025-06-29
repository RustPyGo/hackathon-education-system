'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Trophy,
    Clock,
    Target,
    RotateCcw,
    Home,
    CheckCircle,
    XCircle,
    TrendingUp,
} from 'lucide-react';
import ProjectRanking from './project-ranking';
import { getMockQuizResults } from '@/service/quiz';

interface QuizResultsProps {
    results: {
        mode: 'practice' | 'exam';
        score: number;
        totalQuestions: number;
        timeSpent: number;
        answers: Array<{
            questionId: string;
            question: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
            timeSpent: number;
            attempts: number;
        }>;
    };
    projectId: string;
    projectTitle: string;
    onRetry: () => void;
    onHome: () => void;
}

export default function QuizResults({
    results = getMockQuizResults(),
    projectId,
    projectTitle,
    onRetry,
    onHome,
}: QuizResultsProps) {
    const [showRankings, setShowRankings] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const correctAnswers = results.answers.filter((a) => a.isCorrect).length;
    const averageTime = Math.round(results.timeSpent / results.totalQuestions);
    const totalAttempts = results.answers.reduce(
        (sum, answer) => sum + answer.attempts,
        0
    );

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadgeColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 60)
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    // Auto-submit exam results when component mounts
    useEffect(() => {
        const submitExamResult = async () => {
            if (results.mode !== 'exam' || hasSubmitted) return;

            try {
                const response = await fetch('/api/exam-results', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        project_id: projectId,
                        score: results.score,
                        total_questions: results.totalQuestions,
                        time_spent: results.timeSpent,
                    }),
                });

                if (response.ok) {
                    setHasSubmitted(true);
                }
            } catch (error) {
                console.error('Failed to submit exam result:', error);
            }
        };
        if (results.mode === 'exam' && !hasSubmitted) {
            submitExamResult();
        }
    }, [results.mode, hasSubmitted, projectId, results.score, results.totalQuestions, results.timeSpent]);

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-10 w-10 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Quiz Complete!
                    </h1>
                    <p className="text-gray-600">{projectTitle}</p>
                    <Badge variant="outline" className="mt-2 capitalize">
                        {results.mode} Mode
                    </Badge>
                </div>

                {/* Score Overview */}
                <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div
                                className={`text-6xl font-bold mb-2 ${getScoreColor(
                                    results.score
                                )}`}
                            >
                                {results.score}%
                            </div>
                            <Badge
                                className={`text-lg px-4 py-2 ${getScoreBadgeColor(
                                    results.score
                                )}`}
                            >
                                {correctAnswers} out of {results.totalQuestions}{' '}
                                correct
                            </Badge>
                        </div>
                        <div className="mt-6">
                            <Progress value={results.score} className="h-3">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out rounded-full"
                                    style={{ width: `${results.score}%` }}
                                />
                            </Progress>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                                {formatTime(results.timeSpent)}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Time
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                Avg: {formatTime(averageTime)} per question
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                                {correctAnswers}
                            </div>
                            <div className="text-sm text-gray-600">
                                Correct Answers
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {results.totalQuestions - correctAnswers}{' '}
                                incorrect
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6 text-center">
                            <RotateCcw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                                {totalAttempts}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Attempts
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                {results.mode === 'practice'
                                    ? 'Including retries'
                                    : 'One per question'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Exam Mode - Rankings Section */}
                {results.mode === 'exam' && (
                    <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-yellow-600" />
                                Exam Results Submitted!
                            </CardTitle>
                            <CardDescription>
                                Your exam score has been recorded and
                                you&apos;ve been added to the global leaderboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-yellow-600">
                                            {results.score}%
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Your Score
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {formatTime(results.timeSpent)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Completion Time
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => setShowRankings(true)}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                                >
                                    <Trophy className="h-4 w-4 mr-2" />
                                    View Rankings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Detailed Results */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Review</CardTitle>
                        <CardDescription>
                            Review your answers and see the correct solutions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.answers.map((answer, index) => (
                                <div
                                    key={answer.questionId}
                                    className={`p-4 rounded-lg border-2 ${
                                        answer.isCorrect
                                            ? 'border-green-200 bg-green-50'
                                            : 'border-red-200 bg-red-50'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {answer.isCorrect ? (
                                                <CheckCircle className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium text-gray-900">
                                                    Question {index + 1}
                                                </span>
                                                {results.mode === 'practice' &&
                                                    answer.attempts > 1 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {answer.attempts}{' '}
                                                            attempts
                                                        </Badge>
                                                    )}
                                            </div>
                                            <p className="text-gray-800 mb-3">
                                                {answer.question}
                                            </p>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">
                                                        Your answer:
                                                    </span>
                                                    <span
                                                        className={
                                                            answer.isCorrect
                                                                ? 'text-green-700 font-medium'
                                                                : 'text-red-700 font-medium'
                                                        }
                                                    >
                                                        {answer.userAnswer ||
                                                            'No answer'}
                                                    </span>
                                                </div>
                                                {!answer.isCorrect && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-600">
                                                            Correct answer:
                                                        </span>
                                                        <span className="text-green-700 font-medium">
                                                            {
                                                                answer.correctAnswer
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                    <Button
                        onClick={onRetry}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try Again
                    </Button>
                    <Button
                        onClick={onHome}
                        className="flex items-center gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Back to Project
                    </Button>
                    {results.mode === 'exam' && (
                        <Button
                            onClick={() => setShowRankings(true)}
                            variant="outline"
                            className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100"
                        >
                            <Trophy className="h-4 w-4" />
                            View Rankings
                        </Button>
                    )}
                </div>
            </div>

            {/* Rankings Modal */}
            {showRankings && <ProjectRanking />}
        </>
    );
}
