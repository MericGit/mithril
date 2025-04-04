export interface Author {
  name: string;
  country: string;
  affiliation: string;
}

export interface Keyword {
  keyword: string;
  relevance: number;
}

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskFactor {
  type: RiskLevel;
  category: string;
  description: string;
  relatedKeywords: string[];
  potentialImpact: string;
  mitigationSuggestion: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  publishedDate: string;
  addedDate: string;
  citations: number;
  doi: string;
  topics: string[];
  keywords: Keyword[];
  journal: string;
  riskFactors: RiskFactor[];
  
  // Additional fields from data.json
  paper_summary?: string;
  presumed_publish_country?: string;
  risk_score?: number;
  author_info?: string[];
  topics_relevence?: number[];
}