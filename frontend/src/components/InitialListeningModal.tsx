// TODO: Implementar modal de escuta inicial na Fase 2
import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, UserIcon, CalendarIcon, MicrophoneIcon, ScaleIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  cpf?: string;
  phone?: string;
  serviceType: string;
  arrivalTime: string;
}

interface SigtapProcedure {
  code: string;
  description: string;
  isAutomatic: boolean;
  originData?: string; // qual dado originou o procedimento automático
}

interface RiskClassification {
  code: string;
  name: string;
  description: string;
  color: string;
  priority: number;
}

interface InitialListeningData {
  // RN01: Motivo da consulta CIAP2 (obrigatório)
  ciapCode: string;
  ciapDescription: string;
  
  // RN02: Descrição livre (opcional)
  consultationDescription: string;
  
  // RN03-RN04: Antropometria (opcional)
  weight?: number; // em kg
  height?: number; // em cm
  
  // RN05-RN11: Sinais vitais (opcional)
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  heartRate?: number; // bpm
  respiratoryRate?: number; // irpm
  temperature?: number; // °C
  oxygenSaturation?: number; // %
  capillaryGlycemia?: number; // mg/dL
  glycemiaMoment?: string; // momento da coleta de glicemia
  
  // RN12: Procedimentos realizados
  procedures: SigtapProcedure[]; // procedimentos automáticos e manuais
  
  // RN13: Classificação de risco/vulnerabilidade (obrigatório para demanda espontânea)
  riskClassification?: string; // código da classificação selecionada
  
  // RN14: Desfecho da escuta inicial (obrigatório)
  outcome?: string; // 'release' | 'queue' | 'vaccination' | 'schedule'
  outcomeDetails?: string; // observações específicas do desfecho
  
  // RN16: Estado e metadados da escuta
  status?: 'draft' | 'completed'; // status da escuta inicial
  completedAt?: string; // timestamp da finalização
  completedBy?: string; // profissional que finalizou
  canPrint?: boolean; // flag para impressão
}

interface InitialListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (data: InitialListeningData) => Promise<void>;
  onCancel?: (patientId: number, justification?: string) => Promise<void>; // RN15: Callback para cancelamento
  initialData?: InitialListeningData; // RN16: Dados pré-existentes da escuta
  isViewOnly?: boolean; // RN16: Modo somente leitura (escuta finalizada)
}

