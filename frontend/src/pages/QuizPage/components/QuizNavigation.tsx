import Button from '../../../components/Button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface QuizNavigationProps {
    currentQuestion: number;
    totalQuestions: number;
    selectedAnswer: string | null;
    isAllQuestionsAnswered: boolean;
    onPrevious: () => void;
    onNext: (totalQuestions: number) => void;
    onSubmit: () => void;
}

const QuizNavigation = ({
    currentQuestion,
    totalQuestions,
    selectedAnswer,
    isAllQuestionsAnswered,
    onPrevious,
    onNext,
    onSubmit,
}: QuizNavigationProps) => {
    return (
        <div className="flex justify-between items-center">
            <Button
                mode="outlined"
                colorScheme="primary"
                size="medium"
                onClick={onPrevious}
                disabled={currentQuestion === 0}
            >
                <ArrowLeft className="w-4 h-4" />
                Previous
            </Button>

            <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                    {currentQuestion + 1} of {totalQuestions} questions
                </div>

                {currentQuestion === totalQuestions - 1 ? (
                    <Button
                        mode="contained"
                        colorScheme="primary"
                        size="medium"
                        onClick={onSubmit}
                        disabled={!isAllQuestionsAnswered}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Submit Quiz
                    </Button>
                ) : (
                    <Button
                        mode="contained"
                        colorScheme="primary"
                        size="medium"
                        onClick={() => onNext(totalQuestions)}
                        disabled={!selectedAnswer}
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default QuizNavigation;
