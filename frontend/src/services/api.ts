import { ResearchPaper } from '../types/Paper';

// Interface for publication data returned by the API
export interface PublicationData {
  years: number[];
  countries: {
    name: string;
    color: string;
    flag: string;
    data: number[];
  }[];
}

const API_BASE_URL = 'http://localhost:8000/api';

interface FilterParams {
  keyword?: string;
  keywords?: string[];
  topics?: string[];
  authors?: string[];
  countries?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export const getPapers = async (filters?: FilterParams): Promise<ResearchPaper[]> => {
  const params = new URLSearchParams();
  
  if (filters) {
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.keywords?.length) params.append('keywords', filters.keywords.join(','));
    if (filters.topics?.length) params.append('topics', filters.topics.join(','));
    if (filters.authors?.length) params.append('authors', filters.authors.join(','));
    if (filters.countries?.length) params.append('countries', filters.countries.join(','));
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);
  }

  const queryString = params.toString();
  const url = `${API_BASE_URL}/papers${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
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

export async function uploadPaper(
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<ResearchPaper> {
  const xhr = new XMLHttpRequest();
  
  return new Promise((resolve, reject) => {
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (err) {
          reject(new Error('Invalid response format'));
        }
      } else {
        reject(new Error('Upload failed'));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error'));
    };

    xhr.open('POST', `${API_BASE_URL}/papers/upload`);
    xhr.send(formData);
  });
}

export const getPublicationsData = async (): Promise<PublicationData> => {
  const response = await fetch(`${API_BASE_URL}/publications-data`);
  if (!response.ok) {
    throw new Error('Failed to fetch publications data');
  }
  return response.json();
};
