export interface Author {
  name: string;
  country: string;
  affiliation: string;
}

export interface PaperKeyword {
  keyword: string;
  relevance: number;  // 0-1 score indicating relevance
}

export interface ResearchPaper {
  id: string;
  title: string;
  abstract: string;
  authors: Author[];
  publishedDate: string;
  citations: number;
  doi: string;
  topics: string[];
  keywords: PaperKeyword[];
  journal: string;
}
