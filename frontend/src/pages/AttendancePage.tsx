import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AttendanceHeader from '../components/attendance/AttendanceHeader';
import AttendanceTabs from '../components/attendance/AttendanceTabs';
import AttendanceTimeline from '../components/attendance/AttendanceTimeline';
import CoverSheetTab from '../components/attendance/tabs/CoverSheetTab';
import SOAPTab from '../components/attendance/tabs/SOAPTab';
import MeasurementsTab from '../components/attendance/tabs/MeasurementsTab';
import FinalizationTab from '../components/attendance/tabs/FinalizationTab';
import { attendanceService } from '../services/attendanceService';

// Dados mock para atendimento standalone
const generateMockAttendanceData = (consultationId: string) => {
  const patients = [
    { id: '1', name: 'Maria Silva', age: 34, cpf: '123.456.789-00', birthDate: '1990-01-15', phone: '(11) 98765-4321' },
    { id: '2', name: 'João Santos', age: 28, cpf: '987.654.321-00', birthDate: '1995-08-22', phone: '(11) 99876-5432' },
    { id: '3', name: 'Ana Costa', age: 45, cpf: '456.789.123-00', birthDate: '1978-12-10', phone: '(11) 97654-3210' },
    { id: '4', name: 'Carlos Oliveira', age: 52, cpf: '789.123.456-00', birthDate: '1971-06-05', phone: '(11) 96543-2109' },
    { id: '5', name: 'Fernanda Lima', age: 29, cpf: '321.654.987-00', birthDate: '1994-03-18', phone: '(11) 95432-1098' }
  ];

  const patient = patients.find(p => p.id === consultationId) || patients[0];
  
  return {
    patient: {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      cpf: patient.cpf,
      birthDate: patient.birthDate,
      phone: patient.phone,
      motherName: 'Maria das Dores',
      cns: '123456789012345',
      address: 'Rua das Flores, 123 - Centro',
      photo: null
    },
    consultation: {
      id: consultationId,
      patientId: patient.id,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      serviceType: 'Consulta Médica',
      professional: 'Dr. João Médico',
      team: 'Equipe A',
      status: 'in_progress'
    },
    soap_records: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    },
    vital_signs: {
      temperature: null,
      blood_pressure: null,
      heart_rate: null,
      respiratory_rate: null,
      oxygen_saturation: null,
      weight: null,
      height: null
    },
    measurements: [],
    medications: [],
    timeline: [
      {
        id: 1,
        action: 'Paciente chegou',
        time: '08:30',
        user: 'Sistema',
        description: 'Paciente registrado na fila de atendimento'
      },
      {
        id: 2,
        action: 'Atendimento iniciado',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        user: 'Dr. João Médico',
        description: 'Atendimento médico iniciado'
      }
    ]
  };
};

const AttendancePage: React.FC = () => {
  const { consultationId } = useParams<{ consultationId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('folha-rosto');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (consultationId) {
      loadAttendanceData();
    }
  }, [consultationId]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar do backend primeiro
      try {
        const data = await attendanceService.getAttendanceData(consultationId!);
        setAttendanceData(data);
      } catch (error) {
        console.warn('Backend não disponível, usando dados mock:', error);
        
        // Usar dados mock se backend não estiver disponível
        const mockData = generateMockAttendanceData(consultationId!);
        setAttendanceData(mockData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do atendimento:', error);
      
      // Fallback para dados mock
      const mockData = generateMockAttendanceData(consultationId!);
      setAttendanceData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSOAP = async (soapSection: string, soapData: any) => {
    try {
      // Tentar salvar no backend
      try {
        await attendanceService.updateSOAP(consultationId!, soapSection, soapData);
        await loadAttendanceData(); // Recarregar dados
        console.log('SOAP salvo no backend com sucesso');
      } catch (error) {
        console.warn('Backend não disponível, salvando localmente:', error);
        
        // Salvar localmente em modo standalone
        setAttendanceData((prev: any) => ({
          ...prev,
          soap_records: {
            ...prev.soap_records,
            [soapSection]: soapData
          }
        }));
        
        // Adicionar evento na timeline
        const newTimelineEvent = {
          id: Date.now(),
          action: `SOAP ${soapSection.toUpperCase()} atualizado`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          user: 'Dr. João Médico',
          description: `Seção ${soapSection} do prontuário atualizada`
        };
        
        setAttendanceData((prev: any) => ({
          ...prev,
          timeline: [...prev.timeline, newTimelineEvent]
        }));
        
        console.log('SOAP salvo localmente com sucesso');
      }
    } catch (error) {
      console.error('Erro ao salvar SOAP:', error);
      // TODO: Mostrar toast de erro
    }
  };

  const handleFinalize = async (finalizationData: any) => {
    try {
      // Tentar finalizar no backend
      try {
        await attendanceService.finalizeAttendance(consultationId!, finalizationData);
        console.log('Atendimento finalizado no backend');
      } catch (error) {
        console.warn('Backend não disponível, finalizando localmente:', error);
        
        // Adicionar evento de finalização na timeline
        const finalizationEvent = {
          id: Date.now(),
          action: 'Atendimento finalizado',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          user: 'Dr. João Médico',
          description: 'Atendimento médico finalizado com sucesso'
        };
        
        setAttendanceData((prev: any) => ({
          ...prev,
          timeline: [...prev.timeline, finalizationEvent],
          consultation: {
            ...prev.consultation,
            status: 'completed'
          }
        }));
        
        console.log('Atendimento finalizado localmente');
      }
      
      // Navegar de volta para a fila
      navigate('/queue');
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      // TODO: Mostrar toast de erro
    }
  };

  const handleCancelAppointment = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setShowCancelModal(false);
    navigate('/queue');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!attendanceData) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Atendimento não encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar os dados do atendimento.
            </p>
            <button
              onClick={() => navigate('/queue')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Voltar para a fila
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <AttendanceHeader
          patient={attendanceData.patient}
          consultation={attendanceData.consultation}
          onCancel={handleCancelAppointment}
          onBack={() => navigate('/queue')}
        />

        {/* Main Content */}
        <div className="flex">
          {/* Left Content - 75% */}
          <div className="flex-1 p-6">
            <AttendanceTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              patient={attendanceData.patient}
              consultation={attendanceData.consultation}
              soapRecords={attendanceData.soap_records}
              vitalSigns={attendanceData.vital_signs}
              measurements={attendanceData.measurements}
              medications={attendanceData.medications}
              onSaveSOAP={handleSaveSOAP}
              onFinalize={handleFinalize}
            />
          </div>

          {/* Right Sidebar - 25% */}
          <div className="w-1/4 bg-white border-l border-gray-200 p-6">
            <AttendanceTimeline
              timeline={attendanceData.timeline}
              patient={attendanceData.patient}
            />
          </div>
        </div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancelar Atendimento
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja cancelar este atendimento? Os dados não salvos serão perdidos.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Continuar Atendimento
                </button>
                <button
                  onClick={confirmCancel}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Sim, Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AttendancePage;
