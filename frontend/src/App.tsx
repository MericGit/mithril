import React, { useState } from 'react';
import './App.css';

const publicationsData = {
  years: [2020, 2021, 2022, 2023, 2024],
  countries: [
    {
      name: 'United States',
      color: '#3b82f6',
      flag: '🇺🇸',
      data: [1200, 1500, 1800, 2100, 2400]
    },
    {
      name: 'China',
      color: '#ef4444',
      flag: '🇨🇳',
      data: [1000, 1300, 1900, 2300, 2600]
    },
    {
      name: 'European Union',
      color: '#10b981',
      flag: '🇪🇺',
      data: [800, 1100, 1400, 1700, 2000]
    },
    {
      name: 'Russia',
      color: '#8b5cf6',
      flag: '🇷🇺',
      data: [600, 800, 1000, 1200, 1400]
    }
  ]
};

const App: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{country: string, year: number, value: number} | null>(null);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">
          <h1>Mithril R&D Dashboard</h1>
        </div>
        <nav className="app-nav">
          <a href="#high-risk">High Risk Topics</a>
          <a href="#research">Research Trends</a>
          <a href="#adversarial">Adversarial Activities</a>
        </nav>
      </header>
      <main className="app-main">
        <section className="hero">
          <h2>Global Research & Development Intelligence</h2>
          <p>
            Advanced analytics and insights into global research trends, high-risk developments, and potential threats.
          </p>
        </section>

        <section id="high-risk" className="content-section">
          <h2>High Risk Research Topics</h2>
          <div className="grid-container">
            <div className="grid-item">
              <h3>AI Weaponization</h3>
              <ul>
                <li><b>China 🇨🇳:</b> Advanced AI targeting systems</li>
                <li><b>Russia 🇷🇺:</b> Autonomous combat drones</li>
                <li><b>USA 🇺🇸:</b> Defense AI algorithms</li>
              </ul>
            </div>
            <div className="grid-item">
              <h3>Bioterrorism Research</h3>
              <ul>
                <li><b>North Korea 🇰🇵:</b> Synthetic pathogens</li>
                <li><b>Iran 🇮🇷:</b> Biological agents</li>
                <li><b>Unknown actors:</b> Gene editing</li>
              </ul>
            </div>
            <div className="grid-item">
              <h3>Advanced Weapons</h3>
              <ul>
                <li><b>Russia 🇷🇺:</b> Hypersonic missiles</li>
                <li><b>China 🇨🇳:</b> Quantum radar systems</li>
                <li><b>USA 🇺🇸:</b> Directed energy weapons</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="research" className="content-section">
          <h2>Top Research Topics by Country</h2>
          <div className="stats-container">
            <div className="stats-item">
              <h3>United States</h3>
              <p>Publications: 2,450</p>
              <p>Top areas: AI, Quantum Computing</p>
            </div>
            <div className="stats-item">
              <h3>China</h3>
              <p>Publications: 2,100</p>
              <p>Top areas: Robotics, 5G</p>
            </div>
            <div className="stats-item">
              <h3>European Union</h3>
              <p>Publications: 1,850</p>
              <p>Top areas: Clean Energy, Biotech</p>
            </div>
          </div>
          <div className="chart-container">
            <h3>Publications Trend</h3>
            <div className="chart-flex">
              <div className="chart-legend">
                {publicationsData.countries.map((country) => (
                  <div 
                    key={country.name} 
                    className={`legend-item ${highlightedCountry === country.name ? 'active' : ''}`}
                    onMouseEnter={() => setHighlightedCountry(country.name)}
                    onMouseLeave={() => setHighlightedCountry(null)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="legend-label">{country.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="line-chart">
                <svg width="100%" height="250" viewBox="0 0 800 250" preserveAspectRatio="none">
                  {/* Grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <line
                      key={`grid-${i}`}
                      x1="0"
                      y1={i * 50}
                      x2="800"
                      y2={i * 50}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Data lines */}
                  {publicationsData.countries.map((country) => {
                    const points = country.data.map((value, index) => {
                      const x = (index / (publicationsData.years.length - 1)) * 800;
                      const y = 200 - (value / 3000) * 200;
                      return `${x},${y}`;
                    }).join(' ');
                    
                    const isHighlighted = highlightedCountry === country.name;
                    const isOtherHighlighted = highlightedCountry && highlightedCountry !== country.name;
                    
                    return (
                      <g key={country.name}>
                        <polyline
                          points={points}
                          fill="none"
                          stroke={country.color}
                          strokeWidth={isHighlighted ? "3" : "2"}
                          opacity={isOtherHighlighted ? 0.2 : 1}
                          className="line-path"
                        />
                        {country.data.map((value, index) => {
                          const x = (index / (publicationsData.years.length - 1)) * 800;
                          const y = 200 - (value / 3000) * 200;
                          return (
                            <circle
                              key={`${country.name}-${index}`}
                              cx={x}
                              cy={y}
                              r={isHighlighted ? "6" : "4"}
                              fill={country.color}
                              opacity={isOtherHighlighted ? 0.2 : 1}
                              className="data-point"
                              onMouseEnter={() => setHoveredPoint({
                                country: country.name,
                                year: publicationsData.years[index],
                                value: value
                              })}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        })}
                      </g>
                    );
                  })}

                  {/* Tooltip */}
                  {hoveredPoint && (
                    <g className="tooltip" transform={`translate(${(publicationsData.years.indexOf(hoveredPoint.year) / (publicationsData.years.length - 1)) * 800},${200 - (hoveredPoint.value / 3000) * 200})`}>
                      <rect
                        x="10"
                        y="-25"
                        width="120"
                        height="50"
                        fill="white"
                        stroke="#e5e7eb"
                        rx="4"
                      />
                      <text x="20" y="0" fontSize="12">
                        <tspan x="20" y="-10">{hoveredPoint.country}</tspan>
                        <tspan x="20" y="5">Year: {hoveredPoint.year}</tspan>
                        <tspan x="20" y="20">Publications: {hoveredPoint.value}</tspan>
                      </text>
                    </g>
                  )}
                </svg>
                
                {/* X-axis labels */}
                <div className="chart-labels x-labels">
                  {publicationsData.years.map((year, index) => (
                    <div
                      key={year}
                      className="x-label"
                      style={{ left: `${(index / (publicationsData.years.length - 1)) * 100}%` }}
                    >
                      {year}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="adversarial" className="content-section">
          <h2>Potential Adversarial Activities</h2>
          <div className="alert-grid">
            <div className="alert-item high">
              <h3>Critical Alert</h3>
              <p>Unusual research pattern detected in quantum encryption</p>
              <span className="source">Source: Multiple facilities in Region A</span>
            </div>
            <div className="alert-item medium">
              <h3>Warning</h3>
              <p>Increased publications in synthetic biology</p>
              <span className="source">Source: Research centers in Region B</span>
            </div>
            <div className="alert-item low">
              <h3>Notice</h3>
              <p>New research facility construction detected</p>
              <span className="source">Source: Satellite imagery Region C</span>
            </div>
          </div>
        </section>
      </main>
      {/* <footer className="app-footer">
        <p>&copy; 2025 Mithril Analytics. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default App;
