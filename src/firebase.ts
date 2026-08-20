import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import {
  IncidentDetails,
  TimelineEvent,
  ActionItem,
  Vessel,
  Helicopter,
  WeatherData,
  Participant,
  ChatMessage
} from './types';
import {
  initialIncident,
  initialTimeline,
  initialActionItems,
  initialVessels,
  initialHelicopter,
  initialWeather,
  initialParticipants,
  initialChatMessages
} from './data/initialData';

// User's provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBufm56WxejVYuXrhls8JGg62SItA23Kus",
  authDomain: "drsb-emt.firebaseapp.com",
  projectId: "drsb-emt",
  storageBucket: "drsb-emt.firebasestorage.app",
  messagingSenderId: "612322570417",
  appId: "1:612322570417:web:85f8a745386ba37c883290",
  measurementId: "G-1C9CNEER6H"
};

// Initialize Firebase app singleton
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    timestamp: new Date().toISOString()
  };
  console.error('Firestore Error:', JSON.stringify(errInfo, null, 2));
  return errInfo;
}

export interface EMTDashboardFirestoreState {
  incident: IncidentDetails;
  timeline: TimelineEvent[];
  actions: ActionItem[];
  vessels: Vessel[];
  helicopter: Helicopter;
  weather: WeatherData;
  participants: Participant[];
  chatMessages: ChatMessage[];
  lastUpdated?: string;
  updatedBy?: string;
}

export const DEFAULT_EMT_STATE: EMTDashboardFirestoreState = {
  incident: initialIncident,
  timeline: initialTimeline,
  actions: initialActionItems,
  vessels: initialVessels,
  helicopter: initialHelicopter,
  weather: initialWeather,
  participants: initialParticipants,
  chatMessages: initialChatMessages,
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System Initializer'
};

const DASHBOARD_DOC_PATH = 'emt_dashboard/live_state';

/**
 * Test connectivity to Firestore server
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const docRef = doc(db, 'emt_dashboard', 'live_state');
    await getDocFromServer(docRef);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or network unreachable.");
    }
    return false;
  }
}

/**
 * Real-time subscription to EMT Dashboard live state
 */
export function subscribeToDashboardState(
  onData: (state: EMTDashboardFirestoreState) => void,
  onError?: (err: FirestoreErrorInfo) => void
): Unsubscribe {
  const docRef = doc(db, 'emt_dashboard', 'live_state');

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as EMTDashboardFirestoreState;
        onData(data);
      } else {
        // First-time initialization: seed default dataset
        saveDashboardState(DEFAULT_EMT_STATE, 'Auto Initial Seed').catch((err) => {
          console.error('Error seeding initial state to Firestore:', err);
        });
        onData(DEFAULT_EMT_STATE);
      }
    },
    (error) => {
      const errInfo = handleFirestoreError(error, OperationType.GET, DASHBOARD_DOC_PATH);
      if (onError) onError(errInfo);
    }
  );
}

/**
 * Save / Update full or partial EMT Dashboard state to Firebase Firestore
 */
export async function saveDashboardState(
  state: EMTDashboardFirestoreState,
  updatedBy: string = 'EMT User'
): Promise<void> {
  const docRef = doc(db, 'emt_dashboard', 'live_state');
  const payload: EMTDashboardFirestoreState = {
    incident: state.incident,
    timeline: state.timeline,
    actions: state.actions,
    vessels: state.vessels,
    helicopter: state.helicopter,
    weather: state.weather,
    participants: state.participants,
    chatMessages: state.chatMessages,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    updatedBy
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, DASHBOARD_DOC_PATH);
    throw error;
  }
}

/**
 * Reset Firebase database back to system default emergency drill state
 */
export async function resetDashboardStateInFirestore(): Promise<void> {
  const docRef = doc(db, 'emt_dashboard', 'live_state');
  try {
    await setDoc(docRef, {
      ...DEFAULT_EMT_STATE,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      updatedBy: 'Reset to Drill Baseline'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, DASHBOARD_DOC_PATH);
    throw error;
  }
}
