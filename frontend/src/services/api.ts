import { ResearchPaper } from '../types/Paper';

const API_BASE_URL = 'http://localhost:8000/api';

export const getPapers = async (): Promise<ResearchPaper[]> => {
  const response = await fetch(`${API_BASE_URL}/papers`);
  if (!response.ok) {
    throw new Error('Failed to fetch papers');
  }
  return response.json();
};

export const getPaper = async (id: string): Promise<ResearchPaper> => {
  const response = await fetch(`${API_BASE_URL}/papers/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch paper');
  }
  return response.json();
};
