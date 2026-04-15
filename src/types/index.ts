// Type definitions for the application

export interface Beneficiary {
  id?: number;
  name: string;
  facility: string;
  employee_no: string;
  rank: string;
  subject_code: string;
  course_section: string;
  day: string;
  time: string;
  nature: string;
  rate_per_hour: number;
  hours_per_day: number;
  created_at?: string;
  updated_at?: string;
}
