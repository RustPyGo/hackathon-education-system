import { Project } from './type';

export const getProjects = async (): Promise<Project[]> => {
    return [
        {
            id: '1',
            title: 'Machine Learning Fundamentals',
            overview:
                'This comprehensive PDF document covers the fundamental concepts of machine learning, including supervised and unsupervised learning algorithms, neural networks, and practical applications in various industries.',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
            id: '2',
            title: 'Data Structures and Algorithms',
            overview:
                'An in-depth exploration of essential data structures and algorithms, covering arrays, linked lists, trees, graphs, sorting algorithms, and their time complexity analysis with practical implementation examples.',
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
            id: '3',
            title: 'Introduction to Statistics',
            overview:
                'A foundational guide to statistical concepts including descriptive statistics, probability distributions, hypothesis testing, and statistical inference methods used in data analysis.',
            createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        },
    ];
};
