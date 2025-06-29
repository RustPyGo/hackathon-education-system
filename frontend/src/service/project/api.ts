import { withAuth } from '@workos-inc/authkit-nextjs';
import { Project } from './type';

export const getProjects = async (): Promise<Project[]> => {
    const response = await fetch('http://localhost:3001/api/v1/project', {
        method: 'GET',
    });
    const result = await response.json();
    console.log(result);
    return result.data;
};

export const createProject = async (
    title: string,
    duration: string,
    files: File[],
) => {
    const { user } = await withAuth({ ensureSignedIn: true });

    const formData = new FormData();
    console.log(user);

    formData.append('user_id', user.id);
    formData.append('name', title.trim());
    formData.append('exam_duration', duration.trim());
    formData.append('total_questions', "10");

    console.log(formData);

    // Add files

    // Simulate processing steps
    files.forEach((file) => {
        formData.append('pdf', file);
    });

    // Call the API service
    const result = await fetch('http://localhost:3001/api/v1/project', {
        method: 'POST',
        body: formData,
    });

    const data = await result.json();

    return data;
};
