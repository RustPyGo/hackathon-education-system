import {
    ResultHeader,
    SkillAnalysis,
    QuestionReview,
    StudyRecommendations,
} from './components';
import { useResult } from './hooks/useResult';
import { mockQuizResult } from './mockData';

const ResultPage = () => {
    const {
        currentQuestionIndex,
        currentQuestion,
        filteredQuestions,
        selectedSkill,
        formatTime,
        getStrengthColor,
        getDifficultyColor,
        getTypeIcon,
        handleSkillSelect,
        handleNextQuestion,
        handlePreviousQuestion,
    } = useResult({ quizResult: mockQuizResult });

    if (!currentQuestion) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        No questions found
                    </h1>
                    <p className="text-gray-600">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ResultHeader
                title={mockQuizResult.title}
                score={mockQuizResult.score}
                totalQuestions={mockQuizResult.totalQuestions}
                correctAnswers={mockQuizResult.correctAnswers}
                timeSpent={mockQuizResult.timeSpent}
                formatTime={formatTime}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Question Review & Study Recommendations */}
                    <div className="lg:col-span-2 space-y-8">
                        <QuestionReview
                            question={currentQuestion}
                            currentIndex={currentQuestionIndex}
                            totalQuestions={filteredQuestions.length}
                            onPrevious={handlePreviousQuestion}
                            onNext={handleNextQuestion}
                            getDifficultyColor={getDifficultyColor}
                        />

                        <StudyRecommendations
                            recommendations={
                                mockQuizResult.studyRecommendations
                            }
                            getTypeIcon={getTypeIcon}
                        />
                    </div>

                    {/* Right Column - Skill Analysis */}
                    <div className="lg:col-span-1">
                        <SkillAnalysis
                            skills={mockQuizResult.skillAnalysis}
                            selectedSkill={selectedSkill}
                            onSkillSelect={handleSkillSelect}
                            getStrengthColor={getStrengthColor}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPage;
