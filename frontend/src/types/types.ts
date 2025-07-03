export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  phone?: string;
  active: boolean;
  registration_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  rg?: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  user_id: number;
  team_id?: number;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
  patient?: Patient;
  user?: User;
  team?: Team;
}

export interface Consultation {
  id: number;
  appointment_id: number;
  patient_id: number;
  user_id: number;
  chief_complaint?: string;
  present_illness?: string;
  physical_examination?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  appointment?: Appointment;
  patient?: Patient;
  user?: User;
  soap_records?: SoapRecord[];
  vital_signs?: VitalSign[];
  medications?: Medication[];
}

export interface SoapRecord {
  id: number;
  consultation_id: number;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  created_at: string;
  updated_at: string;
  consultation?: Consultation;
}

export interface VitalSign {
  id: number;
  consultation_id: number;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  temperature?: number;
  oxygen_saturation?: number;
  weight?: number;
  height?: number;
  bmi?: number;
  notes?: string;
  measured_at: string;
  created_at: string;
  updated_at: string;
  consultation?: Consultation;
}

export interface Medication {
  id: number;
  name: string;
  dosage?: string;
  frequency?: string;
  route: 'oral' | 'intravenous' | 'intramuscular' | 'subcutaneous' | 'topical' | 'inhalation' | 'other';
  instructions?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Allergy {
  id: number;
  patient_id: number;
  allergen: string;
  reaction?: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface Measurement {
  id: number;
  patient_id: number;
  measurement_type: string;
  value: number;
  unit: string;
  notes?: string;
  measured_at: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    access_token: string;
    refresh_token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  role: 'admin' | 'doctor' | 'nurse' | 'receptionist';
  phone?: string;
  registration_number?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_count: number;
  };
}
