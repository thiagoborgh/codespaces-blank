# Análise Detalhada - SOAP Bloco Objetivo

## Visão Geral
Análise completa dos requisitos funcionais e regras de negócio para implementação do **Bloco Objetivo** do Prontuário SOAP, conforme especificação recebida em 13/06/2025.

## Estrutura do Bloco Objetivo

### 1. Campo de Texto Livre (#02)
**Funcionalidade:** Editor de texto rico para descrição clínica livre

**Características:**
- Limite: 4.000 caracteres
- Formatação disponível:
  - **B** - Negrito
  - **I** - Itálico  
  - **U** - Sublinhado
  - **S** - Tachado
  - **"** - Citação
  - **⤺** - Desfazer
  - **↷** - Refazer

**Implementação:**
```typescript
interface ObjectiveTextFormat {
  content: string; // máx 4000 chars
  formatting: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    quote: boolean;
  };
}
```

### 2. Data da Última Menstruação (DUM) (#03)
**Regras de Exibição:**
- Apenas para pacientes sexo feminino ≥ 10 anos
- Tooltip: "Preencher mesmo se a cidadã estiver com dúvidas"
- Histórico: Exibir DUM anterior + diferença em dias

**Lógica de Cálculo:**
```typescript
interface DUMData {
  currentDUM: Date;
  previousDUM?: Date;
  daysDifference?: number;
  registrationDate?: Date;
}

// Regra de exibição
const shouldShowDUM = (patient: Patient): boolean => {
  return patient.gender === 'female' && 
         calculateAge(patient.birthDate) >= 10;
};
```

### 3. Antropometria, Sinais Vitais e Glicemia (#04)
**Componente Expansível** com campos opcionais:

#### 3.1 Campos Reutilizados (Sprint 1 - Escuta Inicial)
- Peso (kg) - RN03
- Altura (cm) - RN04  
- IMC - RN03 (calculado)
- Pressão arterial (mmHg) - RN05/RN06
- Frequência respiratória (mpm) - RN08
- Frequência cardíaca (bpm) - RN07
- Temperatura (ºC) - RN09
- Saturação O2 (%) - RN10
- Glicemia capilar (mg/dL) - RN11

#### 3.2 Novos Campos com Máscaras Específicas

**Perímetro Cefálico:**
```typescript
interface PerimetroCefalicoField {
  mask: "000,0 cm";
  min: 10;
  max: 200;
  decimals: 1;
  errorMessage: "Deve ter valor entre 10 e 200";
}

// Variações aceitas:
// "20,5" → 20,5 cm
// "00020" → 20 cm  
// "100," → 100 cm
// "00180" → 180 cm
```

**Circunferência Abdominal:**
```typescript
interface CircunferenciaAbdominalField {
  mask: "000,0 cm";
  decimals: 1;
  alertaRiscoCardiovascular: {
    enabled: true;
    baseadoEmSexoBiologico: true;
    tabelaOMS: true;
  };
}
```

**Perímetro da Panturrilha:**
```typescript
interface PerimetroPanturrilhaField {
  mask: "000,0 cm";
  min: 10;
  max: 99;
  decimals: 1;
  errorMessage: "Deve ter valor entre 10 e 99";
}
```

### 4. Marcadores de Consumo Alimentar (#05)
**Componente Expansível** baseado na idade do paciente

#### 4.1 Estrutura por Faixa Etária
```typescript
type FaixaEtaria = 'menor6meses' | '6a23meses' | '2anosOuMais';

interface MarcadoresConsumo {
  faixaEtaria: FaixaEtaria;
  mensagemInformativa: string;
  todasPerguntasObrigatorias: boolean;
  botaoLimparCampos: {
    inativo: boolean; // default true
    ativaQuandoPreenchido: boolean;
  };
}
```

#### 4.2 Perguntas por Faixa Etária

