import { useState, useEffect } from 'react';

export const useQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [timeRemaining] = useState(1800);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    // Update selectedAnswer when currentQuestion changes
    useEffect(() => {
        setSelectedAnswer(answers[currentQuestion] || null);
    }, [currentQuestion, answers]);

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: answer,
        }));
    };

    const handleNextQuestion = (totalQuestions: number) => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmitQuiz = () => {
        // Logic submit sẽ được implement sau
        console.log('Submit quiz', answers);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isAllQuestionsAnswered = (totalQuestions: number) => {
        return Object.keys(answers).length === totalQuestions;
    };

    return {
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
    };
};
