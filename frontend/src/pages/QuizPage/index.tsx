import {
    QuizHeader,
    ProgressBar,
    QuestionDisplay,
    QuizNavigation,
    // QuestionGrid,
    AnswerSummary,
} from './components';
import { useQuiz } from './hooks';
import { mockQuizData } from './mockData';

const QuizPage = () => {
    const {
        currentQuestion,
        selectedAnswer,
        timeRemaining,
        answers,
        handleAnswerSelect,
        handleNextQuestion,
        handlePreviousQuestion,
        handleSubmitQuiz,
        formatTime,
        setCurrentQuestion,
        isAllQuestionsAnswered,
    } = useQuiz();

    const currentQuestionData = mockQuizData.questions[currentQuestion];
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <QuizHeader
                title={mockQuizData.title}
                currentQuestion={currentQuestion}
                totalQuestions={mockQuizData.totalQuestions}
                timeRemaining={timeRemaining}
                formatTime={formatTime}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Question Display + Progress Bar */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
                            {/* Progress Bar */}
                            <div className="p-6 border-b">
                                <ProgressBar
                                    currentQuestion={currentQuestion}
                                    totalQuestions={mockQuizData.totalQuestions}
                                    answeredCount={answeredCount}
                                />
                            </div>

                            {/* Question Display */}
                            <div className="flex-1 p-6">
                                {currentQuestionData && (
                                    <QuestionDisplay
                                        currentQuestion={currentQuestion}
                                        question={currentQuestionData.question}
                                        options={currentQuestionData.options}
                                        selectedAnswer={selectedAnswer}
                                        onAnswerSelect={handleAnswerSelect}
                                    />
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="p-6 border-t">
                                <QuizNavigation
                                    currentQuestion={currentQuestion}
                                    totalQuestions={mockQuizData.totalQuestions}
                                    selectedAnswer={selectedAnswer}
                                    isAllQuestionsAnswered={isAllQuestionsAnswered(
                                        mockQuizData.totalQuestions
                                    )}
                                    onPrevious={handlePreviousQuestion}
                                    onNext={handleNextQuestion}
                                    onSubmit={handleSubmitQuiz}
                                />
                            </div>
                        </div>

                        {/* Question Grid */}
                        {/* <QuestionGrid
                            totalQuestions={mockQuizData.totalQuestions}
                            currentQuestion={currentQuestion}
                            onQuestionSelect={setCurrentQuestion}
                        /> */}
                    </div>

                    {/* Right Column - Answer Summary */}
                    <div className="lg:col-span-1">
                        <div className="h-full">
                            <AnswerSummary
                                totalQuestions={mockQuizData.totalQuestions}
                                answers={answers}
                                currentQuestion={currentQuestion}
                                onQuestionSelect={setCurrentQuestion}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
