import React from 'react';
import { 
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  BeakerIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

interface AttendanceTimelineProps {
  timeline: any[];
  patient: any;
}

const AttendanceTimeline: React.FC<AttendanceTimelineProps> = ({
  timeline,
  patient
}) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'consultation_started':
        return <ClockIcon className="h-4 w-4" />;
      case 'soap_updated':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'medication_prescribed':
        return <BeakerIcon className="h-4 w-4" />;
      case 'measurement_taken':
        return <ScaleIcon className="h-4 w-4" />;
      default:
        return <UserIcon className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'consultation_started':
        return 'bg-green-100 text-green-600';
      case 'soap_updated':
        return 'bg-blue-100 text-blue-600';
      case 'medication_prescribed':
        return 'bg-purple-100 text-purple-600';
      case 'measurement_taken':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Info Card */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Informações do Paciente
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-700">Nome:</span>
            <span className="ml-2 text-gray-900">{patient?.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">CPF:</span>
            <span className="ml-2 text-gray-900">{patient?.cpf}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Data de Nascimento:</span>
            <span className="ml-2 text-gray-900">{patient?.birth_date}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Gênero:</span>
            <span className="ml-2 text-gray-900">
              {patient?.gender === 'male' ? 'Masculino' : 'Feminino'}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Timeline do Atendimento
        </h3>
        
        {timeline && timeline.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-4">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  
                  {/* Event content */}
                  <div className="ml-4 flex-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {event.description}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Por: {event.professional}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum evento registrado ainda</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Ações Rápidas
        </h4>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Visualizar Histórico Completo
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Agendar Retorno
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Imprimir Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTimeline;
