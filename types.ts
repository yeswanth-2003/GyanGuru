
export enum ModalityType {
  TEXT = 'Text',
  CODE = 'Code',
  AUDIO = 'Audio',
  IMAGE = 'Visual'
}

export enum ComplexityLevel {
  BRIEF = 'Brief',
  DETAILED = 'Detailed',
  COMPREHENSIVE = 'Comprehensive'
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface HistoryItem {
  id: string;
  type: ModalityType;
  topic: string;
  timestamp: number;
  data: any;
}

export interface LearningContent {
  title: string;
  explanation: string;
  code?: string;
  dependencies?: string[];
  audioScript?: string;
  imagePrompts?: string[];
  imageUrls?: string[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
