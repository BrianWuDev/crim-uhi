
import React from 'react';
import { CITIES } from '../services/dataService';
import { CityConfig, Scenario } from '../types';

interface CitySelectorProps {
  selectedCities: CityConfig[];
  onToggleCity: (city: CityConfig) => void;
  showGlobal: boolean;
  onToggleGlobal: () => void;
  scenario: Scenario;
  onScenarioChange: (s: Scenario) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ 
  selectedCities, 
  onToggleCity, 
  showGlobal,
  onToggleGlobal,
  scenario,
  onScenarioChange
}) => {
  const isSelected = (id: string) => selectedCities.some(c => c.id === id);

  const asiaCities = CITIES.filter(c => c.region === 'Asia');
  const worldCities = CITIES.filter(c => c.region === 'World');

  const renderCityBtn = (city: CityConfig) => {
    const active = isSelected(city.id);
    return (
        <button
            key={city.id}
            onClick={() => onToggleCity(city)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all border text-sm ${
                active 
                ? 'bg-slate-800 border-slate-600 shadow-lg shadow-black/20' 
                : 'bg-transparent border-transparent hover:bg-slate-800/40 text-slate-400'
            }`}
        >
            <div className="flex items-center gap-3">
                <span 
                    className={`w-2.5 h-2.5 rounded-full shadow-sm ${city.id === 'taipei' ? 'animate-pulse' : ''}`} 
                    style={{ backgroundColor: active ? city.color : '#475569' }}
                ></span>
                <span className={`font-medium ${active ? 'text-slate-100' : ''}`}>{city.name}</span>
            </div>
            {city.id === 'taipei' && active && <span className="text-[10px] bg-rose-900/50 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">FOCUS</span>}
        </button>
    );
  }

  return (
    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 backdrop-blur-md h-full flex flex-col shadow-xl">
      
      {/* Simulation Controls */}
      <div className="mb-6 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
        <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Climate Time Machine
        </h3>
        <div className="flex flex-col gap-2">
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${scenario === Scenario.HISTORICAL ? 'bg-slate-700' : 'hover:bg-slate-700/30'}`}>
                <input type="radio" name="scenario" className="accent-rose-500" checked={scenario === Scenario.HISTORICAL} onChange={() => onScenarioChange(Scenario.HISTORICAL)} />
                <div className="text-xs">
                    <div className="font-bold text-slate-200">Historical Data</div>
                    <div className="text-slate-400">1880 - 2023 Observed</div>
                </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${scenario === Scenario.OPTIMISTIC ? 'bg-emerald-900/30 border border-emerald-800' : 'hover:bg-slate-700/30'}`}>
                <input type="radio" name="scenario" className="accent-emerald-500" checked={scenario === Scenario.OPTIMISTIC} onChange={() => onScenarioChange(Scenario.OPTIMISTIC)} />
                <div className="text-xs">
                    <div className="font-bold text-emerald-300">Optimistic 2050</div>
                    <div className="text-slate-400">Aggressive Mitigation</div>
                </div>
            </label>
            <label className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${scenario === Scenario.BAU ? 'bg-rose-900/30 border border-rose-800' : 'hover:bg-slate-700/30'}`}>
                <input type="radio" name="scenario" className="accent-rose-500" checked={scenario === Scenario.BAU} onChange={() => onScenarioChange(Scenario.BAU)} />
                <div className="text-xs">
                    <div className="font-bold text-rose-300">Business As Usual</div>
                    <div className="text-slate-400">Current trajectory to 2050</div>
                </div>
            </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
          
          {/* Global Toggle */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Baseline</h4>
            <label className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-slate-800/50 rounded-lg transition-colors group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${showGlobal ? 'bg-slate-400 border-slate-400' : 'border-slate-600'}`}>
                   {showGlobal && <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                </div>
                <span className="text-slate-300 text-sm font-medium group-hover:text-white">Global Average</span>
            </label>
          </div>

          {/* Asian Cities */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Asia (High Growth)</h4>
            {asiaCities.map(renderCityBtn)}
          </div>

          {/* World Cities */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Reference</h4>
            {worldCities.map(renderCityBtn)}
          </div>
      </div>
      
    </div>
  );
};

export default CitySelector;