**Menores de 6 meses:**
```typescript
interface Menor6Meses {
  opcoes: 'Sim' | 'Não' | 'Não sabe';
  perguntas: [
    'A criança ontem tomou leite do peito?',
    'Ontem a criança consumiu: Mingau',
    'Ontem a criança consumiu: Água/Chá',
    'Ontem a criança consumiu: Leite de vaca',
    'Ontem a criança consumiu: Fórmula infantil',
    'Ontem a criança consumiu: Suco de fruta',
    'Ontem a criança consumiu: Fruta',
    'Ontem a criança consumiu: Comida de sal',
    'Ontem a criança consumiu: Outros alimentos/bebidas'
  ];
}
```

**6 a 23 meses:**
```typescript
interface Entre6e23Meses {
  opcoesPrincipais: 'Sim' | 'Não' | 'Não sabe';
  opcoesCondicionais: '1 vez' | '2 vezes' | '3 vezes' | 'Não sabe';
  
  perguntasCondicionais: {
    'Ontem a criança comeu fruta inteira?': {
      condicional: 'Se sim quantas vezes?';
    };
    'Ontem a criança comeu comida de sal?': {
      condicional1: 'Se sim quantas vezes?';
      condicional2: 'Se sim, essa comida foi oferecida:';
      opcoes2: ['Em pedaço', 'Amassada', 'Passada na peneira', 
               'Liquidificada', 'Só o caldo', 'Não sabe'];
    };
  };
}
```

**≥ 2 anos:**
```typescript
interface Maior2Anos {
  opcoes: 'Sim' | 'Não' | 'Não sabe';
  perguntaMultipla: {
    pergunta: 'Quais refeições você faz ao longo do dia?';
    opcoes: ['Café da manhã', 'Lanche da manhã', 'Almoço', 
             'Lanche da tarde', 'Jantar', 'Ceia'];
    multiplaSelecao: true;
  };
}
```

### 5. Vacinação em Dia (#06)
```typescript
interface VacinacaoField {
  opcoes: 'SIM' | 'Não';
  simboloLimpar: 'X'; // permite limpar seleção
  obrigatorio: false;
}
```

### 6. Resultados de Exames (#07)
**Modal "Adicionar resultados de exames"**

#### 6.1 Busca de Exames
```typescript
interface BuscaExames {
  placeholder: "Adicionar exame sem solicitação";
  tiposBusca: ['nome', 'codigoSIGTAP'];
  resultadoSelecao: ExameDetalhado;
}

interface ExameDetalhado {
  codigo?: string;
  nome: string;
  dataRealizacao?: Date; // DD/MM/AAAA (opcional)
  dataResultado?: Date;  // DD/MM/AAAA (opcional)
  resultado: string;     // 2000 chars (obrigatório)
  realizadoEm: Date;     // DD/MM/AAAA (obrigatório)
}
```

#### 6.2 Exames com Valores Numéricos Obrigatórios
```typescript
interface ExamesNumericos {
  codigosSIGTAP: {
    '0202010295': 'Dosagem de Colesterol Total';
    '0202010279': 'Dosagem de Colesterol HDL';
    '0202010287': 'Dosagem de Colesterol LDL';
    '0202010678': 'Dosagem de Triglicerídeos';
    '0202010317': 'Dosagem de Creatinina';
    '0202050025': 'Clearance de Creatinina';
  };
  
  valorNumerico: {
    obrigatorio: true;
    tipo: 'inteiro';
    min: 1;
    max: 10000;
    errorMessage: "Deve ter valor entre 1 e 10000";
  };
  
  descricaoHabilitada: {
    aposPreenchimentoValor: true;
    maxChars: 2000;
  };
}
```

#### 6.3 Ações do Modal
```typescript
interface AcoesModalExames {
  iconeExcluir: {
    simbolo: '🗑️';
    confirmacao: {
      titulo: "Deseja excluir este exame?";
      mensagem: "Os dados deste exame não serão salvos.";
      acoes: ['Cancelar', 'Fechar(X)', 'Excluir'];
    };
  };
  
  botaoSalvar: {
    acao: 'salvarExamesAdicionados';
    retorno: 'modalAdicionarExames';
  };
  
  botaoCancelar: {
    confirmacao: {
      titulo: "Deseja sair sem salvar?";
      mensagem: "As alterações realizadas serão perdidas";
      opcoes: ['Sim, sair da tela', 'Não, continuar aqui'];
    };
  };
}
```

