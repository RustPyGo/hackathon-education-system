import type { Overview } from './type';

const MOCK_OVERVIEW: Overview = {
    project_id: '12345',
    overview:
        'This is a mock AI-generated overview for your project. It summarizes the key concepts and insights extracted from your uploaded content. Use this to quickly grasp the main ideas and structure your study plan.',
    updated_at: new Date().toISOString(),
};

const MOCK_PDF_FILES = [
    { label: 'Document1.pdf', url: 'https://example.com/Document1.pdf' },
    { label: 'Lecture2.pdf', url: 'https://example.com/Lecture2.pdf' },
    { label: 'Summary3.pdf', url: 'https://example.com/Summary3.pdf' },
];

export async function fetchOverview(projectId: string): Promise<Overview> {
    await new Promise((res) => setTimeout(res, 400));
    // Always return the mock overview for the demo
    return { ...MOCK_OVERVIEW, project_id: projectId };
}

export async function fetchPdfFiles(
    projectId: string
): Promise<{ label: string; url: string }[]> {
    await new Promise((res) => setTimeout(res, 200));
    // Always return the mock pdf files for the demo
    return MOCK_PDF_FILES;
}
