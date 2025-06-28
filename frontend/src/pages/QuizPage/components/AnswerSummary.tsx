import { CheckCircle, Circle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AnswerSummaryProps {
    totalQuestions: number;
    answers: Record<number, string>;
    currentQuestion: number;
    onQuestionSelect: (index: number) => void;
}

const AnswerSummary = ({
    totalQuestions,
    answers,
    currentQuestion,
    onQuestionSelect,
}: AnswerSummaryProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const questionsPerPage = 8;
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);

    const startIndex = currentPage * questionsPerPage;
    const endIndex = Math.min(startIndex + questionsPerPage, totalQuestions);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const answeredCount = Object.keys(answers).length;
    const remainingCount = totalQuestions - answeredCount;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Answer Summary
            </h3>

            {/* Progress Stats */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress:</span>
                    <span className="font-medium text-primary-600">
                        {Math.round((answeredCount / totalQuestions) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${(answeredCount / totalQuestions) * 100}%`,
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs mt-2 text-gray-500">
                    <span>{answeredCount} answered</span>
                    <span>{remainingCount} remaining</span>
                </div>
            </div>

            {/* Questions List */}
            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
                {Array.from({ length: endIndex - startIndex }, (_, i) => {
                    const index = startIndex + i;
                    const hasAnswer = answers[index];
                    const isCurrent = index === currentQuestion;

                    return (
                        <button
                            key={index}
                            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                                isCurrent
                                    ? 'bg-primary-50 border-primary-300'
                                    : hasAnswer
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                            onClick={() => onQuestionSelect(index)}
                        >
                            <div className="flex items-center space-x-2">
                                {hasAnswer ? (
                                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                ) : (
                                    <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                                <span
                                    className={`text-sm font-medium ${
                                        isCurrent
                                            ? 'text-primary-700'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    Q{index + 1}
                                </span>
                            </div>
                            {hasAnswer && (
                                <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                    {answers[index]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`w-8 h-8 text-xs rounded ${
                                    i === currentPage
                                        ? 'bg-primary-500 text-white'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-green-50 rounded">
                        <div className="font-medium text-green-700">
                            {answeredCount}
                        </div>
                        <div className="text-green-600">Answered</div>
                    </div>
                    <div className="text-center p-2 bg-orange-50 rounded">
                        <div className="font-medium text-orange-700">
                            {remainingCount}
                        </div>
                        <div className="text-orange-600">Remaining</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnswerSummary;
