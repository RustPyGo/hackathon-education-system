import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { Target, Clock } from 'lucide-react';
import { MOCK_PROJECT_RANKINGS } from '@/service/ranking';

function getRankBadgeColor(rank: number) {
    if (rank === 1) return 'bg-yellow-300 text-yellow-900';
    if (rank === 2) return 'bg-gray-300 text-gray-900';
    if (rank === 3) return 'bg-amber-400 text-amber-900';
    return 'bg-blue-100 text-blue-800';
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

const ProjectRanking: React.FC<{
    rankings?: typeof MOCK_PROJECT_RANKINGS;
}> = ({ rankings = MOCK_PROJECT_RANKINGS }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bảng xếp hạng dự án</CardTitle>
                <CardDescription>
                    Xếp hạng các lần làm bài kiểm tra của bạn theo điểm số và
                    thời gian hoàn thành
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {rankings.map((user) => (
                        <div
                            key={user.user_id}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                                user.is_current_user
                                    ? 'border-blue-300 bg-blue-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12">
                                    <Badge
                                        className={`${getRankBadgeColor(
                                            user.rank
                                        )} font-bold`}
                                    >
                                        #{user.rank}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-green-600">
                                        <Target className="h-4 w-4" />
                                        <span className="font-bold">
                                            {user.score}%
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {user.score}/{user.total_questions * 10}{' '}
                                        điểm
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-medium">
                                            {formatTime(user.time_spent)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        thời gian hoàn thành
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectRanking;
