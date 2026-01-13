import { MajorRoute, TrainRoute, UberDangerZone } from '@/types/dashboard';

export const majorRoutes: MajorRoute[] = [
  { 
    id: 'N1', 
    name: 'N1 Highway (Paarl - CBD)', 
    total_cameras: 47, 
    functioning: 42, 
    offline: 5,
    safety_score: 82,
    incidents_24h: 3,
    sections: [
      { name: 'Paarl Interchange', cameras: 8, status: 'good' },
      { name: 'Bellville', cameras: 12, status: 'good' },
      { name: 'Goodwood', cameras: 9, status: 'moderate' },
      { name: 'Paarden Eiland', cameras: 11, status: 'good' },
      { name: 'CBD Exit', cameras: 7, status: 'good' }
    ]
  },
  { 
    id: 'N2', 
    name: 'N2 Highway (Airport - Somerset West)', 
    total_cameras: 65, 
    functioning: 58, 
    offline: 7,
    safety_score: 68,
    incidents_24h: 12,
    sections: [
      { name: 'CBD to Airport', cameras: 15, status: 'moderate' },
      { name: 'Nyanga (DANGER)', cameras: 18, status: 'critical' },
      { name: 'Khayelitsha', cameras: 14, status: 'critical' },
      { name: 'Mitchells Plain', cameras: 12, status: 'poor' },
      { name: 'Somerset West', cameras: 6, status: 'good' }
    ]
  },
  { 
    id: 'M3', 
    name: 'M3 (CBD - Muizenberg)', 
    total_cameras: 38, 
    functioning: 36, 
    offline: 2,
    safety_score: 88,
    incidents_24h: 2,
    sections: [
      { name: 'Devils Peak', cameras: 8, status: 'good' },
      { name: 'Newlands', cameras: 10, status: 'good' },
      { name: 'Wynberg', cameras: 9, status: 'good' },
      { name: 'Muizenberg', cameras: 11, status: 'good' }
    ]
  },
  { 
    id: 'M5', 
    name: 'M5 (Ottery - Retreat)', 
    total_cameras: 29, 
    functioning: 24, 
    offline: 5,
    safety_score: 61,
    incidents_24h: 8,
    sections: [
      { name: 'Ottery', cameras: 7, status: 'moderate' },
      { name: 'Grassy Park', cameras: 8, status: 'poor' },
      { name: 'Lotus River', cameras: 9, status: 'poor' },
      { name: 'Retreat', cameras: 5, status: 'moderate' }
    ]
  },
  { 
    id: 'R300', 
    name: 'R300 (N1 - N2 Connector)', 
    total_cameras: 32, 
    functioning: 28, 
    offline: 4,
    safety_score: 75,
    incidents_24h: 4,
    sections: [
      { name: 'N1 Junction', cameras: 9, status: 'good' },
      { name: 'Brackenfell', cameras: 11, status: 'good' },
      { name: 'Kuils River', cameras: 8, status: 'moderate' },
      { name: 'N2 Junction', cameras: 4, status: 'moderate' }
    ]
  },
  { 
    id: 'M4', 
    name: 'M4 Marine Drive', 
    total_cameras: 42, 
    functioning: 40, 
    offline: 2,
    safety_score: 91,
    incidents_24h: 1,
    sections: [
      { name: 'Sea Point', cameras: 12, status: 'good' },
      { name: 'Camps Bay', cameras: 8, status: 'good' },
      { name: 'Hout Bay', cameras: 7, status: 'good' },
      { name: 'Noordhoek', cameras: 9, status: 'good' },
      { name: 'Fish Hoek', cameras: 6, status: 'good' }
    ]
  }
];

export const trainRoutes: TrainRoute[] = [
  {
    id: 'SOUTHERN',
    name: 'Southern Line',
    safety_score: 45,
    stations: 32,
    operating_cameras: 18,
    total_cameras: 32,
    incidents_24h: 15,
    status: 'high_risk'
  },
  {
    id: 'CENTRAL',
    name: 'Central Line',
    safety_score: 32,
    stations: 28,
    operating_cameras: 12,
    total_cameras: 28,
    incidents_24h: 24,
    status: 'critical'
  },
  {
    id: 'NORTHERN',
    name: 'Northern Line',
    safety_score: 68,
    stations: 18,
    operating_cameras: 15,
    total_cameras: 18,
    incidents_24h: 6,
    status: 'moderate'
  },
  {
    id: 'CAPE_FLATS',
    name: 'Cape Flats Line',
    safety_score: 38,
    stations: 22,
    operating_cameras: 10,
    total_cameras: 22,
    incidents_24h: 20,
    status: 'critical'
  }
];

export const uberDangerZones: UberDangerZone[] = [
  {
    id: 'UBER-1',
    name: 'Nyanga',
    danger_level: 'CRITICAL',
    risk_score: 15,
    incidents_uber: 45,
    recommendation: 'DO NOT ACCEPT - High carjacking risk'
  },
  {
    id: 'UBER-2',
    name: 'Khayelitsha',
    danger_level: 'CRITICAL',
    risk_score: 12,
    incidents_uber: 52,
    recommendation: 'EXTREME CAUTION - Frequent hijackings'
  },
  {
    id: 'UBER-3',
    name: 'Philippi',
    danger_level: 'HIGH',
    risk_score: 25,
    incidents_uber: 38,
    recommendation: 'High risk - Drive main roads only'
  },
  {
    id: 'UBER-4',
    name: 'Mitchells Plain',
    danger_level: 'HIGH',
    risk_score: 28,
    incidents_uber: 35,
    recommendation: 'Exercise extreme caution'
  },
  {
    id: 'UBER-5',
    name: 'Delft',
    danger_level: 'HIGH',
    risk_score: 30,
    incidents_uber: 29,
    recommendation: 'High crime area - be alert'
  },
  {
    id: 'UBER-6',
    name: 'Manenberg',
    danger_level: 'MODERATE',
    risk_score: 45,
    incidents_uber: 18,
    recommendation: 'Moderate risk - stay on main roads'
  }
];
