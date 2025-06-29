import { CREATE_PROJECT_URL, GET_PROJECTS_URL } from './constant';
import { Project } from './type';
import apiClient from '@/api-client';
import { BASE_URL_DEFAULT } from '@/api-client/constants';

export const getProjects = async () => {
    const response = await fetch(`${BASE_URL_DEFAULT}${GET_PROJECTS_URL}`);
    const responseData = await response.json();
    return responseData.data;
};

export const getProject = async (id: string): Promise<Project> => {
    const response = await apiClient.get(`${GET_PROJECTS_URL}/${id}`);
    return response.data;
};

export const createProject = async (project: Project): Promise<Project> => {
    const response = await apiClient.post(CREATE_PROJECT_URL, project);
    return response.data;
};
