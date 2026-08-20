import { IncidentDetails, TimelineEvent, ActionItem, Vessel, Helicopter, WeatherData, Participant, ChatMessage, User } from '../types';

export const initialIncident: IncidentDetails = {
  id: 'INC-2026-0809',
  title: 'DRSB EMERGENCY MANAGEMENT TEAM (EMT) DASHBOARD',
  clusterName: 'Baram Junior Cluster (Salbiah & Fatimah Fields)',
  companyName: 'Dialog Resources Sdn. Bhd.',
  level: 'LEVEL 2 (STABILISING)',
  location: 'SLDP-A Facility',
  field: 'Salbiah Field',
  accountedPersonnel: 24,
  totalPersonnel: 24,
  missingPersons: 0,
  receivingMedical: 1,
  evacuated: 0,
  medicalTransferStatus: 'Standby',
  currentPriorities: [
    'Protect personnel',
    'Confirm isolation',
    'Prevent escalation'
  ],
  incidentObjectives: [
    'Maintain accountability',
    'Stabilise affected system',
    'Prepare recovery plan'
  ],
  latestSitrepNumber: '02',
  latestSitrepText: [
    'Facility stable; source isolated',
    'No offsite impact reported'
  ],
  nextSitrepTime: '15:00',
  statusText: 'LEVEL 2 STABILISING'
};

export const initialTimeline: TimelineEvent[] = [
  { id: '1', time: '13:42', event: 'Alarm raised', category: 'alarm' },
  { id: '2', time: '13:45', event: 'Offshore response activated', category: 'response' },
  { id: '3', time: '13:52', event: 'Muster completed', category: 'muster' },
  { id: '4', time: '14:05', event: 'ECC activated', category: 'ecc' },
  { id: '5', time: '14:20', event: 'Source isolated', category: 'isolation' }
];

export const initialActionItems: ActionItem[] = [
  { id: 1, action: 'Confirm incident & inform IC', responsible: 'OIM / MOCC', status: 'Completed' },
  { id: 2, action: 'Activate ECC & assemble EMT', responsible: 'ECC', status: 'Completed' },
  { id: 3, action: 'Establish communication', responsible: 'MOCC', status: 'Completed' },
  { id: 4, action: 'Assess incident', responsible: 'HSSE', status: 'Completed' },
  { id: 5, action: 'Determine incident level', responsible: 'IC', status: 'Completed' },
  { id: 6, action: 'Notify authorities', responsible: 'Planning', status: 'In Progress' },
  { id: 7, action: 'Mobilise resources', responsible: 'Logistics', status: 'In Progress' }
];

export const initialVessels: Vessel[] = [
  {
    id: 'FCB-01',
    name: 'FCB-01 (Fast Crew Boat)',
    status: 'En route',
    eta: '15:10',
    speedKnots: 22,
    coordinates: [4.425, 113.910], // En route between Miri Shore Base (4.39, 113.98) and SLDP-A Platform (4.48, 113.85)
    heading: 315
  }
];

export const initialHelicopter: Helicopter = {
  id: 'HELI-01',
  name: 'S-92 Rescue Helicopter',
  status: 'Available',
  conditions: 'Suitable',
  mobilisationTime: '45 min'
};

export const initialWeather: WeatherData = {
  temperatureC: 29.5,
  windSpeedKt: 12,
  windDirection: 'ENE',
  seaStateM: 1.2,
  conditions: 'Partly Cloudy / Fair Waves',
  pressureHpa: 1011,
  humidityPct: 78,
  updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isLiveApi: false,
  locationName: 'Miri Offshore / Salbiah Field'
};

export const initialParticipants: Participant[] = [
  { id: 'p1', name: 'ECC Incident Commander', roleShort: 'IC', department: 'DIALOG Tower', status: 'Connected', videoOn: true, micOn: true },
  { id: 'p2', name: 'MOCC Operations', roleShort: 'MO', department: 'Miri Shore Base', status: 'Connected', videoOn: true, micOn: true },
  { id: 'p3', name: 'HSE / Regulatory', roleShort: 'HS', department: 'Regulatory Affairs', status: 'Connected', videoOn: true, micOn: true },
  { id: 'p4', name: 'MOCC On-Scene Commander', roleShort: 'OSC', department: 'MOCC Onsite', status: 'Speaking', videoOn: true, micOn: true },
  { id: 'p5', name: 'Offshore OIM / OERT', roleShort: 'OIM', department: 'SLDP-A Platform', status: 'Connected', videoOn: true, micOn: false },
  { id: 'p6', name: 'Logistics Lead', roleShort: 'LOG', department: 'Miri Logistics', status: 'Connected', videoOn: false, micOn: false }
];

export const initialChatMessages: ChatMessage[] = [
  { id: 'm1', sender: 'MOCC On-Scene Commander', role: 'OSC', time: '14:10', text: 'All 24 personnel accounted for at muster station. System pressure dropped.' },
  { id: 'm2', sender: 'ECC Incident Commander', role: 'IC', time: '14:15', text: 'Confirmed Level 2 declaration. FCB-01 dispatched to location.' },
  { id: 'm3', sender: 'MOCC Operations', role: 'MO', time: '14:22', text: 'Source isolated successfully. Medical team on standby at Miri base.' }
];

export const initialUsers: User[] = [
  { id: 'u1', name: 'Ir. Ahmad Zaim', role: 'Admin (Incident Commander)', email: 'ic.drsb@dialog.my', department: 'ECC / DIALOG Tower', avatar: 'IC' },
  { id: 'u2', name: 'Capt. Marcus Tan', role: 'Editor (Operations Chief)', email: 'operations.mocc@dialog.my', department: 'MOCC Miri', avatar: 'MO' },
  { id: 'u3', name: 'Siti Nurhaliza', role: 'Viewer (Observer)', email: 'hse.audit@dialog.my', department: 'HSE Regulatory', avatar: 'HS' }
];

export const fieldCoordinates = {
  moccShoreBase: { lat: 4.3995, lng: 113.9914, name: 'MOCC / Shore Base (Miri)' },
  sldpA: { lat: 4.4850, lng: 113.8500, name: 'SLDP-A Facility (Salbiah Field)' },
  s1: { lat: 4.5100, lng: 113.8000, name: 'Wellhead Platform (S1)' },
  s2: { lat: 4.5300, lng: 113.9000, name: 'Wellhead Platform (S2)' },
  s3: { lat: 4.4200, lng: 113.8800, name: 'Wellhead Platform (S3)' },
  subsea: { lat: 4.4500, lng: 113.8100, name: 'Subsea Template Area' }
};
