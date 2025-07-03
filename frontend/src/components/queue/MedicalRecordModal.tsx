import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, EyeIcon } from '@heroicons/react/24/outline';

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName
}) => {
  const [justification, setJustification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewProntuario = async () => {
    if (!justification.trim()) {
      alert('Por favor, informe a justificativa para acessar o prontuário.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Registrar log LGPD para auditoria
      console.log('📋 Acesso ao prontuário registrado:', {
        patientId,
        patientName,
        justification: justification.trim(),
        timestamp: new Date().toISOString(),
        userId: 'user-atual', // TODO: pegar do contexto de autenticação
        action: 'view_medical_record'
      });

      // Simular chamada para registrar o acesso
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navegar para o prontuário
      navigate(`/medical-record/${patientId}`);
      onClose();
    } catch (error) {
      console.error('Erro ao acessar prontuário:', error);
      alert('Erro ao acessar prontuário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setJustification('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Visualizar Prontuário
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Paciente: <span className="font-medium">{patientName}</span>
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Aviso LGPD */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <EyeIcon className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium mb-1">
                  Acesso a Dados Pessoais
                </p>
                <p className="text-blue-700">
                  Em conformidade com a LGPD, é necessário justificar o acesso ao prontuário médico. 
                  Este acesso será registrado para auditoria.
                </p>
              </div>
            </div>
          </div>

          {/* Campo de justificativa */}
          <div>
            <label htmlFor="justification" className="block text-sm font-medium text-gray-700 mb-2">
              Justificativa para o acesso <span className="text-red-500">*</span>
            </label>
            <textarea
              id="justification"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Ex: Consulta médica agendada, atendimento de urgência, etc."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              disabled={isLoading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {justification.length}/500 caracteres
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleViewProntuario}
            disabled={isLoading || !justification.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Acessando...
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                Acessar Prontuário
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;
