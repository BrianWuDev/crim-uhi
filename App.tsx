
import React, { useState, useEffect, useCallback } from 'react';
import { generateClimateData, CITIES } from './services/dataService';
import { analyzeClimateData } from './services/geminiService';
import TemperatureChart from './components/TemperatureChart';
import AnalysisPanel from './components/AnalysisPanel';
import CitySelector from './components/CitySelector';
import AboutDataPanel from './components/AboutDataPanel';
import { ClimateDataPoint, CityConfig, AnalysisStatus, AIAnalysisResponse, Scenario } from './types';


const App: React.FC = () => {
  // State
  const [scenario, setScenario] = useState<Scenario>(Scenario.HISTORICAL);
  const [data, setData] = useState<ClimateDataPoint[]>([]);
  const [selectedCities, setSelectedCities] = useState<CityConfig[]>([
    CITIES.find(c => c.id === 'taipei')!, // Always Taipei first
    CITIES.find(c => c.id === 'tokyo')!
  ]); 
  const [showGlobal, setShowGlobal] = useState<boolean>(true);
  
  // AI State
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [analysisData, setAnalysisData] = useState<AIAnalysisResponse | null>(null);

  // Initialize Data when scenario changes
  useEffect(() => {
    const climateData = generateClimateData(scenario);
    setData(climateData);
    // Reset Analysis when data changes context significantly
    if (analysisStatus === AnalysisStatus.SUCCESS) {
        setAnalysisStatus(AnalysisStatus.IDLE);
        setAnalysisData(null);
    }
  }, [scenario]);

  // Handlers
  const toggleCity = useCallback((city: CityConfig) => {
    setSelectedCities(prev => {
      const exists = prev.find(c => c.id === city.id);
      if (exists) {
        // Prevent removing Taipei 
        if (city.id === 'taipei') return prev; 
        return prev.filter(c => c.id !== city.id);
      } else {
        return [...prev, city];
      }
    });
  }, []);

  const handleRunAnalysis = useCallback(async () => {
    if (analysisStatus === AnalysisStatus.LOADING) return;
    
    setAnalysisStatus(AnalysisStatus.LOADING);
    try {
      const result = await analyzeClimateData(data, scenario);
      setAnalysisData(result);
      setAnalysisStatus(AnalysisStatus.SUCCESS);
    } catch (e) {
      setAnalysisStatus(AnalysisStatus.ERROR);
    }
  }, [analysisStatus, data, scenario]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100">
      
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 w-full px-6 py-4 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="bg-rose-600 p-2 rounded-lg shadow-lg shadow-rose-900/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                    Taipei <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Urban Heat Island</span>
                    </h1>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Interactive Climate Research Dashboard</p>
                </div>
            </div>
            <div className="hidden md:flex flex-col items-end">
                <span className="px-3 py-1 bg-slate-800 rounded-full text-[10px] font-bold text-slate-400 border border-slate-700">
                    VERSION 2.0 • CLIMATE SIMULATOR
                </span>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 w-full max-w-screen-2xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Controls */}
        <div className="lg:col-span-3 h-[500px] lg:h-auto">
            <CitySelector 
                selectedCities={selectedCities} 
                onToggleCity={toggleCity}
                showGlobal={showGlobal}
                onToggleGlobal={() => setShowGlobal(!showGlobal)}
                scenario={scenario}
                onScenarioChange={setScenario}
            />
        </div>

        {/* Center Col: Visualization */}
        <div className="lg:col-span-9 flex flex-col gap-6">
            <TemperatureChart 
                data={data} 
                selectedCities={selectedCities} 
                showGlobal={showGlobal}
                scenario={scenario}
            />

            {/* Bottom Row inside Center: AI Panel */}
            <div className="min-h-[300px] flex-1">
                <AnalysisPanel 
                    status={analysisStatus} 
                    analysis={analysisData} 
                    onAnalyze={handleRunAnalysis}
                />
            </div>

            {/* About Data Panel */}
            <AboutDataPanel />
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-600 text-xs border-t border-slate-900/50">
        <p>Taipei UHI Project • Data simulated based on Berkeley Earth & IPCC trends</p>
      </footer>
    </div>
  );
};

export default App;
