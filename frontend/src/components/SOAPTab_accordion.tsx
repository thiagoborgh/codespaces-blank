import React, { useState, useEffect, useCallback } from 'react';
import { Patient } from '../types/types';
import AttendanceReport from './AttendanceReport';

interface SOAPTabProps {
  patient: Patient;
  consultationId?: number;
  onSave?: (soapData: any) => void;
}

interface SOAPData {
  subjective: string;
  objective: string;
  assessment: {
    problems_conditions: {
      condition: string;
      ciap2_code: string;
      cid10_code: string;
      include_in_list: boolean;
      situation: 'active' | 'inactive' | 'latent';
    }[];
    allergies_reactions: {
      category: string;
      specific_agent: string;
    }[];
    clinical_impressions: string;
  };
  plan: {
    interventions: {
      ciap2_code: string;
      description: string;
      date: string;
    }[];
    medications: {
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
      type: 'controlled' | 'common';
      start_date: string;
      end_date: string;
      instructions: string;
    }[];
    exams: {
      exam: string;
      priority: 'high' | 'medium' | 'low';
      type: 'common' | 'specialized';
      date: string;
      instructions: string;
    }[];
    certificates: {
      type: 'certificate' | 'declaration';
      date: string;
      professional: string;
      unit: string;
      content: string;
    }[];
    orientations: {
      date: string;
      professional: string;
      orientation: string;
    }[];
    referrals: {
      date: string;
      risk_classification: 'emergency' | 'high' | 'medium' | 'low';
      type: string;
      specialty: string;
      caps: boolean;
      urgency: boolean;
      hospitalization: boolean;
      intersectoral: boolean;
      home_care: boolean;
    }[];
    care_sharing: {
      date: string;
      priority: 'high' | 'medium' | 'low';
      shared_with: string;
      content: string;
    }[];
  };
  vital_signs: {
    systolic_pressure: string;
    diastolic_pressure: string;
    heart_rate: string;
    temperature: string;
    respiratory_rate: string;
    oxygen_saturation: string;
  };
  measurements: {
    weight: string;
    height: string;
    bmi: string;
    head_circumference: string;
    abdominal_circumference: string;
  };
  problems: string[];
  allergies: string[];
  medications: string[];
  procedures: string[];
  exams: string[];
  prescriptions: {
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  follow_up: {
    date: string;
    type: string;
    notes: string;
  };
}

const SOAPTab: React.FC<SOAPTabProps> = ({ patient, consultationId, onSave }) => {
  const [soapData, setSoapData] = useState<SOAPData>({
    subjective: '',
    objective: '',
    assessment: {
      problems_conditions: [],
      allergies_reactions: [],
      clinical_impressions: ''
    },
    plan: {
      interventions: [],
      medications: [],
      exams: [],
      certificates: [],
      orientations: [],
      referrals: [],
      care_sharing: []
    },
    vital_signs: {
      systolic_pressure: '',
      diastolic_pressure: '',
      heart_rate: '',
      temperature: '',
      respiratory_rate: '',
      oxygen_saturation: ''
    },
    measurements: {
      weight: '',
      height: '',
      bmi: '',
      head_circumference: '',
      abdominal_circumference: ''
    },
    problems: [],
    allergies: [],
    medications: [],
    procedures: [],
    exams: [],
    prescriptions: [],
    follow_up: {
      date: '',
      type: 'return',
      notes: ''
    }
  });

  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  // Estado para controlar auto-save inteligente
  const [lastSavedData, setLastSavedData] = useState<SOAPData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Estados para controlar accordion SOAP
  const [openAccordion, setOpenAccordion] = useState<string | null>('subjective');
  const [assessmentSubTab, setAssessmentSubTab] = useState<'problems' | 'allergies'>('problems');
  const [planSubTab, setPlanSubTab] = useState<'interventions' | 'medications' | 'exams' | 'certificates' | 'orientations' | 'referrals' | 'care_sharing'>('interventions');

  // Estados para novos problemas/condições
  const [newProblem, setNewProblem] = useState({
    condition: '',
    ciap2_code: '',
    cid10_code: '',
    include_in_list: false,
    situation: 'active' as 'active' | 'inactive' | 'latent'
  });

  // Estados para novas alergias
  const [newAllergy, setNewAllergy] = useState({
    category: '',
    specific_agent: ''
  });

  // Verificar se há mudanças reais nos dados
  const hasRealChanges = useCallback((currentData: SOAPData, previousData: SOAPData | null) => {
    if (!previousData) return false;
    
    // Verifica se há conteúdo real (não apenas strings vazias)
    const hasContent = (obj: any): boolean => {
      if (typeof obj === 'string') return obj.trim() !== '';
      if (Array.isArray(obj)) return obj.length > 0;
      if (typeof obj === 'object' && obj !== null) {
        return Object.values(obj).some(val => hasContent(val));
      }
      return false;
    };

    // Verifica se há mudanças significativas
    const isDifferent = JSON.stringify(currentData) !== JSON.stringify(previousData);
    const hasRealContent = hasContent(currentData);
    
    return isDifferent && hasRealContent;
  }, []);

  // Auto-save inteligente - só salva quando há mudanças reais
  useEffect(() => {
    // Não salva se não há mudanças reais
    if (!hasRealChanges(soapData, lastSavedData)) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (onSave && hasChanges) {
        console.log('🔄 Auto-salvando SOAP com mudanças reais...');
        setAutoSaving(true);
        onSave(soapData);
        setLastSaved(new Date());
        setLastSavedData(soapData);
        setHasChanges(false);
        setTimeout(() => setAutoSaving(false), 500);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [soapData, onSave, hasChanges, lastSavedData, hasRealChanges]);

  // Marcar que há mudanças quando dados são alterados
  useEffect(() => {
    if (hasRealChanges(soapData, lastSavedData)) {
      setHasChanges(true);
    }
  }, [soapData, lastSavedData, hasRealChanges]);

  const updateSOAPField = (field: keyof SOAPData, value: any) => {
    console.log(`📝 Atualizando campo ${field} com valor:`, value);
    setSoapData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: keyof SOAPData, field: string, value: any) => {
    console.log(`📝 Atualizando campo aninhado ${parent}.${field} com valor:`, value);
    setSoapData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }));
  };