### 7. Lista de Resultados Incluídos (#08)
```typescript
interface ListaExamesIncluidos {
  ordenacao: 'alfabetica';
  tag: 'registrado agora';
  
  expandivel: {
    campos: {
      nomeExame: string;
      dataRealizacao: string; // DD/MM/AAAA
      dataResultado: string | '-'; // DD/MM/AAAA ou "-"
      dataSolicitacao: string | '-'; // DD/MM/AAAA ou "-"
      resultadoMgDl?: number; // para exames numéricos
      resultado: string;
      descricao?: string; // para exames numéricos
    };
  };
}
```

### 8. Histórico de Resultados (#09)
**Modal "Histórico de resultados de exames"**

```typescript
interface HistoricoExames {
  habilitacao: {
    condicao: 'primeiroRegistroExameAnterior';
    estado: 'desabilitado' | 'habilitado';
  };
  
  busca: {
    placeholder: "Pesquise por exame ou código";
  };
  
  ordenacao: {
    tipo: 'ultimoResultadoNoTopo';
    campos: ['nomeExame', 'codigoSIGTAP'];
  };
  
  exibicaoDatas: {
    realizadoEm: string; // conforme registro
    ultimaAvaliacaoEm: string; // data inserção sistema
  };
  
  detalhesExame: {
    realizadoEm: string; // DD/MM/AAAA
    resultadoEm: string | '-';
    resultadoMgDl?: number;
    resultado: string;
    descricao?: string;
    avaliadoPor: {
      formato: 'Nome + Especialidade + Data';
    };
  };
  
  totalizacao: {
    totalExamesExibidos: number;
    totalRegistrosPorExame: number;
  };
}
```

### 9. Campos de Habilitação Condicional (#01)
```typescript
interface CamposHabilitacao {
  puericultura: {
    condicao: 'idade >= 0 && idade <= 18 anos 11 meses 29 dias';
    visivel: boolean;
  };
  
  idoso: {
    condicao: 'idade >= 60 anos';
    visivel: boolean;
  };
  
  preNatal: {
    condicao: 'sexo === "feminino" && problemaAvaliado.includes("gravidez")';
    visivel: boolean;
  };
}
```

## Validações e Regras de Negócio

### Validações de Idade
```typescript
const getIdadeEmAnos = (birthDate: Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let idade = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    idade--;
  }
  
  return idade;
};

const getIdadeDetalhada = (birthDate: Date) => {
  // Para puericultura: calcular anos, meses e dias exatos
  const today = new Date();
  const birth = new Date(birthDate);
  
  let anos = today.getFullYear() - birth.getFullYear();
  let meses = today.getMonth() - birth.getMonth();
  let dias = today.getDate() - birth.getDate();
  
  if (dias < 0) {
    meses--;
    dias += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  
  if (meses < 0) {
    anos--;
    meses += 12;
  }
  
  return { anos, meses, dias };
};
```

### Validações de Entrada Numérica
```typescript
const createNumericMask = (format: string, min: number, max: number, decimals: number) => {
  return {
    mask: format,
    min,
    max,
    decimals,
    validate: (value: string): boolean => {
      const numericValue = parseFloat(value.replace(',', '.'));
      return numericValue >= min && numericValue <= max;
    },
    format: (input: string): string => {
      // Implementar lógica de formatação conforme exemplos
      // "20,5" → "20,5 cm"
      // "00020" → "20 cm"
      // "100," → "100 cm"
    }
  };
};
```

## Integrações Necessárias

### 1. Integração SIGTAP
```typescript
interface SIGTAPIntegration {
  endpoint: '/api/sigtap/exames';
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
```

