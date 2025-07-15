import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SOAPTab from '../components/SOAPTab';
import FolhaRosto from '../components/FolhaRosto';
import { Patient, Consultation, Appointment } from '../types/types';
import { 
  UserIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  ArrowLeftIcon,
  CalendarIcon,
  PhoneIcon,
  IdentificationIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Ícones para medicamentos e documentos (fallback)
const MedicationIcon = DocumentTextIcon;
const DocumentIcon = DocumentTextIcon;

const MedicalRecordPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'folha-rosto' | 'overview' | 'soap' | 'history' | 'prescriptions' | 'exams' | 'appointments' | 'documents'>('folha-rosto');
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    // Verificar se foi passado um tab específico via URL
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['folha-rosto', 'overview', 'soap', 'history', 'prescriptions', 'exams', 'appointments', 'documents'].includes(tabFromUrl)) {
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

      setPatient(mockPatient);
      
      // Se o tab é SOAP, criar uma nova consulta ativa
      if (activeTab === 'soap') {
        const newConsultation: Consultation = {
          id: Date.now(),
          appointment_id: 1,
          patient_id: parseInt(patientId!),
          user_id: 1,
          chief_complaint: '',
          present_illness: '',
          physical_examination: '',
          diagnosis: '',
          treatment_plan: '',
          follow_up: '',
          notes: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setActiveConsultation(newConsultation);
      }
      
    } catch (err) {
      setError('Erro ao carregar dados do paciente');
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSOAPSave = async (soapData: any) => {
    try {
      console.log('Salvando dados SOAP:', soapData);
      // Aqui você faria a chamada para a API para salvar os dados
      // await api.saveSOAPData(patientId, soapData);
    } catch (error) {
      console.error('Erro ao salvar dados SOAP:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const tabs = [
    { id: 'folha-rosto', label: 'Folha Rosto', icon: ChartBarIcon },
    { id: 'overview', label: 'Informações Gerais', icon: UserIcon },
    { id: 'soap', label: 'Atendimento SOAP', icon: ClipboardDocumentListIcon },
    { id: 'history', label: 'Histórico', icon: ClockIcon },
    { id: 'prescriptions', label: 'Prescrições', icon: MedicationIcon },
    { id: 'exams', label: 'Exames', icon: BeakerIcon },
    { id: 'appointments', label: 'Agendamentos', icon: CalendarIcon },
    { id: 'documents', label: 'Documentos', icon: DocumentIcon }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !patient) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/queue')}
                className="flex items-center text-gray-500 hover:text-gray-700 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Voltar para Fila
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prontuário Eletrônico</h1>
                <p className="text-gray-600">Pasta completa do paciente</p>
              </div>
            </div>
            {activeTab === 'soap' && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Atendimento em Andamento
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Patient Header */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>📋 {formatCPF(patient.cpf)}</span>
                    <span>🎂 {calculateAge(patient.birth_date)} anos</span>
                    <span>📱 {patient.phone ? formatPhone(patient.phone) : 'Não informado'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Última atualização</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(patient.updated_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map(tab => (
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
            {/* Folha Rosto Tab */}
            {activeTab === 'folha-rosto' && (
              <FolhaRosto patient={patient} />
            )}

            {/* Overview Tab */}
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
                      {patient.email && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{patient.email}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Endereço</label>
                        <p className="text-gray-900">{patient.address}</p>
                        <p className="text-gray-900">{patient.city}, {patient.state} - {patient.zip_code}</p>
                      </div>
                      {patient.emergency_contact && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Contato de Emergência</label>
                          <p className="text-gray-900">{patient.emergency_contact}</p>
                          <p className="text-gray-900">{patient.emergency_phone ? formatPhone(patient.emergency_phone) : 'Não informado'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resumo Clínico</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-sm font-medium text-blue-900">Consultas</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-2">12</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-900">Agendamentos</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 mt-2">3</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <BeakerIcon className="h-5 w-5 text-purple-600 mr-2" />
                        <span className="text-sm font-medium text-purple-900">Exames</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900 mt-2">8</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SOAP Tab */}
            {activeTab === 'soap' && (
              <SOAPTab
                patient={patient}
                consultationId={activeConsultation?.id}
                onSave={handleSOAPSave}
              />
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Histórico de Atendimentos</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Consulta Médica</h4>
                      <span className="text-sm text-gray-500">01/12/2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Dr. João Silva - Clínico Geral</p>
                    <p className="text-sm text-gray-800 mt-2">Consulta de rotina - Paciente apresentou melhora significativa</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Exame Laboratorial</h4>
                      <span className="text-sm text-gray-500">28/11/2024</span>
                    </div>
                    <p className="text-sm text-gray-600">Hemograma completo</p>
                    <p className="text-sm text-gray-800 mt-2">Resultados dentro da normalidade</p>
                  </div>
                </div>
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Prescrições</h3>
                <div className="text-center text-gray-500 py-8">
                  <MedicationIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhuma prescrição registrada ainda</p>
                </div>
              </div>
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Exames</h3>
                <div className="text-center text-gray-500 py-8">
                  <BeakerIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum exame registrado ainda</p>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Agendamentos</h3>
                <div className="text-center text-gray-500 py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum agendamento registrado ainda</p>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Documentos</h3>
                <div className="text-center text-gray-500 py-8">
                  <DocumentIcon className="h-12 w-12 mx-auto mb-4" />
                  <p>Nenhum documento registrado ainda</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MedicalRecordPage;
