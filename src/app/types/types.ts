export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  medicalTexts: MedicalTextData[];
}

export interface MedicalTextData {
  id: string;
  originalText: string;
  annotatedText: string;
  task: string;
  confidence: number;
  batchNumber: number;
  batchPerformance: number;
}

export type UserCreationInput = {
  email: string;
  fullName: string;
  role: string;
};
