
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Defs,
  LinearGradient,
  Stop
} from 'recharts';
import { ClimateDataPoint, CityConfig, Scenario } from '../types';

interface TemperatureChartProps {
  data: ClimateDataPoint[];
  selectedCities: CityConfig[];
  showGlobal: boolean;
  scenario: Scenario;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, selectedCities, showGlobal, scenario }) => {
  
  const formattedData = useMemo(() => data, [data]);

  const isProjecting = scenario !== Scenario.HISTORICAL;

  return (
    <div className="w-full h-[500px] bg-slate-900/60 rounded-xl p-4 border border-slate-700 shadow-2xl backdrop-blur-md relative overflow-hidden">
      <div className="mb-4 flex justify-between items-end relative z-10">
        <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Temperature Anomaly Tracker
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2">
                DATA RANGE: 1880 - {isProjecting ? '2050' : '2023'}
                {isProjecting && <span className="text-amber-500 font-bold px-1 rounded bg-amber-950/30 border border-amber-900/50">PROJECTION ACTIVE</span>}
            </p>
        </div>
        <div className="text-right">
             <span className="text-[10px] uppercase tracking-wider text-slate-500 border border-slate-700 px-2 py-1 rounded bg-slate-800/50">
                Baseline: 1951-1980
             </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="taipeiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={1}/>
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickMargin={10}
            tickFormatter={(year) => year.toString()}
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            label={{ value: 'Anomaly (°C)', angle: -90, position: 'insideLeft', fill: '#94a3b8', style: { textAnchor: 'middle' } }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '8px', borderBottom: '1px solid #334155', paddingBottom: '4px' }}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(2)}°C`, '']}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
          
          <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
          
          {/* Projection Visuals */}
          {isProjecting && (
             <ReferenceLine x={2023} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'TODAY', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, dy: -10 }} />
          )}
          {isProjecting && (
             <ReferenceArea x1={2023} x2={2050} fill="#f59e0b" fillOpacity={0.05} />
          )}

          {/* Global Average Line */}
          {showGlobal && (
            <Line
              type="monotone"
              dataKey="globalAnomaly"
              name="Global Avg"
              stroke="#cbd5e1"
              strokeWidth={2}
              dot={false}
              strokeDasharray="4 4"
              isAnimationActive={false}
            />
          )}

          {/* City Lines */}
          {selectedCities.map((city) => (
            <Line
              key={city.id}
              type="monotone"
              dataKey={`${city.id}Anomaly`}
              name={city.name}
              stroke={city.color}
              strokeWidth={city.id === 'taipei' ? 4 : 1.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              strokeOpacity={city.id === 'taipei' ? 1 : 0.7}
              // Add shadow effect for Taipei
              style={city.id === 'taipei' ? { filter: 'drop-shadow(0px 0px 6px rgba(244, 63, 94, 0.5))' } : {}}
              animationDuration={1500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
