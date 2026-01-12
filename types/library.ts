export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  faculty: string;
  description: string;
  files?: Array<{
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'docx';
  }>;
  video_links?: string[];
  questions?: Array<{
    year: string;
    semester: string;
    questions: string;
  }>;
  credit_hours?: number;
  prerequisites?: string[];
  course_level?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LectureSummary {
  id: string;
  course_id: string;
  title: string;
  content: string;
  lecture_number: number;
  semester: string | null;
  year: string | null;
  created_at: string;
  updated_at: string;
  course?: Course; // Populated when joined
}

export interface StudyPlan {
  id: string;
  major_name: string;
  major_code: string;
  department: string;
  college: string;
  total_credit_hours: number;
  years: number;
  plan_data: any; // JSONB structure
  description: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type LibrarySection = 
  | 'academic-content' 
  | 'lecture-summaries' 
  | 'suggested-courses' 
  | 'learning-paths' 
  | 'tools';
