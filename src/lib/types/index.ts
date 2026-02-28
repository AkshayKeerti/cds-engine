// Shared TypeScript types for the CDS engine

export type LabType = 'creatinine' | 'bun' | 'gfr' | 'potassium' | 'ast' | 'alt';
export type AlertSeverity = 'critical' | 'warning' | 'informational' | 'silent';
export type AlertType = 'context_aware' | 'static';
export type AlertStatus = 'active' | 'dismissed' | 'confirmed';
export type MedicationStatus = 'active' | 'discontinued' | 'held';
export type PatientStatus = 'admitted' | 'discharged' | 'critical';
export type ClearanceRoute = 'renal' | 'hepatic' | 'both';
export type TrendDirection = 'rising' | 'stable' | 'falling';

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  weight: number;
  comorbidities: string[];
  baselineCreatinine: number;
  baselineGfr: number;
  unit: string;
  status: PatientStatus;
}

export interface Medication {
  id: string;
  patientId: string;
  drugName: string;
  drugCode: string;
  dose: string;
  route: string;
  frequency: string;
  startTime: string;
  status: MedicationStatus;
}

export interface LabResult {
  id: string;
  patientId: string;
  labType: LabType;
  value: number;
  unit: string;
  timestamp: string;
  trend?: TrendDirection;
}

export interface Alert {
  id: string;
  patientId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  mechanism: string;
  riskProjection: string;
  recommendation: string;
  drugPair: [string, string];
  riskScore: number;
  status: AlertStatus;
  clinicianFeedback?: string;
  createdAt: string;
  simulationHour: number;
}

export interface AuditLog {
  id: string;
  alertId?: string;
  patientId: string;
  action: string;
  actor: string;
  details: Record<string, unknown>;
  timestamp: string;
}

export interface DrugPair {
  drugA: string;
  drugB: string;
  drugCodeA: string;
  drugCodeB: string;
  clearanceRoute: ClearanceRoute;
  toxicityMultiplier: number;
  mechanism: string;
  riskDescription: string;
  recommendation: string;
  alternativeDrug?: string;
  monitoringParams: LabType[];
}

export interface RiskScore {
  score: number;
  severity: AlertSeverity;
  organFunctionScore: number;
  toxicityMultiplier: number;
  trendFactor: number;
  details: string;
}

export interface SimulationState {
  currentHour: number;
  isPlaying: boolean;
  speed: number; // seconds per step
  selectedPatientId: string | null;
}

export interface InterventionCard {
  why: string;      // Mechanism of interaction
  risk: string;     // Projected accumulation/danger
  what: string;     // Recommended action
  severity: AlertSeverity;
  drugPair: [string, string];
  riskScore: number;
}

export interface ScenarioStep {
  hour: number;
  labs: { labType: LabType; value: number; unit: string }[];
  expectedScore?: number;
  expectedSeverity?: AlertSeverity;
  narrative?: string;
}

export interface Scenario {
  id: string;
  name: string;
  patientId: string;
  description: string;
  drugs: string[];
  steps: ScenarioStep[];
}

export interface HandoverSummary {
  patientId: string;
  generatedAt: string;
  period: string;
  activeAlerts: Alert[];
  labTrends: { labType: LabType; direction: TrendDirection; latestValue: number; unit: string }[];
  activeMedications: Medication[];
  riskSummary: string;
  recommendations: string[];
}
