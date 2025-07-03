import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User, 
  Patient, 
  Appointment, 
  Consultation, 
  Medication,
  Allergy,
  VitalSign,
  SoapRecord,
  Measurement,
  Team,
  ApiResponse,
  PaginatedResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor para adicionar token JWT
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor para tratar erros
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticação
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Fallback para mock quando backend não está disponível
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED') {
        return this.mockLogin(credentials);
      }
      throw error;
    }
  }

  // Mock login para demonstração quando backend não está disponível
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verificar credenciais mock
    const validUsers = [
      {
        email: 'admin@prontuario.com',
        password: 'password123',
        user: {
          id: 1,
          name: 'Administrador do Sistema',
          email: 'admin@prontuario.com',
          role: 'admin' as const,
          registration_number: 'ADMIN001',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      },
      {
        email: 'dr.silva@prontuario.com',
        password: 'password123',
        user: {
          id: 2,
          name: 'Dr. João Silva',
          email: 'dr.silva@prontuario.com',
          role: 'doctor' as const,
          registration_number: 'CRM12345',
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    ];

    const user = validUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const token = `mock-token-${Date.now()}`;
    
    // Armazenar token mock para outras requests
    localStorage.setItem('auth_token', token);
    
    return {
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: user.user,
        access_token: token,
        refresh_token: `refresh-${token}`
      }
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', { user: data });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.delete('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  // Pacientes
  async getPatients(page = 1, perPage = 20, search?: string): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    const response = await this.api.get<PaginatedResponse<Patient>>(`/patients?${params}`);
    return response.data;
  }

  async getPatient(id: number): Promise<Patient> {
    const response = await this.api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  }

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const response = await this.api.post<ApiResponse<Patient>>('/patients', data);
    return response.data.data;
  }

  async updatePatient(id: number, data: Partial<Patient>): Promise<Patient> {
    const response = await this.api.put<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  }

  async deletePatient(id: number): Promise<void> {
    await this.api.delete(`/patients/${id}`);
  }

  // Agendamentos
  async getAppointments(page = 1, perPage = 20, filters?: {
    status?: string;
    date?: string;
    patient_id?: number;
  }): Promise<PaginatedResponse<Appointment>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await this.api.get<PaginatedResponse<Appointment>>(`/appointments?${params}`);
    return response.data;
  }

  async getAppointment(id: number): Promise<Appointment> {
    const response = await this.api.get<ApiResponse<Appointment>>(`/appointments/${id}`);
    return response.data.data;
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const response = await this.api.post<ApiResponse<Appointment>>('/appointments', data);
    return response.data.data;
  }

  async updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const response = await this.api.put<ApiResponse<Appointment>>(`/appointments/${id}`, data);
    return response.data.data;
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.api.delete(`/appointments/${id}`);
  }

  // Consultas
  async getConsultations(page = 1, perPage = 20, filters?: {
    patient_id?: number;
    appointment_id?: number;
  }): Promise<PaginatedResponse<Consultation>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    }
    const response = await this.api.get<PaginatedResponse<Consultation>>(`/consultations?${params}`);
    return response.data;
  }

  async getConsultation(id: number): Promise<Consultation> {
    const response = await this.api.get<ApiResponse<Consultation>>(`/consultations/${id}`);
    return response.data.data;
  }

  async createConsultation(data: Partial<Consultation>): Promise<Consultation> {
    const response = await this.api.post<ApiResponse<Consultation>>('/consultations', data);
    return response.data.data;
  }

  async updateConsultation(id: number, data: Partial<Consultation>): Promise<Consultation> {
    const response = await this.api.put<ApiResponse<Consultation>>(`/consultations/${id}`, data);
    return response.data.data;
  }

  async deleteConsultation(id: number): Promise<void> {
    await this.api.delete(`/consultations/${id}`);
  }

  // SOAP Records
  async createSoapRecord(data: Partial<SoapRecord>): Promise<SoapRecord> {
    const response = await this.api.post<ApiResponse<SoapRecord>>('/soap_records', data);
    return response.data.data;
  }

  async updateSoapRecord(id: number, data: Partial<SoapRecord>): Promise<SoapRecord> {
    const response = await this.api.put<ApiResponse<SoapRecord>>(`/soap_records/${id}`, data);
    return response.data.data;
  }

  // Sinais Vitais
  async createVitalSign(data: Partial<VitalSign>): Promise<VitalSign> {
    const response = await this.api.post<ApiResponse<VitalSign>>('/vital_signs', data);
    return response.data.data;
  }

  async updateVitalSign(id: number, data: Partial<VitalSign>): Promise<VitalSign> {
    const response = await this.api.put<ApiResponse<VitalSign>>(`/vital_signs/${id}`, data);
    return response.data.data;
  }

  // Medicamentos
  async getMedications(page = 1, perPage = 20, search?: string): Promise<PaginatedResponse<Medication>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (search) {
      params.append('search', search);
    }
    const response = await this.api.get<PaginatedResponse<Medication>>(`/medications?${params}`);
    return response.data;
  }

  async createMedication(data: Partial<Medication>): Promise<Medication> {
    const response = await this.api.post<ApiResponse<Medication>>('/medications', data);
    return response.data.data;
  }

  // Alergias
  async getAllergies(patientId: number): Promise<Allergy[]> {
    const response = await this.api.get<ApiResponse<Allergy[]>>(`/allergies?patient_id=${patientId}`);
    return response.data.data;
  }

  async createAllergy(data: Partial<Allergy>): Promise<Allergy> {
    const response = await this.api.post<ApiResponse<Allergy>>('/allergies', data);
    return response.data.data;
  }

  async deleteAllergy(id: number): Promise<void> {
    await this.api.delete(`/allergies/${id}`);
  }

  // Medições
  async getMeasurements(patientId: number): Promise<Measurement[]> {
    const response = await this.api.get<ApiResponse<Measurement[]>>(`/measurements?patient_id=${patientId}`);
    return response.data.data;
  }

  async createMeasurement(data: Partial<Measurement>): Promise<Measurement> {
    const response = await this.api.post<ApiResponse<Measurement>>('/measurements', data);
    return response.data.data;
  }

  // Equipes
  async getTeams(): Promise<Team[]> {
    const response = await this.api.get<ApiResponse<Team[]>>('/teams');
    return response.data.data;
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const response = await this.api.post<ApiResponse<Team>>('/teams', data);
    return response.data.data;
  }

  // Usuários
  async getUsers(page = 1, perPage = 20): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    const response = await this.api.get<PaginatedResponse<User>>(`/users?${params}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
