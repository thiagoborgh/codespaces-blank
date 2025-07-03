import React from 'react';
import { XMarkIcon, ClockIcon, UserIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { QueuePatient } from '../../hooks/useQueue';

interface DayAttendancesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: QueuePatient;
}

interface AttendanceRecord {
  id: number;
  startTime: string;
  endTime: string;
  professional: string;
  cbo: string; // Classificação Brasileira de Ocupações
  serviceType: string;
  insertionTime: string;
  status: 'completed' | 'in_progress' | 'cancelled';
  observations?: string;
}

const DayAttendancesModal: React.FC<DayAttendancesModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  if (!isOpen) return null;

  // Mock de dados de atendimentos do dia
  // TODO: Buscar dados reais da API
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      startTime: '08:30',
      endTime: '09:15',
      professional: 'Dr. João Silva',
      cbo: '225142 - Médico clínico',
      serviceType: 'Consulta Médica',
      insertionTime: '08:00',
      status: 'completed',
      observations: 'Consulta de rotina, pressão arterial controlada'
    },
    {
      id: 2,
      startTime: '10:00',
      endTime: '10:30',
      professional: 'Enf. Maria Santos',
      cbo: '223505 - Enfermeiro',
      serviceType: 'Vacina Gripe',
      insertionTime: '09:45',
      status: 'completed',
      observations: 'Vacina aplicada no braço direito'
    }
  ];

  const formatAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} anos`;
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Concluído
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Em Andamento
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Atendimentos do Dia
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Histórico de atendimentos realizados hoje
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Informações do Cidadão */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-600" />
              Dados do Cidadão
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Nome:</span>
                <p className="font-medium text-gray-900">{patient.name}</p>
              </div>
              <div>
                <span className="text-gray-600">Idade:</span>
                <p className="font-medium text-gray-900">{formatAge(patient.birthDate)}</p>
              </div>
              <div>
                <span className="text-gray-600">CPF:</span>
                <p className="font-medium text-gray-900">{patient.cpf || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-gray-600">CNS:</span>
                <p className="font-medium text-gray-900">{patient.cns || 'Não informado'}</p>
              </div>
              <div>
                <span className="text-gray-600">Data de Nascimento:</span>
                <p className="font-medium text-gray-900">
                  {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Telefone:</span>
                <p className="font-medium text-gray-900">{patient.phone || 'Não informado'}</p>
              </div>
            </div>
          </div>

          {/* Lista de Atendimentos */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDaysIcon className="h-5 w-5 text-gray-600" />
              Atendimentos Realizados ({attendanceRecords.length})
            </h4>

            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDaysIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum atendimento registrado hoje</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attendanceRecords.map((record) => (
                  <div
                    key={record.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <ClockIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{record.serviceType}</h5>
                          <p className="text-sm text-gray-600">
                            {record.startTime} - {record.endTime}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(record.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Profissional:</span>
                        <p className="font-medium text-gray-900">{record.professional}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">CBO:</span>
                        <p className="font-medium text-gray-900">{record.cbo}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Horário de Inserção:</span>
                        <p className="font-medium text-gray-900">{record.insertionTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Duração:</span>
                        <p className="font-medium text-gray-900">
                          {(() => {
                            const start = new Date(`1970-01-01T${record.startTime}:00`);
                            const end = new Date(`1970-01-01T${record.endTime}:00`);
                            const diffMs = end.getTime() - start.getTime();
                            const diffMins = Math.round(diffMs / (1000 * 60));
                            return `${diffMins} minutos`;
                          })()}
                        </p>
                      </div>
                    </div>

                    {record.observations && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-gray-600 text-sm">Observações:</span>
                        <p className="text-sm text-gray-900 mt-1">{record.observations}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayAttendancesModal;