### 2. Integração OMS (Risco Cardiovascular)
```typescript
interface OMSRiscoCardiovascular {
  tabela: {
    masculino: {
      baixo: number;
      elevado: number;
      muitoElevado: number;
    };
    feminino: {
      baixo: number;
      elevado: number;
      muitoElevado: number;
    };
  };
  
  calcularRisco: (circunferencia: number, sexo: 'M' | 'F') => 'baixo' | 'elevado' | 'muito_elevado';
}
```

## Componentes React Necessários

### 1. ObjectiveBlock.tsx
```typescript
interface ObjectiveBlockProps {
  patient: Patient;
  onSave: (data: ObjectiveData) => void;
  initialData?: ObjectiveData;
}

const ObjectiveBlock: React.FC<ObjectiveBlockProps> = ({ patient, onSave, initialData }) => {
  // Componente principal do bloco Objetivo
};
```

### 2. RichTextEditor.tsx
```typescript
interface RichTextEditorProps {
  maxLength: number;
  value: string;
  onChange: (value: string, formatting: TextFormatting) => void;
}
```

### 3. AnthropometrySection.tsx
```typescript
interface AnthropometrySectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  values: AnthropometryData;
  onChange: (field: string, value: any) => void;
}
```

### 4. FoodMarkersSection.tsx
```typescript
interface FoodMarkersSectionProps {
  patientAge: number;
  isExpanded: boolean;
  onToggle: () => void;
  values: FoodMarkersData;
  onChange: (data: FoodMarkersData) => void;
}
```

### 5. ExamResultsModal.tsx
```typescript
interface ExamResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exams: ExamResult[]) => void;
  existingExams?: ExamResult[];
}
```

### 6. ExamHistoryModal.tsx
```typescript
interface ExamHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  hasExamHistory: boolean;
}
```

## Estados e Tipos TypeScript

### Tipos Principais
```typescript
interface ObjectiveData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
  dum?: DUMData;
  anthropometry: AnthropometryData;
  foodMarkers: FoodMarkersData;
  vaccination: 'SIM' | 'Não' | null;
  examResults: ExamResult[];
  conditionalFields: {
    puericultura: boolean;
    idoso: boolean;
    preNatal: boolean;
  };
}

interface AnthropometryData {
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

interface FoodMarkersData {
  faixaEtaria: FaixaEtaria;
  respostas: Record<string, any>;
  todasRespondidas: boolean;
}

interface ExamResult {
  id?: number;
  codigo?: string;
  nome: string;
  dataRealizacao?: Date;
  dataResultado?: Date;
  resultado: string;
  realizadoEm: Date;
  valorNumerico?: number;
  descricao?: string;
  registradoAgora: boolean;
}
```

## Próximos Passos

### Fase 1: Estrutura Base
1. ✅ Análise completa dos requisitos
2. 🔄 Criar componentes base
3. 🔄 Implementar validações de entrada
4. 🔄 Configurar máscaras numéricas

### Fase 2: Lógica Condicional
1. 🔄 Implementar exibição condicional por idade/sexo
2. 🔄 Lógica de marcadores alimentares por faixa etária
3. 🔄 Cálculos automáticos (DUM, IMC)

### Fase 3: Integrações
1. 🔄 Integração SIGTAP para busca de exames
2. 🔄 Integração OMS para risco cardiovascular
3. 🔄 Sistema de histórico de exames

### Fase 4: Interface e UX
1. 🔄 Modais de exames e histórico
2. 🔄 Editor de texto rico
3. 🔄 Responsividade e acessibilidade

### Fase 5: Testes e Validação
1. 🔄 Testes unitários
2. 🔄 Testes de integração
3. 🔄 Validação com usuários

## Considerações Técnicas

### Performance
- Lazy loading para modais
- Debounce em buscas SIGTAP
- Memoização de cálculos complexos

### Acessibilidade
- Labels apropriados para campos
- Navegação por teclado
- Leitores de tela

### Segurança
- Validação server-side
- Sanitização de entradas
- Controle de acesso por perfil

---

