import type { FlashCard } from './type';

export const mockFlashCards: FlashCard[] = [
    {
        id: '1',
        question: 'What is React?',
        answer: 'A JavaScript library for building user interfaces.',
    },
    {
        id: '2',
        question: 'What is a component?',
        answer: 'A reusable piece of UI.',
    },
    {
        id: '3',
        question: 'What is a hook in React?',
        answer: 'A special function that lets you use state and other React features.',
    },
];

// Mock API: get flashcards by projectId
export async function getFlashCards(): Promise<FlashCard[]> {
    // In real API, fetch from server using projectId
    // Here, just return mock data
    return Promise.resolve(mockFlashCards);
}

// Simulate API call with delay
export async function fetchFlashCardsMock(
    projectId: string,
    delay = 500
): Promise<FlashCard[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockFlashCards);
        }, delay);
    });
}
