import { GET_PROJECT_BY_ID } from './constant';
import type { Overview3 as Overview, Project } from './type';
import { BASE_URL_DEFAULT } from '@/api-client/constants';

const MOCK_OVERVIEW: Overview = {
    project_id: '12345',
    overview:
        'This is a mock AI-generated overview for your project. It summarizes the key concepts and insights extracted from your uploaded content. Use this to quickly grasp the main ideas and structure your study plan.',
    updated_at: new Date().toISOString(),
};

const MOCK_PROJECT: Project = {
    id: '12345',
    title: 'Learning Project',
    created_at: new Date().toISOString(),
    file_url: 'https://example.com/Document1.pdf',
    overview:
        'This is a mock AI-generated overview for your project. It summarizes the key concepts and insights extracted from your uploaded content. Use this to quickly grasp the main ideas and structure your study plan.',
};

const MOCK_PDF_FILES = [
    { label: 'Document1.pdf', url: 'https://example.com/Document1.pdf' },
    { label: 'Lecture2.pdf', url: 'https://example.com/Lecture2.pdf' },
    { label: 'Summary3.pdf', url: 'https://example.com/Summary3.pdf' },
];

export async function fetchOverview(projectId: string): Promise<Overview> {
    const response = await fetch(
        `${BASE_URL_DEFAULT}${GET_PROJECT_BY_ID}/${projectId}`
    );
    const responseData = await response.json();
    return responseData.data;
}

export async function fetchProject(projectId: string): Promise<Project> {
    await new Promise((res) => setTimeout(res, 200));
    return { ...MOCK_PROJECT, id: projectId };
}

export async function fetchPdfFiles(): Promise<
    { label: string; url: string }[]
> {
    await new Promise((res) => setTimeout(res, 200));
    // Always return the mock pdf files for the demo
    return MOCK_PDF_FILES;
}

export async function getOverview(): Promise<Overview> {
    // In real API, fetch from server using projectId
    // Here, just return mock data
    return Promise.resolve(MOCK_OVERVIEW);
}
