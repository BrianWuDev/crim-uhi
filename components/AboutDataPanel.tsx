import React from 'react';

const AboutDataPanel: React.FC = () => {
  return (
    <div className="bg-slate-900/60 rounded-xl p-6 border border-slate-800 shadow-xl backdrop-blur-sm mt-6">
      <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        About This Data
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
        
        {/* Data Source */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white border-b border-slate-700 pb-2">Data Source</h4>
          <p>
            The climate data presented here is a <strong>simulation</strong> based on historical trends from 
            <span className="text-blue-300"> Berkeley Earth</span> and <span className="text-blue-300">NASA GISS</span> datasets.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Future projections (post-2023) align with IPCC (Intergovernmental Panel on Climate Change) representative concentration pathways (RCPs), specifically modeling distinct scenarios for educational purposes.
          </p>
        </div>

        {/* Y-Axis Meaning */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white border-b border-slate-700 pb-2">Y-Axis: Temperature Anomaly</h4>
          <p>
            Values represent the <strong>Temperature Anomaly (°C)</strong>, not the absolute temperature.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-slate-400 text-xs">
            <li><strong>0°C Baseline:</strong> Average temperature from 1951-1980.</li>
            <li><strong>Positive (+):</strong> Warmer than the historical average.</li>
            <li><strong>Negative (-):</strong> Cooler than the historical average.</li>
          </ul>
        </div>

        {/* Significance */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white border-b border-slate-700 pb-2">Significance: Urban Heat Island</h4>
          <p>
            This dashboard highlights the <strong>Urban Heat Island (UHI)</strong> effect, where metropolitan areas become significantly warmer than their surroundings.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            <strong>Why Taipei?</strong> Taipei's basin topography traps heat, and high-density concrete structures absorb solar radiation, causing it to warm faster (~1.3x rate) than the global average.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutDataPanel;

