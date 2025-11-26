
import { CityConfig, ClimateDataPoint, Scenario } from '../types';

// Configuration for supported cities - Expanded for Asia Focus
export const CITIES: CityConfig[] = [
  { id: 'taipei', name: 'Taipei (Focus)', color: '#f43f5e', baseTemp: 23.0, uhiFactor: 1.8, warmingRate: 1.3, region: 'Asia' },
  { id: 'tokyo', name: 'Tokyo', color: '#a855f7', baseTemp: 15.4, uhiFactor: 1.5, warmingRate: 1.1, region: 'Asia' },
  { id: 'bangkok', name: 'Bangkok', color: '#f97316', baseTemp: 28.2, uhiFactor: 1.6, warmingRate: 1.15, region: 'Asia' },
  { id: 'seoul', name: 'Seoul', color: '#06b6d4', baseTemp: 12.5, uhiFactor: 1.4, warmingRate: 1.25, region: 'Asia' },
  { id: 'shanghai', name: 'Shanghai', color: '#6366f1', baseTemp: 16.8, uhiFactor: 1.7, warmingRate: 1.2, region: 'Asia' },
  { id: 'manila', name: 'Manila', color: '#eab308', baseTemp: 27.0, uhiFactor: 1.5, warmingRate: 1.1, region: 'Asia' },
  { id: 'mumbai', name: 'Mumbai', color: '#ec4899', baseTemp: 27.2, uhiFactor: 1.3, warmingRate: 1.05, region: 'Asia' },
  { id: 'jakarta', name: 'Jakarta', color: '#10b981', baseTemp: 28.0, uhiFactor: 1.6, warmingRate: 1.1, region: 'Asia' },
  { id: 'beijing', name: 'Beijing', color: '#ef4444', baseTemp: 12.6, uhiFactor: 1.5, warmingRate: 1.2, region: 'Asia' },
  { id: 'hanoi', name: 'Hanoi', color: '#8b5cf6', baseTemp: 23.6, uhiFactor: 1.4, warmingRate: 1.1, region: 'Asia' },
  { id: 'nyc', name: 'New York', color: '#3b82f6', baseTemp: 12.7, uhiFactor: 1.1, warmingRate: 1.0, region: 'World' },
  { id: 'london', name: 'London', color: '#94a3b8', baseTemp: 11.3, uhiFactor: 0.9, warmingRate: 0.9, region: 'World' },
  { id: 'singapore', name: 'Singapore', color: '#14b8a6', baseTemp: 27.5, uhiFactor: 1.4, warmingRate: 1.05, region: 'Asia' },
];

/**
 * Generates mock climate data simulating the period 1880 - 2023 (Historical)
 * or 1880 - 2050 (Projection) based on the selected scenario.
 */
export const generateClimateData = (scenario: Scenario = Scenario.HISTORICAL): ClimateDataPoint[] => {
  const data: ClimateDataPoint[] = [];
  const startYear = 1880;
  const currentYear = 2023;
  const endYear = scenario === Scenario.HISTORICAL ? 2023 : 2050;

  let previousGlobalTrend = 0;

  for (let year = startYear; year <= endYear; year++) {
    // 1. Base Global Warming Trend
    const normalizedTime = (year - startYear) / (2023 - startYear);
    
    let globalTrend = 0;

    if (year <= 2023) {
        // Historical curve (Sigmoid-ish acceleration)
        globalTrend = 0.1 * Math.sin(year / 10) + (Math.pow(normalizedTime, 3) * 1.2); 
    } else {
        // Future Projections
        const yearsPast2023 = year - 2023;
        
        if (scenario === Scenario.OPTIMISTIC) {
            // Leveling off (Aggressive Mitigation)
            // Growth slows down significantly
            globalTrend = previousGlobalTrend + (0.015 * Math.exp(-yearsPast2023 * 0.1));
        } else {
            // BAU (Business As Usual) - Accelerated warming
            // Continues the exponential curve
            globalTrend = previousGlobalTrend + 0.04 + (yearsPast2023 * 0.002);
        }
    }
    
    previousGlobalTrend = globalTrend;

    // Add some random noise (less noise in future to show clear trend lines)
    const noiseAmount = year > 2023 ? 0.02 : 0.15;
    const noise = (Math.random() - 0.5) * noiseAmount;
    const globalAnomaly = parseFloat((globalTrend + noise).toFixed(2));

    const point: ClimateDataPoint = {
      year,
      globalAnomaly,
      taipeiAnomaly: 0 // placeholder
    };

    // Calculate specific city anomalies
    CITIES.forEach(city => {
      // UHI Effect: Grows significantly as cities urbanize
      let urbanizationFactor = Math.max(0, (year - 1950) / 73); 
      
      // Taipei Basin Effect: Special multiplier for Taipei specifically
      // Heat gets trapped, so it responds more aggressively to global rises
      const basinMultiplier = city.id === 'taipei' ? 1.15 : 1.0;

      if (year > 2023) {
          // Future urbanization saturation
          if (scenario === Scenario.OPTIMISTIC) {
             // Green policies reduce UHI effect
             urbanizationFactor = 1.0 - ((year - 2023) * 0.005);
          } else {
             urbanizationFactor = 1.0 + ((year - 2023) * 0.005);
          }
      }

      const uhiBonus = city.uhiFactor * (urbanizationFactor * 0.8) * basinMultiplier; 

      // Total anomaly = Global Trend * City Sensitivity + UHI Bonus + Local Noise
      const cityAnomaly = (globalTrend * city.warmingRate * basinMultiplier) + uhiBonus + ((Math.random() - 0.5) * 0.2);
      
      point[`${city.id}Anomaly`] = parseFloat(cityAnomaly.toFixed(2));
    });

    data.push(point);
  }

  return data;
};
