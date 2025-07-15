// Tipos base para formatação de texto
export interface TextFormatting {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  quote: boolean;
}

// Tipos para paciente
export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
}

// Tipos para DUM (Data da Última Menstruação)
export interface DUMData {
  currentDUM: Date | null;
  previousDUM?: Date | null;
  daysDifference?: number;
  registrationDate?: Date;
}

// Tipos para Antropometria
export interface AnthropometryData {
  peso?: number;
  altura?: number;
  imc?: number;
  perimetroCefalico?: number;
  circunferenciaAbdominal?: number;
  perimetroPanturrilha?: number;
  pressaoArterial?: string;
  frequenciaRespiratoria?: number;
  frequenciaCardiaca?: number;
  temperatura?: number;
  saturacaoO2?: number;
  glicemiaCapilar?: number;
}

// Tipos para Marcadores de Consumo Alimentar
export type FaixaEtaria = 'menor6meses' | '6a23meses' | '2anosOuMais';

export interface FoodMarkersData {
  faixaEtaria: FaixaEtaria;
  respostas: Record<string, any>;
  todasRespondidas: boolean;
}

// Tipos para Resultados de Exames
export interface ExamResult {
  id: string;
  codigo: string;
  procedimento: string;
  resultado: string;
  observacoes?: string;
  dataRealizacao?: string;
  laboratorio?: string;
  tipo: 'laboratorial' | 'imagem' | 'outros';
}

// Tipos para Problemas e Condições
export interface ProblemData {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'CIAP2' | 'CID10';
  situacao: 'Ativo' | 'Latente' | 'Resolvido';
  inicio?: {
    tipo: 'data' | 'idade';
    data?: Date;
    idade?: { anos: number; meses: number; };
  };
  observacoes?: string;
  incluirNaLista: boolean;
}

export interface ExistingProblem {
  id: string;
  descricao: string;
  codigo: string;
  tipo: 'CIAP2' | 'CID10';
  status: 'Ativo' | 'Latente';
  dataRegistro: Date;
}

// Tipos para Alergias e Reações Adversas
export interface AllergyData {
  id: string;
  categoriaAgente: 'Alimento' | 'Ambiente' | 'Biológico' | 'Medicamento';
  agenteEspecifico: {
    codigo?: string;
    nome: string;
    detalhes?: string;
  };
  tipoReacao?: 'Alergia' | 'Intolerância';
  criticidade?: 'Alta' | 'Baixa';
  grauCerteza?: 'Confirmado' | 'Refutado' | 'Resolvido' | 'Suspeito';
  manifestacoes: string[];
  inicio?: {
    tipo: 'data' | 'idade';
    data?: Date;
    idade?: { anos: number; meses: number; };
  };
  observacoes?: string;
}

export interface ExistingAllergy {
  id: string;
  substancia: string;
  tipo: string;
  criticidade: string;
  dataRegistro: Date;
}

export interface Manifestation {
  nome: string;
  sinonimos: string[];
}

// Tipos para classificações médicas
export interface ClassificationData {
  codigo: string;
  descricao: string;
  categoria?: string;
}

export interface AllergenData {
  codigo?: string;
  nome: string;
  categoria: string;
  sinonimos?: string[];
}

// Tipos principais do SOAP
export interface SubjectiveData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
}

export interface ObjectiveData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
  dum?: DUMData;
  anthropometry: AnthropometryData;
  foodMarkers: FoodMarkersData;
  vaccination: 'SIM' | 'Não' | null;
  examResults: ExamResult[];
}

export interface AssessmentData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
  problems: ProblemData[];
  allergies: AllergyData[];
}

export interface PlanData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
}

export interface SOAPData {
  subjective: SubjectiveData;
  objective: ObjectiveData;
  assessment: AssessmentData;
  plan: PlanData;
}

// Props para componentes
export interface SOAPProps {
  patient: Patient;
  onSave: (data: SOAPData) => void;
  initialData?: SOAPData;
}

export interface SubjectiveSectionProps {
  data: SubjectiveData;
  onChange: (data: SubjectiveData) => void;
}

export interface ObjectiveSectionProps {
  data: ObjectiveData;
  patient: Patient;
  onChange: (data: ObjectiveData) => void;
}

export interface AssessmentSectionProps {
  data: AssessmentData;
  patient: Patient;
  onChange: (data: AssessmentData) => void;
}

export interface PlanSectionProps {
  data: PlanData;
  onChange: (data: PlanData) => void;
}

// Tipos para integrações com APIs
export interface SIGTAPIntegration {
  endpoint: string;
  busca: {
    porNome: string;
    porCodigo: string;
  };
  response: {
    codigo: string;
    nome: string;
    categoria: string;
    valorNumericoObrigatorio: boolean;
  };
}

export interface IntegracoesBases {
  ciap2: {
    endpoint: string;
    search: string[];
    autocomplete: boolean;
  };
  cid10: {
    endpoint: string;
    search: string[];
    autocomplete: boolean;
  };
  cbara: {
    endpoint: string;
    categories: string[];
    search: string[];
  };
  obm: {
    endpoint: string;
    category: string;
    fields: string[];
  };
  imunobiologicos: {
    endpoint: string;
    category: string;
    search: string[];
  };
}

// Tipos para validações
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FieldValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

// Tipos para estados do componente
export interface ComponentState {
  activeSection: 'subjective' | 'objective' | 'assessment' | 'plan';
  expandedSections: Record<string, boolean>;
  isLoading: boolean;
  hasChanges: boolean;
  validationErrors: Record<string, string[]>;
}

// Tipos para hooks
export interface UseSOAPState {
  data: SOAPData;
  updateSection: (section: keyof SOAPData, data: any) => void;
  resetData: () => void;
  validateData: () => ValidationResult;
  saveData: () => Promise<boolean>;
  isLoading: boolean;
  hasChanges: boolean;
}

// Tipos para configurações
export interface SOAPConfig {
  maxTextLength: number;
  autoSaveInterval: number;
  enableValidation: boolean;
  enableAutoComplete: boolean;
  integrations: IntegracoesBases;
}

export default SOAPData;
