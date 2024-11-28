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
  annotateReason?: string;
  annotateTime: number;
  userId?: string;
  batchId?: string;
}

export interface Batch {
  id: string;
  index: number;
  confidence: number;
  performance: number;
  medicalTexts: MedicalTextData[];
}

export type UserCreationInput = {
  email: string;
  fullName: string;
  role: string;
};

export type MedicalTextDataInput = {
  originalText: string;
  task: string;
  confidence: number;
  annotateReason?: string;
  annotateTime: number;
  userId?: string;
  batchId?: string;
};

export type BatchInput = {
  index: number;
  confidence: number;
  performance: number;
};
