import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QueuePatient } from '../hooks/useQueue';
import { PlayIcon, EyeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import AttendanceOptionsButton from './AttendanceOptionsButton';

interface AttendanceButtonsProps {
  patient: QueuePatient;
  onPause?: (patientId: number) => void;
  onSave?: (patientId: number) => void;
  showSaveOptions?: boolean;
}

const AttendanceButtons: React.FC<AttendanceButtonsProps> = ({ 
  patient, 
  onPause, 
  onSave, 
  showSaveOptions = false 
}) => {
  const navigate = useNavigate();
  const getButtonText = () => {
    switch (patient.status) {
      case 'completed':
        return 'Visualizar Atendimento';
      case 'in_progress':
        return 'Continuar Atendimento';
      case 'paused':
        return 'Retomar Atendimento';
      default:
        return 'Iniciar Atendimento';
    }
  };

  const getButtonTooltip = () => {
    switch (patient.status) {
      case 'completed':
        return 'Atendimento realizado';
      case 'in_progress':
        return 'Continuar atendimento';
      case 'paused':
        return 'Retomar atendimento';
      default:
        // Verifica se tem pré-atendimento (escuta inicial)
        if (patient.initialListeningCompleted) {
          return 'Visualizar pré-atendimento';
        } else {
          return 'Cidadão sem pré-atendimento';
        }
    }
  };

  const getButtonStyle = () => {
    switch (patient.status) {
      case 'completed':
        return 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200';
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200';
      case 'paused':
        return 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200';
      default:
        // Iniciar atendimento - azul padrão
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200';
    }
  };

  const getButtonIcon = () => {
    switch (patient.status) {
      case 'completed':
        return EyeIcon;
      case 'in_progress':
        return ArrowPathIcon;
      case 'paused':
        return PlayIcon;
      default:
        return PlayIcon;
    }
  };

  const isInProgress = () => {
    return patient.status === 'in_progress';
  };

  const isPaused = () => {
    return patient.status === 'paused';
  };

  const isCompleted = () => {
    return patient.status === 'completed';
  };

  const handleAttend = () => {
    console.log('🏥 Atendendo paciente:', patient.name);
    console.log('🆔 Patient ID:', patient.id);
    console.log('📊 Status:', patient.status);
    
    // Mensagem personalizada baseada no status
    let actionText = 'Iniciar';
    if (isInProgress()) {
      actionText = 'Continuar';
    } else if (isPaused()) {
      actionText = 'Retomar';
    } else if (isCompleted()) {
      actionText = 'Visualizar';
    }
    
    // Confirmar antes de redirecionar (exceto para visualizar)
    if (isCompleted() || window.confirm(`${actionText} atendimento para ${patient.name}?`)) {
      // Navegar para a página de consulta (standalone - sem backend)
      navigate(`/consultations/${patient.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Container para botão principal com opções pequenas */}
      <div className="flex gap-2 items-center justify-end">
        {/* Botão pequeno de opções (⋮) - apenas para status in_progress ou paused */}
        {(isInProgress() || isPaused()) && (
          <AttendanceOptionsButton 
            patient={patient}
            onPause={onPause}
            onSave={onSave}
            showSaveOptions={showSaveOptions}
          />
        )}
        
        {/* Botão principal com largura fixa igual aos outros */}
        <div className="lg:w-[160px] xl:w-[180px]">
          <button
            onClick={handleAttend}
            title={getButtonTooltip()}
            className={`w-full px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap shadow-sm hover:shadow-md hover:scale-105 ${getButtonStyle()}`}
          >
            {React.createElement(getButtonIcon(), { className: "h-4 w-4 lg:mr-2" })}
            <span className="hidden lg:inline">{getButtonText()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceButtons;
