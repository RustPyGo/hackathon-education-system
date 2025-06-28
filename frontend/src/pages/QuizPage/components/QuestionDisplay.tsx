interface QuestionDisplayProps {
    currentQuestion: number;
    question: string;
    options: Record<string, string>;
    selectedAnswer: string | null;
    onAnswerSelect: (answer: string) => void;
}

const QuestionDisplay = ({
    currentQuestion,
    question,
    options,
    selectedAnswer,
    onAnswerSelect,
}: QuestionDisplayProps) => {
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                    Question {currentQuestion + 1}
                </span>
                <span className="text-gray-500 text-sm">Multiple Choice</span>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-6">
                {question}
            </h2>

            <div className="space-y-3">
                {Object.entries(options).map(([key, value]) => (
                    <div
                        key={key}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedAnswer === key
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => onAnswerSelect(key)}
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedAnswer === key
                                        ? 'border-primary-500 bg-primary-500'
                                        : 'border-gray-300'
                                }`}
                            >
                                {selectedAnswer === key && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <span className="font-medium text-gray-700 mr-2">
                                {key}.
                            </span>
                            <span className="text-gray-900">{value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionDisplay;
