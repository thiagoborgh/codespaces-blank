# Análise Detalhada - SOAP Bloco Avaliação

## Visão Geral
Análise completa dos requisitos funcionais e regras de negócio para implementação do **Bloco Avaliação** do Prontuário SOAP, conforme especificação recebida em 13/06/2025.

## Estrutura do Bloco Avaliação

### 1. Campo de Texto Livre (#02)
**Funcionalidade:** Editor de texto rico para avaliação clínica livre

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
interface EvaluationTextFormat {
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

### 2. Registro de Problemas e Condições (#03)
**Funcionalidade:** Sistema dual para registro de problemas clínicos

#### 2.1 Busca por Problemas Existentes
```typescript
interface ProblemaExistente {
  descricao: string;
  codigo: string; // CIAP2 ou CID10
  tipo: 'CIAP2' | 'CID10';
  status: 'Ativo' | 'Latente';
  dataRegistro: Date;
}

interface BuscaProblemasExistentes {
  placeholder: "Pesquisar por problemas e/ou condições ativos ou latentes do cidadão";
  resultados: ProblemaExistente[];
  exibicao: {
    formato: 'Descrição - Código - Status';
    exemplo: 'Diabetes Mellitus - E11 - Ativo';
  };
}
```

#### 2.2 Campos Estruturados CIAP-2 e CID-10
```typescript
interface CamposEstruturados {
  modalInfo: {
    titulo: "Registro de Problemas e Condições";
    faixaInformativa: "Pelo menos um dos campos é de preenchimento obrigatório";
  };
  
  campos: {
    ciap2: {
      obrigatorio: false; // mas pelo menos um dos dois deve ser preenchido
      buscaPor: ['codigo', 'descricao'];
      autocomplete: true;
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-brciap2';
    };
    
    cid10: {
      obrigatorio: false; // mas pelo menos um dos dois deve ser preenchido
      buscaPor: ['codigo', 'descricao'];
      autocomplete: true;
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-brcid10';
    };
  };
  
  validacao: {
    regra: 'pelo menos um campo (CIAP2 ou CID10) deve ser preenchido';
    permitirMultiplos: true;
  };
}
```

#### 2.3 Funcionalidades do Item de Problema
```typescript
interface ItemProblema {
  id: string;
  codigo: string;
  descricao: string;
  tipo: 'CIAP2' | 'CID10';
  situacao: 'Ativo' | 'Latente' | 'Resolvido'; // obrigatório
  inicio?: {
    tipo: 'data' | 'idade';
    data?: Date; // DD/MM/AAAA
    idade?: {
      anos: number; // 000
      meses: number; // 00
    };
  };
  observacoes?: string; // 200 chars
  incluirNaLista: boolean; // toggle button
  
  acoes: {
    editar: boolean; // 📝
    excluir: boolean; // 🗑️
    observacoes: boolean; // 💬
  };
}

interface AcoesItemProblema {
  editar: {
    icone: '📝';
    acao: 'reabrirModalEdicao';
    campos: ['ciap2', 'cid10', 'incluirNaLista', 'situacao', 'inicio', 'observacoes'];
  };
  
  excluir: {
    icone: '🗑️';
    acao: 'removerDaLista';
    confirmacao: false; // não exige confirmação
  };
  
  observacoes: {
    icone: '💬';
    modalObservacoes: {
      maxChars: 200;
      botoes: ['Cancelar', 'Salvar'];
      comportamento: {
        cancelar: 'descartarEFechar';
        salvar: 'armazenarEPermitirEdicao';
      };
    };
  };
  
  incluirNaLista: {
    tipo: 'toggle';
    estados: {
      ativo: 'azul - será registrado na lista de problemas ativos';
      inativo: 'cinza - não será registrado na lista';
    };
  };
}
```

#### 2.4 Campos Obrigatórios e Opcionais
```typescript
interface CamposSituacao {
  situacao: {
    obrigatorio: true;
    opcoes: [
      { valor: 'Ativo', icone: '🔵', descricao: 'condição presente no momento' },
      { valor: 'Latente', icone: '⚪', descricao: 'não manifesta, mas relevante' },
      { valor: 'Resolvido', icone: '⚪', descricao: 'anteriormente presente, já resolvida' }
    ];
  };
  
  inicio: {
    obrigatorio: false;
    opcoes: ['data', 'idade'];
    exclusivoMutuamente: true;
    data: {
      formato: 'DD/MM/AAAA';
      calendario: true;
    };
    idade: {
      anos: { min: 0, max: 999 };
      meses: { min: 0, max: 11 };
    };
  };
  
  observacoes: {
    obrigatorio: false;
    maxChars: 200;
    tipo: 'texto_livre';
    aceita: 'alfanumerico';
  };
}
```

### 3. Alergias e Reações Adversas (#04)
**Seção Expansível** para registro estruturado de alergias

#### 3.1 Busca por Alergias Existentes
```typescript
interface BuscaAlergiasExistentes {
  campo: "Pesquisar por alergias e reações adversas do cidadão";
  exibicao: {
    formato: 'Substância – Tipo – Criticidade';
    exemplo: 'Clara do ovo – Alergia a Alimento – Crit. alta';
  };
  estadoVazio: "Nenhum resultado encontrado";
}
```

#### 3.2 Categoria do Agente Causador
```typescript
interface CategoriaAgente {
  obrigatorio: true;
  opcoes: ['Alimento', 'Ambiente', 'Biológico', 'Medicamento'];
  comportamento: {
    selecao: 'ativaProximoCampo';
    campo: 'agenteEspecifico';
  };
}
```

#### 3.3 Agente ou Substância Específica
```typescript
interface AgenteEspecifico {
  obrigatorio: true;
  ativadoApós: 'seleçãoCategoriaAgente';
  autocomplete: true;
  busca: 'baseSemantica';
  
  basesPorCategoria: {
    alimento: {
      base: 'CBARA';
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-bralergenoscbara';
      nome: 'Catálogo Brasileiro de Alérgenos e Reações Adversas';
    };
    
    ambiente: {
      base: 'CBARA';
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-bralergenoscbara';
      nome: 'Catálogo Brasileiro de Alérgenos e Reações Adversas';
    };
    
    medicamento: {
      base: 'AMPP';
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-brobmanvisa';
      nome: 'Produto Medicinal Comercial com Apresentação (OBM)';
    };
    
    biologico: {
      base: 'Imunobiológicos';
      referencia: 'https://simplifier.net/redenacionaldedadosemsaude/codesystem-brimunobiologico';
      nome: 'CodeSystem Imunobiológicos';
    };
  };
  
  validacao: {
    apenasValoresCadastrados: true;
    sinonimos: true;
  };
}
```

#### 3.4 Campos Opcionais de Classificação
```typescript
interface CamposClassificacao {
  tipoReacao: {
    obrigatorio: false;
    tipo: 'selecaoUnica';
    opcoes: ['Alergia', 'Intolerância'];
    desmarcavel: true;
  };
  
  criticidade: {
    obrigatorio: false;
    tipo: 'selecaoUnica';
    opcoes: ['Alta', 'Baixa'];
    desmarcavel: true;
  };
  
  grauCerteza: {
    obrigatorio: false;
    tipo: 'selecaoUnica';
    opcoes: ['Confirmado', 'Refutado', 'Resolvido', 'Suspeito'];
    editavelAntesDoSalvar: true;
  };
}
```

#### 3.5 Manifestações Clínicas
```typescript
interface ManifestacoesClinicas {
  obrigatorio: false;
  tipo: 'multiplaSelecao';
  exibicao: {
    aoClicar: 'mostrarListaCompleta';
    filtro: 'digitaçãoParaFiltrar';
    selecao: 'caixaSelecaoAoLado';
    areaPreenchimento: 'itensSelecionadosAbaixo';
  };
  
  manifestacoes: [
    { nome: 'Anafilaxia', sinonimos: ['Reação anafilática'] },
    { nome: 'Angioedema', sinonimos: ['Edema Angioneurótico', 'Doença de Quincke'] },
    { nome: 'Artrite', sinonimos: ['Inflamação nas articulações'] },
    { nome: 'Asma', sinonimos: ['Asma brônquica', 'Bronquite asmática'] },
    { nome: 'Broncoespasmo', sinonimos: ['Broncoconstrição'] },
    { nome: 'Conjuntivite', sinonimos: ['Inflamação da conjuntiva'] },
    { nome: 'Dermatite atópica', sinonimos: ['Dermatite alérgica'] },
    { nome: 'Dermatite de contato', sinonimos: ['Eczema de contato'] },
    { nome: 'Diarreia', sinonimos: ['Fezes diarreicas'] },
    { nome: 'Dispneia', sinonimos: ['Dificuldade respiratória'] },
    { nome: 'Edema de glote', sinonimos: ['Edema da laringe'] },
    { nome: 'Eritema multiforme', sinonimos: [] },
    { nome: 'Exantema bolhoso', sinonimos: ['Eruptões bolhosas'] },
    { nome: 'Exantema maculopapular', sinonimos: ['Erupção maculopapular'] },
    { nome: 'Fotossensibilidade', sinonimos: ['Fotossensibilidade cutânea', 'Reação de fotossensibilidade'] },
    { nome: 'Mucosite', sinonimos: ['Inflamação das mucosas'] },
    { nome: 'Nefrite', sinonimos: ['Inflamação no rim'] },
    { nome: 'Parada cardiorrespiratória', sinonimos: ['Parada cardíaca'] },
    { nome: 'Prurido', sinonimos: ['Coceira'] },
    { nome: 'Rinite', sinonimos: ['Inflamação da mucosa nasal'] },
    { nome: 'Síndrome de DRESS', sinonimos: [] },
    { nome: 'Síndrome de Lyell', sinonimos: ['Necrólise epidérmica tóxica'] },
    { nome: 'Síndrome de Stevens-Johnson', sinonimos: ['Eritema multiforme bolhoso'] },
    { nome: 'Tosse', sinonimos: [] },
    { nome: 'Urticária', sinonimos: ['Rash urticariforme'] },
    { nome: 'Vasculite', sinonimos: ['Angeíte'] },
    { nome: 'Vômito', sinonimos: ['Êmese'] }
  ];
}
```

#### 3.6 Campo Início
```typescript
interface InicioAlergia {
  obrigatorio: false;
  opcoes: ['data', 'idade'];
  mutuamenteExclusivos: true;
  
  data: {
    formato: 'DD/MM/AAAA';
    validacao: {
      anteriorOuIgualAtendimento: true;
      calculoIdadeAutomatico: true;
    };
  };
  
  idade: {
    anos: number;
    meses: number;
    validacao: {
      naoSuperiorIdadeAtual: true;
      estimativaDataInterna: true;
    };
  };
  
  finalidade: [
    'cronologiaRegistrosClínicos',
    'avaliaçãoEvoluçãoSensibilidade',
    'análisesClínicas',
    'farmacovigilância',
    'interoperabilidade'
  ];
}
```

#### 3.7 Observações da Alergia
```typescript
interface ObservacoesAlergia {
  obrigatorio: false;
  maxChars: 400;
  tipo: 'textoLivre';
  finalidade: 'descriçõesComplementares';
}
```

#### 3.8 Ações do Formulário de Alergia
```typescript
interface AcoesFormularioAlergia {
  botaoAdicionar: {
    ativacao: {
      condicoes: [
        'categoriaAgenteCausador preenchida',
        'agenteEspecifico preenchido'
      ];
      camposOpcionais: 'todos os demais';
    };
    acao: 'salvarReacao';
  };
  
  botaoCancelar: {
    acao: 'descartarDados';
    comportamento: 'resetarCampos';
  };
}
```

#### 3.9 Lista de Alergias Registradas
```typescript
interface ListaAlergiasRegistradas {
  exibicao: {
    formato: 'linhaEstruturada';
    colunas: [
      'categoriaAgenteCausador',
      'agenteEspecifico'
    ];
    exemplo: 'Medicamento | Dipirona Sódica – 1g';
  };
  
  acoesPorLinha: {
    editar: {
      icone: '✏️';
      acao: 'reabrirFormularioCompleto';
      camposEditaveis: 'todos';
      botoes: ['Salvar', 'Cancelar'];
      permissao: 'atendimentoEmAberto';
      auditoria: 'controleVersionamento';
    };
    
    excluir: {
      icone: '🗑️';
      confirmacao: {
        exibir: true;
        acao: 'removerImediatamente';
      };
      permissao: 'atendimentoEmAberto';
      restricao: 'apósFinalizacao apenas perfil administrativo';
    };
  };
  
  comportamento: {
    todasExcluidas: 'retornarEstadoInicial';
    acoes: 'independentesPorLinha';
    multiplosItens: 'permitido';
  };
}
```

## Validações e Regras de Negócio

### Validações de Campos Obrigatórios
```typescript
interface ValidacoesObrigatorias {
  problemas: {
    regra: 'pelo menos um problema deve ser registrado';
    campos: 'CIAP2 ou CID10 (pelo menos um)';
    situacao: 'obrigatório para cada problema';
  };
  
  alergias: {
    categoriaAgente: 'obrigatório';
    agenteEspecifico: 'obrigatório';
    demaisCampos: 'opcionais';
  };
}
```

### Validações de Data e Idade
```typescript
const validateDateRange = (date: Date, patientBirthDate: Date): boolean => {
  const today = new Date();
  return date <= today && date >= patientBirthDate;
};

const validateAgeRange = (ageYears: number, ageMonths: number, patientAge: number): boolean => {
  const totalAgeInMonths = (ageYears * 12) + ageMonths;
  const patientAgeInMonths = patientAge * 12;
  return totalAgeInMonths <= patientAgeInMonths;
};

const calculateAgeFromDate = (date: Date, birthDate: Date) => {
  // Calcular idade automaticamente quando data é informada
  const birth = new Date(birthDate);
  const event = new Date(date);
  
  let years = event.getFullYear() - birth.getFullYear();
  let months = event.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months };
};
```

### Integrações com Bases Semânticas
```typescript
interface IntegracoesBases {
  ciap2: {
    endpoint: '/api/classifications/ciap2';
    search: ['codigo', 'descricao'];
    autocomplete: true;
  };
  
  cid10: {
    endpoint: '/api/classifications/cid10';
    search: ['codigo', 'descricao'];
    autocomplete: true;
  };
  
  cbara: {
    endpoint: '/api/allergens/cbara';
    categories: ['alimento', 'ambiente'];
    search: ['nome', 'sinonimos'];
  };
  
  obm: {
    endpoint: '/api/medications/ampp';
    category: 'medicamento';
    fields: ['nomeComercial', 'principioAtivo', 'dosagem', 'apresentacao'];
  };
  
  imunobiologicos: {
    endpoint: '/api/biologics/immunobiologics';
    category: 'biologico';
    search: ['nome', 'tipo'];
  };
}
```

## Componentes React Necessários

### 1. EvaluationBlock.tsx
```typescript
interface EvaluationBlockProps {
  patient: Patient;
  onSave: (data: EvaluationData) => void;
  initialData?: EvaluationData;
  existingProblems?: ExistingProblem[];
  existingAllergies?: ExistingAllergy[];
}

const EvaluationBlock: React.FC<EvaluationBlockProps> = ({ 
  patient, 
  onSave, 
  initialData,
  existingProblems,
  existingAllergies 
}) => {
  // Componente principal do bloco Avaliação
};
```

### 2. ProblemsSection.tsx
```typescript
interface ProblemsSectionProps {
  existingProblems: ExistingProblem[];
  onAddProblem: (problem: ProblemData) => void;
  onEditProblem: (id: string, problem: ProblemData) => void;
  onRemoveProblem: (id: string) => void;
  problems: ProblemData[];
}
```

### 3. ProblemModal.tsx
```typescript
interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: ProblemData) => void;
  editingProblem?: ProblemData;
  mode: 'add' | 'edit';
}
```

### 4. AllergiesSection.tsx
```typescript
interface AllergiesSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  existingAllergies: ExistingAllergy[];
  onAddAllergy: (allergy: AllergyData) => void;
  onEditAllergy: (id: string, allergy: AllergyData) => void;
  onRemoveAllergy: (id: string) => void;
  allergies: AllergyData[];
}
```

### 5. AllergyForm.tsx
```typescript
interface AllergyFormProps {
  onSave: (allergy: AllergyData) => void;
  onCancel: () => void;
  editingAllergy?: AllergyData;
  mode: 'add' | 'edit';
}
```

### 6. ClassificationSearch.tsx
```typescript
interface ClassificationSearchProps {
  type: 'ciap2' | 'cid10';
  value: string;
  onChange: (value: string, data: ClassificationData) => void;
  placeholder: string;
  required?: boolean;
}
```

### 7. AllergenSearch.tsx
```typescript
interface AllergenSearchProps {
  category: 'alimento' | 'ambiente' | 'medicamento' | 'biologico';
  value: string;
  onChange: (value: string, data: AllergenData) => void;
  disabled?: boolean;
}
```

### 8. ManifestationsSelector.tsx
```typescript
interface ManifestationsSelectorProps {
  selectedManifestations: string[];
  onChange: (manifestations: string[]) => void;
  manifestationsList: Manifestation[];
}
```

## Estados e Tipos TypeScript

### Tipos Principais
```typescript
interface EvaluationData {
  freeText: {
    content: string;
    formatting: TextFormatting;
  };
  problems: ProblemData[];
  allergies: AllergyData[];
}

interface ProblemData {
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

interface AllergyData {
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

interface ExistingProblem {
  id: string;
  descricao: string;
  codigo: string;
  tipo: 'CIAP2' | 'CID10';
  status: 'Ativo' | 'Latente';
  dataRegistro: Date;
}

interface ExistingAllergy {
  id: string;
  substancia: string;
  tipo: string;
  criticidade: string;
  dataRegistro: Date;
}

interface ClassificationData {
  codigo: string;
  descricao: string;
  categoria?: string;
}

interface AllergenData {
  codigo?: string;
  nome: string;
  categoria: string;
  sinonimos?: string[];
}

interface Manifestation {
  nome: string;
  sinonimos: string[];
}
```

## Fluxos de Trabalho

### Fluxo de Adição de Problema
1. **Busca Existente** → Selecionar da lista ou criar novo
2. **Modal de Problema** → Preencher CIAP2/CID10 (obrigatório: pelo menos um)
3. **Situação** → Selecionar status (obrigatório)
4. **Início** → Data ou idade (opcional)
5. **Toggle Lista** → Incluir na lista de problemas (opcional)
6. **Observações** → Texto livre 200 chars (opcional)
7. **Adicionar** → Salvar na lista

### Fluxo de Adição de Alergia
1. **Busca Existente** → Selecionar da lista ou criar nova
2. **Categoria** → Selecionar tipo de agente (obrigatório)
3. **Agente** → Buscar na base semântica (obrigatório)
4. **Classificações** → Tipo, criticidade, certeza (opcionais)
5. **Manifestações** → Seleção múltipla (opcional)
6. **Início** → Data ou idade (opcional)
7. **Observações** → Texto livre 400 chars (opcional)
8. **Adicionar** → Salvar na lista

### Fluxo de Edição
1. **Ícone Editar** → Reabrir formulário completo
2. **Alterações** → Modificar campos desejados
3. **Salvar/Cancelar** → Confirmar ou descartar alterações

## Próximos Passos

### Fase 1: Estrutura Base
1. ✅ Análise completa dos requisitos
2. 🔄 Criar componentes base (EvaluationBlock, ProblemsSection)
3. 🔄 Implementar editor de texto rico
4. 🔄 Configurar validações de campos obrigatórios

### Fase 2: Sistema de Problemas
1. 🔄 Implementar busca de problemas existentes
2. 🔄 Modal de adição/edição de problemas
3. 🔄 Integração CIAP2 e CID10
4. 🔄 Sistema de situação e início

### Fase 3: Sistema de Alergias
1. 🔄 Seção expansível de alergias
2. 🔄 Formulário estruturado de alergias
3. 🔄 Integrações bases semânticas (CBARA, OBM, etc.)
4. 🔄 Seletor múltiplo de manifestações

### Fase 4: Funcionalidades Avançadas
1. 🔄 Sistema de edição e exclusão
2. 🔄 Validações de data/idade
3. 🔄 Observações dinâmicas
4. 🔄 Toggle de inclusão na lista

### Fase 5: Integração e Testes
1. 🔄 Integrações completas com APIs
2. 🔄 Testes unitários e integração
3. 🔄 Validação com usuários
4. 🔄 Otimização de performance

## Considerações Técnicas

### Performance
- Debounce em buscas autocomplete
- Lazy loading para bases semânticas grandes
- Memoização de listas de manifestações
- Cache de resultados de classificações

### Acessibilidade
- Labels adequados para todos os campos
- Navegação por teclado em modais
- Aria-labels para ícones funcionais
- Contraste adequado para criticidade

### Segurança e Validação
- Validação server-side obrigatória
- Sanitização de entradas de texto
- Controle de acesso por perfil profissional
- Auditoria de alterações

### Integrações Críticas
- **CIAP2/CID10:** Classificações internacionais
- **CBARA:** Catálogo brasileiro de alérgenos
- **OBM/AMPP:** Ontologia de medicamentos
- **Imunobiológicos:** Base de vacinas e terapias

---

**Status:** Documentação completa ✅  
**Próximo:** Início da implementação dos componentes  
**Estimativa:** 4-5 sprints para implementação completa
