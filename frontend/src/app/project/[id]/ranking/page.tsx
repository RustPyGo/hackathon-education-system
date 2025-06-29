'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import ProjectRanking from '@/components/project-ranking';
import { MOCK_GLOBAL_RANKING } from '@/service/ranking';

interface GlobalRankingData {
    overall_rank: number;
    total_users: number;
    average_score: number;
    total_exams_taken: number;
    best_performance: {
        project_title: string;
        score: number;
        rank: number;
    } | null;
}

export default function GlobalRankingsDashboard() {
    const [globalRanking, setGlobalRanking] =
        useState<GlobalRankingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRankingData();
    }, []);

    const fetchRankingData = async () => {
        try {
            setLoading(true);
            // MOCK: Simulate network delay
            await new Promise((res) => setTimeout(res, 500));
            setGlobalRanking(MOCK_GLOBAL_RANKING);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load ranking data'
            );
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />;
            default:
                return <Trophy className="h-5 w-5 text-blue-500" />;
        }
    };

    const getPerformanceColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPerformanceBadge = (score: number) => {
        if (score >= 90)
            return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
        if (score >= 80)
            return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
        if (score >= 70)
            return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={fetchRankingData}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!globalRanking) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-gray-600">
                            No ranking data available
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const performanceBadge = getPerformanceBadge(globalRanking.average_score);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    My Project Rankings
                </h1>
                <p className="text-gray-600">
                    Your performance across all projects
                </p>
            </div>

            {/* Global Ranking Overview */}
            <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {getRankIcon(globalRanking.overall_rank)}
                        My Ranking
                    </CardTitle>
                    <CardDescription>
                        Based on your best performance across all projects
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600">
                                #{globalRanking.overall_rank}
                            </div>
                            <div className="text-sm text-gray-600">
                                Global Rank
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                out of {globalRanking.total_users} users
                            </div>
                        </div>

                        <div className="text-center">
                            <div
                                className={`text-3xl font-bold ${getPerformanceColor(
                                    globalRanking.average_score
                                )}`}
                            >
                                {globalRanking.average_score}%
                            </div>
                            <div className="text-sm text-gray-600">
                                Average Score
                            </div>
                            <Badge
                                className={`text-xs mt-1 ${performanceBadge.color}`}
                            >
                                {performanceBadge.label}
                            </Badge>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600">
                                {globalRanking.total_exams_taken}
                            </div>
                            <div className="text-sm text-gray-600">
                                Exams Taken
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                across all projects
                            </div>
                        </div>

                        <div className="text-center">
                            {globalRanking.best_performance ? (
                                <>
                                    <div className="text-3xl font-bold text-yellow-600">
                                        {globalRanking.best_performance.score}%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Best Score
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {
                                            globalRanking.best_performance
                                                .project_title
                                        }
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-3xl font-bold text-gray-400">
                                        -
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        No Exams
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Take an exam to see stats
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Project Ranking Table (per-project, personal) */}
            <ProjectRanking />
        </div>
    );
}
