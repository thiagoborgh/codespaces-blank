import React, { useState } from 'react';
import { 
  UserIcon, 
  CalendarIcon, 
  ClockIcon, 
  DocumentTextIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface CoverSheetTabProps {
  consultation: any;
  patient: any;
  onUpdate: (data: any) => void;
}

const CoverSheetTab: React.FC<CoverSheetTabProps> = ({ consultation, patient, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    chiefComplaint: consultation?.chief_complaint || '',
    currentIllness: consultation?.current_illness || '',
    observations: consultation?.observations || '',
    consultationType: consultation?.consultation_type || 'consulta',
    priority: consultation?.priority || 'normal'
  });

  const handleEdit = (field: string) => {
    setEditingField(field);
    setIsEditing(true);
  };

  const handleSave = (field: string) => {
    onUpdate({
      [field]: formData[field as keyof typeof formData]
    });
    setEditingField(null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingField(null);
    setIsEditing(false);
  };

  const renderEditableField = (field: string, label: string, value: string, isTextArea = false) => {
    const isCurrentlyEditing = editingField === field;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
          {!isCurrentlyEditing && (
            <button
              onClick={() => handleEdit(field)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {isCurrentlyEditing ? (
          <div className="space-y-3">
            {isTextArea ? (
              <textarea
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder={`Digite ${label.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={formData[field as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Digite ${label.toLowerCase()}...`}
              />
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleSave(field)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700">
            {value || (
              <span className="italic text-gray-400">
                Clique no ícone de edição para adicionar {label.toLowerCase()}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Informações do Paciente */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <UserIcon className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-blue-900">Informações do Paciente</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <p className="text-lg font-semibold text-gray-900">{patient?.name || 'Não informado'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <p className="text-lg font-semibold text-gray-900">{patient?.cpf || 'Não informado'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
            <p className="text-lg font-semibold text-gray-900">{patient?.birthDate || 'Não informado'}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
            <p className="text-lg font-semibold text-gray-900">
              {patient?.gender === 'male' ? 'Masculino' : 'Feminino'}
            </p>
          </div>
        </div>
      </div>

      {/* Informações da Consulta */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CalendarIcon className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold text-green-900">Informações da Consulta</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <p className="text-lg font-semibold text-gray-900">
              {consultation?.consultation_date || new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              value={formData.consultationType}
              onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="consulta">Consulta</option>
              <option value="retorno">Retorno</option>
              <option value="urgencia">Urgência</option>
              <option value="emergencia">Emergência</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campos Editáveis */}
      <div className="space-y-4">
        {renderEditableField('chiefComplaint', 'Queixa Principal', formData.chiefComplaint, true)}
        {renderEditableField('currentIllness', 'História da Doença Atual', formData.currentIllness, true)}
        {renderEditableField('observations', 'Observações Gerais', formData.observations, true)}
      </div>

      {/* Prioridade */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioridade do Atendimento</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800 border-green-200' },
            { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800 border-blue-200' },
            { value: 'alta', label: 'Alta', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
            { value: 'urgente', label: 'Urgente', color: 'bg-red-100 text-red-800 border-red-200' }
          ].map((priority) => (
            <label key={priority.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="priority"
                value={priority.value}
                checked={formData.priority === priority.value}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="mr-2"
              />
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priority.color}`}>
                {priority.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <button
          onClick={() => onUpdate(formData)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <DocumentTextIcon className="w-5 h-5 mr-2" />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default CoverSheetTab;