  const addPrescription = () => {
    if (newPrescription.medication && newPrescription.dosage && newPrescription.frequency) {
      console.log('💊 Adicionando prescrição:', newPrescription);
      setSoapData(prev => ({
        ...prev,
        prescriptions: [...prev.prescriptions, { ...newPrescription }]
      }));
      setNewPrescription({
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      });
    }
  };

  const removePrescription = (index: number) => {
    console.log('🗑️ Removendo prescrição no índice:', index);
    setSoapData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions.filter((_, i) => i !== index)
    }));
  };

  const addToList = (listType: 'problems' | 'allergies' | 'medications' | 'procedures' | 'exams', item: string) => {
    if (item.trim()) {
      console.log(`📋 Adicionando item à lista ${listType}:`, item);
      setSoapData(prev => ({
        ...prev,
        [listType]: [...prev[listType], item.trim()]
      }));
    }
  };

  const removeFromList = (listType: 'problems' | 'allergies' | 'medications' | 'procedures' | 'exams', index: number) => {
    console.log(`🗑️ Removendo item da lista ${listType} no índice:`, index);
    setSoapData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  // Funções para gerenciar problemas/condições
  const addProblemCondition = () => {
    if (newProblem.condition.trim()) {
      console.log('🏥 Adicionando problema/condição:', newProblem);
      setSoapData(prev => ({
        ...prev,
        assessment: {
          ...prev.assessment,
          problems_conditions: [...prev.assessment.problems_conditions, { ...newProblem }]
        }
      }));
      setNewProblem({
        condition: '',
        ciap2_code: '',
        cid10_code: '',
        include_in_list: false,
        situation: 'active'
      });
    }
  };

  const removeProblemCondition = (index: number) => {
    console.log('🗑️ Removendo problema/condição no índice:', index);
    setSoapData(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        problems_conditions: prev.assessment.problems_conditions.filter((_, i) => i !== index)
      }
    }));
  };

  // Funções para gerenciar alergias
  const addAllergy = () => {
    if (newAllergy.category.trim() && newAllergy.specific_agent.trim()) {
      console.log('🚨 Adicionando alergia:', newAllergy);
      setSoapData(prev => ({
        ...prev,
        assessment: {
          ...prev.assessment,
          allergies_reactions: [...prev.assessment.allergies_reactions, { ...newAllergy }]
        }
      }));
      setNewAllergy({
        category: '',
        specific_agent: ''
      });
    }
  };

  const removeAllergy = (index: number) => {
    console.log('🗑️ Removendo alergia no índice:', index);
    setSoapData(prev => ({
      ...prev,
      assessment: {
        ...prev.assessment,
        allergies_reactions: prev.assessment.allergies_reactions.filter((_, i) => i !== index)
      }
    }));
  };

  // Função para salvamento manual
  const handleManualSave = () => {
    if (onSave) {
      console.log('💾 Salvamento manual solicitado');
      setAutoSaving(true);
      onSave(soapData);
      setLastSaved(new Date());
      setLastSavedData(soapData);
      setHasChanges(false);
      setTimeout(() => setAutoSaving(false), 500);
    }
  };

  // Cálculo automático do IMC
  useEffect(() => {
    const calculateBMI = () => {
      const weight = parseFloat(soapData.measurements.weight);
      const height = parseFloat(soapData.measurements.height);
      
      if (weight && height) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        updateNestedField('measurements', 'bmi', bmi);
      }
    };

    calculateBMI();
  }, [soapData.measurements.weight, soapData.measurements.height]);

  // Funções para controlar accordion
  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const isAccordionOpen = (section: string) => {
    return openAccordion === section;
  };

  // Componente AccordionSection
  const AccordionSection: React.FC<{
    id: string;
    title: string;
    bgColor: string;
    textColor: string;
    children: React.ReactNode;
  }> = ({ id, title, bgColor, textColor, children }) => {
    const isOpen = isAccordionOpen(id);
    
    return (
      <div className="mb-4">
        <div 
          className={`${bgColor} ${textColor} px-4 py-3 rounded-lg cursor-pointer flex justify-between items-center shadow-sm hover:shadow-md transition-shadow`}
          onClick={() => toggleAccordion(id)}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          <svg 
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {isOpen && (
          <div className="bg-white border border-gray-200 rounded-b-lg p-4 mt-1 shadow-sm">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header with patient info and auto-save status */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Atendimento SOAP - {patient.name}
              </h3>
              <p className="text-sm text-gray-600">
                Registro de atendimento médico
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Indicador de mudanças não salvas */}
              {hasChanges && !autoSaving && (
                <div className="flex items-center text-amber-600">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                  <span className="text-sm">Há mudanças não salvas</span>
                </div>
              )}
              
              {/* Status do auto-save */}
              {autoSaving && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Salvando...</span>
                </div>
              )}
              
              {lastSaved && !autoSaving && !hasChanges && (
                <span className="text-sm text-green-600">
                  ✓ Salvo {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              {/* Botão de salvamento manual */}
              {hasChanges && (
                <button
                  onClick={handleManualSave}
                  disabled={autoSaving}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Salvar Agora
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SOAP Content com Accordion */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-6">
            Preencha as seções do SOAP (Subjetivo, Objetivo, Avaliação, Plano) clicando nas seções abaixo:
          </p>
          
          {/* Seções SOAP em Accordion */}
          <div className="space-y-4">
            
            {/* Seção Subjetivo */}
            <AccordionSection 
              id="subjective" 
              title="📝 Subjetivo - Queixa e História"
              bgColor="bg-blue-50"
              textColor="text-blue-800"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Queixa Principal
                  </label>
                  <input
                    type="text"
                    value={soapData.subjective.split('\n')[0] || ''}
                    onChange={(e) => {
                      const lines = soapData.subjective.split('\n');
                      lines[0] = e.target.value;
                      updateSOAPField('subjective', lines.join('\n'));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Dor de cabeça há 3 dias"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    História da Doença Atual
                  </label>
                  <textarea
                    value={soapData.subjective}
                    onChange={(e) => updateSOAPField('subjective', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva em detalhes: início dos sintomas, evolução, fatores de melhora/piora, sintomas associados, tratamentos já realizados..."
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Seção Objetivo */}
            <AccordionSection 
              id="objective" 
              title="🔍 Objetivo - Exame Físico e Dados"
              bgColor="bg-green-50"
              textColor="text-green-800"
            >
              <div className="space-y-6">
                {/* Sinais Vitais */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">💓</span>
                    Sinais Vitais
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pressão Arterial (mmHg)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={soapData.vital_signs.systolic_pressure}
                          onChange={(e) => updateNestedField('vital_signs', 'systolic_pressure', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="120"
                        />
                        <span className="flex items-center text-gray-500">x</span>
                        <input
                          type="number"
                          value={soapData.vital_signs.diastolic_pressure}
                          onChange={(e) => updateNestedField('vital_signs', 'diastolic_pressure', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="80"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequência Cardíaca (bpm)
                      </label>
                      <input
                        type="number"
                        value={soapData.vital_signs.heart_rate}
                        onChange={(e) => updateNestedField('vital_signs', 'heart_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="72"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperatura (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={soapData.vital_signs.temperature}
                        onChange={(e) => updateNestedField('vital_signs', 'temperature', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="36.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Freq. Respiratória (irpm)
                      </label>
                      <input
                        type="number"
                        value={soapData.vital_signs.respiratory_rate}
                        onChange={(e) => updateNestedField('vital_signs', 'respiratory_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="16"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Saturação O2 (%)
                      </label>
                      <input
                        type="number"
                        value={soapData.vital_signs.oxygen_saturation}
                        onChange={(e) => updateNestedField('vital_signs', 'oxygen_saturation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="98"
                      />
                    </div>
                  </div>
                </div>

                {/* Medidas Antropométricas */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📏</span>
                    Medidas Antropométricas
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={soapData.measurements.weight}
                        onChange={(e) => updateNestedField('measurements', 'weight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="70.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        value={soapData.measurements.height}
                        onChange={(e) => updateNestedField('measurements', 'height', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="165"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IMC
                      </label>
                      <input
                        type="text"
                        value={soapData.measurements.bmi}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                        placeholder="Auto"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Circunf. Abdominal (cm)
                      </label>
                      <input
                        type="number"
                        value={soapData.measurements.abdominal_circumference}
                        onChange={(e) => updateNestedField('measurements', 'abdominal_circumference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="85"
                      />
                    </div>
                  </div>
                </div>

                {/* Exame Físico */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🩺</span>
                    Exame Físico
                  </h4>
                  <textarea
                    value={soapData.objective}
                    onChange={(e) => updateSOAPField('objective', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descreva os achados do exame físico por sistemas:&#10;- Geral: Estado geral, corado, hidratado...&#10;- Cardiovascular: Ritmo cardíaco, sopros...&#10;- Respiratório: Murmúrio vesicular, ruídos adventícios...&#10;- Abdome: Flácido, indolor, ruídos hidroaéreos...&#10;- Neurológico: Consciente, orientado, reflexos..."
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Seção Avaliação */}
            <AccordionSection 
              id="assessment" 
              title="🎯 Avaliação - Diagnóstico e Análise"
              bgColor="bg-yellow-50"
              textColor="text-yellow-800"
            >
              <div className="space-y-6">
                {/* Sub-abas da Avaliação */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setAssessmentSubTab('problems')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        assessmentSubTab === 'problems'
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Problemas e/ou condições
                    </button>
                    <button
                      onClick={() => setAssessmentSubTab('allergies')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        assessmentSubTab === 'allergies'
                          ? 'border-yellow-500 text-yellow-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Alergias e reações adversas
                    </button>
                  </nav>
                </div>

                {/* Conteúdo das Sub-abas */}
                {assessmentSubTab === 'problems' && (
                  <div className="space-y-6">
                    {/* Formulário para adicionar problema/condição */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-3">Adicionar Problema/Condição</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Problemas/condições ativos ou latentes
                          </label>
                          <select
                            value={newProblem.condition}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, condition: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Selecione</option>
                            <option value="Hipertensão Arterial">Hipertensão Arterial</option>
                            <option value="Diabetes Mellitus">Diabetes Mellitus</option>
                            <option value="Remoção do apêndice">Remoção do apêndice</option>
                            <option value="Cefaleia">Cefaleia</option>
                            <option value="Dor abdominal">Dor abdominal</option>
                            <option value="Infecção respiratória">Infecção respiratória</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CIAP 2
                          </label>
                          <select
                            value={newProblem.ciap2_code}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, ciap2_code: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Selecione o CIAP 2</option>
                            <option value="K86">K86 - Hipertensão sem complicações</option>
                            <option value="T90">T90 - Diabetes não insulino-dependente</option>
                            <option value="D88">D88 - Apendicectomia</option>
                            <option value="N01">N01 - Cefaleia</option>
                            <option value="D01">D01 - Dor abdominal generalizada</option>
                            <option value="R74">R74 - Infecção respiratória superior</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CID 10
                          </label>
                          <select
                            value={newProblem.cid10_code}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, cid10_code: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Selecione o CID 10</option>
                            <option value="I10">I10 - Hipertensão essencial</option>
                            <option value="E11">E11 - Diabetes mellitus tipo 2</option>
                            <option value="Z98.89">Z98.89 - Outros estados pós-procedimento especificados</option>
                            <option value="G44.1">G44.1 - Cefaleia vascular</option>
                            <option value="R10.4">R10.4 - Outras dores abdominais e as não especificadas</option>
                            <option value="J06.9">J06.9 - Infecção aguda das vias aéreas superiores não especificada</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Situação
                          </label>
                          <select
                            value={newProblem.situation}
                            onChange={(e) => setNewProblem(prev => ({ ...prev, situation: e.target.value as 'active' | 'inactive' | 'latent' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="latent">Latente</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={newProblem.include_in_list}
                          onChange={(e) => setNewProblem(prev => ({ ...prev, include_in_list: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Incluir na lista de problema/condição
                        </label>
                      </div>
                      <button
                        onClick={addProblemCondition}
                        disabled={!newProblem.condition}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Incluir problema e/ou condição
                      </button>
                    </div>

                    {/* Tabela de problemas/condições */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Problemas/Condições Registrados</h5>
                      {soapData.assessment.problems_conditions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CIAP 2</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CID 10</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Lista de problema/condição</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Situação</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {soapData.assessment.problems_conditions.map((problem, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                  <td className="px-4 py-2 text-sm text-gray-900">{problem.ciap2_code}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{problem.cid10_code}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">
                                    {problem.include_in_list ? 'Incluído' : 'Não incluído'}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      problem.situation === 'active' ? 'bg-red-100 text-red-800' :
                                      problem.situation === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {problem.situation === 'active' ? 'Ativo' :
                                       problem.situation === 'inactive' ? 'Inativo' : 'Latente'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    <button
                                      onClick={() => removeProblemCondition(index)}
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Remover
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum problema/condição registrado</p>
                      )}
                    </div>

                    {/* Impressões clínicas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Impressões Clínicas
                      </label>
                      <textarea
                        value={soapData.assessment.clinical_impressions}
                        onChange={(e) => updateNestedField('assessment', 'clinical_impressions', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Informe as impressões subjetivas do profissional e as expressadas pelo munícipe..."
                      />
                    </div>
                  </div>
                )}

                {assessmentSubTab === 'allergies' && (
                  <div className="space-y-6">
                    {/* Formulário para adicionar alergia */}
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h5 className="font-medium text-red-900 mb-3">Nova Alergia/Reação Adversa</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categoria do agente causador
                          </label>
                          <select
                            value={newAllergy.category}
                            onChange={(e) => setNewAllergy(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <option value="">Selecione</option>
                            <option value="Alimento">Alimento</option>
                            <option value="Medicamento">Medicamento</option>
                            <option value="Substância química">Substância química</option>
                            <option value="Alérgeno ambiental">Alérgeno ambiental</option>
                            <option value="Veneno/Toxina">Veneno/Toxina</option>
                            <option value="Material médico">Material médico</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Agente ou substância específica
                          </label>
                          <input
                            type="text"
                            value={newAllergy.specific_agent}
                            onChange={(e) => setNewAllergy(prev => ({ ...prev, specific_agent: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Ex: Camarão, Dipirona, Látex..."
                          />
                        </div>
                      </div>
                      <button
                        onClick={addAllergy}
                        disabled={!newAllergy.category || !newAllergy.specific_agent}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        + Nova alergia
                      </button>
                    </div>

                    {/* Tabela de alergias */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Alergias e Reações Adversas Registradas</h5>
                      {soapData.assessment.allergies_reactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Categoria do agente causador</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Agente ou substância específica</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {soapData.assessment.allergies_reactions.map((allergy, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                  <td className="px-4 py-2 text-sm text-gray-900">{allergy.category}</td>
                                  <td className="px-4 py-2 text-sm text-gray-900">{allergy.specific_agent}</td>
                                  <td className="px-4 py-2">
                                    <button
                                      onClick={() => removeAllergy(index)}
                                      className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                      Remover
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhuma alergia/reação adversa registrada</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </AccordionSection>

            {/* Seção Plano */}
            <AccordionSection 
              id="plan" 
              title="📋 Plano - Tratamento e Conduta"
              bgColor="bg-purple-50"
              textColor="text-purple-800"
            >
              <div className="space-y-6">
                {/* Sub-abas do Plano */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    <button
                      onClick={() => setPlanSubTab('interventions')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'interventions'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Intervenções e/ou procedimentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('medications')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'medications'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Prescrição de medicamentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('exams')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'exams'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Solicitação de exames
                    </button>
                    <button
                      onClick={() => setPlanSubTab('certificates')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'certificates'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Atestados/Declarações
                    </button>
                    <button
                      onClick={() => setPlanSubTab('orientations')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'orientations'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Orientações
                    </button>
                    <button
                      onClick={() => setPlanSubTab('referrals')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'referrals'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Encaminhamentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('care_sharing')}
                      className={`py-2 px-3 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'care_sharing'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Compartilhamento de cuidado
                    </button>
                  </nav>
                </div>

                {/* Conteúdo das Sub-abas do Plano */}
                {planSubTab === 'interventions' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-3">Nova Intervenção/Procedimento</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            CIAP 2
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Pesquise e selecione o CIAP 2</option>
                            <option value="D88">D88 - Remoção do apêndice</option>
                            <option value="K86">K86 - Procedimento cardiovascular</option>
                            <option value="R74">R74 - Procedimento respiratório</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descreva o procedimento"
                          />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        + Incluir intervenção e/ou procedimento
                      </button>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhuma intervenção/procedimento registrado
                    </div>
                  </div>
                )}

                {planSubTab === 'medications' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-900 mb-3">Nova Prescrição de Medicamento</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medicamento
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Pesquise por medicamento"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Posologia
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ex: 1 cápsula de 50mg a cada 8h"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="common">Comum</option>
                            <option value="controlled">Controlado</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Período
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <span className="flex items-center">a</span>
                            <input
                              type="date"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        + Nova prescrição
                      </button>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhuma prescrição registrada
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Selecionar e imprimir
                      </button>
                    </div>
                  </div>
                )}

                {planSubTab === 'exams' && (
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h5 className="font-medium text-orange-900 mb-3">Nova Solicitação de Exame</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Exame
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Pesquise por exame"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridade
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="common">Comum</option>
                            <option value="specialized">Especializado</option>
                          </select>
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                        + Novo exame
                      </button>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhum exame solicitado
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Selecionar e imprimir
                      </button>
                    </div>
                  </div>
                )}

                {planSubTab === 'certificates' && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h5 className="font-medium text-purple-900 mb-3">Novo Atestado/Declaração</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="certificate">Atestado</option>
                            <option value="declaration">Declaração</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Profissional/Unidade
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Pesquise por profissional ou unidade"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conteúdo
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={3}
                          placeholder="Descreva o conteúdo do atestado/declaração"
                        />
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                          + Novo atestado
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                          + Nova declaração
                        </button>
                      </div>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhum atestado/declaração registrado
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Selecionar e imprimir
                      </button>
                    </div>
                  </div>
                )}

                {planSubTab === 'orientations' && (
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                      <h5 className="font-medium text-cyan-900 mb-3">Nova Orientação</h5>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Orientação
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            rows={4}
                            placeholder="Informe as orientações ao munícipe"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="Pesquise por profissional, especialidade ou orientação"
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              Ver somente as minhas orientações
                            </label>
                          </div>
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors">
                        + Incluir orientação
                      </button>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhuma orientação registrada
                    </div>
                  </div>
                )}

                {planSubTab === 'referrals' && (
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h5 className="font-medium text-red-900 mb-3">Novo Encaminhamento</h5>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">CAPS</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Urgência</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Internação hospitalar</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Intersetorial</label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 text-sm text-gray-700">Serviço de Atenção Domiciliar</label>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo de encaminhamento
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Pesquise por tipo"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Especialidade
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Pesquise por especialidade"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Classificação de risco
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                              <option value="low">Baixo</option>
                              <option value="medium">Médio</option>
                              <option value="high">Alto</option>
                              <option value="emergency">Emergência</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                          + Novo encaminhamento
                        </button>
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                          Serviço especializado
                        </button>
                      </div>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhum encaminhamento registrado
                    </div>
                  </div>
                )}

                {planSubTab === 'care_sharing' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <h5 className="font-medium text-indigo-900 mb-3">Novo Compartilhamento de Cuidado</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Compartilhar com
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Pesquise por profissional ou unidade de saúde"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prioridade
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conteúdo a compartilhar
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                          placeholder="Descreva as informações a serem compartilhadas"
                        />
                      </div>
                      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        + Novo compartilhamento
                      </button>
                    </div>
                    <div className="text-center text-gray-500 py-4">
                      Nenhum compartilhamento registrado
                    </div>
                  </div>
                )}
              </div>
            </AccordionSection>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="text-sm text-gray-500">
              {autoSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Salvando automaticamente...
                </div>
              ) : (
                'Salvamento automático ativado'
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onSave?.(soapData)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                💾 Salvar
              </button>
              <button
                onClick={() => {
                  // Função para imprimir receita
                  console.log('Imprimindo receita:', soapData.prescriptions);
                  setShowReport(true);
                }}
                disabled={soapData.prescriptions.length === 0}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
              >
                🖨️ Imprimir Receita
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja finalizar este atendimento? Esta ação não pode ser desfeita.')) {
                    console.log('Finalizando atendimento:', {
                      patientId: patient.id,
                      soapData,
                      timestamp: new Date().toISOString()
                    });
                    alert('Atendimento finalizado com sucesso! O paciente foi removido da fila.');
                    // Aqui você redirecionaria de volta para a fila
                    // navigate('/queue');
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                ✅ Finalizar Atendimento
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Relatório */}
      {showReport && (
        <AttendanceReport
          patient={patient}
          soapData={soapData}
          onClose={() => setShowReport(false)}
          onPrint={() => {
            window.print();
          }}
        />
      )}
    </>
  );
};

export default SOAPTab;
