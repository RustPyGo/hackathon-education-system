import type { QuizResult } from '../mockData';
import { useState, useMemo } from 'react';

interface UseResultProps {
    quizResult: QuizResult;
}

export const useResult = ({ quizResult }: UseResultProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    const currentQuestion = quizResult.questions[currentQuestionIndex];

    const filteredQuestions = useMemo(() => {
        if (!selectedSkill) return quizResult.questions;
        return quizResult.questions.filter((q) => q.skill === selectedSkill);
    }, [quizResult.questions, selectedSkill]);

    const correctQuestions = useMemo(() => {
        return quizResult.questions.filter((q) => q.isCorrect);
    }, [quizResult.questions]);

    const incorrectQuestions = useMemo(() => {
        return quizResult.questions.filter((q) => !q.isCorrect);
    }, [quizResult.questions]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    };

    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case 'strong':
                return 'text-green-600 bg-green-100';
            case 'average':
                return 'text-yellow-600 bg-yellow-100';
            case 'weak':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'text-green-600 bg-green-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'hard':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return '🎥';
            case 'article':
                return '📄';
            case 'practice':
                return '💻';
            case 'book':
                return '📚';
            default:
                return '📖';
        }
    };

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const handleSkillSelect = (skill: string | null) => {
        setSelectedSkill(skill);
        setCurrentQuestionIndex(0);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < filteredQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return {
        currentQuestionIndex,
        currentQuestion,
        filteredQuestions,
        correctQuestions,
        incorrectQuestions,
        selectedSkill,
        formatTime,
        getStrengthColor,
        getDifficultyColor,
        getTypeIcon,
        handleQuestionSelect,
        handleSkillSelect,
        handleNextQuestion,
        handlePreviousQuestion,
    };
};
