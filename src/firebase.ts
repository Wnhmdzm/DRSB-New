import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  getDocFromServer,
  Unsubscribe
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
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
export const auth = getAuth(app);

// Attempt silent anonymous authentication so security rules requiring auth pass seamlessly
try {
  signInAnonymously(auth).catch((err) => {
    console.info('Firebase anonymous auth notice:', err.message);
  });
} catch (e) {
  console.info('Auth initialization note:', e);
}

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
  code?: string;
  operationType: OperationType;
  path: string | null;
  timestamp: string;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errCode = (error as { code?: string })?.code;
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    code: errCode,
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
 * Deep-clean all properties to remove `undefined` values which Firestore strictly rejects
 */
export function sanitizeFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeFirestoreData(value);
      }
    }
    return cleanObj as T;
  }
  return obj;
}

export interface FirestoreConnectionResult {
  ok: boolean;
  message: string;
  code?: string;
  isPermissionError?: boolean;
}

/**
 * Test connectivity and permission to Firestore server
 */
export async function testFirestoreConnection(): Promise<FirestoreConnectionResult> {
  try {
    const docRef = doc(db, 'emt_dashboard', 'live_state');
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      // Seed default doc
      await setDoc(docRef, sanitizeFirestoreData(DEFAULT_EMT_STATE));
    }
    return {
      ok: true,
      message: 'Successfully connected and verified with Firebase Firestore (drsb-emt).'
    };
  } catch (error: unknown) {
    const errCode = (error as { code?: string })?.code;
    const errMsg = error instanceof Error ? error.message : String(error);
    const isPermission = errCode === 'permission-denied' || errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('insufficient');

    if (isPermission) {
      return {
        ok: false,
        code: 'permission-denied',
        isPermissionError: true,
        message: 'Firestore Security Rules are blocking access. Please check rules in Firebase Console.'
      };
    }

    if (errMsg.includes('the client is offline') || errCode === 'unavailable') {
      return {
        ok: false,
        code: 'unavailable',
        message: 'Firestore server is unreachable or offline.'
      };
    }

    return {
      ok: false,
      code: errCode || 'unknown',
      message: errMsg
    };
  }
}

/**
 * Fetch the latest live state directly from Firestore
 */
export async function fetchLiveDashboardState(): Promise<EMTDashboardFirestoreState | null> {
  try {
    const docRef = doc(db, 'emt_dashboard', 'live_state');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as EMTDashboardFirestoreState;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, DASHBOARD_DOC_PATH);
    return null;
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
        // Document does not exist yet on Firestore; attempt initial seed
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
 * Save / Update full EMT Dashboard state to Firebase Firestore
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
    const sanitized = sanitizeFirestoreData(payload);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    const errInfo = handleFirestoreError(error, OperationType.WRITE, DASHBOARD_DOC_PATH);
    throw errInfo;
  }
}

/**
 * Reset Firebase database back to system default emergency drill state
 */
export async function resetDashboardStateInFirestore(): Promise<void> {
  const docRef = doc(db, 'emt_dashboard', 'live_state');
  try {
    const sanitized = sanitizeFirestoreData({
      ...DEFAULT_EMT_STATE,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      updatedBy: 'Reset to Drill Baseline'
    });
    await setDoc(docRef, sanitized);
  } catch (error) {
    const errInfo = handleFirestoreError(error, OperationType.WRITE, DASHBOARD_DOC_PATH);
    throw errInfo;
  }
}
