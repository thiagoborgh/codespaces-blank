import React, { useState } from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filters: QueueFilters) => void;
  onResetFilter: () => void;
}

export interface QueueFilters {
  status: string[];
  period: {
    start: string;
    end: string;
  };
  serviceTypes: string[];
  teams: string[];
  professionals: string[];
  onlyUnfinished: boolean;
  showMyAttendances: boolean;
  sortBy: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  onApplyFilter, 
  onResetFilter 
}) => {
  const [filters, setFilters] = useState<QueueFilters>({
    status: ['waiting', 'in_progress', 'initial'],
    period: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    serviceTypes: [],
    teams: [],
    professionals: [],
    onlyUnfinished: false,
    showMyAttendances: false,
    sortBy: 'arrival'
  });

  const statusOptions = [
    { id: 'waiting', label: 'Aguardando', color: 'bg-green-100 text-green-800' },
    { id: 'in_progress', label: 'Em Atendimento', color: 'bg-purple-100 text-purple-800' },
    { id: 'initial_listening', label: 'Escuta Inicial', color: 'bg-pink-100 text-pink-800' },
    { id: 'completed', label: 'Realizado', color: 'bg-blue-100 text-blue-800' },
    { id: 'no_show', label: 'Não Aguardou', color: 'bg-gray-200 text-gray-800' }
  ];

  const serviceTypeOptions = [
    { id: 'consultation', label: 'Consulta Médica' },
    { id: 'medication', label: 'Administração de Medicamento' },
    { id: 'listening', label: 'Escuta Inicial' },
    { id: 'dentistry', label: 'Odontologia' },
    { id: 'dressing', label: 'Curativo' },
    { id: 'exams', label: 'Exames' },
    { id: 'procedures', label: 'Procedimentos' },
    { id: 'spontaneous', label: 'Demanda Espontânea' },
    { id: 'nebulization', label: 'Nebulização' },
    { id: 'vaccine', label: 'Vacina' }
  ];

  const teamOptions = [
    { id: 'equipe1', label: 'Equipe 1' },
    { id: 'equipe2', label: 'Equipe 2' },
    { id: 'equipe3', label: 'Equipe 3' }
  ];

  const professionalOptions = [
    { id: 'maria', label: 'Maria Assunção - Médica' },
    { id: 'joao', label: 'João Silva - Enfermeiro' },
    { id: 'carlos', label: 'Carlos Pereira - Médico' }
  ];

  const handleStatusChange = (statusId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      status: checked 
        ? [...prev.status, statusId]
        : prev.status.filter(id => id !== statusId)
    }));
  };

  const handleServiceTypeChange = (serviceId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      serviceTypes: checked 
        ? [...prev.serviceTypes, serviceId]
        : prev.serviceTypes.filter(id => id !== serviceId)
    }));
  };

  const handleTeamChange = (teamId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      teams: checked 
        ? [...prev.teams, teamId]
        : prev.teams.filter(id => id !== teamId)
    }));
  };

  const handleProfessionalChange = (professionalId: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      professionals: checked 
        ? [...prev.professionals, professionalId]
        : prev.professionals.filter(id => id !== professionalId)
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleResetFilter = () => {
    const defaultFilters: QueueFilters = {
      status: ['waiting', 'in_progress', 'initial'],
      period: {
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      serviceTypes: [],
      teams: [],
      professionals: [],
      onlyUnfinished: false,
      showMyAttendances: false,
      sortBy: 'arrival'
    };
    setFilters(defaultFilters);
    onResetFilter();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-start justify-center p-4">
      <div className="relative w-full max-w-2xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtros da Fila
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-140px)] p-4 sm:p-6 space-y-6">
          {/* Status do Atendimento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status do Atendimento
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {statusOptions.map((status) => (
                <div key={status.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${status.id}`}
                    checked={filters.status.includes(status.id)}
                    onChange={(e) => handleStatusChange(status.id, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`status-${status.id}`} className="text-sm select-none">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Início</label>
                <input
                  type="date"
                  value={filters.period.start}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    period: { ...prev.period, start: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={filters.period.end}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    period: { ...prev.period, end: e.target.value }
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Serviço
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
              {serviceTypeOptions.map((service) => (
                <div key={service.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={filters.serviceTypes.includes(service.id)}
                    onChange={(e) => handleServiceTypeChange(service.id, e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`service-${service.id}`} className="text-sm text-gray-700 select-none">
                    {service.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Equipe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipe</label>
            <div className="space-y-1">
              {teamOptions.map((team) => (
                <div key={team.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`team-${team.id}`}
                    checked={filters.teams.includes(team.id)}
                    onChange={(e) => handleTeamChange(team.id, e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`team-${team.id}`} className="text-sm">
                    {team.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Profissional */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profissional</label>
            <div className="space-y-1">
              {professionalOptions.map((professional) => (
                <div key={professional.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`professional-${professional.id}`}
                    checked={filters.professionals.includes(professional.id)}
                    onChange={(e) => handleProfessionalChange(professional.id, e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={`professional-${professional.id}`} className="text-sm">
                    {professional.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Opções Adicionais */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="onlyUnfinished"
                checked={filters.onlyUnfinished}
                onChange={(e) => setFilters(prev => ({ ...prev, onlyUnfinished: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="onlyUnfinished" className="text-sm">
                Ver somente atendimentos não finalizados
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showMyAttendances"
                checked={filters.showMyAttendances}
                onChange={(e) => setFilters(prev => ({ ...prev, showMyAttendances: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="showMyAttendances" className="text-sm">
                Ver somente meus atendimentos
              </label>
            </div>
          </div>

          {/* Ordenação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="arrival">Hora de chegada (crescente)</option>
              <option value="priority">Classificação de risco</option>
              <option value="name">Nome (alfabética)</option>
              <option value="service">Tipo de serviço</option>
            </select>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 order-3 sm:order-1"
          >
            Fechar
          </button>
          <button
            onClick={handleResetFilter}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 order-2 sm:order-2"
          >
            Voltar para padrão
          </button>
          <button
            onClick={handleApplyFilter}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 order-1 sm:order-3"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
