export interface Question {
  id: string;
  text: string;
  type: 'single' | 'scale' | 'input';
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
}

export interface UserData {
  name: string;
  email: string;
}

export interface QuizAnswers {
  [key: string]: string | number;
}

export interface ActionableStep {
  time: 'Manhã' | 'Tarde' | 'Noite';
  action: string;
  iconType: 'sun' | 'coffee' | 'moon';
}

export interface ActionPlanPhase {
  title: string;
  duration: string;
  focus: string;
  steps: string[];
}

export interface SupplementRecommendation {
  name: string;
  dosage: string;
  reason: string;
  timing: string;
}

export interface AnalysisResult {
  userName: string; 
  score: number; // 0 to 100
  sleepEfficiency: number; // Percentage (0-100)
  timeInBed: string; 
  actualSleepTime: string; 
  lostTime: string; 
  summary: string;
  basicTips: string[];
  checklist: ActionableStep[]; 
  fullAnalysis: string; // Markdown content
  advancedStrategies: string[]; // Now just general advanced tips
  recoveryPlan: ActionPlanPhase[]; // NEW: 7, 14, 30 days plan
  supplementStack: SupplementRecommendation[]; // NEW: Specific supplements
  circadianProfile: string; 
}

export enum AppState {
  LANDING,
  QUIZ,
  PROCESSING,
  PRE_RESULT,
  PAYMENT,
  FULL_RESULT
}