**Status:** Documentação completa ✅  
**Próximo:** Início da implementação dos componentes  
**Estimativa:** 3-4 sprints para implementação completa

## Botões de Atendimento na Fila de Espera

### 1. Botão "Realizar Atendimento" (#08)
**Funcionalidade:** Iniciar ou continuar atendimento clínico completo

```typescript
interface BotaoRealizarAtendimento {
  permissao: 'todos_os_perfis';
  acao: 'direcionarFolhaRosto';
  destino: '/atendimento/folha-rosto';
  
  tooltips: {
    atendimentoFinalizado: "atendimento realizado";
    atendimentoEmAndamento: "continuar atendimento";
  };
  
  estados: {
    naoIniciado: {
      texto: 'Atender';
      acao: 'iniciarAtendimento';
      tooltip: 'Iniciar atendimento';
    };
    emAndamento: {
      texto: 'Continuar';
      acao: 'continuarAtendimento';
      tooltip: 'continuar atendimento';
    };
    finalizado: {
      texto: 'Visualizar';
      acao: 'visualizarAtendimento';
      tooltip: 'atendimento realizado';
    };
  };
}
```

### 2. Botão "Realizar Vacinação" (#09)
**Funcionalidade:** Atendimento específico para vacinação

```typescript
interface BotaoRealizarVacinacao {
  acao: 'direcionarVacinacao';
  destino: '/atendimento/vacinacao';
  
  tooltips: {
    vacinacaoFinalizada: "atendimento de vacinação realizado";
    vacinacaoEmAndamento: {
      mesmoProfissional: "continuar vacinação";
      outroProfissional: "cidadão está em atendimento de vacinação";
    };
  };
  
  estados: {
    naoIniciado: {
      texto: 'Vacinar';
      acao: 'iniciarVacinacao';
      tooltip: 'Aplicar vacina';
    };
    emAndamentoMesmoProfissional: {
      texto: 'Continuar';
      acao: 'continuarVacinacao';
      tooltip: 'continuar vacinação';
    };
    emAndamentoOutroProfissional: {
      texto: 'Em Vacinação';
      acao: 'disabled';
      tooltip: 'cidadão está em atendimento de vacinação';
      disabled: true;
    };
    finalizado: {
      texto: 'Visualizar';
      acao: 'visualizarVacinacao';
      tooltip: 'atendimento de vacinação realizado';
    };
  };
}
```

### 3. Lógica de Determinação do Estado dos Botões
```typescript
interface EstadoAtendimento {
  tipo: 'consulta' | 'vacinacao';
  status: 'nao_iniciado' | 'em_andamento' | 'finalizado';
  profissionalResponsavel?: string;
  profissionalLogado: string;
}

const determinarEstadoBotaoAtendimento = (
  atendimento: EstadoAtendimento,
  profissionalLogado: string
): string => {
  if (!atendimento || atendimento.status === 'nao_iniciado') {
    return 'naoIniciado';
  }
  
  if (atendimento.status === 'finalizado') {
    return 'finalizado';
  }
  
  if (atendimento.status === 'em_andamento') {
    return 'emAndamento';
  }
  
  return 'naoIniciado';
};

const determinarEstadoBotaoVacinacao = (
  vacinacao: EstadoAtendimento,
  profissionalLogado: string
): string => {
  if (!vacinacao || vacinacao.status === 'nao_iniciado') {
    return 'naoIniciado';
  }
  
  if (vacinacao.status === 'finalizado') {
    return 'finalizado';
  }
  
  if (vacinacao.status === 'em_andamento') {
    if (vacinacao.profissionalResponsavel === profissionalLogado) {
      return 'emAndamentoMesmoProfissional';
    } else {
      return 'emAndamentoOutroProfissional';
    }
  }
  
  return 'naoIniciado';
};
```

