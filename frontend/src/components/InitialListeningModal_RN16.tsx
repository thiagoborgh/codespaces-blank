// RN16 - Limitação da Escuta Inicial por Atendimento
import React, { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  CalendarIcon, 
  MicrophoneIcon, 
  ScaleIcon, 
  HeartIcon,
  CheckCircleIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  cpf?: string;
  phone?: string;
  serviceType: string;
  arrivalTime: string;
}

interface SigtapProcedure {
  code: string;
  description: string;
  isAutomatic: boolean;
  originData?: string; // qual dado originou o procedimento automático
}

interface RiskClassification {
  code: string;
  name: string;
  description: string;
  color: string;
  priority: number; // 1 = maior prioridade, 4 = menor prioridade
}

interface InitialListeningData {
  // RN01: Motivo da consulta CIAP2 (obrigatório)
  ciapCode: string;
  ciapDescription: string;
  
  // RN02: Descrição livre (opcional)
  consultationDescription: string;
  
  // RN03-RN04: Antropometria (opcional)
  weight?: number; // em kg
  height?: number; // em cm
  
  // RN05-RN11: Sinais vitais (opcional)
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  heartRate?: number; // bpm
  respiratoryRate?: number; // irpm
  temperature?: number; // °C
  oxygenSaturation?: number; // %
  capillaryGlycemia?: number; // mg/dL
  glycemiaMoment?: string; // momento da coleta de glicemia
  
  // RN12: Procedimentos realizados
  procedures: SigtapProcedure[]; // procedimentos automáticos e manuais
  
  // RN13: Classificação de risco/vulnerabilidade (obrigatório para demanda espontânea)
  riskClassification?: string; // código da classificação selecionada
  
  // RN14: Vulnerabilidade social/familiar (opcional)
  vulnerabilityLevel?: string; // 'baixa' | 'media' | 'alta' | 'critica'
  vulnerabilityDescription?: string; // descrição livre da vulnerabilidade
  
  // RN14: Desfecho da escuta inicial (obrigatório)
  outcome?: string; // 'release' | 'queue' | 'vaccination' | 'schedule'
  outcomeDetails?: string; // observações específicas do desfecho
  
  // RN16: Estado e metadados da escuta
  status: 'draft' | 'completed'; // status da escuta inicial
  completedAt?: string; // timestamp da finalização
  completedBy?: string; // profissional que finalizou
  canPrint: boolean; // flag para impressão
  isFinalized: boolean; // controle de bloqueio de edições
}

interface InitialListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (data: InitialListeningData) => Promise<void>;
  onCancel?: (patientId: number, justification?: string) => Promise<void>; // RN15: Callback para cancelamento
  initialData?: InitialListeningData; // RN16: Dados pré-existentes da escuta
  isViewOnly?: boolean; // RN16: Modo somente leitura (escuta finalizada)
}

