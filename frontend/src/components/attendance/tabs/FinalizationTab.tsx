import React, { useState } from 'react';
import { 
  CheckCircleIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface FinalizationTabProps {
  consultation: any;
  onFinalize: (data: any) => void;
}

const FinalizationTab: React.FC<FinalizationTabProps> = ({ consultation, onFinalize }) => {
  const [formData, setFormData] = useState({
    observations: '',
    attendanceType: 'individual',
    conduct: '',
    sharedCare: {
      matrix: false,
      teleconsultation: false,
      regulation: false
    },
    municipalityParticipation: false,
    participationForm: '',
    healthRationality: '',
    outcome: '',
    printOnFinish: false,
    notificationForms: {
      violence: false,
      accident: false,
      intoxication: false,
      antimicrobial: false
    },
    scheduledAppointment: {
      hasScheduled: false,
      date: '',
      time: '',
      type: ''
    }
  });

  const handleSubmit = () => {
    if (!formData.conduct || !formData.outcome) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    onFinalize(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as Record<string, any>),
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center">
          <CheckCircleIcon className="w-6 h-6 text-green-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finalização do Atendimento</h2>
            <p className="text-gray-600 mt-1">
              Complete as informações para finalizar o atendimento
            </p>
          </div>
        </div>
      </div>

      {/* Observações Finais */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações Finais</h3>
        <textarea
          value={formData.observations}
          onChange={(e) => handleInputChange('observations', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder="Digite observações importantes sobre o atendimento..."
        />
      </div>

      {/* Tipo de Atendimento */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Atendimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'individual', label: 'Individual' },
            { value: 'coletivo', label: 'Coletivo' },
            { value: 'domiciliar', label: 'Domiciliar' }
          ].map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="attendanceType"
                value={type.value}
                checked={formData.attendanceType === type.value}
                onChange={(e) => handleInputChange('attendanceType', e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Conduta */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Conduta <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'alta', label: 'Alta' },
            { value: 'retorno', label: 'Retorno' },
            { value: 'encaminhamento', label: 'Encaminhamento' },
            { value: 'observacao', label: 'Observação' }
          ].map((conduct) => (
            <label key={conduct.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="conduct"
                value={conduct.value}
                checked={formData.conduct === conduct.value}
                onChange={(e) => handleInputChange('conduct', e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">{conduct.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cuidado Compartilhado */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cuidado Compartilhado</h3>
        <div className="space-y-3">
          {[
            { key: 'matrix', label: 'Apoio Matricial' },
            { key: 'teleconsultation', label: 'Teleconsulta' },
            { key: 'regulation', label: 'Regulação' }
          ].map((option) => (
            <label key={option.key} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.sharedCare[option.key as keyof typeof formData.sharedCare]}
                onChange={(e) => handleNestedChange('sharedCare', option.key, e.target.checked)}
                className="mr-3"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Participação do Município */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Participação do Município</h3>
        <div className="space-y-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.municipalityParticipation}
              onChange={(e) => handleInputChange('municipalityParticipation', e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-700">Houve participação do município no atendimento</span>
          </label>

          {formData.municipalityParticipation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forma de Participação
              </label>
              <input
                type="text"
                value={formData.participationForm}
                onChange={(e) => handleInputChange('participationForm', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva como foi a participação do município..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Racionalidade em Saúde */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Racionalidade em Saúde</h3>
        <select
          value={formData.healthRationality}
          onChange={(e) => handleInputChange('healthRationality', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecione...</option>
          <option value="medicina_tradicional">Medicina Tradicional Chinesa</option>
          <option value="homeopatia">Homeopatia</option>
          <option value="fitoterapia">Fitoterapia</option>
          <option value="acupuntura">Acupuntura</option>
          <option value="terapia_floral">Terapia Floral</option>
          <option value="outras">Outras</option>
        </select>
      </div>

      {/* Desfecho */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Desfecho do Atendimento <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'resolvido', label: 'Problema Resolvido' },
            { value: 'melhorado', label: 'Melhorado' },
            { value: 'inalterado', label: 'Inalterado' },
            { value: 'piorado', label: 'Piorado' }
          ].map((outcome) => (
            <label key={outcome.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="outcome"
                value={outcome.value}
                checked={formData.outcome === outcome.value}
                onChange={(e) => handleInputChange('outcome', e.target.value)}
                className="mr-3"
              />
              <span className="text-gray-700">{outcome.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fichas de Notificação */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fichas de Notificação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'violence', label: 'Violência Interpessoal/Autoprovocada' },
            { key: 'accident', label: 'Acidente de Trabalho' },
            { key: 'intoxication', label: 'Intoxicação Exógena' },
            { key: 'antimicrobial', label: 'Uso de Antimicrobiano' }
          ].map((notification) => (
            <label key={notification.key} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notificationForms[notification.key as keyof typeof formData.notificationForms]}
                onChange={(e) => handleNestedChange('notificationForms', notification.key, e.target.checked)}
                className="mr-3"
              />
              <span className="text-gray-700">{notification.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Agendamento */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendamento</h3>
        <div className="space-y-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.scheduledAppointment.hasScheduled}
              onChange={(e) => handleNestedChange('scheduledAppointment', 'hasScheduled', e.target.checked)}
              className="mr-3"
            />
            <span className="text-gray-700">Agendar nova consulta</span>
          </label>

          {formData.scheduledAppointment.hasScheduled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                  type="date"
                  value={formData.scheduledAppointment.date}
                  onChange={(e) => handleNestedChange('scheduledAppointment', 'date', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                <input
                  type="time"
                  value={formData.scheduledAppointment.time}
                  onChange={(e) => handleNestedChange('scheduledAppointment', 'time', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                  value={formData.scheduledAppointment.type}
                  onChange={(e) => handleNestedChange('scheduledAppointment', 'type', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="consulta">Consulta</option>
                  <option value="retorno">Retorno</option>
                  <option value="procedimento">Procedimento</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Opções de Impressão */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Opções de Impressão</h3>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.printOnFinish}
            onChange={(e) => handleInputChange('printOnFinish', e.target.checked)}
            className="mr-3"
          />
          <PrinterIcon className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-700">Imprimir ao finalizar atendimento</span>
        </label>
      </div>

      {/* Botão de Finalização */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
            <p className="text-sm text-gray-600">
              Ao finalizar, o atendimento será encerrado e não poderá ser editado.
            </p>
          </div>
          
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center font-semibold"
          >
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            Finalizar Atendimento
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalizationTab;
