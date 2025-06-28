export interface QuizResult {
    id: string;
    title: string;
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    timeSpent: number;
    completedAt: string;
    questions: QuestionResult[];
    skillAnalysis: SkillAnalysis[];
    studyRecommendations: StudyRecommendation[];
}

export interface QuestionResult {
    id: number;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    skill: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export interface SkillAnalysis {
    skill: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    strength: 'weak' | 'average' | 'strong';
}

export interface StudyRecommendation {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'practice' | 'book';
    url?: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
}

export const mockQuizResult: QuizResult = {
    id: 'quiz-001',
    title: 'JavaScript Fundamentals Quiz',
    totalQuestions: 20,
    correctAnswers: 15,
    score: 75,
    timeSpent: 1841, // 30 minutes in seconds
    completedAt: '2024-01-15T10:30:00Z',
    questions: [
        {
            id: 1,
            question: 'What is the output of console.log(typeof null)?',
            userAnswer: 'object',
            correctAnswer: 'object',
            isCorrect: true,
            explanation:
                'In JavaScript, typeof null returns "object". This is a known quirk in the language that has persisted for historical reasons. null is actually a primitive value, not an object.',
            skill: 'Data Types',
            difficulty: 'medium',
        },
        {
            id: 2,
            question: 'Which method removes the last element from an array?',
            userAnswer: 'shift()',
            correctAnswer: 'pop()',
            isCorrect: false,
            explanation:
                'The pop() method removes and returns the last element from an array. shift() removes the first element. Use pop() when you want to remove from the end.',
            skill: 'Array Methods',
            difficulty: 'easy',
        },
        {
            id: 3,
            question: 'What is closure in JavaScript?',
            userAnswer:
                'A function that has access to variables in its outer scope',
            correctAnswer:
                'A function that has access to variables in its outer scope',
            isCorrect: true,
            explanation:
                'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
            skill: 'Closures',
            difficulty: 'hard',
        },
        {
            id: 4,
            question: 'How do you declare a constant in JavaScript?',
            userAnswer: 'const',
            correctAnswer: 'const',
            isCorrect: true,
            explanation:
                'The const keyword declares a block-scoped constant that cannot be reassigned. However, for objects and arrays, the properties can still be modified.',
            skill: 'Variables',
            difficulty: 'easy',
        },
        {
            id: 5,
            question: 'What is the difference between == and ===?',
            userAnswer: '== checks value and type, === checks only value',
            correctAnswer: '== checks value only, === checks value and type',
            isCorrect: false,
            explanation:
                '== performs type coercion and checks value equality, while === checks both value and type equality without coercion. Always use === for strict equality.',
            skill: 'Operators',
            difficulty: 'medium',
        },
    ],
    skillAnalysis: [
        {
            skill: 'Data Types',
            totalQuestions: 4,
            correctAnswers: 3,
            percentage: 75,
            strength: 'strong',
        },
        {
            skill: 'Array Methods',
            totalQuestions: 3,
            correctAnswers: 1,
            percentage: 33,
            strength: 'weak',
        },
        {
            skill: 'Closures',
            totalQuestions: 2,
            correctAnswers: 2,
            percentage: 100,
            strength: 'strong',
        },
        {
            skill: 'Variables',
            totalQuestions: 3,
            correctAnswers: 3,
            percentage: 100,
            strength: 'strong',
        },
        {
            skill: 'Operators',
            totalQuestions: 2,
            correctAnswers: 0,
            percentage: 0,
            strength: 'weak',
        },
    ],
    studyRecommendations: [
        {
            id: 'rec-001',
            title: 'JavaScript Array Methods Mastery',
            description:
                'Learn all essential array methods including pop, push, shift, unshift, and more with practical examples.',
            type: 'video',
            url: 'https://example.com/array-methods',
            difficulty: 'beginner',
            estimatedTime: '45 minutes',
        },
        {
            id: 'rec-002',
            title: 'Understanding JavaScript Operators',
            description:
                'Deep dive into comparison operators, logical operators, and type coercion in JavaScript.',
            type: 'article',
            url: 'https://example.com/operators',
            difficulty: 'intermediate',
            estimatedTime: '20 minutes',
        },
        {
            id: 'rec-003',
            title: 'JavaScript Closures Practice',
            description:
                'Practice exercises to master closures, scope, and lexical environment concepts.',
            type: 'practice',
            difficulty: 'intermediate',
            estimatedTime: '60 minutes',
        },
        {
            id: 'rec-004',
            title: "You Don't Know JS: Types & Grammar",
            description:
                'Comprehensive book covering JavaScript types, coercion, and grammar in detail.',
            type: 'book',
            difficulty: 'advanced',
            estimatedTime: '4 hours',
        },
    ],
};
