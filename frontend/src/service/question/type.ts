export interface QuestionChoice {
    id: string;
    content: string;
    explanation: string;
    isCorrect: boolean;
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
    id: string;
    content: string;
    difficulty: QuestionDifficulty;
    hint: string;
    choices: QuestionChoice[];
}
