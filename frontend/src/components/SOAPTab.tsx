import React, { useState, useEffect, useCallback } from 'react';
// ...existing code...
      referrals: '',
      certificates: '',
      general_guidance: '',
      food_guidance: '',
      exercise_guidance: '',
      selfcare_guidance: '',
      referral_reason: '',
      care_sharing: '',
      certificate_observations: '',
      procedures: ''
    },
    vital_signs: {
      systolic_pressure: '',
      diastolic_pressure: '',
      heart_rate: '',
      temperature: '',
      oxygen_saturation: ''
    },
    prescriptions: [],
    exams: [],
    procedures: [],
    follow_up: {
      notes: ''
    }
  });
  const [lastSavedData, setLastSavedData] = useState<SOAPData | null>(null);

  // Keep localSubjective in sync with soapData.subjective.subjective_impressions
  useEffect(() => {
    setLocalSubjective(soapData.subjective.subjective_impressions || '');
  }, [soapData.subjective.subjective_impressions]);

  // When saving, update soapData.subjective.subjective_impressions from localSubjective
  const handleSave = () => {
    setSoapData(prev => ({
      ...prev,
      subjective: {
        ...prev.subjective,
        subjective_impressions: localSubjective
      }
    }));
    if (onSave) {
      setAutoSaving(true);
      onSave({
        ...soapData,
        subjective: {
          ...soapData.subjective,
          subjective_impressions: localSubjective
        }
      });
      setLastSaved(new Date());
      setLastSavedData({
        ...soapData,
        subjective: {
          ...soapData.subjective,
          subjective_impressions: localSubjective
        }
      });
      setHasChanges(false);
      setTimeout(() => setAutoSaving(false), 500);
    }
  };

  // ...existing code (all other handlers and rendering)...

  const updateNestedField = useCallback((parent: keyof SOAPData, field: string, value: any) => {
    console.log(`📝 Atualizando campo aninhado ${parent}.${field} com valor:`, value);
    setSoapData(prev => ({
      ...prev,
      [parent]: typeof prev[parent] === 'object' && prev[parent] !== null
        ? { ...prev[parent] as any, [field]: value }
        : { [field]: value }
    }));
    // Removido setHasChanges para não interferir na digitação
  }, []);


  // Função para salvar imediatamente quando usuário sai do campo
  const handleFieldBlur = useCallback((field: keyof SOAPData, value: any) => {
    console.log(`💾 Campo ${field} perdeu foco, salvando imediatamente...`);
    if (onSave && hasRealChanges(soapData, lastSavedData)) {
      setAutoSaving(true);
      onSave(soapData);
      setLastSaved(new Date());
      setLastSavedData(soapData);
      setHasChanges(false);
      setTimeout(() => setAutoSaving(false), 500);
    }
  }, [soapData, lastSavedData, onSave, hasRealChanges]);

  const handleNestedFieldBlur = useCallback((parent: keyof SOAPData, field: string) => {
    console.log(`💾 Campo ${parent}.${field} perdeu foco, salvando imediatamente...`);
    if (onSave && hasRealChanges(soapData, lastSavedData)) {
      setAutoSaving(true);
      onSave(soapData);
      setLastSaved(new Date());
      setLastSavedData(soapData);
      setHasChanges(false);
      setTimeout(() => setAutoSaving(false), 500);
    }
  }, [soapData, lastSavedData, onSave, hasRealChanges]);

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

  useEffect(() => {
    const calculateBMI = () => {
      const weight = parseFloat(soapData.objective.anthropometry.weight);
      const height = parseFloat(soapData.objective.anthropometry.height);
      
      if (weight && height) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        updateNestedField('objective', 'anthropometry', {
          ...soapData.objective.anthropometry,
          bmi: bmi
        });
      }
    };

    calculateBMI();
  }, [soapData.objective.anthropometry.weight, soapData.objective.anthropometry.height, soapData.objective.anthropometry, updateNestedField]);

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
    <div className="space-y-6 pb-24">
      {/* Layout com Grid - Timeline à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conteúdo principal (9 colunas) */}
        <div className="lg:col-span-9">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header with patient info */}
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
              title="📝 Subjetivo - Impressões do Munícipe"
              bgColor="bg-green-50"
              textColor="text-green-800"
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Informe as impressões subjetivas expressadas pelo munícipe
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descreva as impressões subjetivas...
                  </label>
                  <textarea
                    value={localSubjective}
                    onChange={e => setLocalSubjective(e.target.value)}
                    // onBlur removido para não salvar automaticamente
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Descreva as impressões subjetivas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo da consulta - CIAP 2
                  </label>
                  <select
                    value={soapData.subjective.consultation_reason}
                    onChange={(e) => updateSOAPField('subjective', {
                      ...soapData.subjective,
                      consultation_reason: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Selecione o CIAP 2</option>
                    <option value="A01">A01 - Dor generalizada</option>
                    <option value="A02">A02 - Calafrio</option>
                    <option value="A03">A03 - Febre</option>
                    <option value="A04">A04 - Fraqueza/cansaço geral</option>
                    <option value="A05">A05 - Sensação de doença</option>
                    <option value="A06">A06 - Desmaio/síncope</option>
                    <option value="A07">A07 - Coma</option>
                    <option value="A08">A08 - Inchaço</option>
                    <option value="A09">A09 - Problema de sudorese</option>
                    <option value="A10">A10 - Sangramento/hemorragia</option>
                    <option value="A11">A11 - Dor no peito</option>
                    <option value="A13">A13 - Preocupação/medo de tratamento</option>
                    <option value="A16">A16 - Criança irritável</option>
                    <option value="A18">A18 - Preocupação com aparência</option>
                    <option value="A20">A20 - Solicitação de exame</option>
                    <option value="A21">A21 - Fator de risco de doença</option>
                    <option value="A23">A23 - Fator de risco NE</option>
                    <option value="A25">A25 - Medo de morte/medo de morrer</option>
                    <option value="A26">A26 - Medo de câncer</option>
                    <option value="A27">A27 - Medo de outras doenças</option>
                    <option value="A28">A28 - Limitação de função/incapacidade</option>
                    <option value="A29">A29 - Outros sinais/sintomas gerais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CIAP 2
                  </label>
                  <input
                    type="text"
                    value={soapData.subjective.ciap2_code}
                    onChange={(e) => updateSOAPField('subjective', {
                      ...soapData.subjective,
                      ciap2_code: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Informe o CIAP 2"
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Seção Objetivo */}
            <AccordionSection 
              id="objective" 
              title="🔍 Objetivo - Exame Físico e Dados"
              bgColor="bg-blue-50"
              textColor="text-blue-800"
            >
              <div className="space-y-6">
                {/* Sub-abas do Objetivo */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setObjectiveSubTab('general')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        objectiveSubTab === 'general'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Informações gerais
                    </button>
                    <button
                      onClick={() => setObjectiveSubTab('anthropometry')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        objectiveSubTab === 'anthropometry'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Antropometria, sinais vitais e glicemia capilar
                    </button>
                    <button
                      onClick={() => setObjectiveSubTab('food_markers')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        objectiveSubTab === 'food_markers'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Marcadores de consumo alimentar
                    </button>
                    <button
                      onClick={() => setObjectiveSubTab('exam_results')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        objectiveSubTab === 'exam_results'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Resultados de exames
                    </button>
                  </nav>
                </div>

                {/* Conteúdo das Sub-abas */}
                {objectiveSubTab === 'general' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Vacinação em dia
                      </label>
                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vacina-sim"
                            name="vaccination_up_to_date"
                            checked={soapData.objective.general_info.vaccination_up_to_date === true}
                            onChange={() => updateNestedField('objective', 'general_info', {
                              ...soapData.objective.general_info,
                              vaccination_up_to_date: true
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="vacina-sim" className="ml-2 text-sm text-gray-700">
                            Sim
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vacina-nao"
                            name="vaccination_up_to_date"
                            checked={soapData.objective.general_info.vaccination_up_to_date === false}
                            onChange={() => updateNestedField('objective', 'general_info', {
                              ...soapData.objective.general_info,
                              vaccination_up_to_date: false
                            })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="vacina-nao" className="ml-2 text-sm text-gray-700">
                            Não
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DUM (Data da Última Menstruação)
                      </label>
                      <input
                        type="date"
                        value={soapData.objective.general_info.last_menstrual_period}
                        onChange={(e) => updateNestedField('objective', 'general_info', {
                          ...soapData.objective.general_info,
                          last_menstrual_period: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <small className="text-gray-500 text-sm mt-1">
                        Última DUM: {soapData.objective.general_info.last_menstrual_period || 'Não registrada'}
                      </small>
                    </div>
                  </div>
                )}

                {objectiveSubTab === 'anthropometry' && (
                  <div className="space-y-6">
                    {/* Antropometria */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📏</span>
                        Medidas Antropométricas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (kg)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soapData.objective.anthropometry.weight}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              weight: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Altura (cm)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soapData.objective.anthropometry.height}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              height: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            IMC
                          </label>
                          <input
                            type="text"
                            value={soapData.objective.anthropometry.bmi}
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
                            step="0.1"
                            value={soapData.objective.anthropometry.abdominal_circumference}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              abdominal_circumference: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Perímetro Cefálico (cm)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soapData.objective.anthropometry.head_circumference}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              head_circumference: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Perímetro da Panturrilha (cm)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soapData.objective.anthropometry.calf_circumference}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              calf_circumference: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sinais Vitais */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">💓</span>
                        Sinais Vitais
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pressão Arterial (mmHg)
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={soapData.objective.anthropometry.systolic_pressure}
                              onChange={(e) => updateNestedField('objective', 'anthropometry', {
                                ...soapData.objective.anthropometry,
                                systolic_pressure: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Informe"
                            />
                            <span className="flex items-center text-gray-500">/</span>
                            <input
                              type="number"
                              value={soapData.objective.anthropometry.diastolic_pressure}
                              onChange={(e) => updateNestedField('objective', 'anthropometry', {
                                ...soapData.objective.anthropometry,
                                diastolic_pressure: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Informe"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequência Respiratória (mpm)
                          </label>
                          <input
                            type="number"
                            value={soapData.objective.anthropometry.respiratory_rate}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              respiratory_rate: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequência Cardíaca (bpm)
                          </label>
                          <input
                            type="number"
                            value={soapData.objective.anthropometry.heart_rate}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              heart_rate: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Temperatura (°C)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={soapData.objective.anthropometry.temperature}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              temperature: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Saturação de O₂ (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={soapData.objective.anthropometry.oxygen_saturation}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              oxygen_saturation: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Glicemia Capilar */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🩸</span>
                        Glicemia Capilar
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Glicemia capilar (mg/dL)
                          </label>
                          <input
                            type="number"
                            value={soapData.objective.anthropometry.capillary_glucose}
                            onChange={(e) => updateNestedField('objective', 'anthropometry', {
                              ...soapData.objective.anthropometry,
                              capillary_glucose: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Informe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Momento da coleta
                          </label>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="momento-nao-especificado"
                                name="glucose_collection_time"
                                checked={soapData.objective.anthropometry.glucose_collection_time === 'nao-especificado'}
                                onChange={() => updateNestedField('objective', 'anthropometry', {
                                  ...soapData.objective.anthropometry,
                                  glucose_collection_time: 'nao-especificado'
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label htmlFor="momento-nao-especificado" className="ml-2 text-sm text-gray-700">
                                Momento da coleta não especificado
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="jejum"
                                name="glucose_collection_time"
                                checked={soapData.objective.anthropometry.glucose_collection_time === 'jejum'}
                                onChange={() => updateNestedField('objective', 'anthropometry', {
                                  ...soapData.objective.anthropometry,
                                  glucose_collection_time: 'jejum'
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label htmlFor="jejum" className="ml-2 text-sm text-gray-700">
                                Jejum
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="pre-prandial"
                                name="glucose_collection_time"
                                checked={soapData.objective.anthropometry.glucose_collection_time === 'pre-prandial'}
                                onChange={() => updateNestedField('objective', 'anthropometry', {
                                  ...soapData.objective.anthropometry,
                                  glucose_collection_time: 'pre-prandial'
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label htmlFor="pre-prandial" className="ml-2 text-sm text-gray-700">
                                Pré-prandial
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="pos-prandial"
                                name="glucose_collection_time"
                                checked={soapData.objective.anthropometry.glucose_collection_time === 'pos-prandial'}
                                onChange={() => updateNestedField('objective', 'anthropometry', {
                                  ...soapData.objective.anthropometry,
                                  glucose_collection_time: 'pos-prandial'
                                })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <label htmlFor="pos-prandial" className="ml-2 text-sm text-gray-700">
                                Pós-prandial
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {objectiveSubTab === 'food_markers' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marcadores de Consumo Alimentar
                    </label>
                    <textarea
                      value={soapData.objective.food_consumption_markers}
                      onChange={(e) => updateNestedField('objective', 'food_consumption_markers', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva marcadores de consumo alimentar..."
                    />
                  </div>
                )}

                {objectiveSubTab === 'exam_results' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resultados de Exames
                    </label>
                    <textarea
                      value={soapData.objective.exam_results}
                      onChange={(e) => updateNestedField('objective', 'exam_results', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva resultados de exames..."
                    />
                  </div>
                )}
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
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Problema/Condição</th>
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
                                  <td className="px-4 py-2 text-sm text-gray-900 font-medium">{problem.condition}</td>
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
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    <button
                      onClick={() => setPlanSubTab('procedures')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'procedures'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Intervenções e/ou procedimentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('medications')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'medications'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Prescrição de medicamentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('exams')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'exams'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Solicitação de exames
                    </button>
                    <button
                      onClick={() => setPlanSubTab('certificates')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'certificates'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Atestados/Declarações
                    </button>
                    <button
                      onClick={() => setPlanSubTab('guidance')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'guidance'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Orientações
                    </button>
                    <button
                      onClick={() => setPlanSubTab('referrals')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'referrals'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Encaminhamentos
                    </button>
                    <button
                      onClick={() => setPlanSubTab('care_sharing')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        planSubTab === 'care_sharing'
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Compartilhamento de cuidado
                    </button>
                  </nav>
                </div>

                {/* Conteúdo das Sub-abas */}
                {planSubTab === 'procedures' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intervenções e/ou Procedimentos
                      </label>
                      <textarea
                        value={soapData.plan.procedures || ''}
                        onChange={e => updateNestedField('plan', 'procedures', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva as intervenções e procedimentos realizados ou planejados..."
                      />
                    </div>
                    
                    {/* Lista de procedimentos */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Procedimentos Registrados</h5>
                      {soapData.procedures.length > 0 ? (
                        <div className="space-y-2">
                          {soapData.procedures.map((procedure, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-900">{procedure}</span>
                              <button
                                onClick={() => removeFromList('procedures', index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum procedimento registrado</p>
                      )}
                      
                      {/* Adicionar novo procedimento */}
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Adicionar novo procedimento..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToList('procedures', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addToList('procedures', input.value);
                            input.value = '';
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {planSubTab === 'medications' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">💊</span>
                        Prescrições Médicas
                      </h4>
                      {soapData.prescriptions.length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {soapData.prescriptions.map((prescription, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{prescription.medication}</h5>
                                  <div className="text-sm text-gray-600 mt-1">
                                    <p><strong>Dosagem:</strong> {prescription.dosage}</p>
                                    <p><strong>Frequência:</strong> {prescription.frequency}</p>
                                    {prescription.duration && <p><strong>Duração:</strong> {prescription.duration}</p>}
                                    {prescription.instructions && <p><strong>Instruções:</strong> {prescription.instructions}</p>}
                                  </div>
                                </div>
                                <button
                                  onClick={() => removePrescription(index)}
                                  className="ml-4 text-red-500 hover:text-red-700"
                                >
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhuma prescrição adicionada</p>
                      )}

                      {/* Formulário de Nova Prescrição */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-3">Adicionar Nova Prescrição</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Medicamento *
                            </label>
                            <input
                              type="text"
                              value={newPrescription.medication}
                              onChange={(e) => setNewPrescription(prev => ({ ...prev, medication: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Dipirona 500mg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dosagem *
                            </label>
                            <input
                              type="text"
                              value={newPrescription.dosage}
                              onChange={(e) => setNewPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: 1 comprimido"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Frequência *
                            </label>
                            <input
                              type="text"
                              value={newPrescription.frequency}
                              onChange={(e) => setNewPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: 3x ao dia"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Duração
                            </label>
                            <input
                              type="text"
                              value={newPrescription.duration}
                              onChange={(e) => setNewPrescription(prev => ({ ...prev, duration: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: 7 dias"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Instruções Especiais
                            </label>
                            <textarea
                              value={newPrescription.instructions}
                              onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Ex: Tomar após as refeições"
                            />
                          </div>
                        </div>
                        <button
                          onClick={addPrescription}
                          disabled={!newPrescription.medication || !newPrescription.dosage || !newPrescription.frequency}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          Adicionar Prescrição
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {planSubTab === 'exams' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solicitação de Exames
                      </label>
                      <textarea
                        value={soapData.plan.requested_exams || ''}
                        onChange={e => updateNestedField('plan', 'requested_exams', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva os exames solicitados..."
                      />
                    </div>
                    
                    {/* Lista de exames */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Exames Solicitados</h5>
                      {soapData.exams.length > 0 ? (
                        <div className="space-y-2">
                          {soapData.exams.map((exam, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm text-gray-900">{exam}</span>
                              <button
                                onClick={() => removeFromList('exams', index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Nenhum exame solicitado</p>
                      )}
                      
                      {/* Adicionar novo exame */}
                      <div className="mt-4 flex gap-2">
                        <input
                          type="text"
                          placeholder="Adicionar novo exame..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToList('exams', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addToList('exams', input.value);
                            input.value = '';
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {planSubTab === 'certificates' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Atestados e Declarações
                      </label>
                      <textarea
                        value={soapData.plan.certificates || ''}
                        onChange={e => updateNestedField('plan', 'certificates', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva os atestados e declarações emitidos..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Documento
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Selecione o tipo</option>
                          <option value="atestado_medico">Atestado Médico</option>
                          <option value="declaracao_comparecimento">Declaração de Comparecimento</option>
                          <option value="atestado_saude">Atestado de Saúde</option>
                          <option value="declaracao_acompanhante">Declaração de Acompanhante</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Período de Afastamento
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Ex: 3 dias"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                        value={soapData.plan.certificate_observations || ''}
                        onChange={e => updateNestedField('plan', 'certificate_observations', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Observações adicionais sobre o atestado..."
                    />
                    </div>
                  </div>
                )}

                {planSubTab === 'guidance' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Orientações Gerais
                      </label>
                      <textarea
                        value={soapData.plan.general_guidance || ''}
                        onChange={e => updateNestedField('plan', 'general_guidance', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Orientações sobre cuidados, estilo de vida, prevenção..."
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Orientações Alimentares
                        </label>
                        <textarea
                          value={soapData.plan.food_guidance || ''}
                          onChange={e => updateNestedField('plan', 'food_guidance', e.target.value)}
                          onBlur={handleAutoSave}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Orientações sobre dieta e alimentação..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Orientações de Atividade Física
                        </label>
                        <textarea
                        value={soapData.plan.exercise_guidance || ''}
                        onChange={e => updateNestedField('plan', 'exercise_guidance', e.target.value)}
                          onBlur={handleAutoSave}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Orientações sobre exercícios e atividades..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Orientações de Autocuidado
                      </label>
                      <textarea
                        value={soapData.plan.selfcare_guidance || ''}
                        onChange={e => updateNestedField('plan', 'selfcare_guidance', e.target.value)}
                        onBlur={handleAutoSave}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Orientações sobre autocuidado e prevenção..."
                      />
                    </div>
                  </div>
                )}

                {planSubTab === 'referrals' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encaminhamentos
                      </label>
                      <textarea
                        value={soapData.plan.referrals || ''}
                        onChange={e => updateNestedField('plan', 'referrals', e.target.value)}
                        onBlur={handleAutoSave}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva os encaminhamentos realizados..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Especialidade
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Selecione a especialidade</option>
                          <option value="cardiologia">Cardiologia</option>
                          <option value="endocrinologia">Endocrinologia</option>
                          <option value="neurologia">Neurologia</option>
                          <option value="ortopedia">Ortopedia</option>
                          <option value="psiquiatria">Psiquiatria</option>
                          <option value="ginecologia">Ginecologia</option>
                          <option value="urologia">Urologia</option>
                          <option value="dermatologia">Dermatologia</option>
                          <option value="oftalmologia">Oftalmologia</option>
                          <option value="otorrinolaringologia">Otorrinolaringologia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prioridade
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Selecione a prioridade</option>
                          <option value="rotina">Rotina</option>
                          <option value="urgente">Urgente</option>
                          <option value="eletiva">Eletiva</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo do Encaminhamento
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva o motivo do encaminhamento..."
                      />
                    </div>
                  </div>
                )}

                {planSubTab === 'care_sharing' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compartilhamento de Cuidado
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva o plano de compartilhamento de cuidado..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Profissional/Serviço
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Selecione o profissional/serviço</option>
                          <option value="enfermeiro">Enfermeiro</option>
                          <option value="nutricionista">Nutricionista</option>
                          <option value="fisioterapeuta">Fisioterapeuta</option>
                          <option value="psicologo">Psicólogo</option>
                          <option value="assistente_social">Assistente Social</option>
                          <option value="farmaceutico">Farmacêutico</option>
                          <option value="nasf">NASF</option>
                          <option value="caps">CAPS</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Cuidado
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Selecione o tipo</option>
                          <option value="acompanhamento">Acompanhamento</option>
                          <option value="orientacao">Orientação</option>
                          <option value="procedimento">Procedimento</option>
                          <option value="avaliacao">Avaliação</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objetivo do Compartilhamento
                      </label>
                      <textarea
                        value={soapData.plan.care_sharing || ''}
                        onChange={e => updateNestedField('plan', 'care_sharing', e.target.value)}
                        onBlur={handleAutoSave}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Descreva o objetivo do compartilhamento de cuidado..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Periodicidade
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Selecione a periodicidade</option>
                        <option value="semanal">Semanal</option>
                        <option value="quinzenal">Quinzenal</option>
                        <option value="mensal">Mensal</option>
                        <option value="trimestral">Trimestral</option>
                        <option value="conforme_necessidade">Conforme necessidade</option>
                      </select>
                    </div>
                  </div>
                )}

                {planSubTab === 'followup' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📅</span>
                        Agendamento de Retorno
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Data do Retorno
                          </label>
                          <input
                            type="date"
                            value={soapData.follow_up.date}
                            onChange={(e) => updateNestedField('follow_up', 'date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Retorno
                          </label>
                          <select
                            value={soapData.follow_up.type}
                            onChange={(e) => updateNestedField('follow_up', 'type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="return">Retorno Médico</option>
                            <option value="exam">Retorno para Exames</option>
                            <option value="procedure">Procedimento</option>
                            <option value="vaccination">Vacinação</option>
                            <option value="other">Outro</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações do Retorno
                        </label>
                        <textarea
                          value={soapData.follow_up.notes}
                          onChange={(e) => updateNestedField('follow_up', 'notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Orientações específicas para o retorno, observações importantes..."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>

    {/* Timeline Lateral Fixa (3 colunas) */}
    {showTimeline && (
      <div className="lg:col-span-3">
        <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <ClockIcon className="h-5 w-5 text-blue-600" />
            </div>
            Timeline
            <button
              onClick={() => setShowTimeline(false)}
              className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </h3>
          
          {/* Eventos da Timeline */}
          <div className="space-y-4">
            <div className="border-l-3 border-blue-200 pl-4 pb-4 relative">
              <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-500 font-medium">2 dias atrás</span>
              <p className="font-medium text-sm text-gray-900 mt-1">Consulta especialidade Oftalmologia</p>
            </div>
            <div className="border-l-3 border-blue-200 pl-4 pb-4 relative">
              <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-500 font-medium">2 dias atrás</span>
              <p className="font-medium text-sm text-gray-900 mt-1">Vacina campanha COVID-19</p>
            </div>
            <div className="border-l-3 border-blue-200 pl-4 pb-4 relative">
              <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-500 font-medium">6h atrás</span>
              <p className="font-medium text-sm text-gray-900 mt-1">Procedimento</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                  Procedimento
                </span>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                  Consulta
                </span>
              </div>
            </div>
            <div className="border-l-3 border-blue-200 pl-4 pb-4 relative">
              <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              <span className="text-xs text-gray-500 font-medium">4 dias atrás</span>
              <p className="font-medium text-sm text-gray-900 mt-1">Escuta inicial</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="inline-block px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded-full font-medium">
                  Escuta
                </span>
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                  Consulta
                </span>
              </div>
            </div>
          </div>

          {/* Info simples */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-500">Histórico de eventos do paciente</p>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Botão para mostrar Timeline (quando escondida) */}
  {!showTimeline && (
    <button
      onClick={() => setShowTimeline(true)}
      className="fixed right-4 top-32 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      title="Mostrar Timeline"
    >
      <ClockIcon className="h-5 w-5" />
    </button>
  )}

  {/* Botões de ação principais */}
  <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4 px-6 flex justify-end gap-4 z-30">
    <button
      onClick={handleSave}
      className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
    >
      Salvar e Finalizar
    </button>
    <button
      onClick={handleSave}
      className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 transition-colors"
    >
      Salvar Rascunho
    </button>
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


export default SOAPTab;