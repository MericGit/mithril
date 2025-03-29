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
      }
    ],
    publishedDate: "2024-12-15",
    citations: 145,
    doi: "10.1234/qc.2024.12345",
    topics: ["Quantum Computing", "Cryptography", "Computer Science"],
    keywords: [
      { keyword: "quantum supremacy", relevance: 0.95 },
      { keyword: "quantum cryptography", relevance: 0.85 },
      { keyword: "quantum circuits", relevance: 0.80 }
    ],
    journal: "Nature Quantum Information",
    riskFactors: [
      {
        type: "HIGH",
        category: "Cryptographic Security",
        description: "Research discusses quantum supremacy achievements that could potentially break current cryptographic systems",
        relatedKeywords: ["quantum supremacy", "quantum cryptography"],
        potentialImpact: "Could compromise existing security infrastructure and encrypted communications",
        mitigationSuggestion: "Accelerate development of quantum-resistant cryptographic algorithms"
      },
      {
        type: "MEDIUM",
        category: "Dual-Use Technology",
        description: "Quantum optimization algorithms could be repurposed for military applications",
        relatedKeywords: ["quantum algorithms", "quantum circuits"],
        potentialImpact: "Potential military applications in optimization of weapon systems",
        mitigationSuggestion: "Implement strict access controls and usage monitoring"
      }
    ]
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
      { keyword: "computer vision", relevance: 0.85 }
    ],
    journal: "IEEE Transactions on Artificial Intelligence",
    riskFactors: [
      {
        type: "HIGH",
        category: "Autonomous Weapons",
        description: "Deep learning techniques could be adapted for autonomous weapon systems",
        relatedKeywords: ["autonomous systems", "deep learning"],
        potentialImpact: "Could enable development of autonomous weapons with reduced human oversight",
        mitigationSuggestion: "Establish international frameworks for AI use in military applications"
      },
      {
        type: "MEDIUM",
        category: "Surveillance",
        description: "Advanced computer vision techniques could be used for mass surveillance",
        relatedKeywords: ["computer vision", "deep learning"],
        potentialImpact: "Potential misuse for unauthorized surveillance and privacy violations",
        mitigationSuggestion: "Develop privacy-preserving AI techniques and ethical guidelines"
      },
      {
        type: "LOW",
        category: "Bias and Fairness",
        description: "Neural network models may perpetuate existing biases in training data",
        relatedKeywords: ["deep learning", "neural networks"],
        potentialImpact: "Could lead to discriminatory automated decision-making",
        mitigationSuggestion: "Implement rigorous bias testing and diverse training datasets"
      }
    ]
  }
];
