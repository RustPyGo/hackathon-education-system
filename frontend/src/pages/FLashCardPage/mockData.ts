export interface FlashCard {
    id: string;
    front: string;
    back: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isLearned: boolean;
    lastReviewed?: string;
    reviewCount: number;
    correctCount: number;
}

export interface FlashCardDeck {
    id: string;
    title: string;
    description: string;
    subject: string;
    totalCards: number;
    learnedCards: number;
    createdAt: string;
    lastStudied?: string;
    cards: FlashCard[];
}

export interface StudySession {
    id: string;
    deckId: string;
    startTime: string;
    endTime?: string;
    cardsReviewed: number;
    correctAnswers: number;
    incorrectAnswers: number;
}

export const mockFlashCardDeck: FlashCardDeck = {
    id: 'deck-001',
    title: 'JavaScript Fundamentals',
    description: 'Essential JavaScript concepts and definitions',
    subject: 'JavaScript',
    totalCards: 12,
    learnedCards: 8,
    createdAt: '2024-01-01T00:00:00Z',
    lastStudied: '2024-01-15T10:30:00Z',
    cards: [
        {
            id: 'card-001',
            front: 'What is the output of console.log(typeof null)?',
            back: 'object - In JavaScript, typeof null returns "object". This is a known quirk in the language that has persisted for historical reasons.',
            category: 'Data Types',
            difficulty: 'medium',
            isLearned: true,
            lastReviewed: '2024-01-15T10:30:00Z',
            reviewCount: 5,
            correctCount: 4,
        },
        {
            id: 'card-002',
            front: 'Which method removes the last element from an array?',
            back: 'pop() - The pop() method removes and returns the last element from an array. Use shift() to remove the first element.',
            category: 'Array Methods',
            difficulty: 'easy',
            isLearned: true,
            lastReviewed: '2024-01-14T15:45:00Z',
            reviewCount: 3,
            correctCount: 3,
        },
        {
            id: 'card-003',
            front: 'What is closure in JavaScript?',
            back: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
            category: 'Closures',
            difficulty: 'hard',
            isLearned: false,
            reviewCount: 2,
            correctCount: 1,
        },
        {
            id: 'card-004',
            front: 'How do you declare a constant in JavaScript?',
            back: 'const - The const keyword declares a block-scoped constant that cannot be reassigned. However, for objects and arrays, the properties can still be modified.',
            category: 'Variables',
            difficulty: 'easy',
            isLearned: true,
            lastReviewed: '2024-01-13T09:20:00Z',
            reviewCount: 4,
            correctCount: 4,
        },
        {
            id: 'card-005',
            front: 'What is the difference between == and ===?',
            back: '== performs type coercion and checks value equality, while === checks both value and type equality without coercion. Always use === for strict equality.',
            category: 'Operators',
            difficulty: 'medium',
            isLearned: false,
            reviewCount: 1,
            correctCount: 0,
        },
        {
            id: 'card-006',
            front: 'What is hoisting in JavaScript?',
            back: "Hoisting is JavaScript's default behavior of moving declarations to the top of their scope. Variable and function declarations are hoisted, but not their initializations.",
            category: 'Scope & Hoisting',
            difficulty: 'medium',
            isLearned: true,
            lastReviewed: '2024-01-12T14:15:00Z',
            reviewCount: 3,
            correctCount: 2,
        },
        {
            id: 'card-007',
            front: 'What is the event loop?',
            back: 'The event loop is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded. It continuously checks the call stack and processes tasks from the callback queue.',
            category: 'Asynchronous',
            difficulty: 'hard',
            isLearned: false,
            reviewCount: 1,
            correctCount: 0,
        },
        {
            id: 'card-008',
            front: 'What is destructuring assignment?',
            back: 'Destructuring assignment is a syntax that allows you to extract values from arrays or properties from objects into distinct variables. Example: const [a, b] = [1, 2];',
            category: 'ES6+',
            difficulty: 'medium',
            isLearned: true,
            lastReviewed: '2024-01-11T11:30:00Z',
            reviewCount: 2,
            correctCount: 2,
        },
        {
            id: 'card-009',
            front: 'What is a promise?',
            back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It has three states: pending, fulfilled, and rejected.',
            category: 'Asynchronous',
            difficulty: 'medium',
            isLearned: true,
            lastReviewed: '2024-01-10T16:45:00Z',
            reviewCount: 4,
            correctCount: 3,
        },
        {
            id: 'card-010',
            front: 'What is the spread operator?',
            back: 'The spread operator (...) allows an iterable to be expanded in places where zero or more arguments or elements are expected. It can be used with arrays, objects, and function arguments.',
            category: 'ES6+',
            difficulty: 'easy',
            isLearned: true,
            lastReviewed: '2024-01-09T13:20:00Z',
            reviewCount: 3,
            correctCount: 3,
        },
        {
            id: 'card-011',
            front: 'What is the difference between let and var?',
            back: 'let is block-scoped while var is function-scoped. let does not allow redeclaration in the same scope, and let variables are not hoisted. var allows redeclaration and is hoisted.',
            category: 'Variables',
            difficulty: 'medium',
            isLearned: false,
            reviewCount: 1,
            correctCount: 0,
        },
        {
            id: 'card-012',
            front: 'What is a callback function?',
            back: 'A callback function is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action.',
            category: 'Functions',
            difficulty: 'easy',
            isLearned: true,
            lastReviewed: '2024-01-08T10:15:00Z',
            reviewCount: 2,
            correctCount: 2,
        },
    ],
};

export const mockStudySessions: StudySession[] = [
    {
        id: 'session-001',
        deckId: 'deck-001',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:30:00Z',
        cardsReviewed: 8,
        correctAnswers: 6,
        incorrectAnswers: 2,
    },
    {
        id: 'session-002',
        deckId: 'deck-001',
        startTime: '2024-01-14T15:00:00Z',
        endTime: '2024-01-14T15:45:00Z',
        cardsReviewed: 6,
        correctAnswers: 5,
        incorrectAnswers: 1,
    },
    {
        id: 'session-003',
        deckId: 'deck-001',
        startTime: '2024-01-13T09:00:00Z',
        endTime: '2024-01-13T09:20:00Z',
        cardsReviewed: 4,
        correctAnswers: 4,
        incorrectAnswers: 0,
    },
];
