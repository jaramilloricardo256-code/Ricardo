
export type UserRole = 'student' | 'teacher';

export interface StudentProfile {
  userId: string;
  name: string;
  age: string;
  career: string;
  registrationDate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrolledCourses: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Module {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'assignment' | 'document';
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  questions?: QuizQuestion[];
  completed?: boolean;
}

export interface Unit {
  id: string;
  title: string;
  modules: Module[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  image: string;
  units: Unit[];
  progress?: number;
}

export interface AnalyticsEvent {
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
  action: 'view' | 'complete' | 'quiz_score' | 'feedback' | 'registration';
  value?: any; // Aquí guardaremos el texto manual o el score
  timestamp: number;
}
