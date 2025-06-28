import { CheckCircle, Clock, Trophy } from 'lucide-react';

interface ResultHeaderProps {
    title: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    formatTime: (seconds: number) => string;
}

const ResultHeader = ({
    title,
    score,
    totalQuestions,
    correctAnswers,
    timeSpent,
    formatTime,
}: ResultHeaderProps) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreMessage = (score: number) => {
        if (score >= 90) return 'Excellent!';
        if (score >= 80) return 'Great job!';
        if (score >= 70) return 'Good work!';
        if (score >= 60) return 'Not bad!';
        return 'Keep practicing!';
    };

    return (
        <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg">
                            <Trophy className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Quiz completed
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {/* Score */}
                        <div className="text-center">
                            <div
                                className={`text-3xl font-bold ${getScoreColor(
                                    score
                                )}`}
                            >
                                {score}%
                            </div>
                            <div className="text-sm text-gray-600">
                                {getScoreMessage(score)}
                            </div>
                        </div>

                        {/* Correct Answers */}
                        <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">
                                {correctAnswers}/{totalQuestions} correct
                            </span>
                        </div>

                        {/* Time Spent */}
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium">
                                {formatTime(timeSpent)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultHeader;
