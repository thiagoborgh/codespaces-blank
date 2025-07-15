import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SOAPTab from '../components/SOAPTab';
import { Patient, Consultation, Appointment } from '../types/types';
import { 
  UserIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  HeartIcon,
  ArrowLeftIcon,
  CalendarIcon,
  PhoneIcon,
  IdentificationIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  DocumentIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const MedicalRecordPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'soap' | 'history' | 'prescriptions' | 'exams' | 'appointments' | 'documents'>('overview');
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    // Verificar se foi passado um tab específico via URL
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['overview', 'soap', 'history', 'prescriptions', 'exams', 'appointments', 'documents'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (patientId) {
      loadPatientData();
    }
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular carregamento de dados - substituir por chamadas reais à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados - substituir por dados reais da API
      const mockPatient: Patient = {
        id: parseInt(patientId!),
        name: 'Maria Silva Santos',
        cpf: '12345678901',
        rg: '1234567',
        birth_date: '1985-03-15',
        gender: 'female',
        phone: '11987654321',
        email: 'maria.silva@email.com',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234567',
        emergency_contact: 'João Silva',
        emergency_phone: '11987654322',
        active: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-12-01T15:30:00Z'
      };

      const mockConsultations: Consultation[] = [
        {
          id: 1,
          appointment_id: 1,
          patient_id: parseInt(patientId!),
          user_id: 1,
          chief_complaint: 'Dor de cabeça há 3 dias',
          present_illness: 'Paciente relata cefaleia frontal, de intensidade moderada, que piora com exposição à luz. Nega febre, náuseas ou vômitos.',
          physical_examination: 'PA: 120/80 mmHg, FC: 72 bpm, Tax: 36.5°C. Paciente em bom estado geral, orientada, cooperativa. Ausculta cardiopulmonar normal.',
          diagnosis: 'Cefaleia tensional',
          treatment_plan: 'Dipirona 500mg, 1 comprimido de 8/8h por 5 dias. Repouso relativo.',
          follow_up: 'Retorno em 1 semana se persistir sintomas',
          notes: 'Orientado sobre sinais de alarme',
          created_at: '2024-12-01T10:00:00Z',
          updated_at: '2024-12-01T10:00:00Z'
        },
        {
          id: 2,
          appointment_id: 2,
          patient_id: parseInt(patientId!),
          user_id: 2,
          chief_complaint: 'Consulta de rotina',
          present_illness: 'Paciente assintomática, comparece para consulta de rotina e renovação de receitas.',
          physical_examination: 'PA: 118/78 mmHg, FC: 70 bpm, Peso: 65kg, Altura: 1.65m, IMC: 23.9. Exame físico sem alterações.',
          diagnosis: 'Paciente hígida',
          treatment_plan: 'Manutenção das medicações em uso',
          follow_up: 'Retorno em 6 meses',
          notes: 'Solicitados exames de rotina',
          created_at: '2024-11-01T14:30:00Z',
          updated_at: '2024-11-01T14:30:00Z'
        }
      ];

      const mockAppointments: Appointment[] = [
        {
          id: 1,
          patient_id: parseInt(patientId!),
          user_id: 1,
          appointment_date: '2024-12-01',
          appointment_time: '10:00',
          status: 'completed',
          priority: 'normal',
          notes: 'Consulta médica',
          created_at: '2024-11-25T09:00:00Z',
          updated_at: '2024-12-01T11:00:00Z'
        },
        {
          id: 2,
          patient_id: parseInt(patientId!),
          user_id: 2,
          appointment_date: '2024-11-01',
          appointment_time: '14:30',
          status: 'completed',
          priority: 'normal',
          notes: 'Consulta de rotina',
          created_at: '2024-10-25T10:00:00Z',
          updated_at: '2024-11-01T15:30:00Z'
        },
        {
          id: 3,
          patient_id: parseInt(patientId!),
          user_id: 1,
          appointment_date: '2025-01-15',
          appointment_time: '09:00',
          status: 'scheduled',
          priority: 'normal',
          notes: 'Retorno',
          created_at: '2024-12-01T11:00:00Z',
          updated_at: '2024-12-01T11:00:00Z'
        }
      ];

      setPatient(mockPatient);
      setConsultations(mockConsultations);
      setAppointments(mockAppointments);
    } catch (err) {
      setError('Erro ao carregar dados do prontuário');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'scheduled': { label: 'Agendado', color: 'bg-blue-100 text-blue-800' },
      'confirmed': { label: 'Confirmado', color: 'bg-green-100 text-green-800' },
      'in_progress': { label: 'Em Andamento', color: 'bg-yellow-100 text-yellow-800' },
      'completed': { label: 'Concluído', color: 'bg-gray-100 text-gray-800' },
      'cancelled': { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
      'no_show': { label: 'Não Compareceu', color: 'bg-orange-100 text-orange-800' }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.scheduled;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      'low': { label: 'Baixa', color: 'bg-gray-100 text-gray-800' },
      'normal': { label: 'Normal', color: 'bg-blue-100 text-blue-800' },
      'high': { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
      'urgent': { label: 'Urgente', color: 'bg-red-100 text-red-800' }
    };

    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityInfo.color}`}>
        {priorityInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando prontuário...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Paciente não encontrado'}</p>
            <button
              onClick={() => navigate('/queue')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar à Fila
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/queue')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                Prontuário do Cidadão
              </h1>
              <p className="text-gray-600">Visualização completa do histórico médico</p>
            </div>
          </div>
        </div>

        {/* Patient Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{patient.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <IdentificationIcon className="h-4 w-4" />
                  <span>CPF: {formatCPF(patient.cpf)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Nascimento: {formatDate(patient.birth_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{patient.phone ? formatPhone(patient.phone) : 'Não informado'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'info', label: 'Informações Pessoais', icon: UserIcon },
                { id: 'consultations', label: 'Consultas', icon: DocumentTextIcon },
                { id: 'appointments', label: 'Agendamentos', icon: CalendarIcon }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Informações Pessoais */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nome Completo</label>
                        <p className="text-gray-900">{patient.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">CPF</label>
                        <p className="text-gray-900">{formatCPF(patient.cpf)}</p>
                      </div>
                      {patient.rg && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">RG</label>
                          <p className="text-gray-900">{patient.rg}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                        <p className="text-gray-900">{formatDate(patient.birth_date)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Gênero</label>
                        <p className="text-gray-900">
                          {patient.gender === 'male' ? 'Masculino' : patient.gender === 'female' ? 'Feminino' : 'Outro'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contato</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Telefone</label>
                        <p className="text-gray-900">{patient.phone ? formatPhone(patient.phone) : 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{patient.email || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Endereço</label>
                        <p className="text-gray-900">{patient.address || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Cidade/Estado</label>
                        <p className="text-gray-900">
                          {patient.city && patient.state ? `${patient.city}/${patient.state}` : 'Não informado'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">CEP</label>
                        <p className="text-gray-900">{patient.zip_code || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {(patient.emergency_contact || patient.emergency_phone) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contato de Emergência</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Nome</label>
                        <p className="text-gray-900">{patient.emergency_contact || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Telefone</label>
                        <p className="text-gray-900">
                          {patient.emergency_phone ? formatPhone(patient.emergency_phone) : 'Não informado'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Consultas */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Histórico de Consultas</h3>
                  <span className="text-sm text-gray-500">{consultations.length} consulta(s)</span>
                </div>

                {consultations.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma consulta registrada</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {consultations.map((consultation) => (
                      <div key={consultation.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            Consulta - {formatDateTime(consultation.created_at)}
                          </h4>
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Queixa Principal</h5>
                            <p className="text-gray-700 text-sm">{consultation.chief_complaint}</p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Diagnóstico</h5>
                            <p className="text-gray-700 text-sm">{consultation.diagnosis}</p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">História da Doença Atual</h5>
                            <p className="text-gray-700 text-sm">{consultation.present_illness}</p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Plano de Tratamento</h5>
                            <p className="text-gray-700 text-sm">{consultation.treatment_plan}</p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Exame Físico</h5>
                            <p className="text-gray-700 text-sm">{consultation.physical_examination}</p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Seguimento</h5>
                            <p className="text-gray-700 text-sm">{consultation.follow_up}</p>
                          </div>
                        </div>

                        {consultation.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="font-medium text-gray-900 mb-2">Observações</h5>
                            <p className="text-gray-700 text-sm">{consultation.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Agendamentos */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Histórico de Agendamentos</h3>
                  <span className="text-sm text-gray-500">{appointments.length} agendamento(s)</span>
                </div>

                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum agendamento registrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">
                                {new Date(appointment.appointment_date).getDate()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(appointment.appointment_date).toLocaleDateString('pt-BR', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {appointment.appointment_time} - {appointment.notes}
                              </p>
                              <p className="text-sm text-gray-600">
                                Criado em {formatDateTime(appointment.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appointment.status)}
                            {getPriorityBadge(appointment.priority)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalRecordPage;
