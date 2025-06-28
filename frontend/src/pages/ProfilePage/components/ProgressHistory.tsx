import type { LearningProgress } from '../mockData';
import { BarChart3, Filter, Calendar, Target, Clock } from 'lucide-react';

interface ProgressHistoryProps {
    progress: LearningProgress[];
    subjects: string[];
    selectedSubject: string | null;
    formatDate: (dateString: string) => string;
    formatDuration: (seconds: number) => string;
    getScoreColor: (score: number) => string;
    onSubjectFilter: (subject: string | null) => void;
}

const ProgressHistory = ({
    progress,
    subjects,
    selectedSubject,
    formatDate,
    formatDuration,
    getScoreColor,
    onSubjectFilter,
}: ProgressHistoryProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Progress History
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                            Filter by subject
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Subject Filter */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onSubjectFilter(null)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                selectedSubject === null
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Subjects
                        </button>
                        {subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => onSubjectFilter(subject)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                    selectedSubject === subject
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress List */}
                <div className="space-y-4">
                    {progress.map((item) => (
                        <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {item.quizTitle}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {formatDate(item.completedAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {formatDuration(item.timeSpent)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Target className="w-4 h-4" />
                                            <span>
                                                {item.correctAnswers}/
                                                {item.totalQuestions} correct
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className={`text-2xl font-bold ${getScoreColor(
                                            item.score
                                        )}`}
                                    >
                                        {item.score}%
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {item.subject}
                                    </div>
                                </div>
                            </div>

                            {/* Skill Breakdown */}
                            <div className="border-t pt-3">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Skill Breakdown
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {item.skillBreakdown.map((skill) => (
                                        <div
                                            key={skill.skill}
                                            className="flex items-center justify-between text-xs"
                                        >
                                            <span className="text-gray-600 truncate">
                                                {skill.skill}
                                            </span>
                                            <span
                                                className={`font-medium ${
                                                    skill.percentage >= 80
                                                        ? 'text-green-600'
                                                        : skill.percentage >= 60
                                                        ? 'text-yellow-600'
                                                        : 'text-red-600'
                                                }`}
                                            >
                                                {skill.percentage}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {progress.length === 0 && (
                    <div className="text-center py-8">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                            No progress data available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressHistory;
