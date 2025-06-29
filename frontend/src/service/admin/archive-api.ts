// Mock API for archived data
import { Project } from '@/service/project';

export const getArchivedProjects = async (): Promise<Project[]> => {
    return [
        {
            id: 'archived-1',
            title: 'Archived Project Alpha',
            overview: 'This project was archived for demonstration.',
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        },
        {
            id: 'archived-2',
            title: 'Archived Project Beta',
            overview: 'Another archived project for mock testing.',
            createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        },
    ];
};

export const getArchivedUsers = async () => [
    {
        id: 1,
        name: 'Archived Alice',
        email: 'archived.alice@example.com',
        role: 'Student',
        status: 'Inactive',
        projects: 1,
        joinDate: '2023-10-01',
    },
    {
        id: 2,
        name: 'Archived Bob',
        email: 'archived.bob@example.com',
        role: 'Instructor',
        status: 'Inactive',
        projects: 2,
        joinDate: '2023-09-15',
    },
];

// Feature API for table actions (mock)

export const archiveProject = async (id: string) => {
    // Simulate archiving a project
    return { success: true, id };
};

export const reviveProject = async (id: string) => {
    // Simulate reviving a project
    return { success: true, id };
};

export const archiveUser = async (id: number) => {
    // Simulate archiving a user
    return { success: true, id };
};

export const reviveUser = async (id: number) => {
    // Simulate reviving a user
    return { success: true, id };
};
