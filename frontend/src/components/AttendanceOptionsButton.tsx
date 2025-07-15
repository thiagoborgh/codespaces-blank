import React, { useState, useEffect, useRef } from 'react';
import { QueuePatient } from '../hooks/useQueue';

interface AttendanceOptionsButtonProps {
  patient: QueuePatient;
  onPause?: (patientId: number) => void;
  onSave?: (patientId: number) => void;
  showSaveOptions?: boolean;
}

const AttendanceOptionsButton: React.FC<AttendanceOptionsButtonProps> = ({ 
  patient, 
  onPause, 
  onSave, 
  showSaveOptions = false 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePause = () => {
    console.log('⏸️ Pausando atendimento:', patient.name);
    if (window.confirm(`Pausar atendimento de ${patient.name}? O paciente voltará para a fila.`)) {
      if (onPause) {
        onPause(patient.id);
      }
      setShowDropdown(false);
    }
  };

  const handleSave = () => {
    console.log('💾 Salvando atendimento:', patient.name);
    if (onSave) {
      onSave(patient.id);
    }
    setShowDropdown(false);
  };

  const handleQuickSave = () => {
    console.log('⚡ Salvamento rápido:', patient.name);
    if (onSave) {
      onSave(patient.id);
    }
    setShowDropdown(false);
  };

  const isInProgress = () => {
    return patient.status === 'in_progress';
  };

  const isPaused = () => {
    return patient.status === 'paused';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md hover:scale-105"
        title="Opções de atendimento"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* Opção de Salvamento Rápido */}
            {showSaveOptions && (
              <button
                onClick={handleQuickSave}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Salvar Progresso
              </button>
            )}

            {/* Opção de Pausar */}
            {isInProgress() && (
              <button
                onClick={handlePause}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pausar Atendimento
              </button>
            )}

            {/* Separador */}
            {showSaveOptions && <div className="border-t border-gray-100 my-1"></div>}

            {/* Opção de Salvar e Pausar */}
            {isInProgress() && showSaveOptions && (
              <button
                onClick={() => {
                  handleSave();
                  setTimeout(() => handlePause(), 300);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Salvar e Pausar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceOptionsButton;
