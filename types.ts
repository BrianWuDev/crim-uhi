
export interface ClimateDataPoint {
  year: number;
  globalAnomaly: number;
  taipeiAnomaly: number;
  [key: string]: number; // Allow dynamic city keys
}

export enum Scenario {
  HISTORICAL = 'HISTORICAL',
  OPTIMISTIC = 'OPTIMISTIC', // RCP 2.6 / Paris Agreement goals
  BAU = 'BAU', // Business as Usual (RCP 8.5)
}

export interface CityConfig {
  id: string;
  name: string;
  color: string;
  baseTemp: number; // Base temperature for reference
  uhiFactor: number; // Simulated intensity of UHI effect
  warmingRate: number; // Global warming multiplier
  region: 'Asia' | 'World';
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface AIAnalysisResponse {
  scenarioContext: string;
  summary: string;
  keyFactors: string[];
  recommendations: string[];
}