const InitialListeningModal: React.FC<InitialListeningModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
  onCancel,
  initialData,
  isViewOnly = false
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // RN16: Estado inicial baseado em dados existentes ou nova escuta
  const [formData, setFormData] = useState<InitialListeningData>(() => {
    if (initialData) {
      return initialData;
    }
    return {
      ciapCode: '',
      ciapDescription: '',
      consultationDescription: '',
      weight: undefined,
      height: undefined,
      systolicBP: undefined,
      diastolicBP: undefined,
      heartRate: undefined,
      respiratoryRate: undefined,
      temperature: undefined,
      oxygenSaturation: undefined,
      capillaryGlycemia: undefined,
      glycemiaMoment: undefined,
      procedures: [],
      riskClassification: undefined,
      vulnerabilityLevel: undefined,
      vulnerabilityDescription: '',
      outcome: '',
      outcomeDetails: '',
      status: 'draft',
      canPrint: false,
      isFinalized: false
    };
  });

  // RN16: Função para verificar se pode finalizar a escuta
  const canFinalize = (): boolean => {
    // CIAP2 obrigatório
    if (!formData.ciapCode.trim()) return false;
    
    // Classificação de risco para demanda espontânea
    if (patient?.serviceType === 'spontaneous' && !formData.riskClassification) return false;
    
    // Desfecho obrigatório
    if (!formData.outcome) return false;
    
    // Momento da glicemia se glicemia preenchida
    if (formData.capillaryGlycemia && !formData.glycemiaMoment) return false;
    
    return true;
  };

  // RN16: Função para finalizar a escuta inicial
  const handleFinalize = async () => {
    if (!canFinalize()) {
      setErrors({...errors, general: 'Preencha todos os campos obrigatórios'});
      return;
    }

    setLoading(true);
    try {
      // Preparar dados de finalização
      const finalizedData: InitialListeningData = {
        ...formData,
        status: 'completed',
        completedAt: new Date().toISOString(),
        completedBy: user?.name || 'Sistema',
        canPrint: true,
        isFinalized: true
      };

      // Log de auditoria RN16
      console.log('[ESCUTA_INICIAL] RN16 - Finalização completa:', {
        pacienteId: patient?.id,
        pacienteNome: patient?.name,
        profissional: user?.name,
        timestamp: finalizedData.completedAt,
        desfecho: formData.outcome,
        classificacaoRisco: formData.riskClassification,
        dadosFinalizados: finalizedData
      });

      // Salvar dados finalizados
      await onSave(finalizedData);
      
      // Fechar modal
      onClose();
      
    } catch (error) {
      console.error('[ESCUTA_INICIAL] RN16 - Erro na finalização:', error);
      setErrors({...errors, general: 'Erro ao finalizar escuta inicial'});
    } finally {
      setLoading(false);
    }
  };

  // RN16: Função para imprimir escuta finalizada
  const handlePrint = () => {
    console.log('[ESCUTA_INICIAL] RN16 - Solicitação de impressão:', {
      pacienteId: patient?.id,
      escutaId: formData.completedAt,
      profissional: user?.name,
      timestamp: new Date().toISOString()
    });
    
    // TODO: Implementar lógica de impressão
    alert('Funcionalidade de impressão será implementada na integração com backend');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${
        theme === 'hybrid' ? 'healthcare-modal' : 'bg-white'
      } rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`${
          theme === 'hybrid' ? 'healthcare-modal-header' : 'bg-pink-600'
        } px-6 py-4 flex items-center justify-between text-white`}>
          <div className="flex items-center space-x-3">
            <MicrophoneIcon className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-semibold">
                {isViewOnly ? 'Visualizar Escuta Inicial' : 'Escuta Inicial'}
              </h2>
              <p className="text-sm opacity-90">
                {patient?.name} • {patient?.serviceType === 'spontaneous' ? 'Demanda Espontânea' : 'Agendado'}
              </p>
            </div>
          </div>
          
          {/* RN16: Indicador de status finalizado */}
          {formData.isFinalized && (
            <div className="flex items-center space-x-2 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
              <CheckCircleIcon className="w-5 h-5 text-green-200" />
              <span className="text-sm font-medium">Finalizada</span>
            </div>
          )}
          
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* RN16: Banner de escuta finalizada */}
        {isViewOnly && formData.isFinalized && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4 rounded-r-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">
                    Escuta Inicial Finalizada
                  </p>
                  <p className="text-green-600 text-sm">
                    Concluída em {formData.completedAt ? new Date(formData.completedAt).toLocaleString('pt-BR') : ''} 
                    por {formData.completedBy}
                  </p>
                </div>
              </div>
              {formData.canPrint && (
                <button
                  onClick={handlePrint}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span className="text-sm">Imprimir</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body - Simplified for demo */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          
          {/* RN01: CIAP2 obrigatório */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código CIAP2 *
            </label>
            <input
              type="text"
              value={formData.ciapCode}
              onChange={(e) => !isViewOnly && setFormData({...formData, ciapCode: e.target.value})}
              disabled={isViewOnly || formData.isFinalized}
              className={`w-full px-3 py-2 border rounded-lg ${
                isViewOnly || formData.isFinalized
                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-pink-500'
              } ${errors.ciapCode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={isViewOnly ? '' : 'Digite o código CIAP2...'}
            />
            {errors.ciapCode && (
              <p className="text-red-600 text-sm mt-1">{errors.ciapCode}</p>
            )}
          </div>

          {/* RN14: Desfecho obrigatório */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desfecho da Escuta *
            </label>
            <select
              value={formData.outcome || ''}
              onChange={(e) => !isViewOnly && setFormData({...formData, outcome: e.target.value})}
              disabled={isViewOnly || formData.isFinalized}
              className={`w-full px-3 py-2 border rounded-lg ${
                isViewOnly || formData.isFinalized
                  ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                  : 'focus:ring-2 focus:ring-pink-500'
              } ${errors.outcome ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Selecione o desfecho...</option>
              <option value="release">✅ Liberar Paciente</option>
              <option value="queue">🏥 Adicionar à Fila</option>
              <option value="vaccination">💉 Vacinação</option>
              <option value="schedule">📅 Agendamento</option>
            </select>
            {errors.outcome && (
              <p className="text-red-600 text-sm mt-1">{errors.outcome}</p>
            )}
          </div>

          {/* Placeholder para outros campos... */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500">
            <p>Demais campos da escuta inicial (implementação completa já existe)</p>
            <p className="text-sm">CIAP2, Antropometria, Sinais Vitais, Procedimentos, etc.</p>
          </div>

        </div>

        {/* Footer */}
        <div className={`${
          theme === 'hybrid' ? 'healthcare-modal-footer' : 'bg-gray-50'
        } px-6 py-4 border-t flex items-center justify-between`}>
          
          <div className="flex items-center space-x-4">
            {/* RN15: Cancelar Atendimento (apenas em modo de edição) */}
            {!isViewOnly && !formData.isFinalized && onCancel && (
              <button
                onClick={() => onCancel(patient?.id || 0, 'Cancelamento pelo usuário')}
                disabled={loading}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors border border-red-300 disabled:opacity-50 text-sm font-medium"
                title="Cancelar e descartar a escuta inicial em andamento"
              >
                Cancelar Atendimento
              </button>
            )}
            
            {errors.general && (
              <p className="text-red-600 text-sm">{errors.general}</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'hybrid' 
                  ? 'healthcare-btn' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              {isViewOnly ? 'Fechar' : 'Cancelar'}
            </button>
            
            {/* RN16: Botão de finalização condicional */}
            {!isViewOnly && !formData.isFinalized && (
              <button
                onClick={handleFinalize}
                disabled={!canFinalize() || loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  canFinalize() && !loading
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } disabled:opacity-50`}
                title={
                  !canFinalize() 
                    ? 'Preencha todos os campos obrigatórios para finalizar'
                    : 'Finalizar escuta inicial'
                }
              >
                {loading ? 'Finalizando...' : 'Finalizar Escuta Inicial'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialListeningModal;