const InitialListeningModal: React.FC<InitialListeningModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSave,
  onCancel
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estados dos campos do formulário
  const [formData, setFormData] = useState<InitialListeningData>({
    ciapCode: '',
    ciapDescription: '',
    consultationDescription: '',
    weight: undefined,
    height: undefined,
    systolicBP: undefined,
    diastolicBP: undefined,
    heartRate: undefined,
    respiratoryRate: undefined,
    temperature: undefined,
    oxygenSaturation: undefined,
    capillaryGlycemia: undefined,
    glycemiaMoment: undefined,
    procedures: [],
    riskClassification: undefined,
    outcome: '', // obrigatório, mas será preenchido no final
    outcomeDetails: ''
  });

  // RN02: Contador de caracteres para descrição livre
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);
  const MAX_DESCRIPTION_LENGTH = 4000;

  // RN03: Estado para validação do peso
  const [weightError, setWeightError] = useState('');
  
  // RN04: Estado para validação da altura
  const [heightError, setHeightError] = useState('');
  
  // RN05: Estado para validação da pressão arterial sistólica
  const [systolicBPError, setSystolicBPError] = useState('');
  
  // RN06: Estado para validação da pressão arterial diastólica
  const [diastolicBPError, setDiastolicBPError] = useState('');
  
  // RN07: Estado para validação da frequência cardíaca
  const [heartRateError, setHeartRateError] = useState('');
  
  // RN08: Estado para validação da frequência respiratória
  const [respiratoryRateError, setRespiratoryRateError] = useState('');
  
  // RN09: Estado para validação da temperatura
  const [temperatureError, setTemperatureError] = useState('');
  
  // RN10: Estado para validação da saturação de oxigênio
  const [oxygenSaturationError, setOxygenSaturationError] = useState('');
  
  // RN11: Estado para validação da glicemia capilar
  const [capillaryGlycemiaError, setCapillaryGlycemiaError] = useState('');
  const [glycemiaMomentError, setGlycemiaMomentError] = useState('');
  const [glycemiaMoment, setGlycemiaMoment] = useState('');
  
  // RN12: Estados para procedimentos
  const [procedureSearchTerm, setProcedureSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SigtapProcedure[]>([]);
  const [showProcedureSearch, setShowProcedureSearch] = useState(false);
  
  // RN13: Estados para classificação de risco
  const [riskClassificationError, setRiskClassificationError] = useState('');
  
  // RN14: Estados para desfecho
  const [outcomeError, setOutcomeError] = useState('');
  const [outcomeDetailsCharCount, setOutcomeDetailsCharCount] = useState(0);
  const MAX_OUTCOME_DETAILS_LENGTH = 2000;

  // RN15: Estados para cancelamento de atendimento
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelJustification, setCancelJustification] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Reset form quando modal abrir/fechar
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ciapCode: '',
        ciapDescription: '',
        consultationDescription: '',
        weight: undefined,
        height: undefined,
        systolicBP: undefined,
        diastolicBP: undefined,
        heartRate: undefined,
        respiratoryRate: undefined,
        temperature: undefined,
        oxygenSaturation: undefined,
        capillaryGlycemia: undefined,
        glycemiaMoment: undefined,
        procedures: [],
        riskClassification: undefined,
        outcome: '',
        outcomeDetails: ''
      });
      setDescriptionCharCount(0);
      setWeightError('');
      setHeightError('');
      setSystolicBPError('');
      setDiastolicBPError('');
      setHeartRateError('');
      setRespiratoryRateError('');
      setTemperatureError('');
      setOxygenSaturationError('');
      setCapillaryGlycemiaError('');
      setGlycemiaMomentError('');
      setGlycemiaMoment('');
      setProcedureSearchTerm('');
      setSearchResults([]);
      setShowProcedureSearch(false);
      setRiskClassificationError('');
      setErrors({});
    }
  }, [isOpen]);

  // RN02: Atualizar contador de caracteres
  useEffect(() => {
    setDescriptionCharCount(formData.consultationDescription.length);
  }, [formData.consultationDescription]);

  useEffect(() => {
    setOutcomeDetailsCharCount(formData.outcomeDetails?.length || 0);
  }, [formData.outcomeDetails]);

  // RN12: Base de dados simulada de procedimentos SIGTAP
  const sigtapProcedures: SigtapProcedure[] = [
    // Procedimentos automáticos
    { code: '02.14.01.009-4', description: 'Aferição de peso e altura', isAutomatic: true, originData: 'antropometria' },
    { code: '02.11.01.001-3', description: 'Verificação de pressão arterial', isAutomatic: true, originData: 'pressao' },
    { code: '02.11.01.002-1', description: 'Verificação de sinais vitais', isAutomatic: true, originData: 'sinais' },
    { code: '02.11.01.003-0', description: 'Verificação de temperatura corporal', isAutomatic: true, originData: 'temperatura' },
    { code: '02.02.01.004-7', description: 'Verificação de saturação periférica de oxigênio', isAutomatic: true, originData: 'saturacao' },
    { code: '02.02.01.005-5', description: 'Verificação de glicemia capilar', isAutomatic: true, originData: 'glicemia' },
    
    // Procedimentos manuais disponíveis
    { code: '03.01.01.007-2', description: 'Consulta médica em atenção básica', isAutomatic: false },
    { code: '03.01.02.001-2', description: 'Consulta de enfermagem em atenção básica', isAutomatic: false },
    { code: '02.14.01.001-9', description: 'Aferição de circunferência abdominal', isAutomatic: false },
    { code: '02.11.01.010-2', description: 'Eletrocardiograma', isAutomatic: false },
    { code: '02.02.02.001-4', description: 'Teste de glicemia (jejum)', isAutomatic: false },
    { code: '02.02.01.006-3', description: 'Teste rápido para detecção de sífilis', isAutomatic: false },
    { code: '02.02.01.007-1', description: 'Teste rápido para detecção de HIV', isAutomatic: false },
    { code: '02.14.01.002-7', description: 'Medida da pressão intraocular', isAutomatic: false },
    { code: '02.11.01.011-0', description: 'Spirometria', isAutomatic: false },
    { code: '02.14.01.003-5', description: 'Teste de acuidade visual', isAutomatic: false }
  ];

  // RN13: Classificações de Risco/Vulnerabilidade
  const riskClassifications: RiskClassification[] = [
    { 
      code: 'VERMELHO', 
      name: 'Vermelho - Alto', 
      description: 'Emergência — risco iminente de morte ou sofrimento intenso. Atendimento imediato.',
      color: 'red',
      priority: 1
    },
    { 
      code: 'AMARELO', 
      name: 'Amarelo - Intermediário', 
      description: 'Urgência — condição instável ou agravamento iminente. Atendimento prioritário.',
      color: 'yellow',
      priority: 2
    },
    { 
      code: 'VERDE', 
      name: 'Verde - Baixo', 
      description: 'Pouco urgente — condição estável, sem risco iminente. Pode aguardar.',
      color: 'green',
      priority: 3
    },
    { 
      code: 'AZUL', 
      name: 'Azul - Não Agudo', 
      description: 'Não urgente — queixas simples, sem sinais de gravidade. Pode ser redirecionado para acolhimento educativo ou atendimento em outro momento.',
      color: 'blue',
      priority: 4
    }
  ];

  // RN14: Opções de desfecho da escuta inicial
  const outcomeOptions = [
    { 
      code: 'release', 
      name: 'Liberar Paciente', 
      description: 'Paciente não necessita atendimento médico ou de enfermagem no momento',
      icon: '✅' 
    },
    { 
      code: 'queue', 
      name: 'Adicionar à Fila', 
      description: 'Direcionar para fila de atendimento médico ou de enfermagem conforme classificação',
      icon: '🏥' 
    },
    { 
      code: 'vaccination', 
      name: 'Vacinação', 
      description: 'Direcionar para sala de vacinação',
      icon: '💉' 
    },
    { 
      code: 'schedule', 
      name: 'Agendamento', 
      description: 'Agendar consulta para data futura',
      icon: '📅' 
    }
  ];

  // RN12: Função para gerar procedimentos automáticos
  const generateAutomaticProcedures = useCallback((): SigtapProcedure[] => {
    const automaticProcedures: SigtapProcedure[] = [];
    
    // Aferição de peso e altura
    if (formData.weight !== undefined && formData.height !== undefined) {
      automaticProcedures.push({
        code: '02.14.01.009-4',
        description: 'Aferição de peso e altura',
        isAutomatic: true,
        originData: 'antropometria'
      });
    }
    
    // Verificação de pressão arterial
    if (formData.systolicBP !== undefined || formData.diastolicBP !== undefined) {
      automaticProcedures.push({
        code: '02.11.01.001-3',
        description: 'Verificação de pressão arterial',
        isAutomatic: true,
        originData: 'pressao'
      });
    }
    
    // Verificação de sinais vitais (FC ou FR)
    if (formData.heartRate !== undefined || formData.respiratoryRate !== undefined) {
      automaticProcedures.push({
        code: '02.11.01.002-1',
        description: 'Verificação de sinais vitais',
        isAutomatic: true,
        originData: 'sinais'
      });
    }
    
    // Verificação de temperatura corporal
    if (formData.temperature !== undefined) {
      automaticProcedures.push({
        code: '02.11.01.003-0',
        description: 'Verificação de temperatura corporal',
        isAutomatic: true,
        originData: 'temperatura'
      });
    }
    
    // Verificação de saturação de oxigênio
    if (formData.oxygenSaturation !== undefined) {
      automaticProcedures.push({
        code: '02.02.01.004-7',
        description: 'Verificação de saturação periférica de oxigênio',
        isAutomatic: true,
        originData: 'saturacao'
      });
    }
    
    // Verificação de glicemia capilar
    if (formData.capillaryGlycemia !== undefined) {
      automaticProcedures.push({
        code: '02.02.01.005-5',
        description: 'Verificação de glicemia capilar',
        isAutomatic: true,
        originData: 'glicemia'
      });
    }
    
    return automaticProcedures;
  }, [formData.weight, formData.height, formData.systolicBP, formData.diastolicBP, 
      formData.heartRate, formData.respiratoryRate, formData.temperature, 
      formData.oxygenSaturation, formData.capillaryGlycemia]);

  // RN12: Atualizar procedimentos automáticos quando dados mudarem
  useEffect(() => {
    const automaticProcedures = generateAutomaticProcedures();
    const manualProcedures = formData.procedures.filter(p => !p.isAutomatic);
    
    // Combinar procedimentos automáticos com manuais
    const updatedProcedures = [...automaticProcedures, ...manualProcedures];
    
    // Só atualizar se houve mudança real nos procedimentos
    const currentAutomaticProcedures = formData.procedures.filter(p => p.isAutomatic);
    const hasChanged = JSON.stringify(currentAutomaticProcedures) !== JSON.stringify(automaticProcedures);
    
    if (hasChanged) {
      setFormData(prev => ({
        ...prev,
        procedures: updatedProcedures
      }));
      
      // Log de auditoria para procedimentos automáticos
      if (automaticProcedures.length > 0) {
        console.log('[ESCUTA_INICIAL] RN12 - Procedimentos automáticos gerados:', {
          user: 'Usuario atual', // TODO: pegar do contexto
          timestamp: new Date().toISOString(),
          procedimentosGerados: automaticProcedures.map(p => ({ 
            codigo: p.code, 
            descricao: p.description, 
            origem: p.originData 
          })),
          pacienteId: patient?.id
        });
      }
    }
  }, [formData.weight, formData.height, formData.systolicBP, formData.diastolicBP, 
      formData.heartRate, formData.respiratoryRate, formData.temperature, 
      formData.oxygenSaturation, formData.capillaryGlycemia, patient?.id]); // Removido formData.procedures e generateAutomaticProcedures

  const calculateAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    if (age === 0) {
      const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
      return `${months} meses`;
    }
    
    return `${age} anos`;
  };

  // RN03: Validação e formatação do peso
  const handleWeightChange = (value: string) => {
    // Remover caracteres não numéricos exceto vírgula
    const cleanValue = value.replace(/[^0-9,]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, weight: undefined }));
      setWeightError('');
      return;
    }

    // Converter vírgula para ponto para processamento
    const numericValue = parseFloat(cleanValue.replace(',', '.'));
    
    if (isNaN(numericValue)) {
      setWeightError('Este campo aceita apenas números.');
      return;
    }

    // RN03: Validação dos limites (0,5 kg a 500 kg)
    if (numericValue < 0.5) {
      setWeightError('Deve ser entre 0,5 e 500 kg.');
      return;
    }
    
    if (numericValue > 500) {
      setWeightError('Deve ser entre 0,5 e 500 kg.');
      return;
    }

    // Validação passou
    setWeightError('');
    setFormData(prev => ({ ...prev, weight: numericValue }));
  };

  // RN04: Validação e formatação da altura (melhorada)
  const handleHeightChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN04 - Altura sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // RN04: Função auxiliar para formatar altura durante digitação
    const formatHeightInput = (value: string): string => {
      // Remove caracteres inválidos
      let cleaned = value.replace(/[^0-9,.]/g, '');
      
      // Se começar com 0, permite apenas se for seguido de vírgula/ponto
      if (cleaned.startsWith('0') && cleaned.length > 1 && !cleaned.startsWith('0,') && !cleaned.startsWith('0.')) {
        cleaned = cleaned.substring(1);
      }
      
      // Limita a 5 caracteres
      cleaned = cleaned.slice(0, 5);
      
      // Garante apenas uma vírgula ou ponto
      const separators = cleaned.match(/[,.]/g);
      if (separators && separators.length > 1) {
        // Mantém apenas o primeiro separador
        const firstSeparatorIndex = cleaned.search(/[,.]/);
        cleaned = cleaned.substring(0, firstSeparatorIndex + 1) + 
                  cleaned.substring(firstSeparatorIndex + 1).replace(/[,.]/g, '');
      }
      
      return cleaned;
    };

    // Formatar valor antes de atualizar o estado
    const formattedValue = formatHeightInput(value);
    setFormData(prev => ({ ...prev, height: formattedValue ? parseFloat(formattedValue.replace(',', '.')) : undefined }));

    if (formattedValue === '') {
      setHeightError('');
      return;
    }

    // Validar formato: máximo uma vírgula ou ponto
    const commaCount = (formattedValue.match(/,/g) || []).length;
    const dotCount = (formattedValue.match(/\./g) || []).length;
    
    if (commaCount + dotCount > 1) {
      setHeightError('Formato inválido. Use apenas uma vírgula ou ponto.');
      return;
    }

    // Converter vírgula para ponto para processamento
    const processValue = formattedValue.replace(',', '.');
    const numericValue = parseFloat(processValue);
    
    // Validar se é um número válido
    if (isNaN(numericValue)) {
      setHeightError('Valor inválido. Digite um número válido.');
      return;
    }

    // RN04: Validação dos limites (20 cm a 250 cm)
    if (numericValue < 20) {
      setHeightError('A altura deve ser entre 20 cm e 250 cm.');
      console.log('[ESCUTA_INICIAL] RN04 - Erro: altura menor que 20cm:', {
        valorInformado: numericValue,
        minimoPermitido: 20
      });
      return;
    }
    
    if (numericValue > 250) {
      setHeightError('A altura deve ser entre 20 cm e 250 cm.');
      console.log('[ESCUTA_INICIAL] RN04 - Erro: altura maior que 250cm:', {
        valorInformado: numericValue,
        maximoPermitido: 250
      });
      return;
    }

    // Validar casas decimais (máximo 1)
    const decimalPart = processValue.split('.')[1];
    if (decimalPart && decimalPart.length > 1) {
      setHeightError('Use no máximo 1 casa decimal.');
      return;
    }

    // Validação passou - log de sucesso
    setHeightError('');
    setFormData(prev => ({ ...prev, height: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN04 - Altura validada com sucesso:', {
      valorFinal: numericValue,
      unidade: 'cm',
      status: 'validado'
    });
  };

  // RN05: Validação da pressão arterial sistólica
  const handleSystolicBPChange = (value: string) => {
    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, systolicBP: undefined }));
      setSystolicBPError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setSystolicBPError('Este campo aceita apenas números.');
      return;
    }

    // RN05: Validação dos limites (70 mmHg a 250 mmHg)
    if (numericValue < 70) {
      setSystolicBPError('Deve ser entre 70 mmHg e 250 mmHg.');
      return;
    }
    
    if (numericValue > 250) {
      setSystolicBPError('Deve ser entre 70 mmHg e 250 mmHg.');
      return;
    }

    // Validação passou
    setSystolicBPError('');
    setFormData(prev => ({ ...prev, systolicBP: numericValue }));
  };

  // RN06: Validação da pressão arterial diastólica
  const handleDiastolicBPChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN06 - Pressão diastólica sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, diastolicBP: undefined }));
      setDiastolicBPError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setDiastolicBPError('Este campo aceita apenas números.');
      return;
    }

    // RN06: Validação dos limites (40 mmHg a 150 mmHg)
    if (numericValue < 40) {
      setDiastolicBPError('Deve ser entre 40 mmHg e 150 mmHg.');
      console.log('[ESCUTA_INICIAL] RN06 - Erro: pressão diastólica menor que 40mmHg:', {
        valorInformado: numericValue,
        minimoPermitido: 40
      });
      return;
    }
    
    if (numericValue > 150) {
      setDiastolicBPError('Deve ser entre 40 mmHg e 150 mmHg.');
      console.log('[ESCUTA_INICIAL] RN06 - Erro: pressão diastólica maior que 150mmHg:', {
        valorInformado: numericValue,
        maximoPermitido: 150
      });
      return;
    }

    // Validação passou
    setDiastolicBPError('');
    setFormData(prev => ({ ...prev, diastolicBP: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN06 - Pressão diastólica validada com sucesso:', {
      valorFinal: numericValue,
      unidade: 'mmHg',
      status: 'validado'
    });
  };

  // RN07: Validação da frequência cardíaca
  const handleHeartRateChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN07 - Frequência cardíaca sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, heartRate: undefined }));
      setHeartRateError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setHeartRateError('Este campo aceita apenas números.');
      return;
    }

    // RN07: Validação dos limites (30 bpm a 220 bpm)
    if (numericValue < 30) {
      setHeartRateError('Deve ser entre 30 bpm e 220 bpm.');
      console.log('[ESCUTA_INICIAL] RN07 - Erro: frequência cardíaca menor que 30bpm:', {
        valorInformado: numericValue,
        minimoPermitido: 30
      });
      return;
    }
    
    if (numericValue > 220) {
      setHeartRateError('Deve ser entre 30 bpm e 220 bpm.');
      console.log('[ESCUTA_INICIAL] RN07 - Erro: frequência cardíaca maior que 220bpm:', {
        valorInformado: numericValue,
        maximoPermitido: 220
      });
      return;
    }

    // Validação passou
    setHeartRateError('');
    setFormData(prev => ({ ...prev, heartRate: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN07 - Frequência cardíaca validada com sucesso:', {
      valorFinal: numericValue,
      unidade: 'bpm',
      status: 'validado'
    });
  };

  // RN08: Validação da frequência respiratória
  const handleRespiratoryRateChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN08 - Frequência respiratória sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, respiratoryRate: undefined }));
      setRespiratoryRateError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setRespiratoryRateError('Este campo aceita apenas números.');
      return;
    }

    // RN08: Validação dos limites (8 rpm a 80 rpm)
    if (numericValue < 8) {
      setRespiratoryRateError('Deve ser entre 8 rpm e 80 rpm.');
      console.log('[ESCUTA_INICIAL] RN08 - Erro: frequência respiratória menor que 8rpm:', {
        valorInformado: numericValue,
        minimoPermitido: 8
      });
      return;
    }
    
    if (numericValue > 80) {
      setRespiratoryRateError('Deve ser entre 8 rpm e 80 rpm.');
      console.log('[ESCUTA_INICIAL] RN08 - Erro: frequência respiratória maior que 80rpm:', {
        valorInformado: numericValue,
        maximoPermitido: 80
      });
      return;
    }

    // Validação passou
    setRespiratoryRateError('');
    setFormData(prev => ({ ...prev, respiratoryRate: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN08 - Frequência respiratória validada com sucesso:', {
      valorFinal: numericValue,
      unidade: 'rpm',
      status: 'validado'
    });
  };

  // RN09: Validação da temperatura corporal
  const handleTemperatureChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN09 - Temperatura sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Permitir apenas números, vírgula e ponto
    const cleanValue = value.replace(/[^0-9,.]/g, '');
    
    // Limitar a 4 caracteres (formato: 99,9)
    const limitedValue = cleanValue.slice(0, 4);
    
    if (limitedValue === '') {
      setFormData(prev => ({ ...prev, temperature: undefined }));
      setTemperatureError('');
      return;
    }

    // Validar formato: máximo uma vírgula ou ponto
    const commaCount = (limitedValue.match(/,/g) || []).length;
    const dotCount = (limitedValue.match(/\./g) || []).length;
    
    if (commaCount + dotCount > 1) {
      setTemperatureError('Formato inválido. Use apenas uma vírgula.');
      return;
    }

    // Converter vírgula para ponto para processamento
    const processValue = limitedValue.replace(',', '.');
    const numericValue = parseFloat(processValue);
    
    // Validar se é um número válido
    if (isNaN(numericValue)) {
      setTemperatureError('Valor inválido. Digite um número válido.');
      return;
    }

    // RN09: Validação dos limites (32,0°C a 42,0°C)
    if (numericValue < 32) {
      setTemperatureError('Deve ser entre 32 °C e 42 °C.');
      console.log('[ESCUTA_INICIAL] RN09 - Erro: temperatura menor que 32°C:', {
        valorInformado: numericValue,
        minimoPermitido: 32
      });
      return;
    }
    
    if (numericValue > 42) {
      setTemperatureError('Deve ser entre 32 °C e 42 °C.');
      console.log('[ESCUTA_INICIAL] RN09 - Erro: temperatura maior que 42°C:', {
        valorInformado: numericValue,
        maximoPermitido: 42
      });
      return;
    }

    // Validar casas decimais (máximo 1)
    const decimalPart = processValue.split('.')[1];
    if (decimalPart && decimalPart.length > 1) {
      setTemperatureError('Use no máximo 1 casa decimal.');
      return;
    }

    // Validação passou
    setTemperatureError('');
    setFormData(prev => ({ ...prev, temperature: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN09 - Temperatura validada com sucesso:', {
      valorFinal: numericValue,
      unidade: '°C',
      status: 'validado'
    });
  };

  // RN10: Validação da saturação de oxigênio
  const handleOxygenSaturationChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN10 - Saturação de oxigênio sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, oxygenSaturation: undefined }));
      setOxygenSaturationError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setOxygenSaturationError('Este campo aceita apenas números.');
      return;
    }

    // RN10: Validação dos limites (70% a 100%)
    if (numericValue < 70) {
      setOxygenSaturationError('Deve ser entre 70% e 100%.');
      console.log('[ESCUTA_INICIAL] RN10 - Erro: saturação menor que 70%:', {
        valorInformado: numericValue,
        minimoPermitido: 70
      });
      return;
    }
    
    if (numericValue > 100) {
      setOxygenSaturationError('Deve ser entre 70% e 100%.');
      console.log('[ESCUTA_INICIAL] RN10 - Erro: saturação maior que 100%:', {
        valorInformado: numericValue,
        maximoPermitido: 100
      });
      return;
    }

    // Validação passou
    setOxygenSaturationError('');
    setFormData(prev => ({ ...prev, oxygenSaturation: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN10 - Saturação de oxigênio validada com sucesso:', {
      valorFinal: numericValue,
      unidade: '%',
      status: 'validado'
    });
  };

  // RN11: Validação da glicemia capilar
  const handleCapillaryGlycemiaChange = (value: string) => {
    console.log('[ESCUTA_INICIAL] RN11 - Glicemia capilar sendo alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      valorInserido: value,
      pacienteId: patient?.id
    });

    // Remover caracteres não numéricos
    const cleanValue = value.replace(/[^0-9]/g, '');
    
    if (cleanValue === '') {
      setFormData(prev => ({ ...prev, capillaryGlycemia: undefined }));
      setCapillaryGlycemiaError('');
      return;
    }

    const numericValue = parseInt(cleanValue);
    
    if (isNaN(numericValue)) {
      setCapillaryGlycemiaError('Este campo aceita apenas números.');
      return;
    }

    // RN11: Validação dos limites (20 mg/dL a 600 mg/dL)
    if (numericValue < 20) {
      setCapillaryGlycemiaError('Deve ser entre 20 mg/dL e 600 mg/dL.');
      console.log('[ESCUTA_INICIAL] RN11 - Erro: glicemia menor que 20mg/dL:', {
        valorInformado: numericValue,
        minimoPermitido: 20
      });
      return;
    }
    
    if (numericValue > 600) {
      setCapillaryGlycemiaError('Deve ser entre 20 mg/dL e 600 mg/dL.');
      console.log('[ESCUTA_INICIAL] RN11 - Erro: glicemia maior que 600mg/dL:', {
        valorInformado: numericValue,
        maximoPermitido: 600
      });
      return;
    }

    // Validação passou
    setCapillaryGlycemiaError('');
    setFormData(prev => ({ ...prev, capillaryGlycemia: numericValue }));
    
    console.log('[ESCUTA_INICIAL] RN11 - Glicemia capilar validada com sucesso:', {
      valorFinal: numericValue,
      unidade: 'mg/dL',
      status: 'validado'
    });
  };

  // RN11: Validação do momento da coleta de glicemia
  const handleGlycemiaMomentChange = (moment: string) => {
    console.log('[ESCUTA_INICIAL] RN11 - Momento da coleta alterado:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      momentoSelecionado: moment,
      pacienteId: patient?.id
    });

    setGlycemiaMoment(moment);
    setFormData(prev => ({ ...prev, glycemiaMoment: moment }));
    
    // Limpar erro se momento foi selecionado
    if (moment && moment !== '') {
      setGlycemiaMomentError('');
    }
  };

  // RN12: Busca de procedimentos SIGTAP
  const handleProcedureSearch = (searchTerm: string) => {
    setProcedureSearchTerm(searchTerm);
    
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Filtrar procedimentos manuais disponíveis
    const results = sigtapProcedures
      .filter(proc => !proc.isAutomatic)
      .filter(proc => 
        proc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 10); // Limitar a 10 resultados
    
    setSearchResults(results);
    
    console.log('[ESCUTA_INICIAL] RN12 - Busca de procedimentos realizada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      termoBusca: searchTerm,
      resultadosEncontrados: results.length,
      pacienteId: patient?.id
    });
  };

  // RN12: Adicionar procedimento manual
  const handleAddManualProcedure = (procedure: SigtapProcedure) => {
    // Verificar se procedimento já existe
    const exists = formData.procedures.some(p => p.code === procedure.code);
    
    if (exists) {
      console.log('[ESCUTA_INICIAL] RN12 - Tentativa de adicionar procedimento duplicado:', {
        user: 'Usuario atual',
        timestamp: new Date().toISOString(),
        procedimento: { codigo: procedure.code, descricao: procedure.description },
        acao: 'bloqueado_duplicado'
      });
      return;
    }
    
    const manualProcedure: SigtapProcedure = {
      ...procedure,
      isAutomatic: false
    };
    
    setFormData(prev => ({
      ...prev,
      procedures: [...prev.procedures, manualProcedure]
    }));
    
    // Limpar busca
    setProcedureSearchTerm('');
    setSearchResults([]);
    setShowProcedureSearch(false);
    
    console.log('[ESCUTA_INICIAL] RN12 - Procedimento manual adicionado:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      procedimentoAdicionado: {
        codigo: procedure.code,
        descricao: procedure.description,
        tipo: 'manual'
      },
      pacienteId: patient?.id
    });
  };

  // RN12: Remover procedimento manual
  const handleRemoveProcedure = (procedureCode: string) => {
    const procedure = formData.procedures.find(p => p.code === procedureCode);
    
    if (!procedure) return;
    
    // Impedir remoção de procedimentos automáticos
    if (procedure.isAutomatic) {
      console.log('[ESCUTA_INICIAL] RN12 - Tentativa de remoção de procedimento automático bloqueada:', {
        user: 'Usuario atual',
        timestamp: new Date().toISOString(),
        procedimento: { codigo: procedure.code, descricao: procedure.description },
        motivo: 'procedimento_automatico_nao_removivel'
      });
      
      alert('Este procedimento foi gerado automaticamente a partir dos dados inseridos e não pode ser removido.');
      return;
    }
    
    // Remover procedimento manual
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.filter(p => p.code !== procedureCode)
    }));
    
    console.log('[ESCUTA_INICIAL] RN12 - Procedimento manual removido:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      procedimentoRemovido: {
        codigo: procedure.code,
        descricao: procedure.description,
        tipo: 'manual'
      },
      pacienteId: patient?.id
    });
  };

  // RN13: Manipular seleção de classificação de risco
  const handleRiskClassificationChange = (classificationCode: string) => {
    console.log('[ESCUTA_INICIAL] RN13 - Classificação de risco alterada:', {
      user: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      classificacaoSelecionada: classificationCode,
      tipoAtendimento: patient?.serviceType === 'spontaneous' ? 'espontaneo' : 'agendado',
      pacienteId: patient?.id
    });

    setFormData(prev => ({ ...prev, riskClassification: classificationCode }));
    
    // Limpar erro se classificação foi selecionada
    if (classificationCode && classificationCode !== '') {
      setRiskClassificationError('');
    }
    
    const selectedClassification = riskClassifications.find(c => c.code === classificationCode);
    console.log('[ESCUTA_INICIAL] RN13 - Classificação registrada com sucesso:', {
      classificacao: selectedClassification,
      prioridadeFila: selectedClassification?.priority,
      impactoFila: 'paciente_sera_reordenado_conforme_prioridade',
      status: 'validado'
    });
  };

  // RN02: Validação da descrição livre
  const handleDescriptionChange = (value: string) => {
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setFormData(prev => ({ ...prev, consultationDescription: value }));
    }
  };

  // RN14: Handler para desfecho da escuta
  const handleOutcomeChange = (outcomeCode: string) => {
    setFormData(prev => ({ ...prev, outcome: outcomeCode }));
    setOutcomeError('');
    
    console.log('[ESCUTA_INICIAL] RN14 - Desfecho selecionado:', {
      desfecho: outcomeCode,
      descricao: outcomeOptions.find(o => o.code === outcomeCode)?.name,
      impacto: getOutcomeImpactDescription(outcomeCode),
      timestamp: new Date().toISOString()
    });
  };

  const handleOutcomeDetailsChange = (value: string) => {
    if (value.length <= MAX_OUTCOME_DETAILS_LENGTH) {
      setFormData(prev => ({ ...prev, outcomeDetails: value }));
    }
  };

  // RN14: Função auxiliar para descrever o impacto do desfecho
  const getOutcomeImpactDescription = (outcomeCode: string): string => {
    switch (outcomeCode) {
      case 'release':
        return 'Paciente será removido da fila';
      case 'queue':
        return 'Paciente será reposicionado na fila conforme classificação de risco';
      case 'vaccination':
        return 'Paciente será direcionado para sala de vacinação';
      case 'schedule':
        return 'Consulta será agendada para data futura';
      default:
        return 'Sem impacto definido';
    }
  };

  // RN15: Handlers para cancelamento de atendimento
  const handleCancelRequest = () => {
    console.log('[ESCUTA_INICIAL] RN15 - Solicitação de cancelamento iniciada:', {
      pacienteId: patient?.id,
      profissional: 'Usuario atual', // TODO: pegar do contexto
      timestamp: new Date().toISOString(),
      statusAtual: 'em_escuta_inicial'
    });
    
    setShowCancelConfirmation(true);
    setCancelError('');
  };

  const handleCancelConfirm = async () => {
    if (!patient || !onCancel) {
      setCancelError('Erro interno: dados do paciente não disponíveis.');
      return;
    }

    try {
      console.log('[ESCUTA_INICIAL] RN15 - Cancelamento confirmado:', {
        pacienteId: patient.id,
        justificativa: cancelJustification.trim() || 'Não informada',
        profissional: 'Usuario atual', // TODO: pegar do contexto
        timestamp: new Date().toISOString(),
        dadosDescartados: {
          ciap: formData.ciapCode,
          sinaisVitais: {
            peso: formData.weight,
            altura: formData.height,
            pressao: formData.systolicBP || formData.diastolicBP ? 'preenchida' : 'vazia',
            temperatura: formData.temperature
          },
          procedimentos: formData.procedures.length,
          classificacao: formData.riskClassification
        }
      });

      // Chamar callback de cancelamento
      await onCancel(patient.id, cancelJustification.trim() || undefined);
      
      // Fechar modal de confirmação e limpar estados
      setShowCancelConfirmation(false);
      setCancelJustification('');
      onClose();
      
    } catch (error) {
      console.error('[ESCUTA_INICIAL] RN15 - Erro no cancelamento:', error);
      setCancelError('Erro ao cancelar atendimento. Tente novamente.');
    }
  };

  const handleCancelCancel = () => {
    console.log('[ESCUTA_INICIAL] RN15 - Cancelamento abortado pelo usuário:', {
      pacienteId: patient?.id,
      timestamp: new Date().toISOString()
    });
    
    setShowCancelConfirmation(false);
    setCancelJustification('');
    setCancelError('');
  };

  // Validações do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // RN08: Validação da glicemia capilar (opcional, mas se preenchida, momento é obrigatório)
    if (formData.capillaryGlycemia && (!formData.glycemiaMoment || formData.glycemiaMoment === '')) {
      newErrors.glycemiaMoment = 'Selecione o momento da coleta da glicemia.';
    }

    // RN13: Validação obrigatória da classificação de risco para demanda espontânea
    if (patient?.serviceType === 'spontaneous') {
      if (!formData.riskClassification || formData.riskClassification === '') {
        newErrors.riskClassification = 'A classificação de risco é obrigatória para atendimentos por demanda espontânea.';
      }
    }

    // RN14: Validação obrigatória do desfecho
    if (!formData.outcome || formData.outcome === '') {
      newErrors.outcome = 'O desfecho da escuta inicial é obrigatório.';
    }

    // RN14: Validação dos detalhes do desfecho se preenchidos
    if (formData.outcomeDetails && formData.outcomeDetails.length > MAX_OUTCOME_DETAILS_LENGTH) {
      newErrors.outcomeDetails = `Excedeu o limite de ${MAX_OUTCOME_DETAILS_LENGTH} caracteres.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // RN16: Função para salvar a escuta inicial
  const handleSave = async () => {
    setLoading(true);
    
    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar escuta inicial:', error);
      setErrors(prev => ({ ...prev, general: 'Erro ao salvar. Tente novamente.' }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <>
      {/* RN15: Modal de Confirmação de Cancelamento */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <XMarkIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Cancelar Escuta Inicial</h3>
                  <p className="text-sm text-gray-600">Esta ação não poderá ser desfeita</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Deseja cancelar a Escuta Inicial?</strong><br />
                  As alterações realizadas serão perdidas.
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Dados que serão perdidos:</strong><br />
                    • Código CIAP2 e descrição<br />
                    • Dados antropométricos (peso, altura)<br />
                    • Sinais vitais coletados<br />
                    • Procedimentos registrados<br />
                    • Classificação de risco<br />
                    • Avaliação de vulnerabilidade
                  </p>
                </div>

                <label htmlFor="cancelJustification" className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa (opcional)
                </label>
                <textarea
                  id="cancelJustification"
                  rows={3}
                  value={cancelJustification}
                  onChange={(e) => setCancelJustification(e.target.value)}
                  placeholder="Ex: Paciente desistiu do atendimento, dados inseridos incorretamente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {cancelError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{cancelError}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleCancelCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Manter Escuta
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancelar Escuta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Principal de Escuta Inicial */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${
          theme === 'hybrid' ? 'healthcare-modal' : 'bg-white'
        } rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}>
        
        {/* Header */}
        <div className={`${
          theme === 'hybrid' ? 'healthcare-modal-header' : 'bg-gradient-to-r from-pink-500 to-purple-600'
        } px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <MicrophoneIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Escuta Inicial</h2>
              <p className="text-pink-100 text-sm">Acolhimento e Classificação de Risco</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-pink-200 transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Patient Info */}
        <div className={`${
          theme === 'hybrid' ? 'healthcare-card' : 'bg-gray-50'
        } px-6 py-4 border-b`}>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-semibold text-gray-900">{patient.name}</p>
                <p className="text-sm text-gray-600">CPF: {patient.cpf || 'Não informado'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Idade</p>
                <p className="font-medium text-gray-900">{calculateAge(patient.birthDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Serviço</p>
              <p className="font-medium text-gray-900">{patient.serviceType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Chegada</p>
              <p className="font-medium text-gray-900">{patient.arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-6">
            
            {/* RN01: Motivo da Consulta CIAP2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo da Consulta (CIAP2) <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Digite o código CIAP2 ou busque por descrição..."
                  value={formData.ciapCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, ciapCode: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${
                    errors.ciapCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.ciapCode && (
                  <p className="text-red-600 text-sm">{errors.ciapCode}</p>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    💡 <strong>Dica:</strong> Digite o código (ex: A01) ou palavras-chave para buscar na classificação CIAP2
                  </p>
                </div>
              </div>
            </div>

            {/* RN02: Descrição Livre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Complementar do Motivo (Opcional)
              </label>
              <div className="space-y-2">
                <textarea
                  value={formData.consultationDescription}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Descreva detalhes adicionais sobre o motivo da consulta..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-vertical ${
                    errors.consultationDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                
                {/* RN02: Contador de caracteres */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Campo opcional para informações complementares
                  </p>
                  <p className={`text-sm font-medium ${
                    descriptionCharCount > MAX_DESCRIPTION_LENGTH ? 'text-red-600' : 
                    descriptionCharCount > MAX_DESCRIPTION_LENGTH * 0.9 ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH} caracteres
                  </p>
                </div>
                
                {errors.consultationDescription && (
                  <p className="text-red-600 text-sm">{errors.consultationDescription}</p>
                )}
              </div>
            </div>

            {/* RN03-RN04: Antropometria */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2 text-gray-600" />
                Antropometria (Opcional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* RN03: Peso */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0,000"
                      value={formData.weight !== undefined ? formData.weight.toString().replace('.', ',') : ''}
                      onChange={(e) => handleWeightChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 ${
                        weightError || errors.weight ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">kg</span>
                    </div>
                  </div>
                  {(weightError || errors.weight) && (
                    <p className="text-red-600 text-sm mt-1">{weightError || errors.weight}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Intervalo válido: 0,5 kg a 500 kg
                  </p>
                </div>

                {/* RN04: Altura (melhorada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                    <span className="text-xs text-gray-500 ml-1">• Máx. 1 casa decimal</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 175,5"
                      maxLength={5}
                      value={formData.height !== undefined ? formData.height.toString().replace('.', ',') : ''}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 transition-colors ${
                        heightError || errors.height ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">cm</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro/validação */}
                  {(heightError || errors.height) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{heightError || errors.height}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 20 cm a 250 cm
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Use vírgula para decimais (ex: 175,5)
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.height !== undefined && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.height} cm - Valor válido
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Cálculo do IMC (se peso e altura estiverem preenchidos) */}
              {formData.weight && formData.height && !weightError && !heightError && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">
                        Índice de Massa Corporal (IMC)
                      </h4>
                      <p className="text-xs text-blue-700 mt-1">
                        Calculado automaticamente com base no peso e altura informados
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-900">
                        {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                      </p>
                      <p className="text-xs text-blue-700">kg/m²</p>
                    </div>
                  </div>
                  
                  {/* Classificação do IMC */}
                  {(() => {
                    const imc = formData.weight / Math.pow(formData.height / 100, 2);
                    let classification = '';
                    let color = '';
                    
                    if (imc < 18.5) {
                      classification = 'Abaixo do peso';
                      color = 'text-yellow-700';
                    } else if (imc < 25) {
                      classification = 'Peso normal';
                      color = 'text-green-700';
                    } else if (imc < 30) {
                      classification = 'Sobrepeso';
                      color = 'text-orange-700';
                    } else if (imc < 35) {
                      classification = 'Obesidade grau I';
                      color = 'text-red-700';
                    } else if (imc < 40) {
                      classification = 'Obesidade grau II';
                      color = 'text-red-800';
                    } else {
                      classification = 'Obesidade grau III';
                      color = 'text-red-900';
                    }
                    
                    return (
                      <p className={`text-xs mt-2 font-medium ${color}`}>
                        Classificação: {classification}
                      </p>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* RN05-RN11: Sinais Vitais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <HeartIcon className="h-5 w-5 mr-2 text-gray-600" />
                Sinais Vitais (Opcional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* RN05: Pressão Arterial Sistólica */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pressão Arterial Sistólica
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000"
                      value={formData.systolicBP || ''}
                      onChange={(e) => handleSystolicBPChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-16 ${
                        systolicBPError || errors.systolicBP ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm">mmHg</span>
                    </div>
                  </div>
                  {(systolicBPError || errors.systolicBP) && (
                    <p className="text-red-600 text-sm mt-1">{systolicBPError || errors.systolicBP}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Intervalo: 70-250 mmHg
                  </p>
                </div>

                {/* RN06: Pressão Arterial Diastólica (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pressão Arterial Diastólica
                    <span className="text-xs text-gray-500 ml-1">• Apenas inteiros</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000"
                      maxLength={3}
                      value={formData.diastolicBP || ''}
                      onChange={(e) => handleDiastolicBPChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-16 transition-colors ${
                        diastolicBPError || errors.diastolicBP ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">mmHg</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(diastolicBPError || errors.diastolicBP) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{diastolicBPError || errors.diastolicBP}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 40-150 mmHg
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.diastolicBP !== undefined && !diastolicBPError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.diastolicBP} mmHg - Valor válido
                      </p>
                    )}
                  </div>
                </div>

                {/* RN07: Frequência Cardíaca (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência Cardíaca
                    <span className="text-xs text-gray-500 ml-1">• Apenas inteiros</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000"
                      maxLength={3}
                      value={formData.heartRate || ''}
                      onChange={(e) => handleHeartRateChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 transition-colors ${
                        heartRateError || errors.heartRate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">bpm</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(heartRateError || errors.heartRate) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{heartRateError || errors.heartRate}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 30-220 bpm
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.heartRate !== undefined && !heartRateError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.heartRate} bpm - Valor válido
                      </p>
                    )}
                  </div>
                </div>

                {/* RN08: Frequência Respiratória (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência Respiratória
                    <span className="text-xs text-gray-500 ml-1">• Apenas inteiros</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="00"
                      maxLength={2}
                      value={formData.respiratoryRate || ''}
                      onChange={(e) => handleRespiratoryRateChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 transition-colors ${
                        respiratoryRateError || errors.respiratoryRate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">rpm</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(respiratoryRateError || errors.respiratoryRate) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{respiratoryRateError || errors.respiratoryRate}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 8-80 rpm
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.respiratoryRate !== undefined && !respiratoryRateError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.respiratoryRate} rpm - Valor válido
                      </p>
                    )}
                  </div>
                </div>

                {/* RN09: Temperatura Corporal (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura Corporal
                    <span className="text-xs text-gray-500 ml-1">• Máx. 1 casa decimal</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 36,5"
                      maxLength={4}
                      value={formData.temperature !== undefined ? formData.temperature.toString().replace('.', ',') : ''}
                      onChange={(e) => handleTemperatureChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 transition-colors ${
                        temperatureError || errors.temperature ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">°C</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(temperatureError || errors.temperature) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{temperatureError || errors.temperature}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 32-42 °C
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Use vírgula para decimais (ex: 36,5)
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.temperature !== undefined && !temperatureError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.temperature} °C - Valor válido
                      </p>
                    )}
                  </div>
                </div>

                {/* RN10: Saturação de Oxigênio (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saturação de O₂ (SpO₂)
                    <span className="text-xs text-gray-500 ml-1">• Apenas inteiros</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000"
                      maxLength={3}
                      value={formData.oxygenSaturation || ''}
                      onChange={(e) => handleOxygenSaturationChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12 transition-colors ${
                        oxygenSaturationError || errors.oxygenSaturation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">%</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(oxygenSaturationError || errors.oxygenSaturation) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{oxygenSaturationError || errors.oxygenSaturation}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 70-100%
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                      Normal: 95-100% (todas as idades)
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.oxygenSaturation !== undefined && !oxygenSaturationError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.oxygenSaturation}% - Valor válido
                        {formData.oxygenSaturation >= 95 && (
                          <span className="ml-1 text-blue-600">(Normal)</span>
                        )}
                        {formData.oxygenSaturation < 95 && (
                          <span className="ml-1 text-orange-600">(Hipoxemia)</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* RN11: Glicemia Capilar (implementada) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Glicemia Capilar
                    <span className="text-xs text-gray-500 ml-1">• Apenas inteiros</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="000"
                      maxLength={3}
                      value={formData.capillaryGlycemia || ''}
                      onChange={(e) => handleCapillaryGlycemiaChange(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-20 transition-colors ${
                        capillaryGlycemiaError || errors.capillaryGlycemia ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      autoComplete="off"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-gray-500 text-sm font-medium">mg/dL</span>
                    </div>
                  </div>
                  
                  {/* Mensagens de erro */}
                  {(capillaryGlycemiaError || errors.capillaryGlycemia) && (
                    <div className="mt-1 flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{capillaryGlycemiaError || errors.capillaryGlycemia}</p>
                    </div>
                  )}
                  
                  {/* Informações de ajuda */}
                  <div className="mt-1 space-y-1">
                    <p className="text-xs text-gray-500 flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                      Intervalo válido: 20-600 mg/dL
                    </p>
                    
                    {/* Dica dinâmica baseada no valor */}
                    {formData.capillaryGlycemia !== undefined && !capillaryGlycemiaError && (
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {formData.capillaryGlycemia} mg/dL - Valor válido
                      </p>
                    )}
                  </div>
                  
                  {/* RN11: Momento da Coleta (obrigatório se glicemia preenchida) */}
                  {formData.capillaryGlycemia !== undefined && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Momento da Coleta
                        <span className="text-red-500 ml-1">*</span>
                        <span className="text-xs text-gray-500 ml-1">• Obrigatório</span>
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'nao-especificado', label: 'Momento da coleta não especificado' },
                          { value: 'jejum', label: 'Jejum' },
                          { value: 'pre-prandial', label: 'Pré-prandial' },
                          { value: 'pos-prandial', label: 'Pós-prandial' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              name="glycemiaMoment"
                              value={option.value}
                              checked={glycemiaMoment === option.value}
                              onChange={(e) => handleGlycemiaMomentChange(e.target.value)}
                              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      
                      {/* Erro do momento da coleta */}
                      {(glycemiaMomentError || errors.glycemiaMoment) && (
                        <div className="mt-1 flex items-start">
                          <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-red-600 text-sm">{glycemiaMomentError || errors.glycemiaMoment}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RN12: Seção de Procedimentos Realizados */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Procedimentos Realizados
              </h3>
              
              {/* Lista de procedimentos atuais */}
              {formData.procedures.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Procedimentos Registrados:</h4>
                  <div className="space-y-2">
                    {formData.procedures.map((procedure, index) => (
                      <div 
                        key={`${procedure.code}-${index}`}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          procedure.isAutomatic 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-gray-600 bg-white px-2 py-1 rounded">
                              {procedure.code}
                            </span>
                            {procedure.isAutomatic && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Automático
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 mt-1">{procedure.description}</p>
                          {procedure.isAutomatic && procedure.originData && (
                            <p className="text-xs text-blue-600 mt-1">
                              Gerado a partir de: {procedure.originData}
                            </p>
                          )}
                        </div>
                        
                        {/* Botão de remover (apenas para procedimentos manuais) */}
                        {!procedure.isAutomatic && (
                          <button
                            onClick={() => handleRemoveProcedure(procedure.code)}
                            className="ml-3 text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Remover procedimento"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Campo de busca para adicionar procedimentos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Adicionar Outros Procedimentos:</h4>
                  <button
                    onClick={() => setShowProcedureSearch(!showProcedureSearch)}
                    className="text-sm text-pink-600 hover:text-pink-800 transition-colors flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Buscar Procedimento SIGTAP
                  </button>
                </div>
                
                {showProcedureSearch && (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="relative mb-3">
                      <input
                        type="text"
                        placeholder="Digite o código SIGTAP ou descrição do procedimento..."
                        value={procedureSearchTerm}
                        onChange={(e) => handleProcedureSearch(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10"
                      />
                      <svg className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    
                    {/* Resultados da busca */}
                    {searchResults.length > 0 && (
                      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                        {searchResults.map((procedure) => (
                          <button
                            key={procedure.code}
                            onClick={() => handleAddManualProcedure(procedure)}
                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {procedure.code}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{procedure.description}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Mensagem quando não há resultados */}
                    {procedureSearchTerm.length >= 2 && searchResults.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-3">
                        Nenhum procedimento encontrado para "{procedureSearchTerm}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RN13: Classificação de Risco (obrigatório para demanda espontânea) */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Classificação de Risco
                {patient?.serviceType === 'spontaneous' && <span className="text-red-500 ml-2">*</span>}
                {patient?.serviceType !== 'spontaneous' && <span className="text-gray-500 ml-2 text-sm">(Opcional para este tipo de atendimento)</span>}
              </h3>
                
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>⚕️ Classificação de Risco:</strong> Selecione a classificação conforme avaliação clínica dos sinais e sintomas apresentados. Esta classificação determinará a prioridade do atendimento na fila.
                  </p>
                </div>
                
                <div className="space-y-3">
                  {riskClassifications.map((classification) => (
                    <label 
                      key={classification.code}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.riskClassification === classification.code
                          ? classification.color === 'red' 
                            ? 'border-red-500 bg-red-50'
                            : classification.color === 'yellow'
                            ? 'border-yellow-500 bg-yellow-50'
                            : classification.color === 'green'
                            ? 'border-green-500 bg-green-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="riskClassification"
                        value={classification.code}
                        checked={formData.riskClassification === classification.code}
                        onChange={(e) => handleRiskClassificationChange(e.target.value)}
                        className={`mt-1 h-4 w-4 border-gray-300 ${
                          classification.color === 'red' ? 'text-red-600 focus:ring-red-500' :
                          classification.color === 'yellow' ? 'text-yellow-600 focus:ring-yellow-500' :
                          classification.color === 'green' ? 'text-green-600 focus:ring-green-500' :
                          'text-blue-600 focus:ring-blue-500'
                        }`}
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className={`inline-block w-6 h-6 rounded-full mr-3 ${
                                classification.color === 'red' ? 'bg-red-500' :
                                classification.color === 'yellow' ? 'bg-yellow-500' :
                                classification.color === 'green' ? 'bg-green-500' :
                                'bg-blue-500'
                              }`}
                            ></div>
                            <span className="font-bold text-gray-900 text-lg">
                              {classification.name}
                            </span>
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            classification.priority === 1 ? 'bg-red-100 text-red-700' :
                            classification.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                            classification.priority === 3 ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            Prioridade {classification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>{classification.description.split(' — ')[0]}</strong> — {classification.description.split(' — ')[1]}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {/* Mensagens de erro */}
                {(riskClassificationError || errors.riskClassification) && (
                  <div className="mt-4 flex items-start">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-sm">{riskClassificationError || errors.riskClassification}</p>
                  </div>
                )}
                
                {/* Informação sobre impacto na fila */}
                {formData.riskClassification && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm text-blue-800 font-medium mb-1">
                          📋 <strong>Impacto na Fila de Atendimento</strong>
                        </p>
                        <p className="text-sm text-blue-700">
                          O cidadão será <strong>reposicionado automaticamente</strong> na fila conforme a prioridade {riskClassifications.find(c => c.code === formData.riskClassification)?.priority} da classificação <strong>{riskClassifications.find(c => c.code === formData.riskClassification)?.name}</strong>.
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          ⏱️ Esta classificação é baseada na urgência clínica e determina o tempo máximo para início do atendimento.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            {/* RN14: Desfecho da Escuta Inicial */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                Desfecho da Escuta Inicial
                <span className="text-sm font-normal text-red-500 ml-2">*</span>
              </h3>
              
              {/* Opções de desfecho */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecione o desfecho para este atendimento
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {outcomeOptions.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      onClick={() => handleOutcomeChange(option.code)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.outcome === option.code
                          ? option.code === 'release'
                            ? 'bg-green-50 border-green-500 text-green-700'
                            : option.code === 'queue'
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : option.code === 'vaccination'
                            ? 'bg-purple-50 border-purple-500 text-purple-700'
                            : 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {outcomeError && (
                  <p className="text-red-600 text-sm mt-2">{outcomeError}</p>
                )}
                {errors.outcome && (
                  <p className="text-red-600 text-sm mt-2">{errors.outcome}</p>
                )}
              </div>

              {/* Detalhes do desfecho (opcional) */}
              {formData.outcome && (
                <div>
                  <label htmlFor="outcomeDetails" className="block text-sm font-medium text-gray-700 mb-2">
                    Observações sobre o Desfecho
                    <span className="text-gray-500 text-xs ml-1">
                      ({outcomeDetailsCharCount}/{MAX_OUTCOME_DETAILS_LENGTH}) - Opcional
                    </span>
                  </label>
                  <div className={`p-3 rounded-lg text-sm mb-3 ${
                    formData.outcome === 'release' ? 'bg-green-50 text-green-700 border border-green-200' :
                    formData.outcome === 'queue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    formData.outcome === 'vaccination' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                    'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>
                    <strong>Impacto:</strong> {getOutcomeImpactDescription(formData.outcome)}
                  </div>
                  <textarea
                    id="outcomeDetails"
                    rows={3}
                    value={formData.outcomeDetails || ''}
                    onChange={(e) => handleOutcomeDetailsChange(e.target.value)}
                    placeholder={
                      formData.outcome === 'release' ? 'Ex: Orientações gerais fornecidas, retornar se necessário...' :
                      formData.outcome === 'queue' ? 'Ex: Prioridade justificada pelos sinais vitais alterados...' :
                      formData.outcome === 'vaccination' ? 'Ex: Vacina solicitada, verificar cartão de vacinação...' :
                      'Ex: Agendamento preferível com especialista...'
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none ${
                      errors.outcomeDetails ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.outcomeDetails && (
                    <p className="text-red-600 text-sm mt-1">{errors.outcomeDetails}</p>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className={`${
          theme === 'hybrid' ? 'healthcare-modal-footer' : 'bg-gray-50'
        } px-6 py-4 border-t flex items-center justify-between`}>
          <div className="flex items-center space-x-4">
            {/* RN15: Botão Cancelar Atendimento */}
            {onCancel && (
              <button
                onClick={handleCancelRequest}
                disabled={loading}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors border border-red-300 disabled:opacity-50 text-sm font-medium"
                title="Cancelar e descartar a escuta inicial em andamento"
              >
                Cancelar Atendimento
              </button>
            )}
            
            {errors.general && (
              <p className="text-red-600 text-sm">{errors.general}</p>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'hybrid' 
                  ? 'healthcare-btn' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } disabled:opacity-50`}
            >
              Fechar
            </button>
            
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                theme === 'hybrid' 
                  ? 'healthcare-btn-primary' 
                  : 'bg-pink-600 text-white hover:bg-pink-700'
              } disabled:opacity-50`}
            >
              {loading ? 'Salvando...' : 'Finalizar Escuta Inicial'}
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default InitialListeningModal;