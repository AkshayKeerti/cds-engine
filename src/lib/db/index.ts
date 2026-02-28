// In-memory store — no SQLite, Vercel-compatible
import { v4 as uuid } from 'uuid';

export interface DbPatient {
  id: string;
  name: string;
  age: number;
  sex: string;
  weight: number;
  comorbidities: string; // JSON string
  baselineCreatinine: number;
  baselineGfr: number;
  unit: string;
  status: string;
}

export interface DbMedication {
  id: string;
  patientId: string;
  drugName: string;
  drugCode: string;
  dose: string;
  route: string;
  frequency: string;
  startTime: string;
  status: string;
}

export interface DbLabResult {
  id: string;
  patientId: string;
  labType: string;
  value: number;
  unit: string;
  timestamp: string;
  trend: string | null;
}

export interface DbAlert {
  id: string;
  patientId: string;
  alertType: string;
  severity: string;
  title: string;
  mechanism: string;
  riskProjection: string;
  recommendation: string;
  drugPair: string; // JSON string
  riskScore: number;
  status: string;
  clinicianFeedback: string | null;
  createdAt: string;
  simulationHour: number;
}

export interface DbAuditLog {
  id: string;
  alertId: string | null;
  patientId: string;
  action: string;
  actor: string;
  details: string; // JSON string
  timestamp: string;
}

export interface DbSimulationState {
  id: string;
  currentHour: number;
  isPlaying: boolean;
}

// --- In-memory tables ---
let patients: DbPatient[] = [];
let medications: DbMedication[] = [];
let labResults: DbLabResult[] = [];
let alerts: DbAlert[] = [];
let auditLogs: DbAuditLog[] = [];
let simulationState: DbSimulationState = { id: 'global', currentHour: 0, isPlaying: false };
let seeded = false;

function seed() {
  const now = new Date().toISOString();

  patients = [
    { id: 'patient-1', name: 'Robert Chen', age: 68, sex: 'M', weight: 82, comorbidities: JSON.stringify(['Sepsis', 'Type 2 Diabetes', 'Hypertension']), baselineCreatinine: 1.0, baselineGfr: 95, unit: 'ICU Bed 4', status: 'critical' },
    { id: 'patient-2', name: 'Maria Santos', age: 72, sex: 'F', weight: 65, comorbidities: JSON.stringify(['Type 2 Diabetes', 'CKD Stage 2', 'Coronary Artery Disease']), baselineCreatinine: 1.3, baselineGfr: 68, unit: 'ICU Bed 7', status: 'admitted' },
    { id: 'patient-3', name: 'James Wilson', age: 55, sex: 'M', weight: 95, comorbidities: JSON.stringify(['Hypertension', 'Post-surgical', 'Osteoarthritis']), baselineCreatinine: 1.1, baselineGfr: 82, unit: 'ICU Bed 12', status: 'admitted' },
  ];

  medications = [
    { id: uuid(), patientId: 'patient-1', drugName: 'Vancomycin', drugCode: 'VANC', dose: '1g', route: 'IV', frequency: 'Q12H', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-1', drugName: 'Gentamicin', drugCode: 'GENT', dose: '80mg', route: 'IV', frequency: 'Q8H', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-1', drugName: 'Norepinephrine', drugCode: 'NORE', dose: '0.1mcg/kg/min', route: 'IV', frequency: 'Continuous', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-1', drugName: 'Normal Saline', drugCode: 'NS', dose: '125mL/hr', route: 'IV', frequency: 'Continuous', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-2', drugName: 'Metformin', drugCode: 'METF', dose: '500mg', route: 'PO', frequency: 'BID', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-2', drugName: 'IV Contrast', drugCode: 'CNTR', dose: '100mL', route: 'IV', frequency: 'Once', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-2', drugName: 'Aspirin', drugCode: 'ASA', dose: '81mg', route: 'PO', frequency: 'Daily', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-3', drugName: 'Ketorolac', drugCode: 'KETO', dose: '30mg', route: 'IV', frequency: 'Q6H', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-3', drugName: 'Lisinopril', drugCode: 'LISI', dose: '10mg', route: 'PO', frequency: 'Daily', startTime: now, status: 'active' },
    { id: uuid(), patientId: 'patient-3', drugName: 'Omeprazole', drugCode: 'OMEP', dose: '20mg', route: 'PO', frequency: 'Daily', startTime: now, status: 'active' },
  ];

  const baseLabs: { patientId: string; labs: { labType: string; value: number; unit: string }[] }[] = [
    { patientId: 'patient-1', labs: [
      { labType: 'creatinine', value: 1.0, unit: 'mg/dL' },
      { labType: 'bun', value: 18, unit: 'mg/dL' },
      { labType: 'gfr', value: 95, unit: 'mL/min' },
      { labType: 'potassium', value: 4.2, unit: 'mEq/L' },
    ]},
    { patientId: 'patient-2', labs: [
      { labType: 'creatinine', value: 1.3, unit: 'mg/dL' },
      { labType: 'gfr', value: 68, unit: 'mL/min' },
      { labType: 'potassium', value: 4.0, unit: 'mEq/L' },
    ]},
    { patientId: 'patient-3', labs: [
      { labType: 'creatinine', value: 1.1, unit: 'mg/dL' },
      { labType: 'gfr', value: 82, unit: 'mL/min' },
      { labType: 'potassium', value: 4.4, unit: 'mEq/L' },
    ]},
  ];

  labResults = [];
  for (const s of baseLabs) {
    for (const lab of s.labs) {
      labResults.push({ id: uuid(), patientId: s.patientId, labType: lab.labType, value: lab.value, unit: lab.unit, timestamp: now, trend: 'stable' });
    }
  }

  alerts = [];
  auditLogs = [];
  simulationState = { id: 'global', currentHour: 0, isPlaying: false };
}

