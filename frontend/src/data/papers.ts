import { ResearchPaper } from '../types/Paper';

export const samplePapers: ResearchPaper[] = [
  {
    id: "1",
    title: "Advances in Quantum Computing: A Survey of Recent Developments",
    abstract: "This comprehensive survey examines recent developments in quantum computing, focusing on quantum supremacy achievements and practical applications in cryptography and optimization...",
    authors: [
      {
        name: "Sarah Chen",
        country: "United States",
        affiliation: "Stanford University"
      },
      {
        name: "Alexander Petrov",
        country: "Russia",
        affiliation: "Moscow State University"
      },
      {
        name: "James Wilson",
        country: "United Kingdom",
        affiliation: "Cambridge University"
      }
    ],
    publishedDate: "2024-12-15",
    citations: 145,
    doi: "10.1234/qc.2024.12345",
    topics: ["Quantum Computing", "Cryptography", "Computer Science"],
    keywords: [
      { keyword: "quantum supremacy", relevance: 0.95 },
      { keyword: "quantum circuits", relevance: 0.85 },
      { keyword: "quantum cryptography", relevance: 0.80 },
      { keyword: "quantum algorithms", relevance: 0.75 },
      { keyword: "quantum error correction", relevance: 0.70 }
    ],
    journal: "Nature Quantum Information"
  },
  {
    id: "2",
    title: "Deep Learning Applications in Autonomous Systems",
    abstract: "This paper explores novel applications of deep learning in autonomous systems, with a focus on real-time decision making and adaptive control mechanisms...",
    authors: [
      {
        name: "Wei Zhang",
        country: "China",
        affiliation: "Tsinghua University"
      },
      {
        name: "Emily Brown",
        country: "United States",
        affiliation: "MIT"
      }
    ],
    publishedDate: "2025-01-20",
    citations: 89,
    doi: "10.1234/ai.2025.67890",
    topics: ["Artificial Intelligence", "Robotics", "Computer Vision"],
    keywords: [
      { keyword: "deep learning", relevance: 0.95 },
      { keyword: "autonomous systems", relevance: 0.90 },
      { keyword: "neural networks", relevance: 0.85 },
      { keyword: "computer vision", relevance: 0.80 },
      { keyword: "real-time control", relevance: 0.75 }
    ],
    journal: "IEEE Transactions on Artificial Intelligence"
  }
];
