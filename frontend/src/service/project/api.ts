import { Project } from './type';
import { delay } from '@/lib/utils';

export const getProjects = async (): Promise<Project[]> => {
    const response = await fetch('http://localhost:3001/api/v1/project', {
        method: 'GET',
    });
    const result = await response.json();
    console.log(result);
    return result.data;
};

export const createProject = async (formData: FormData) => {
    // Create new FormData with correct field names for backe

    const response = await fetch('http://localhost:3001/api/v1/project', {
        method: 'POST',

        body: formData,
    });
    const result = await response.json();
    console.log(result);
    return result.data;
};
