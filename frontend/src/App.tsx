import React, { useState, memo, useCallback } from 'react';
import './App.css';
import './styles/Papers.css';

import { publicationsData } from './data/publications';
import { researchTopics } from './data/researchTopics';
import { worldMapData } from './data/worldMap';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  ZoomableGroup 
} from 'react-simple-maps';
import Papers from './pages/Papers';
import RiskAnalysis from './components/RiskAnalysis'; // Import the RiskAnalysis component
import PaperUpload from './components/PaperUpload'; // Import the PaperUpload component

// Use reliable TopoJSON from world-atlas
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

const App: React.FC = () => {
  const [hoveredPoint, setHoveredPoint] = useState<{country: string, year: number, value: number} | null>(null);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredMapPoint, setHoveredMapPoint] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);
  const [activePage, setActivePage] = useState('map');
  
  // Function to get color for a country based on its data
  const getCountryColor = useCallback((countryName: string) => {
    const countryData = publicationsData.countries.find(c => c.name === countryName);
    const matchingPoints = worldMapData.filter(point => {
      if (point.country === countryName) return true;
      if (countryName === "United States of America" && point.country === "United States") return true;
      if (countryName === "Russian Federation" && point.country === "Russia") return true;
      return false;
    });
    
    const hasData = matchingPoints.length > 0;
    const isAdversarial = hasData && matchingPoints.some(p => p.adversarial);
    
    if (hasData) {
      const avgIntensity = matchingPoints.reduce((sum, p) => sum + p.intensity, 0) / matchingPoints.length;
      return isAdversarial 
        ? `rgba(239, 68, 68, ${0.3 + (avgIntensity * 0.5)})` 
        : `rgba(59, 130, 246, ${0.3 + (avgIntensity * 0.5)})`;
    }
    
    return countryData?.color || '#e5e7eb';
  }, []);
  return (
    <div className="app-container">
      <header className="app-header">

        <h1>Mithril R&D Dashboard</h1>
        <nav className="main-nav">
          <button 
            className={`nav-button ${activePage === 'map' ? 'active' : ''}`}
            onClick={() => setActivePage('map')}
          >
            World Map
          </button>
          <button 
            className={`nav-button ${activePage === 'papers' ? 'active' : ''}`}
            onClick={() => setActivePage('papers')}
          >
            Research Papers
          </button>
        </nav>
      </header>

      {activePage === 'map' ? (
        <main className="app-main">
          <section className="hero">
            <h2>Global Research & Development Intelligence</h2>
            <p>
              Advanced analytics and insights into global research trends, high-risk developments, and potential threats.
            </p>
            
            <div className="world-map-container">
              <div className="topic-filters">
                <button 
                  className={`filter-btn ${selectedTopic === null ? 'active' : ''}`}
                  onClick={() => setSelectedTopic(null)}
                >
                  All Topics
                </button>
                {researchTopics.map(topic => (
                  <button
                    key={topic}
                    className={`filter-btn ${selectedTopic === topic ? 'active' : ''}`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
              
              <div className="map-wrapper">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 140,
                    center: [0, 25]
                  }}
                  style={{
                    width: "100%",
                    height: "500px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    background: "#f9fafb"
                  }}
                >
                  <ZoomableGroup zoom={1}>
                    <Geographies geography={geoUrl}>
                      {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { name: string } }> }) =>
                        geographies.map((geo) => {
                          const countryName = geo.properties.name;
                          
                          // Find matching data points for this country
                          const matchingPoints = worldMapData.filter(point => {
                            // Try different variations of the country name
                            if (point.country === countryName) return true;
                            
                            // Common mismatches
                            if (countryName === "United States of America" && point.country === "United States") return true;
                            if (countryName === "Russian Federation" && point.country === "Russia") return true;
                            if (countryName === "Republic of Korea" && point.country === "South Korea") return true;
                            if (countryName === "Dem. Rep. Korea" && point.country === "North Korea") return true;
                            if (countryName === "Iran (Islamic Republic of)" && point.country === "Iran") return true;
                            
                            // Apply topic filter if selected
                            return false;
                          }).filter(point => !selectedTopic || point.topic === selectedTopic);
                          
                          // Determine if country should be highlighted
                          const hasData = matchingPoints.length > 0;
                          const isAdversarial = hasData && matchingPoints.some(p => p.adversarial);
                          
                          // Calculate intensity (if multiple points, use average)
                          const avgIntensity = hasData 
                            ? matchingPoints.reduce((sum, p) => sum + p.intensity, 0) / matchingPoints.length
                            : 0;
                            
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              className={`country-geography ${hasData ? 'has-data' : ''}`}
                              onClick={() => {
                                if (hasData) {
                                  setHoveredMapPoint(matchingPoints[0]);
                                }
                              }}
                              onMouseEnter={(evt: React.MouseEvent) => {
                                setHighlightedCountry(countryName);
                                if (hasData) {
                                  setHoveredMapPoint(matchingPoints[0]);
                                  setTooltipPosition({
                                    x: evt.clientX,
                                    y: evt.clientY - 10
                                  });
                                }
                              }}
                              onMouseLeave={() => {
                                setHighlightedCountry(null);
                                setHoveredMapPoint(null);
                                setTooltipPosition(null);
                              }}
                              style={{
                                default: {
                                  fill: hasData 
                                    ? isAdversarial 
                                      ? `rgba(239, 68, 68, ${0.3 + (avgIntensity * 0.5)})` 
                                      : `rgba(59, 130, 246, ${0.3 + (avgIntensity * 0.5)})` 
                                    : '#e5e7eb',
                                  stroke: '#d1d5db',
                                  strokeWidth: 0.5,
                                  outline: 'none',
                                  cursor: 'pointer'
                                },
                                hover: {
                                  fill: hasData 
                                    ? isAdversarial 
                                      ? `rgba(239, 68, 68, ${0.7 + (avgIntensity * 0.3)})` 
                                      : `rgba(59, 130, 246, ${0.7 + (avgIntensity * 0.3)})` 
                                    : '#d1d5db',
                                  stroke: '#000',
                                  strokeWidth: 1.5,
                                  outline: 'none',
                                  cursor: 'pointer'
                                },
                                pressed: {
                                  fill: hasData ? '#3182CE' : '#E5E7EB',
                                  stroke: '#000',
                                  strokeWidth: 1,
                                  outline: 'none'
                                }
                              }}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
                
                {hoveredMapPoint && (
                  <div className="risk-analysis-section">
                    <RiskAnalysis riskFactors={hoveredMapPoint.riskFactors || []} />
                  </div>
                )}
                
                {hoveredMapPoint && tooltipPosition && (
                  <div 
                    className="map-tooltip"
                    style={{
                      position: 'fixed',
                      left: tooltipPosition.x + 10,
                      top: tooltipPosition.y - 100,
                      transform: 'none'
                    }}
                  >
                    <div className="tooltip-header">
                      {hoveredMapPoint.country} {hoveredMapPoint.adversarial && '⚠️'}
                    </div>
                    <div className="tooltip-topic">{hoveredMapPoint.topic}</div>
                    <div className="tooltip-description">{hoveredMapPoint.description}</div>
                  </div>
                )}
              </div>
              
              <div className="map-legend">
                <div className="legend-item">
                  <span className="legend-symbol normal"></span>
                  <span>Normal Research</span>
                </div>
                <div className="legend-item">
                  <span className="legend-symbol adversarial"></span>
                  <span>Adversarial Activity</span>
                </div>
                <div className="legend-item legend-note">
                  <span>Darker color = Higher intensity</span>
                </div>
              </div>
            </div>
            
            <div className="upload-section">
              <h3>Upload Research Paper</h3>
              <PaperUpload onUploadSuccess={() => {}} />
            </div>
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
      ) : (
        <Papers />
      )}
    </div>
  );
};

export default App;