### 4. Implementação dos Botões na Fila de Espera
```typescript
interface BotoesAtendimentoProps {
  patient: QueuePatient;
  currentUser: User;
  onAtendimento: (patientId: number) => void;
  onVacinacao: (patientId: number) => void;
}

const BotoesAtendimento: React.FC<BotoesAtendimentoProps> = ({
  patient,
  currentUser,
  onAtendimento,
  onVacinacao
}) => {
  // Determinar estados dos atendimentos
  const estadoAtendimento = determinarEstadoBotaoAtendimento(
    patient.atendimento,
    currentUser.id
  );
  
  const estadoVacinacao = determinarEstadoBotaoVacinacao(
    patient.vacinacao,
    currentUser.id
  );
  
  // Configurações do botão de atendimento
  const configAtendimento = BotaoRealizarAtendimento.estados[estadoAtendimento];
  
  // Configurações do botão de vacinação
  const configVacinacao = BotaoRealizarVacinacao.estados[estadoVacinacao];
  
  return (
    <div className="flex gap-2">
      {/* Botão Realizar Atendimento */}
      <button
        onClick={() => onAtendimento(patient.id)}
        disabled={false} // Sempre habilitado
        className={getButtonClass(estadoAtendimento)}
        title={configAtendimento.tooltip}
      >
        <CheckIcon className="h-4 w-4 mr-2" />
        {configAtendimento.texto}
      </button>
      
      {/* Botão Realizar Vacinação */}
      <button
        onClick={() => onVacinacao(patient.id)}
        disabled={configVacinacao.disabled || false}
        className={getButtonClass(estadoVacinacao, configVacinacao.disabled)}
        title={configVacinacao.tooltip}
      >
        <BeakerIcon className="h-4 w-4 mr-2" />
        {configVacinacao.texto}
      </button>
    </div>
  );
};

const getButtonClass = (estado: string, disabled: boolean = false): string => {
  if (disabled) {
    return 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed px-3 py-2 rounded-lg text-sm font-medium';
  }
  
  switch (estado) {
    case 'naoIniciado':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg text-sm font-medium transition-all';
    case 'emAndamento':
    case 'emAndamentoMesmoProfissional':
      return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-2 rounded-lg text-sm font-medium transition-all';
    case 'emAndamentoOutroProfissional':
      return 'bg-red-50 text-red-700 border border-red-200 cursor-not-allowed px-3 py-2 rounded-lg text-sm font-medium';
    case 'finalizado':
      return 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 px-3 py-2 rounded-lg text-sm font-medium transition-all';
    default:
      return 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium transition-all';
  }
};
```

### 5. Navegação para Páginas de Atendimento
```typescript
interface NavegacaoAtendimento {
  handleRealizarAtendimento: (patientId: number) => void;
  handleRealizarVacinacao: (patientId: number) => void;
}

const useNavegacaoAtendimento = (): NavegacaoAtendimento => {
  const navigate = useNavigate();
  
  const handleRealizarAtendimento = (patientId: number) => {
    // Redirecionar para Folha de Rosto
    navigate(`/atendimento/folha-rosto/${patientId}`);
  };
  
  const handleRealizarVacinacao = (patientId: number) => {
    // Redirecionar para Atendimento de Vacinação
    navigate(`/atendimento/vacinacao/${patientId}`);
  };
  
  return {
    handleRealizarAtendimento,
    handleRealizarVacinacao
  };
};
```

### 6. Integração com QueuePage.tsx
```typescript
// Adicionar ao QueuePage.tsx
const { handleRealizarAtendimento, handleRealizarVacinacao } = useNavegacaoAtendimento();

// Função para determinar qual botão exibir baseado no tipo de serviço
const getBotoesAtendimento = (patient: QueuePatient) => {
  // Se é serviço de vacinação, mostrar apenas botão de vacina
  if (isVaccineService(patient.serviceType)) {
    return (
      <BotoesAtendimento
        patient={patient}
        currentUser={user}
        onAtendimento={handleRealizarAtendimento}
        onVacinacao={handleRealizarVacinacao}
        mostrarApenas="vacinacao"
      />
    );
  }
  
  // Para outros serviços, mostrar ambos os botões
  return (
    <BotoesAtendimento
      patient={patient}
      currentUser={user}
      onAtendimento={handleRealizarAtendimento}
      onVacinacao={handleRealizarVacinacao}
      mostrarApenas="ambos"
    />
  );
};
```

