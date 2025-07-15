import React, { useState } from 'react';
import RichTextEditor from '../../ui/RichTextEditor';
import ProblemModal from './ProblemModal';
import AllergyModal from './AllergyModal';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import type { 
  TextFormatting, 
  ProblemData, 
  AllergyData, 
  AssessmentData,
  Patient
} from '../../../types/soap';

interface AssessmentSectionProps {
  data: AssessmentData;
  patient: Patient;
  onChange: (data: AssessmentData) => void;
}

const AssessmentSection: React.FC<AssessmentSectionProps> = ({ data, patient, onChange }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    problems: true,
    allergies: false
  });
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemData | undefined>();
  const [editingAllergy, setEditingAllergy] = useState<AllergyData | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data para problemas existentes
  const existingProblems = [
    { 
      id: '1', 
      descricao: 'Hipertensão arterial essencial', 
      codigo: 'I10', 
      tipo: 'CID10' as const, 
      status: 'Ativo' as const,
      dataRegistro: new Date('2024-01-15')
    },
    { 
      id: '2', 
      descricao: 'Diabetes Mellitus tipo 2', 
      codigo: 'E11', 
      tipo: 'CID10' as const, 
      status: 'Ativo' as const,
      dataRegistro: new Date('2024-02-20')
    },
    { 
      id: '3', 
      descricao: 'Hipertensão arterial sem complicação', 
      codigo: 'K86', 
      tipo: 'CIAP2' as const, 
      status: 'Latente' as const,
      dataRegistro: new Date('2024-03-10')
    }
  ];

  // Mock data para alergias existentes
  const existingAllergies = [
    { 
      id: '1', 
      substancia: 'Dipirona Sódica – 1g', 
      tipo: 'Medicamento', 
      criticidade: 'Crit. alta',
      dataRegistro: new Date('2024-01-20')
    },
    { 
      id: '2', 
      substancia: 'Clara do ovo', 
      tipo: 'Alergia a Alimento', 
      criticidade: 'Crit. alta',
      dataRegistro: new Date('2024-02-15')
    }
  ];

  const handleTextChange = (content: string, formatting: TextFormatting) => {
    onChange({
      ...data,
      freeText: { content, formatting }
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleProblemSave = (problemData: Omit<ProblemData, 'id'>) => {
    if (editingProblem) {
      // Update existing problem
      onChange({
        ...data,
        problems: data.problems.map(p => 
          p.id === editingProblem.id 
            ? { ...problemData, id: editingProblem.id }
            : p
        )
      });
    } else {
      // Add new problem
      const newProblem: ProblemData = {
        ...problemData,
        id: Date.now().toString()
      };
      onChange({
        ...data,
        problems: [...data.problems, newProblem]
      });
    }
    setEditingProblem(undefined);
  };

  const handleAllergySave = (allergyData: Omit<AllergyData, 'id'>) => {
    if (editingAllergy) {
      // Update existing allergy
      onChange({
        ...data,
        allergies: data.allergies.map(a => 
          a.id === editingAllergy.id 
            ? { ...allergyData, id: editingAllergy.id }
            : a
        )
      });
    } else {
      // Add new allergy
      const newAllergy: AllergyData = {
        ...allergyData,
        id: Date.now().toString()
      };
      onChange({
        ...data,
        allergies: [...data.allergies, newAllergy]
      });
    }
    setEditingAllergy(undefined);
  };

  const handleProblemEdit = (problem: ProblemData) => {
    setEditingProblem(problem);
    setShowProblemModal(true);
  };

  const handleProblemDelete = (id: string) => {
    onChange({
      ...data,
      problems: data.problems.filter(p => p.id !== id)
    });
  };

  const handleAllergyEdit = (allergy: AllergyData) => {
    setEditingAllergy(allergy);
    setShowAllergyModal(true);
  };

  const handleAllergyDelete = (id: string) => {
    onChange({
      ...data,
      allergies: data.allergies.filter(a => a.id !== id)
    });
  };

  const handleEditAllergy = (id: string, updatedAllergy: AllergyData) => {
    onChange({
      ...data,
      allergies: data.allergies.map(a => a.id === id ? updatedAllergy : a)
    });
    setShowAllergyForm(false);
    setEditingAllergy(undefined);
  };

  const handleRemoveAllergy = (id: string) => {
    onChange({
      ...data,
      allergies: data.allergies.filter(a => a.id !== id)
    });
  };

  const renderProblemsSection = () => (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
            <h4 className="font-medium text-gray-900">Registro de Problemas e Condições</h4>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingProblem(undefined);
              setShowProblemModal(true);
            }}
            className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Adicionar
          </button>
        </div>
        
        {/* Busca por problemas existentes */}
        <div className="mt-3">
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar por problemas e/ou condições ativos ou latentes do cidadão"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          {searchTerm && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm max-h-32 overflow-y-auto">
              {existingProblems
                .filter(p => 
                  p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(problem => (
                  <button
                    key={problem.id}
                    type="button"
                    onClick={() => {
                      // Adicionar problema existente
                      const newProblem: ProblemData = {
                        id: Date.now().toString(),
                        codigo: problem.codigo,
                        descricao: problem.descricao,
                        tipo: problem.tipo,
                        situacao: problem.status,
                        incluirNaLista: true
                      };
                      onChange({
                        ...data,
                        problems: [...data.problems, newProblem]
                      });
                      setSearchTerm('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {problem.descricao} - {problem.codigo} - {problem.status}
                  </button>
                ))
              }
              {existingProblems.filter(p => 
                p.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de problemas registrados */}
      <div className="p-4">
        {data.problems.length > 0 ? (
          <div className="space-y-3">
            {data.problems.map((problem) => (
              <div key={problem.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2 gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        problem.situacao === 'Ativo' ? 'bg-red-100 text-red-800' :
                        problem.situacao === 'Latente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {problem.situacao}
                      </span>
                      {problem.incluirNaLista && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          Incluído na lista
                        </span>
                      )}
                    </div>
                    <h5 className="font-medium text-red-900 mb-1">
                      {problem.descricao}
                    </h5>
                    <p className="text-sm text-red-700 mb-1">
                      <strong>{problem.tipo}:</strong> {problem.codigo}
                    </p>
                    {problem.inicio && (
                      <p className="text-sm text-red-600 mb-1">
                        <strong>Início:</strong> {problem.inicio.tipo === 'data' && problem.inicio.data 
                          ? new Date(problem.inicio.data).toLocaleDateString('pt-BR')
                          : problem.inicio.idade 
                          ? `${problem.inicio.idade.anos} anos, ${problem.inicio.idade.meses} meses`
                          : 'Não informado'
                        }
                      </p>
                    )}
                    {problem.observacoes && (
                      <p className="text-sm text-red-600">
                        <strong>Observações:</strong> {problem.observacoes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleProblemEdit(problem)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      title="Editar problema"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleProblemDelete(problem.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      title="Excluir problema"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                    {problem.observacoes && (
                      <button
                        type="button"
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Ver observações"
                      >
                        <ChatBubbleLeftIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum problema registrado</p>
            <p className="text-sm">Clique em "Adicionar" para registrar um novo problema</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAllergiesSection = () => (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => toggleSection('allergies')}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
          <span className="font-medium text-gray-900">Alergias e Reações Adversas</span>
          {data.allergies.length > 0 && (
            <span className="ml-2 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
              {data.allergies.length}
            </span>
          )}
        </div>
        {expandedSections.allergies ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {expandedSections.allergies && (
        <div className="border-t border-gray-200 p-4">
          {/* Busca por alergias existentes */}
          <div className="mb-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por alergias e reações adversas do cidadão"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          
          {!showAllergyForm ? (
            <button
              type="button"
              onClick={() => setShowAllergyForm(true)}
              className="w-full bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-4 text-orange-600 hover:bg-orange-100 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mx-auto mb-2" />
              <span className="block text-sm font-medium">Adicionar Nova Alergia</span>
              <span className="block text-xs mt-1">Clique para adicionar uma nova alergia ou reação adversa</span>
            </button>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-orange-900">Nova Alergia/Reação Adversa</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowAllergyForm(false);
                    setEditingAllergy(undefined);
                  }}
                  className="text-orange-600 hover:text-orange-800"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Categoria do Agente - Placeholder */}
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">
                    Categoria do Agente Causador *
                  </label>
                  <select className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="">Selecione...</option>
                    <option value="Alimento">Alimento</option>
                    <option value="Ambiente">Ambiente</option>
                    <option value="Biológico">Biológico</option>
                    <option value="Medicamento">Medicamento</option>
                  </select>
                </div>
                
                {/* Agente Específico - Placeholder */}
                <div>
                  <label className="block text-sm font-medium text-orange-900 mb-1">
                    Agente ou Substância Específica *
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome do agente causador..."
                    className="w-full p-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Placeholder - adicionar lógica de salvamento
                      const newAllergy: AllergyData = {
                        id: Date.now().toString(),
                        categoriaAgente: 'Medicamento',
                        agenteEspecifico: { nome: 'Dipirona' },
                        manifestacoes: []
                      };
                      handleAllergySave(newAllergy);
                    }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Adicionar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAllergyForm(false);
                      setEditingAllergy(undefined);
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Lista de alergias registradas */}
          {data.allergies.length > 0 && (
            <div className="mt-4 space-y-3">
              {data.allergies.map((allergy) => (
                <div key={allergy.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-orange-900">
                        {allergy.categoriaAgente} | {allergy.agenteEspecifico.nome}
                      </h5>
                      {allergy.tipoReacao && (
                        <p className="text-sm text-orange-700">Tipo: {allergy.tipoReacao}</p>
                      )}
                      {allergy.criticidade && (
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          allergy.criticidade === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Criticidade {allergy.criticidade}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAllergy(allergy);
                          setShowAllergyForm(true);
                        }}
                        className="text-orange-600 hover:text-orange-800"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy.id)}
                        className="text-orange-600 hover:text-orange-800"
                        title="Excluir"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Avaliação</h3>
        <p className="text-sm text-gray-600">
          Registre aqui a análise clínica, diagnósticos diferenciais, 
          problemas identificados e reações adversas.
        </p>
      </div>

      {/* Free Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Avaliação Clínica Livre
        </label>
        
        <RichTextEditor
          value={data.freeText.content}
          formatting={data.freeText.formatting}
          onChange={handleTextChange}
          maxLength={4000}
          placeholder="Digite aqui sua avaliação clínica, impressões diagnósticas, diagnósticos diferenciais, análise dos achados, hipóteses diagnósticas e raciocínio clínico..."
          className="w-full"
        />
        
        <div className="mt-2 text-xs text-gray-500">
          <p>
            <strong>Dicas:</strong> Inclua impressão diagnóstica principal, diagnósticos diferenciais, 
            análise dos sintomas e sinais, correlação clínico-laboratorial, prognóstico e 
            grau de confiança no diagnóstico.
          </p>
        </div>
      </div>

      {/* Problems Section */}
      {renderProblemsSection()}

      {/* Allergies Section */}
      {renderAllergiesSection()}

      {/* Problem Modal - Placeholder */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProblem ? 'Editar Problema' : 'Adicionar Problema'}
                </h2>
                <button 
                  onClick={() => {
                    setShowProblemModal(false);
                    setEditingProblem(undefined);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Pelo menos um dos campos é de preenchimento obrigatório
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CIAP-2
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por código ou descrição CIAP-2"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CID-10
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por código ou descrição CID-10"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situação *
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selecione...</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Latente">Latente</option>
                    <option value="Resolvido">Resolvido</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowProblemModal(false);
                    setEditingProblem(undefined);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Placeholder - adicionar lógica de salvamento
                    const newProblem: ProblemData = {
                      id: Date.now().toString(),
                      codigo: 'I10',
                      descricao: 'Hipertensão arterial essencial',
                      tipo: 'CID10',
                      situacao: 'Ativo',
                      incluirNaLista: true
                    };
                    handleProblemSave(newProblem);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProblem ? 'Salvar' : 'Adicionar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentSection;