function ensureSeeded() {
  if (!seeded) {
    seed();
    seeded = true;
  }
}

// --- Public API (drop-in replacement for drizzle queries) ---

export const store = {
  getPatients: () => { ensureSeeded(); return patients; },
  getPatient: (id: string) => { ensureSeeded(); return patients.find((p) => p.id === id); },

  getMedications: (patientId?: string) => { ensureSeeded(); return patientId ? medications.filter((m) => m.patientId === patientId) : medications; },

  getLabResults: (patientId?: string) => { ensureSeeded(); return patientId ? labResults.filter((l) => l.patientId === patientId) : labResults; },
  insertLabResult: (lab: DbLabResult) => { ensureSeeded(); labResults.push(lab); },

  getAlerts: (filters?: { patientId?: string; alertType?: string }) => {
    ensureSeeded();
    let result = alerts;
    if (filters?.patientId) result = result.filter((a) => a.patientId === filters.patientId);
    if (filters?.alertType) result = result.filter((a) => a.alertType === filters.alertType);
    return result;
  },
  getAlert: (id: string) => { ensureSeeded(); return alerts.find((a) => a.id === id); },
  insertAlert: (alert: DbAlert) => { ensureSeeded(); alerts.push(alert); },
  updateAlert: (id: string, updates: Partial<DbAlert>) => {
    ensureSeeded();
    const idx = alerts.findIndex((a) => a.id === id);
    if (idx !== -1) alerts[idx] = { ...alerts[idx], ...updates };
  },

  getAuditLogs: (patientId?: string) => { ensureSeeded(); return patientId ? auditLogs.filter((l) => l.patientId === patientId) : auditLogs; },
  insertAuditLog: (log: DbAuditLog) => { ensureSeeded(); auditLogs.push(log); },

  getSimulationState: () => { ensureSeeded(); return simulationState; },
  updateSimulationState: (updates: Partial<DbSimulationState>) => { ensureSeeded(); simulationState = { ...simulationState, ...updates }; },

  reset: () => { seed(); seeded = true; },
};