### 7. Estados dos Pacientes para Controle dos Botões
```typescript
interface QueuePatientExtended extends QueuePatient {
  atendimento?: {
    status: 'nao_iniciado' | 'em_andamento' | 'finalizado';
    profissionalResponsavel?: string;
    dataInicio?: Date;
    dataFim?: Date;
    tipo: 'consulta';
  };
  
  vacinacao?: {
    status: 'nao_iniciado' | 'em_andamento' | 'finalizado';
    profissionalResponsavel?: string;
    dataInicio?: Date;
    dataFim?: Date;
    tipo: 'vacinacao';
  };
}
```

### 8. Hooks para Gerenciamento de Estado
```typescript
const useAtendimentoStatus = (patientId: number) => {
  const [atendimentoStatus, setAtendimentoStatus] = useState<EstadoAtendimento | null>(null);
  const [vacinacaoStatus, setVacinacaoStatus] = useState<EstadoAtendimento | null>(null);
  
  const fetchAtendimentoStatus = async () => {
    // Buscar status do atendimento na API
    try {
      const response = await api.get(`/patients/${patientId}/atendimento-status`);
      setAtendimentoStatus(response.data.atendimento);
      setVacinacaoStatus(response.data.vacinacao);
    } catch (error) {
      console.error('Erro ao buscar status do atendimento:', error);
    }
  };
  
  const iniciarAtendimento = async (tipo: 'consulta' | 'vacinacao') => {
    try {
      await api.post(`/patients/${patientId}/iniciar-atendimento`, { tipo });
      await fetchAtendimentoStatus(); // Atualizar status
    } catch (error) {
      console.error('Erro ao iniciar atendimento:', error);
    }
  };
  
  const finalizarAtendimento = async (tipo: 'consulta' | 'vacinacao') => {
    try {
      await api.post(`/patients/${patientId}/finalizar-atendimento`, { tipo });
      await fetchAtendimentoStatus(); // Atualizar status
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
    }
  };
  
  useEffect(() => {
    fetchAtendimentoStatus();
  }, [patientId]);
  
  return {
    atendimentoStatus,
    vacinacaoStatus,
    iniciarAtendimento,
    finalizarAtendimento,
    refreshStatus: fetchAtendimentoStatus
  };
};
```

## Atualizações na Fila de Espera

### 1. Modificações no Componente Principal
```typescript
// Substituir a lógica atual dos botões de ação por:
<div className="flex lg:flex-col flex-wrap gap-2 lg:min-w-[160px] xl:min-w-[180px]">
  {getBotoesAtendimento(patient)}
  
  {/* Manter outros botões existentes */}
  <button
    onClick={() => handleCallPatient(patient.id)}
    className="px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm hover:shadow-md hover:scale-105"
    title="Chamar paciente"
  >
    <SpeakerWaveIcon className="h-4 w-4 lg:mr-2" />
    <span className="hidden lg:inline">Chamar</span>
  </button>
  
  {/* Dropdown de mais opções permanece inalterado */}
</div>
```

### 2. Rotas para as Páginas de Atendimento
```typescript
// Adicionar ao router principal
const AppRoutes = () => {
  return (
    <Routes>
      {/* ...existing routes... */}
      
      {/* Rotas de Atendimento */}
      <Route path="/atendimento/folha-rosto/:patientId" element={<FolhaRostoPage />} />
      <Route path="/atendimento/vacinacao/:patientId" element={<VacinacaoPage />} />
      
      {/* ...existing routes... */}
    </Routes>
  );
};
```

---

**Implementação Completa dos Botões de Atendimento** ✅  
**Próximos Passos:**  
1. 🔄 Implementar páginas FolhaRostoPage e VacinacaoPage  
2. 🔄 Integrar com APIs de controle de status  
3. 🔄 Testes de navegação e estados  
4. 🔄 Validação do fluxo completo