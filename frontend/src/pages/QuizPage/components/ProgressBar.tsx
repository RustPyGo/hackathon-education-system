interface ProgressBarProps {
    currentQuestion: number;
    totalQuestions: number;
    answeredCount: number;
}

const ProgressBar = ({
    currentQuestion,
    totalQuestions,
    answeredCount,
}: ProgressBarProps) => {
    const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;
    const answeredPercentage = (answeredCount / totalQuestions) * 100;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">
                        Progress: {Math.round(progressPercentage)}%
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-green-600">
                        {answeredCount} answered
                    </span>
                    <span className="text-sm text-orange-600">
                        {totalQuestions - answeredCount} remaining
                    </span>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                {/* Progress based on current question */}
                <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />

                {/* Answered questions overlay */}
                <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300 absolute top-0 left-0"
                    style={{ width: `${answeredPercentage}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
                <span>Current progress</span>
                <span>Answered questions</span>
            </div>
        </div>
    );
};

export default ProgressBar;
