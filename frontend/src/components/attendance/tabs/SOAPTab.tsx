import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SOAPTabProps {
  consultation: any;
  soapRecords: any[];
  onUpdateSOAP: (section: string, data: any) => void;
}

const SOAPTab: React.FC<SOAPTabProps> = ({ consultation, soapRecords, onUpdateSOAP }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['subjective']);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const startEditing = (section: string) => {
    const existingRecord = soapRecords.find(record => record.soap_type === section);
    setFormData({
      content: existingRecord?.content || '',
      ...existingRecord?.data || {}
    });
    setEditingSection(section);
  };

  const saveSection = () => {
    if (editingSection) {
      onUpdateSOAP(editingSection, formData);
      setEditingSection(null);
      setFormData({});
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setFormData({});
  };

  const getSectionData = (section: string) => {
    return soapRecords.find(record => record.soap_type === section);
  };

  const soapSections = [
    {
      id: 'subjective',
      title: 'Subjetivo (S)',
      description: 'Relato do paciente, sintomas, queixas e história',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      headerColor: 'bg-blue-100'
    },
    {
      id: 'objective',
      title: 'Objetivo (O)',
      description: 'Exame físico, sinais vitais, dados mensuráveis',
      color: 'bg-green-50 border-green-200 text-green-800',
      headerColor: 'bg-green-100'
    },
    {
      id: 'assessment',
      title: 'Avaliação (A)',
      description: 'Diagnóstico, análise clínica, problemas identificados',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      headerColor: 'bg-yellow-100'
    },
    {
      id: 'plan',
      title: 'Plano (P)',
      description: 'Tratamento, medicamentos, orientações, encaminhamentos',
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      headerColor: 'bg-purple-100'
    }
  ];

  const renderSectionContent = (section: any) => {
    const sectionData = getSectionData(section.id);
    const isExpanded = expandedSections.includes(section.id);
    const isEditing = editingSection === section.id;

    return (
      <div key={section.id} className={`border rounded-lg ${section.color} mb-4`}>
        {/* Header */}
        <div 
          className={`${section.headerColor} p-4 cursor-pointer flex items-center justify-between`}
          onClick={() => toggleSection(section.id)}
        >
          <div className="flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-3" />
            <div>
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <p className="text-sm opacity-75">{section.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(section.id);
                }}
                className="px-3 py-1 bg-white rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {sectionData ? 'Editar' : 'Adicionar'}
              </button>
            )}
            
            {isExpanded ? (
              <ChevronUpIcon className="w-5 h-5" />
            ) : (
              <ChevronDownIcon className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Content */}
        {isExpanded && (
          <div className="p-4 bg-white border-t">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder={`Digite as informações da seção ${section.title.toLowerCase()}...`}
                />
                
                {/* Campos específicos por seção */}
                {section.id === 'objective' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pressão Arterial
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 120/80 mmHg"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequência Cardíaca
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 80 bpm"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperatura
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 36.5°C"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 70 kg"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
                
                {section.id === 'plan' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medicamentos
                      </label>
                      <textarea
                        placeholder="Liste os medicamentos prescritos..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Orientações
                      </label>
                      <textarea
                        placeholder="Digite as orientações ao paciente..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={saveSection}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Salvar
                  </button>
                  
                  <button
                    onClick={cancelEditing}
                    className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {sectionData ? (
                  <div className="space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {sectionData.content || 'Nenhuma informação registrada.'}
                      </p>
                    </div>
                    
                    {sectionData.updated_at && (
                      <div className="text-xs text-gray-500">
                        Última atualização: {new Date(sectionData.updated_at).toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 mb-4">
                      Nenhuma informação registrada nesta seção.
                    </p>
                    <button
                      onClick={() => startEditing(section.id)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Adicionar Informações
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Registro SOAP</h2>
            <p className="text-gray-600 mt-1">
              Método estruturado para documentação clínica
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExpandedSections(soapSections.map(s => s.id))}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Expandir Todas
            </button>
            
            <button
              onClick={() => setExpandedSections([])}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Recolher Todas
            </button>
          </div>
        </div>
      </div>

      {/* SOAP Sections */}
      <div>
        {soapSections.map(section => renderSectionContent(section))}
      </div>
    </div>
  );
};

export default SOAPTab;
