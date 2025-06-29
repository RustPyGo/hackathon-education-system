// Global Ranking Page
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
import {
    Trophy,
    TrendingUp,
    Target,
    BookOpen,
    Medal,
    Award,
    Crown,
} from 'lucide-react';
import {
    getGlobalRanking,
    getProjectsRanking,
    GlobalRankingData,
} from '@/service/ranking';

export interface ProjectRankingStats {
    project_id: string;
    project_title: string;
    total_participants: number;
    average_score: number;
    highest_score: number;
    current_user_rank?: number;
    current_user_score?: number;
}

export default function RankingPage() {
    const [globalRanking, setGlobalRanking] =
        useState<GlobalRankingData | null>(null);
    const [projectsStats, setProjectsStats] = useState<ProjectRankingStats[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRankingData();
    }, []);

    const fetchRankingData = async () => {
        try {
            setLoading(true);
            const [globalData, projectsData] = await Promise.all([
                getGlobalRanking(),
                getProjectsRanking(),
            ]);
            setGlobalRanking(globalData);
            setProjectsStats(projectsData);
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
                    Global Rankings
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
                        Your Global Ranking
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

            {/* Project-by-Project Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Project Performance
                    </CardTitle>
                    <CardDescription>
                        Your ranking and performance in each project
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {projectsStats.map((project) => (
                            <div
                                key={project.project_id}
                                className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {project.project_title}
                                    </h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Target className="h-4 w-4" />
                                            {project.total_participants}{' '}
                                            participants
                                        </span>
                                        <span>
                                            Avg: {project.average_score}%
                                        </span>
                                        <span>
                                            High: {project.highest_score}%
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {project.current_user_rank ? (
                                        <>
                                            <div className="flex items-center gap-2 justify-end">
                                                <Badge
                                                    variant="outline"
                                                    className="font-medium"
                                                >
                                                    Rank #
                                                    {project.current_user_rank}
                                                </Badge>
                                            </div>
                                            <div
                                                className={`text-lg font-bold mt-1 ${getPerformanceColor(
                                                    project.current_user_score ||
                                                        0
                                                )}`}
                                            >
                                                {project.current_user_score}%
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-gray-400">
                                            <div className="text-sm">
                                                Not taken
                                            </div>
                                            <div className="text-xs">
                                                Take exam to rank
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Performance Insights
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {globalRanking.average_score >= 85 && (
                            <div className="flex items-center gap-2 text-green-700">
                                <Trophy className="h-4 w-4" />
                                <span className="text-sm">
                                    Excellent performance! You&apos;re in the
                                    top tier of learners.
                                </span>
                            </div>
                        )}

                        {globalRanking.total_exams_taken >= 3 && (
                            <div className="flex items-center gap-2 text-blue-700">
                                <Target className="h-4 w-4" />
                                <span className="text-sm">
                                    Great consistency! You&apos;ve completed
                                    multiple exams.
                                </span>
                            </div>
                        )}

                        {globalRanking.overall_rank <= 3 && (
                            <div className="flex items-center gap-2 text-yellow-700">
                                <Crown className="h-4 w-4" />
                                <span className="text-sm">
                                    Outstanding! You&apos;re among the top 3
                                    performers globally.
                                </span>
                            </div>
                        )}

                        {projectsStats.filter((p) => !p.current_user_rank)
                            .length > 0 && (
                            <div className="flex items-center gap-2 text-purple-700">
                                <BookOpen className="h-4 w-4" />
                                <span className="text-sm">
                                    Try taking exams in{' '}
                                    {
                                        projectsStats.filter(
                                            (p) => !p.current_user_rank
                                        ).length
                                    }{' '}
                                    more projects to improve your global
                                    ranking.
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
