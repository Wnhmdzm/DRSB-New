export type IncidentLevel = 'LEVEL 1 (LOCAL)' | 'LEVEL 2 (STABILISING)' | 'LEVEL 3 (CRISIS)';

export type UserRole = 'Admin (Incident Commander)' | 'Editor (Operations Chief)' | 'Viewer (Observer)';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department: string;
  avatar?: string;
}

export interface IncidentDetails {
  id: string;
  title: string;
  clusterName: string;
  companyName: string;
  level: IncidentLevel;
  location: string;
  field: string;
  accountedPersonnel: number;
  totalPersonnel: number;
  missingPersons: number;
  receivingMedical: number;
  evacuated: number;
  medicalTransferStatus: string;
  currentPriorities: string[];
  incidentObjectives: string[];
  latestSitrepNumber: string;
  latestSitrepText: string[];
  nextSitrepTime: string;
  statusText: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  event: string;
  category?: 'alarm' | 'response' | 'muster' | 'ecc' | 'isolation' | 'sitrep';
}

export interface ActionItem {
  id: number;
  action: string;
  responsible: string;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export interface Vessel {
  id: string;
  name: string;
  status: 'En route' | 'On site' | 'Standby' | 'Docked';
  eta: string;
  speedKnots: number;
  coordinates: [number, number]; // [lat, lng]
  heading: number;
}

export interface Helicopter {
  id: string;
  name: string;
  status: 'Available' | 'Mobilised' | 'Grounded';
  conditions: string;
  mobilisationTime: string;
}

export interface WeatherData {
  temperatureC: number;
  windSpeedKt: number;
  windDirection: string;
  seaStateM: number;
  conditions: string;
  pressureHpa: number;
  humidityPct: number;
  updatedAt: string;
  isLiveApi: boolean;
  locationName: string;
}

export interface OrgNode {
  title: string;
  personName: string;
  status: 'Active' | 'On Call' | 'In ECC';
  children?: OrgNode[];
}

export interface Participant {
  id: string;
  name: string;
  roleShort: string;
  department: string;
  status: 'Connected' | 'Speaking' | 'Muted';
  videoOn: boolean;
  micOn: boolean;
}

export interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  time: string;
  text: string;
}

export interface FilterState {
  field: string;
  incidentLevel: string;
  status: string;
  timeHorizon: string;
  searchTerm: string;
}
