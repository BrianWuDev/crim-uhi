
import React from 'react';
import { AIAnalysisResponse, AnalysisStatus } from '../types';

interface AnalysisPanelProps {
  status: AnalysisStatus;
  analysis: AIAnalysisResponse | null;
  onAnalyze: () => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ status, analysis, onAnalyze }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 h-full flex flex-col backdrop-blur-md shadow-2xl relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 transition-all duration-1000 group-hover:bg-emerald-500/10"></div>

      <div className="flex items-center justify-between mb-6 z-10">
        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-100">
          <span className="text-emerald-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </span>
          AI Climate Scientist Insights
        </h2>
        <div className="flex gap-2">
            <div className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-emerald-900/50 shadow-inner">
                STATUS: {status}
            </div>
        </div>
      </div>

      {status === AnalysisStatus.IDLE && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
          <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
            Run a deep-learning analysis on the currently displayed data scenario. 
            The AI will evaluate the specific divergence of Taipei's temperature curve against the selected projection model.
          </p>
          <button
            onClick={onAnalyze}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Analyze Scenario
          </button>
        </div>
      )}

      {status === AnalysisStatus.LOADING && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-8">
          <div className="relative w-12 h-12">
            <div className="absolute top-0 left-0 w-full h-full border-2 border-slate-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-2 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-emerald-400 animate-pulse font-mono text-xs">PROCESSING CLIMATE MODELS...</p>
        </div>
      )}

      {status === AnalysisStatus.ERROR && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-rose-400 text-sm">Analysis computation failed.</p>
          <button onClick={onAnalyze} className="text-xs underline text-slate-400 hover:text-white">Retry Analysis</button>
        </div>
      )}

      {status === AnalysisStatus.SUCCESS && analysis && (
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          
          <div className="space-y-4">
             <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700">
                <h4 className="text-[10px] uppercase tracking-wider text-emerald-400 mb-2 font-bold flex justify-between">
                    <span>Summary Assessment</span>
                    <span className="text-slate-500 text-right">{analysis.scenarioContext}</span>
                </h4>
                <p className="text-slate-200 leading-relaxed text-sm">
                  {analysis.summary}
                </p>
             </div>

             <div>
                <h4 className="text-[10px] uppercase tracking-wider text-rose-400 mb-3 font-bold flex items-center gap-2">
                  Key Drivers (UHI & Local)
                </h4>
                <ul className="space-y-2">
                  {analysis.keyFactors.map((factor, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                      {factor}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          <div className="bg-emerald-900/10 p-4 rounded-lg border border-emerald-900/30">
            <h4 className="text-[10px] uppercase tracking-wider text-emerald-400 mb-3 font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Scientific Recommendations
            </h4>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="bg-slate-900/50 p-3 rounded border-l-2 border-emerald-500 text-xs text-slate-300 leading-relaxed shadow-sm">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;
