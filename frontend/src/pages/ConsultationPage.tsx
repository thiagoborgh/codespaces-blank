import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import CoverSheetNew from '../components/consultations/CoverSheetNew';
import SOAPTab from '../components/SOAPTab';
import { useQueue } from '../hooks/useQueue';

type TabType = 'folhaRosto' | 'soap' | 'vacinacao' | 'historico' | 'agendamentos';

interface AttendanceData {
  coverSheet: {
    motivo: string;
    profissional: string;
    observacoes: string;
    dataHora: Date;
  };
  soap: {
    subjetivo: string;
    objetivo: {
      sinaisVitais: any;
      exameFisico: string;
      resultadosExames: string;
    };
    avaliacao: {
      diagnostico: string;
      ciap2: string;
      cid10: string;
    };
    plano: {
      prescricoes: any[];
      encaminhamentos: any[];
      retorno: Date | null;
      orientacoes: string;
    };
  };
  status: 'draft' | 'completed';
}

const ConsultationPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  
  // Hooks devem vir antes de qualquer return condicional
  const [activeTab, setActiveTab] = useState<TabType>('folhaRosto');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    coverSheet: {
      motivo: '',
      profissional: 'Dr. João Silva',
      observacoes: '',
      dataHora: new Date()
    },
    soap: {
      subjetivo: '',
      objetivo: {
        sinaisVitais: {},
        exameFisico: '',
        resultadosExames: ''
      },
      avaliacao: {
        diagnostico: '',
        ciap2: '',
        cid10: ''
      },
      plano: {
        prescricoes: [],
        encaminhamentos: [],
        retorno: null,
        orientacoes: ''
      }
    },
    status: 'draft'
  });

  const { patients, completeCurrentPatient } = useQueue();

  useEffect(() => {
    // Carregar rascunho salvo se existir
    const savedDraft = localStorage.getItem(`attendance_draft_${patientId}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setAttendanceData(draft);
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
      }
    }
  }, [patientId]);

  // Verificar se patientId é válido após os hooks
  if (!patientId || isNaN(parseInt(patientId))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Paciente não encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            ID do paciente inválido ou não fornecido.
          </p>
          <button
            onClick={() => navigate('/queue')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Voltar para a fila
          </button>
        </div>
      </div>
    );
  }

  // Função auxiliar para atualizar status do paciente
  const updatePatientStatus = (patientId: number, status: string) => {
    if (status === 'completed') {
      completeCurrentPatient();
    }
    // Para outros status, implementar conforme necessário
    console.log(`Atualizando paciente ${patientId} para status ${status}`);
  };

  // Buscar dados do paciente
  const patient = patients.find(p => p.id === parseInt(patientId || '0')) || {
    id: parseInt(patientId || '0'),
    name: 'Maria Antoinieta Albuquerque Soares',
    cpf: '094.556.799-80',
    birthDate: '10/02/2004',
    ageFormatted: '21a 4m 8d',
    gender: 'female' as const,
    photo: '',
    motherName: 'Ana Maria Silva',
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    conditions: ['Hipertenso', 'Diabético'],
    allergies: ['Dipirona', 'Leite', 'Mofo']
  };

  // Garantir que o patient tenha todos os campos necessários para o SOAPTab
  const patientForSOAP = {
    id: patient.id,
    name: patient.name,
    cpf: patient.cpf || '094.556.799-80',
    birth_date: patient.birthDate,
    birthDate: patient.birthDate, // Mantém para compatibilidade
    phone: patient.phone || '(11) 99999-9999',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    // Campos adicionais para exibição
    ageFormatted: patient.ageFormatted,
    gender: (patient as any).gender || 'female' as const,
    photo: (patient as any).photo || '',
    motherName: (patient as any).motherName || 'Ana Maria Silva',
    address: (patient as any).address || 'Rua das Flores, 123 - Centro',
    conditions: (patient as any).conditions || ['Hipertenso', 'Diabético'],
    allergies: (patient as any).allergies || ['Dipirona', 'Leite', 'Mofo']
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(`attendance_draft_${patientId}`, JSON.stringify(attendanceData));
      alert('Rascunho salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert('Erro ao salvar rascunho');
    }
  };

  const handleSaveAndFinish = () => {
    // Validar campos obrigatórios
    if (!attendanceData.coverSheet.motivo.trim()) {
      alert('Preencha o motivo da consulta antes de finalizar');
      setActiveTab('folhaRosto');
      return;
    }

    if (!attendanceData.coverSheet.profissional.trim()) {
      alert('Preencha o profissional responsável antes de finalizar');
      setActiveTab('folhaRosto');
      return;
    }

    // Verificar se pelo menos um campo do SOAP foi preenchido
    const soapFilled = 
      attendanceData.soap.subjetivo.trim() ||
      attendanceData.soap.objetivo.exameFisico.trim() ||
      attendanceData.soap.avaliacao.diagnostico.trim() ||
      attendanceData.soap.plano.orientacoes.trim();

    if (!soapFilled) {
      alert('Preencha pelo menos um campo do SOAP antes de finalizar');
      setActiveTab('soap');
      return;
    }

    // Atualizar status do paciente
    updatePatientStatus(parseInt(patientId || '0'), 'completed');
    
    // Limpar rascunho
    localStorage.removeItem(`attendance_draft_${patientId}`);
    
    // Gerar log de auditoria
    console.log('Atendimento finalizado:', {
      patientId,
      professional: attendanceData.coverSheet.profissional,
      completedAt: new Date(),
      data: attendanceData
    });

    alert('Atendimento finalizado com sucesso!');
    navigate('/queue');
  };

  const handleCancelAppointment = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    const hasData = 
      attendanceData.coverSheet.motivo.trim() ||
      attendanceData.coverSheet.observacoes.trim() ||
      attendanceData.soap.subjetivo.trim() ||
      attendanceData.soap.objetivo.exameFisico.trim() ||
      attendanceData.soap.avaliacao.diagnostico.trim() ||
      attendanceData.soap.plano.orientacoes.trim();

    if (hasData) {
      const confirmLoss = window.confirm('Deseja cancelar o atendimento? Os dados serão perdidos.');
      if (!confirmLoss) {
        setShowCancelModal(false);
        return;
      }
    }

    // Reverter status para aguardando
    updatePatientStatus(parseInt(patientId || '0'), 'waiting');
    
    // Limpar rascunho
    localStorage.removeItem(`attendance_draft_${patientId}`);
    
    setShowCancelModal(false);
    navigate('/queue');
  };

  const tabs = [
    { id: 'folhaRosto', label: 'Folha de Rosto', enabled: true },
    { id: 'soap', label: 'SOAP', enabled: true },
    { id: 'vacinacao', label: 'Vacinação', enabled: true },
    { id: 'historico', label: 'Histórico', enabled: true },
    { id: 'agendamentos', label: 'Agendamentos', enabled: true }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'folhaRosto':
        return (
          <CoverSheetNew 
            patient={patientForSOAP} 
            data={attendanceData.coverSheet}
            onDataChange={(data) => setAttendanceData(prev => ({ ...prev, coverSheet: data }))}
          />
        );
      case 'soap':
        return (
          <SOAPTab 
            patient={patientForSOAP}
            onSave={(data: any) => setAttendanceData(prev => ({ ...prev, soap: data }))}
          />
        );
      case 'vacinacao':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Vacinação</h3>
            <p className="text-gray-600">Seção de vacinação em desenvolvimento...</p>
          </div>
        );
      case 'historico':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Histórico</h3>
            <p className="text-gray-600">Seção de histórico em desenvolvimento...</p>
          </div>
        );
      case 'agendamentos':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Agendamentos</h3>
            <p className="text-gray-600">Seção de agendamentos em desenvolvimento...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-600"
              >
                Home
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <button 
                onClick={() => navigate('/queue')}
                className="hover:text-blue-600"
              >
                Fila de Atendimento
              </button>
            </li>
            <li className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Atendimento</span>
            </li>
          </ol>
        </nav>

        {/* Cabeçalho do Paciente */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-6">
            <div className="flex items-start space-x-6">
              {/* Foto/Avatar */}
              <div className="flex-shrink-0">
                {patientForSOAP.photo ? (
                  <img 
                    src={patientForSOAP.photo} 
                    alt={patientForSOAP.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                    <span className="text-blue-600 font-semibold text-lg">
                      {patientForSOAP.name.split(' ').map((name: string) => name.charAt(0).toUpperCase()).slice(0, 2).join('')}
                    </span>
                  </div>
                )}
              </div>

              {/* Informações Básicas */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {patientForSOAP.name}
                    </h2>
                    <p className="text-gray-600 mb-1">
                      {patientForSOAP.motherName && `(${patientForSOAP.motherName})`}
                    </p>
                    <p className="text-gray-600 mb-1">
                      CPF: {patientForSOAP.cpf}
                    </p>
                    <p className="text-gray-600 mb-1">
                      Data de nascimento: {patientForSOAP.birthDate} - {patientForSOAP.ageFormatted}
                    </p>
                    <p className="text-gray-600">
                      Sexo: {patientForSOAP.gender === 'female' ? 'Feminino' : 'Masculino'}
                    </p>
                  </div>

                  {/* Condições e Alergias */}
                  <div>
                    <div className="mb-4">
                      <h3 className="font-medium text-gray-900 mb-2">Condições e situações de saúde</h3>
                      <div className="flex flex-wrap gap-2">
                        {patientForSOAP.conditions?.map((condition: string, index: number) => (
                          <span 
                            key={index} 
                            className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Alergias/Reações adversas</h3>
                      <div className="flex flex-wrap gap-2">
                        {patientForSOAP.allergies?.map((allergy: string, index: number) => (
                          <span 
                            key={index} 
                            className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  disabled={!tab.enabled}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.enabled
                      ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      : 'border-transparent text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="px-6 py-6">
          {renderTabContent()}
        </div>

        {/* Botões de Ação */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/queue')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Voltar para a fila
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Salvar Rascunho
              </button>
              
              <button
                onClick={handleSaveAndFinish}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                Salvar e Finalizar
              </button>
              
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
              >
                Cancelar Atendimento
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Confirmação de Cancelamento */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancelar Atendimento
              </h3>
              <p className="text-gray-600 mb-6">
                Deseja cancelar o atendimento? Os dados serão perdidos e o paciente retornará para a fila.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
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

export default ConsultationPage;
