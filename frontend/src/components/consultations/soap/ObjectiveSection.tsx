import React, { useState, useEffect } from 'react';
import RichTextEditor from '../../ui/RichTextEditor';
import FoodMarkersComponent from './FoodMarkersComponent';
import ExamModal from './ExamModal';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PlusIcon,
  CalendarDaysIcon,
  ScaleIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import type { 
  TextFormatting, 
  DUMData, 
  AnthropometryData, 
  FoodMarkersData, 
  ExamResult, 
  ObjectiveData,
  Patient,
  FaixaEtaria
} from '../../../types/soap';

interface ObjectiveSectionProps {
  data: ObjectiveData;
  patient: Patient;
  onChange: (data: ObjectiveData) => void;
}

const ObjectiveSection: React.FC<ObjectiveSectionProps> = ({ data, patient, onChange }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    anthropometry: false,
    foodMarkers: false,
    examResults: false
  });
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<ExamResult | undefined>();

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const calculateAgeInMonths = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    return ageInYears * 12 + monthDiff;
  };

  const shouldShowDUM = (): boolean => {
    return patient.gender === 'female' && calculateAge(patient.birthDate) >= 10;
  };

  const handleTextChange = (content: string, formatting: TextFormatting) => {
    onChange({
      ...data,
      freeText: { content, formatting }
    });
  };

  const handleDUMChange = (date: Date | null) => {
    onChange({
      ...data,
      dum: {
        ...data.dum,
        currentDUM: date,
        registrationDate: new Date()
      }
    });
  };

  const handleAnthropometryChange = (field: keyof AnthropometryData, value: any) => {
    const newAnthropometry = {
      ...data.anthropometry,
      [field]: value
    };

    // Calcular IMC automaticamente
    if ((field === 'peso' || field === 'altura') && newAnthropometry.peso && newAnthropometry.altura) {
      newAnthropometry.imc = parseFloat((newAnthropometry.peso / Math.pow(newAnthropometry.altura / 100, 2)).toFixed(1));
    }

    onChange({
      ...data,
      anthropometry: newAnthropometry
    });
  };

  const handleFoodMarkersChange = (foodMarkersData: FoodMarkersData) => {
    onChange({
      ...data,
      foodMarkers: foodMarkersData
    });
  };

  const handleVaccinationChange = (value: 'SIM' | 'Não' | null) => {
    onChange({
      ...data,
      vaccination: value
    });
  };

  const handleExamSave = (examData: Omit<ExamResult, 'id'>) => {
    const newExam: ExamResult = {
      ...examData,
      id: Date.now().toString() // Simple ID generation
    };

    if (editingExam) {
      // Update existing exam
      const updatedExams = data.examResults.map(exam => 
        exam.id === editingExam.id ? { ...newExam, id: editingExam.id } : exam
      );
      onChange({
        ...data,
        examResults: updatedExams
      });
    } else {
      // Add new exam
      onChange({
        ...data,
        examResults: [...data.examResults, newExam]
      });
    }

    setEditingExam(undefined);
  };

  const handleExamEdit = (exam: ExamResult) => {
    setEditingExam(exam);
    setExamModalOpen(true);
  };

  const handleExamDelete = (examId: string | number) => {
    onChange({
      ...data,
      examResults: data.examResults.filter(exam => exam.id !== examId)
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate cardiovascular risk alert for abdominal circumference
  const getCardiovascularRiskAlert = (circumference: number, gender: string): string | null => {
    if (gender === 'male' && circumference >= 94) {
      return circumference >= 102 ? 'Risco cardiovascular muito elevado' : 'Risco cardiovascular elevado';
    }
    if (gender === 'female' && circumference >= 80) {
      return circumference >= 88 ? 'Risco cardiovascular muito elevado' : 'Risco cardiovascular elevado';
    }
    return null;
  };

  const renderDUMSection = () => {
    if (!shouldShowDUM()) return null;

    return (
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <CalendarDaysIcon className="h-5 w-5 text-pink-600 mr-2" />
          <label className="block text-sm font-medium text-pink-900">
            Data da Última Menstruação (DUM)
          </label>
          <span className="ml-2 text-xs text-pink-600 cursor-help" title="Preencher mesmo se a cidadã estiver com dúvidas">
            ⓘ
          </span>
        </div>
        
        <input
          type="date"
          value={data.dum?.currentDUM ? new Date(data.dum.currentDUM).toISOString().split('T')[0] : ''}
          onChange={(e) => handleDUMChange(e.target.value ? new Date(e.target.value) : null)}
          className="w-full p-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
        
        {data.dum?.previousDUM && (
          <div className="mt-2 text-xs text-pink-700">
            DUM anterior: {new Date(data.dum.previousDUM).toLocaleDateString('pt-BR')}
            {data.dum.daysDifference && ` (diferença: ${data.dum.daysDifference} dias)`}
          </div>
        )}
      </div>
    );
  };

  const renderAnthropometrySection = () => (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => toggleSection('anthropometry')}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center">
          <ScaleIcon className="h-5 w-5 text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">Antropometria, Sinais Vitais e Glicemia</span>
        </div>
        {expandedSections.anthropometry ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {expandedSections.anthropometry && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="300"
                value={data.anthropometry.peso || ''}
                onChange={(e) => handleAnthropometryChange('peso', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,0"
              />
            </div>
            
            {/* Altura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="250"
                value={data.anthropometry.altura || ''}
                onChange={(e) => handleAnthropometryChange('altura', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,0"
              />
            </div>
            
            {/* IMC (calculado automaticamente) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IMC (kg/m²)</label>
              <input
                type="text"
                value={
                  data.anthropometry.peso && data.anthropometry.altura
                    ? (data.anthropometry.peso / Math.pow(data.anthropometry.altura / 100, 2)).toFixed(1)
                    : ''
                }
                readOnly
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Calculado automaticamente"
              />
            </div>
            
            {/* Perímetro Cefálico */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perímetro Cefálico (cm)</label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="200"
                value={data.anthropometry.perimetroCefalico || ''}
                onChange={(e) => handleAnthropometryChange('perimetroCefalico', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,0"
              />
            </div>
            
            {/* Circunferência Abdominal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Circunferência Abdominal (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={data.anthropometry.circunferenciaAbdominal || ''}
                onChange={(e) => handleAnthropometryChange('circunferenciaAbdominal', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,0"
              />
              {data.anthropometry.circunferenciaAbdominal && (
                (() => {
                  const riskAlert = getCardiovascularRiskAlert(data.anthropometry.circunferenciaAbdominal, patient.gender);
                  return riskAlert ? (
                    <div className="mt-1 flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      {riskAlert}
                    </div>
                  ) : null;
                })()
              )}
            </div>
            
            {/* Perímetro da Panturrilha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Perímetro da Panturrilha (cm)</label>
              <input
                type="number"
                step="0.1"
                min="10"
                max="99"
                value={data.anthropometry.perimetroPanturrilha || ''}
                onChange={(e) => handleAnthropometryChange('perimetroPanturrilha', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0,0"
              />
            </div>
            
            {/* Pressão Arterial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Arterial (mmHg)</label>
              <input
                type="text"
                value={data.anthropometry.pressaoArterial || ''}
                onChange={(e) => handleAnthropometryChange('pressaoArterial', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="120/80"
              />
            </div>
            
            {/* Frequência Respiratória */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Freq. Respiratória (ipm)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={data.anthropometry.frequenciaRespiratoria || ''}
                onChange={(e) => handleAnthropometryChange('frequenciaRespiratoria', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            
            {/* Frequência Cardíaca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Freq. Cardíaca (bpm)</label>
              <input
                type="number"
                min="0"
                max="300"
                value={data.anthropometry.frequenciaCardiaca || ''}
                onChange={(e) => handleAnthropometryChange('frequenciaCardiaca', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>
            
            {/* Temperatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="45"
                value={data.anthropometry.temperatura || ''}
                onChange={(e) => handleAnthropometryChange('temperatura', parseFloat(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="36,5"
              />
            </div>
            
            {/* Saturação O2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturação O₂ (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={data.anthropometry.saturacaoO2 || ''}
                onChange={(e) => handleAnthropometryChange('saturacaoO2', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="98"
              />
            </div>
            
            {/* Glicemia Capilar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Glicemia Capilar (mg/dL)</label>
              <input
                type="number"
                min="0"
                max="1000"
                value={data.anthropometry.glicemiaCapilar || ''}
                onChange={(e) => handleAnthropometryChange('glicemiaCapilar', parseInt(e.target.value) || undefined)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="90"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVaccinationSection = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <HeartIcon className="h-5 w-5 text-green-600 mr-2" />
        <label className="block text-sm font-medium text-green-900">
          Vacinação em Dia
        </label>
      </div>
      
      <div className="flex space-x-4">
        <label className="flex items-center">
          <input
            type="radio"
            name="vaccination"
            value="SIM"
            checked={data.vaccination === 'SIM'}
            onChange={(e) => handleVaccinationChange('SIM')}
            className="mr-2 text-green-600 focus:ring-green-500"
          />
          <span className="text-green-800">SIM</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="radio"
            name="vaccination"
            value="Não"
            checked={data.vaccination === 'Não'}
            onChange={(e) => handleVaccinationChange('Não')}
            className="mr-2 text-green-600 focus:ring-green-500"
          />
          <span className="text-green-800">Não</span>
        </label>
        
        <button
          type="button"
          onClick={() => handleVaccinationChange(null)}
          className="text-sm text-green-600 hover:text-green-800"
          title="Limpar seleção"
        >
          ✕ Limpar
        </button>
      </div>
    </div>
  );

  const renderFoodMarkersSection = () => (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => toggleSection('foodMarkers')}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center">
          <DocumentTextIcon className="h-5 w-5 text-orange-600 mr-2" />
          <span className="font-medium text-gray-900">Marcadores de Consumo Alimentar</span>
          {data.foodMarkers.todasRespondidas && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ✓ Completo
            </span>
          )}
        </div>
        {expandedSections.foodMarkers ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {expandedSections.foodMarkers && (
        <div className="border-t border-gray-200 p-4">
          <FoodMarkersComponent
            patientAge={calculateAge(patient.birthDate)}
            data={data.foodMarkers}
            onChange={handleFoodMarkersChange}
          />
        </div>
      )}
    </div>
  );

  const renderExamResultsSection = () => (
    <div className="border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={() => toggleSection('examResults')}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
      >
        <div className="flex items-center">
          <BeakerIcon className="h-5 w-5 text-purple-600 mr-2" />
          <span className="font-medium text-gray-900">Resultados de Exames</span>
          {data.examResults.length > 0 && (
            <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {data.examResults.length}
            </span>
          )}
        </div>
        {expandedSections.examResults ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {expandedSections.examResults && (
        <div className="border-t border-gray-200 p-4">
          <button
            type="button"
            onClick={() => {
              setEditingExam(undefined);
              setExamModalOpen(true);
            }}
            className="w-full bg-purple-50 border-2 border-dashed border-purple-300 rounded-lg p-4 text-purple-600 hover:bg-purple-100 transition-colors flex flex-col items-center"
          >
            <PlusIcon className="h-5 w-5 mb-2" />
            <span className="text-sm font-medium">Adicionar Resultados de Exames</span>
            <span className="text-xs mt-1">Buscar exames SIGTAP e registrar resultados</span>
          </button>
          
          {data.examResults.length > 0 && (
            <div className="mt-4 space-y-3">
              {data.examResults.map((exam) => (
                <div key={exam.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-purple-900">{exam.procedimento}</h4>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {exam.tipo}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-purple-700 mb-2">
                        {exam.codigo && <div><strong>Código:</strong> {exam.codigo}</div>}
                        {exam.dataRealizacao && (
                          <div><strong>Data realização:</strong> {exam.dataRealizacao}</div>
                        )}
                        {exam.laboratorio && (
                          <div><strong>Laboratório:</strong> {exam.laboratorio}</div>
                        )}
                      </div>
                      
                      <div className="text-sm text-purple-600 mb-2">
                        <strong>Resultado:</strong> {exam.resultado}
                      </div>
                      
                      {exam.observacoes && (
                        <div className="text-sm text-purple-600">
                          <strong>Observações:</strong> {exam.observacoes}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleExamEdit(exam)}
                        className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
                        title="Editar exame"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => exam.id && handleExamDelete(exam.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Excluir exame"
                      >
                        <TrashIcon className="w-4 h-4" />
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Objetivo</h3>
        <p className="text-sm text-gray-600">
          Registre aqui os dados objetivos do exame físico, sinais vitais, 
          medidas antropométricas e resultados de exames.
        </p>
      </div>

      {/* Free Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Descrição Clínica Livre
        </label>
        
        <RichTextEditor
          value={data.freeText.content}
          formatting={data.freeText.formatting}
          onChange={handleTextChange}
          maxLength={4000}
          placeholder="Digite aqui os achados do exame físico, inspeção geral, exame por aparelhos e sistemas, e outras observações objetivas..."
          className="w-full"
        />
      </div>

      {/* DUM Section */}
      {renderDUMSection()}

      {/* Anthropometry Section */}
      {renderAnthropometrySection()}

      {/* Food Markers Section */}
      {renderFoodMarkersSection()}

      {/* Vaccination Section */}
      {renderVaccinationSection()}

      {/* Exam Results Section */}
      {renderExamResultsSection()}

      {/* Exam Modal */}
      <ExamModal
        isOpen={examModalOpen}
        onClose={() => {
          setExamModalOpen(false);
          setEditingExam(undefined);
        }}
        onSave={handleExamSave}
        existingExam={editingExam}
      />
    </div>
  );
};

export default ObjectiveSection;
