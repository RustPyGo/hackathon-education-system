import { Question } from './type';

export const getQuestions = async (_projectId: string): Promise<Question[]> => {
    return [
        {
            id: '1',
            content: 'What is the primary goal of machine learning?',
            difficulty: 'medium',
            hint: 'Hint',
            choices: [
                {
                    id: '1',
                    content: 'To replace human intelligence completely',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '2',
                    content:
                        'To enable computers to learn and make decisions from data without explicit programming',
                    explanation: 'No explanation',
                    isCorrect: true,
                },
                {
                    id: '3',
                    content: 'To create faster computers',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '4',
                    content: 'To store large amounts of data efficiently',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
            ],
        },
        {
            id: '2',
            content:
                'Which of the following is an example of supervised learning?',
            difficulty: 'medium',
            hint: 'Hint',
            choices: [
                {
                    id: '5',
                    content: 'Customer segmentation',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '6',
                    content: 'Email spam classification',
                    explanation: 'No explanation',
                    isCorrect: true,
                },
                {
                    id: '7',
                    content: 'Data compression',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '8',
                    content: 'Anomaly detection',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
            ],
        },
        {
            id: '3',
            content: 'What is overfitting in machine learning?',
            difficulty: 'hard',
            hint: 'Hint',
            choices: [
                {
                    id: '9',
                    content: 'When a model is too simple',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '10',
                    content:
                        'When a model performs well on training data but poorly on new data',
                    explanation: 'No explanation',
                    isCorrect: true,
                },
                {
                    id: '11',
                    content: 'When training takes too long',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '12',
                    content: 'Anomaly detection',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
            ],
        },
        {
            id: '4',
            content: 'What does a p-value represent in hypothesis testing?',
            difficulty: 'hard',
            hint: 'Hint',
            choices: [
                {
                    id: '13',
                    content: 'The probability that the null hypothesis is true',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '14',
                    content:
                        'The probability of observing the data given that the null hypothesis is true',
                    explanation: 'No explanation',
                    isCorrect: true,
                },
                {
                    id: '15',
                    content: 'The probability of making a Type I error',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
                {
                    id: '16',
                    content: 'The confidence level of the test',
                    explanation: 'No explanation',
                    isCorrect: false,
                },
            ],
        },
    ];
};
