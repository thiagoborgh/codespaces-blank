import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QueuePatient } from '../hooks/useQueue';
import { BeakerIcon } from '@heroicons/react/24/outline';

interface VaccinationButtonProps {
  patient: QueuePatient;
  currentUserId?: string;
}

const VaccinationButton: React.FC<VaccinationButtonProps> = ({ 
  patient, 
  currentUserId 
}) => {
  const navigate = useNavigate();

  const getVaccinationTooltip = (): string => {
    const status = patient.status?.toLowerCase();
    
    // RN: Regras de negócio para tooltips do botão "Realizar Vacinação"
    switch (status) {
      case 'completed':
      case 'finalizado':
      case 'atendimento_realizado':
        return 'Atendimento de vacinação realizado';
      case 'in_progress':
      case 'em_andamento':
      case 'iniciado':
        // Verifica se foi iniciado pelo profissional logado
        if (patient.professional && currentUserId && 
            patient.professional.toLowerCase().includes(currentUserId.toLowerCase())) {
          return 'Continuar vacinação';
        } else {
          return 'Cidadão está em atendimento de vacinação';
        }
      default:
        return 'Realizar vacinação';
    }
  };

  const getButtonStyle = (): string => {
    const status = patient.status?.toLowerCase();
    
    switch (status) {
      case 'completed':
      case 'finalizado':
      case 'atendimento_realizado':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300';
      case 'in_progress':
      case 'em_andamento':
      case 'iniciado':
        // Se foi iniciado por outro profissional, deixar mais neutro
        if (patient.professional && currentUserId && 
            !patient.professional.toLowerCase().includes(currentUserId.toLowerCase())) {
          return 'bg-gray-100 text-gray-600 border border-gray-300 cursor-not-allowed';
        }
        return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200';
      default:
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200';
    }
  };

  const getButtonText = (): string => {
    const status = patient.status?.toLowerCase();
    
    switch (status) {
      case 'completed':
      case 'finalizado':
      case 'atendimento_realizado':
        return 'Visualizar Vacinação';
      case 'in_progress':
      case 'em_andamento':
      case 'iniciado':
        // Verifica se foi iniciado pelo profissional logado
        if (patient.professional && currentUserId && 
            patient.professional.toLowerCase().includes(currentUserId.toLowerCase())) {
          return 'Continuar Vacinação';
        } else {
          return 'Em Vacinação';
        }
      default:
        return 'Realizar Vacinação';
    }
  };

  const isDisabled = (): boolean => {
    const status = patient.status?.toLowerCase();
    
    // Desabilitar se está em progresso com outro profissional
    if ((status === 'in_progress' || status === 'em_andamento' || status === 'iniciado') &&
        patient.professional && currentUserId && 
        !patient.professional.toLowerCase().includes(currentUserId.toLowerCase())) {
      return true;
    }
    
    return false;
  };

  const handleVaccinationClick = () => {
    console.log('💉 Realizando vacinação para:', patient.name);
    console.log('🆔 Patient ID:', patient.id);
    console.log('📊 Status:', patient.status);
    
    // Verificar se pode realizar a ação
    if (isDisabled()) {
      console.log('❌ Ação bloqueada - paciente em atendimento com outro profissional');
      return;
    }
    
    // Redirecionar para a página de Atendimento de Vacinação
    // Na implementação real, isso seria uma página específica de vacinação
    navigate(`/consultations/${patient.id}?tab=vacinacao`);
  };

  return (
    <button
      onClick={handleVaccinationClick}
      title={getVaccinationTooltip()}
      disabled={isDisabled()}
      className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap shadow-sm hover:shadow-md hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-sm w-full ${getButtonStyle()}`}
    >
      <BeakerIcon className="h-4 w-4 lg:mr-2" />
      <span className="hidden lg:inline">{getButtonText()}</span>
    </button>
  );
};

export default VaccinationButton;
