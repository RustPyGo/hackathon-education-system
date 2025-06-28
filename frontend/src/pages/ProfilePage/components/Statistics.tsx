import type { UserStatistics } from '../mockData';
import { Trophy, Target, Clock, Award, Zap } from 'lucide-react';

interface StatisticsProps {
    statistics: UserStatistics;
    getLevelProgress: () => number;
    formatTime: (minutes: number) => string;
}

const Statistics = ({
    statistics,
    getLevelProgress,
    formatTime,
}: StatisticsProps) => {
    const levelProgress = getLevelProgress();

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                        Learning Statistics
                    </h2>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Level & Experience */}
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                                <Award className="w-5 h-5 text-primary-600" />
                                <h3 className="font-semibold text-gray-900">
                                    Level {statistics.level}
                                </h3>
                            </div>
                            <span className="text-sm text-gray-600">
                                {statistics.experience}/
                                {statistics.nextLevelExperience} XP
                            </span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 mb-2">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${levelProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-600">
                            {statistics.nextLevelExperience -
                                statistics.experience}{' '}
                            XP to next level
                        </p>
                    </div>

                    {/* Quiz Performance */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Target className="w-5 h-5 text-green-600" />
                            <h3 className="font-semibold text-gray-900">
                                Quiz Performance
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Total Quizzes
                                </span>
                                <span className="font-medium">
                                    {statistics.totalQuizzes}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Questions Answered
                                </span>
                                <span className="font-medium">
                                    {statistics.totalQuestions}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Correct Answers
                                </span>
                                <span className="font-medium text-green-600">
                                    {statistics.correctAnswers}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Average Score
                                </span>
                                <span className="font-medium text-green-600">
                                    {statistics.averageScore}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Study Time */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                                Study Time
                            </h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Total Time
                                </span>
                                <span className="font-medium">
                                    {formatTime(statistics.studyTime)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                    Current Streak
                                </span>
                                <span className="font-medium text-blue-600">
                                    {statistics.streakDays} days
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievement Badges */}
                <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                        Recent Achievements
                    </h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-2 rounded-full">
                            <span className="text-yellow-600">🏆</span>
                            <span className="text-sm font-medium text-yellow-800">
                                Quiz Master
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                            <span className="text-green-600">🔥</span>
                            <span className="text-sm font-medium text-green-800">
                                7-Day Streak
                            </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-full">
                            <span className="text-blue-600">📚</span>
                            <span className="text-sm font-medium text-blue-800">
                                Level 5
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
