import type { QuestionResult } from '../mockData';
import {
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    BookOpen,
} from 'lucide-react';

interface QuestionReviewProps {
    question: QuestionResult;
    currentIndex: number;
    totalQuestions: number;
    onPrevious: () => void;
    onNext: () => void;
    getDifficultyColor: (difficulty: string) => string;
}

const QuestionReview = ({
    question,
    currentIndex,
    totalQuestions,
    onPrevious,
    onNext,
    getDifficultyColor,
}: QuestionReviewProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-primary-600" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Question Review
                            </h2>
                        </div>
                        <span className="text-sm text-gray-500">
                            {currentIndex + 1} of {totalQuestions}
                        </span>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                            question.difficulty
                        )}`}
                    >
                        {question.difficulty}
                    </span>
                </div>
            </div>

            {/* Question Content */}
            <div className="p-6">
                <div className="space-y-6">
                    {/* Question */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {question.question}
                        </h3>
                    </div>

                    {/* Answers */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-700">
                                Your answer:
                            </span>
                            <div className="flex items-center space-x-2">
                                {question.isCorrect ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                )}
                                <span
                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                        question.isCorrect
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {question.userAnswer}
                                </span>
                            </div>
                        </div>

                        {!question.isCorrect && (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700">
                                    Correct answer:
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-800">
                                    {question.correctAnswer}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Explanation */}
                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">
                            Explanation
                        </h4>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            {question.explanation}
                        </p>
                    </div>

                    {/* Skill */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                            Skill:
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {question.skill}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onPrevious}
                        disabled={currentIndex === 0}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <div className="text-sm text-gray-500">
                        Question {currentIndex + 1} of {totalQuestions}
                    </div>

                    <button
                        onClick={onNext}
                        disabled={currentIndex === totalQuestions - 1}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionReview;
