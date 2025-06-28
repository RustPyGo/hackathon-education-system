import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuestionGridProps {
    totalQuestions: number;
    currentQuestion: number;
    onQuestionSelect: (index: number) => void;
}

const QuestionGrid = ({
    totalQuestions,
    currentQuestion,
    onQuestionSelect,
}: QuestionGridProps) => {
    const questionsPerRow = 5;
    const maxRows = 4;
    const maxVisibleQuestions = questionsPerRow * maxRows;

    return (
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    Question Navigation
                </h3>
                <div className="text-sm text-gray-500">
                    {currentQuestion + 1} of {totalQuestions}
                </div>
            </div>

            <div className="relative">
                {/* Grid Container with Scroll */}
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-5 gap-2 min-w-max">
                        {Array.from({ length: totalQuestions }, (_, index) => (
                            <button
                                key={index}
                                className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                                    index === currentQuestion
                                        ? 'bg-primary-500 text-white border-primary-500'
                                        : index < currentQuestion
                                        ? 'bg-green-100 text-green-800 border-green-200'
                                        : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                                onClick={() => onQuestionSelect(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicators */}
                {totalQuestions > maxVisibleQuestions && (
                    <div className="flex justify-between items-center mt-4">
                        <div className="text-xs text-gray-500">
                            Scroll to see more questions
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    const container =
                                        document.querySelector(
                                            '.overflow-x-auto'
                                        );
                                    if (container) {
                                        container.scrollBy({
                                            left: -200,
                                            behavior: 'smooth',
                                        });
                                    }
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    const container =
                                        document.querySelector(
                                            '.overflow-x-auto'
                                        );
                                    if (container) {
                                        container.scrollBy({
                                            left: 200,
                                            behavior: 'smooth',
                                        });
                                    }
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Jump */}
            <div className="mt-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Jump to:</span>
                    <div className="flex space-x-1">
                        {Array.from(
                            { length: Math.ceil(totalQuestions / 10) },
                            (_, i) => {
                                const start = i * 10;
                                const end = Math.min(
                                    start + 9,
                                    totalQuestions - 1
                                );
                                return (
                                    <button
                                        key={i}
                                        onClick={() => onQuestionSelect(start)}
                                        className={`px-2 py-1 text-xs rounded ${
                                            currentQuestion >= start &&
                                            currentQuestion <= end
                                                ? 'bg-primary-100 text-primary-700'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {start + 1}-{end + 1}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionGrid;
