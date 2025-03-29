import React from 'react';
import { RiskFactor } from '../types/Paper';
import '../styles/RiskAnalysis.css';

interface RiskAnalysisProps {
  riskFactors: RiskFactor[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ riskFactors = [] }) => {
  if (!riskFactors || riskFactors.length === 0) {
    return (
      <div className="risk-analysis">
        <div className="no-risks">No risk factors identified for this paper.</div>
      </div>
    );
  }

  return (
    <div className="risk-analysis">
      <div className="risk-cards">
        {riskFactors.map((risk, index) => (
          <div key={index} className={`risk-card ${risk.type.toLowerCase()}`}>
            <div className="risk-header">
              <span className={`risk-level ${risk.type.toLowerCase()}`}>
                {risk.type}
              </span>
              <h3 className="risk-title">{risk.category}</h3>
            </div>

            <p className="risk-description">
              {risk.description}
            </p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskAnalysis;
