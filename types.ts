
export enum RiskLevel {
  SAFE = 'Safe',
  WATCH = 'Watch',
  EMERGENCY = 'Emergency'
}

export type ThemeMode = 'black' | 'blue' | 'white';
export type Language = 'en' | 'hi' | 'ta' | 'gu';

export interface GeoLocation {
  lat: number;
  lng: number;
  name?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  windGust: number;
  rainfall: number;
  cloudCover: number;
  pressure: number;
  timestamp: string;
}

export interface DisasterRisk {
  score: number;
  level: RiskLevel;
  type: 'Flood' | 'Cyclone' | 'Heatwave' | 'Fire' | 'None';
  predictionTimeframe?: string; // Added for advanced prediction timing
}

export interface SatelliteMetadata {
  satelliteId: string;
  acquisitionTime: string;
  band: string;
  imageUrl: string;
}

export interface LocationReport {
  id: string;
  location: GeoLocation;
  currentWeather: WeatherData;
  risk: DisasterRisk;
  satellite: SatelliteMetadata;
  timelineData: { time: string; rain: number; temp: number; probability: number }[]; 
}

export interface GeminiInsight {
  analysis: string;
  recommendations: string[];
  alertLevel: string;
}
