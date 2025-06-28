import { Clock } from 'lucide-react';

interface QuizHeaderProps {
    title: string;
    currentQuestion: number;
    totalQuestions: number;
    timeRemaining: number;
    formatTime: (seconds: number) => string;
}

const QuizHeader = ({
    title,
    currentQuestion,
    totalQuestions,
    timeRemaining,
    formatTime,
}: QuizHeaderProps) => {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-lg">
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Question {currentQuestion + 1} of {totalQuestions}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizHeader;
