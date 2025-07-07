# 📋 Planejamento Detalhado: Implementação da Escuta Inicial

## 🎯 **OBJETIVO GERAL**
Implementar o fluxo completo da **Escuta Inicial** conforme RF12-RF14, incluindo o botão específico na fila de atendimento, modal/página de acolhimento, classificação de risco/vulnerabilidade, e integração com o fluxo da UBS.

---

## 📊 **CONTEXTO E ESTADO ATUAL**

### ✅ **Base Implementada**
- Interface da fila de atendimento funcionando
- Sistema de status e badges padronizados
- Menu "Mais Opções" completo (RF24 - 100%)
- Ordenação por horário de chegada e classificação de risco
- Estrutura de dados com campos `initialListeningCompleted` e `vulnerabilityRisk`
- Protótipo visual da página de escuta inicial em `/Prototipo/escutaInicial.html`

### ⚠️ **Pendências Identificadas**
- Botão "Escuta Inicial" ainda genérico ("Atender")
- Restrição por perfil (Enfermeiro e Médico) não implementada
- Redirecionamento para página específica não existe
- Modal/página de escuta inicial não implementada
- Integração do resultado da escuta com reordenação da fila

---

## 🚀 **FASES DE EXECUÇÃO DETALHADAS**

### **FASE 1: Implementação do Botão Específico (1 dia)**

#### **1.1 Diferenciação de Botões por Tipo de Demanda**
- **Arquivo**: `/frontend/src/pages/QueuePage.tsx`
- **Ação**: Modificar lógica de renderização dos botões principais
- **Implementação**:
  - Para demanda espontânea (`appointmentType: 'spontaneous'`): Botão "Escuta Inicial"
  - Para demanda agendada (`appointmentType: 'scheduled'`): Botão "Pré-Atendimento"
  - Para tipo vacina: Botão "Realizar Vacinação"
  - Para outros casos: Botão "Atender"

#### **1.2 Controle de Perfil Profissional**
- **Arquivos**: 
  - `/frontend/src/hooks/useAuth.tsx` - Adicionar tipo de profissional
  - `/frontend/src/pages/QueuePage.tsx` - Validação de permissão
- **Regra**: Apenas Enfermeiros e Médicos podem executar Escuta Inicial
- **Implementação**: Verificação de `user.professionalType` antes de exibir/habilitar botão

#### **1.3 Estados e Tooltips Específicos**
- **Arquivo**: `/frontend/src/pages/QueuePage.tsx`
- **Implementação**:
  - Tooltip "Realizar Escuta Inicial" para status `waiting`
  - Tooltip "Escuta Inicial em Andamento" para status `initial_listening`
  - Botão desabilitado se usuário não tem perfil adequado
  - Visual diferenciado (ícone de escuta/acolhimento)
  - Tooltip "Escuta já realizada" para status `initial_listening`
  - Desabilitar botão se profissional sem permissão

---

### **FASE 2: Modal/Página de Escuta Inicial (2 dias)**

#### **2.1 Estrutura da Interface**
- **Arquivo**: `/frontend/src/components/queue/InitialListeningModal.tsx` ou `/frontend/src/pages/InitialListeningPage.tsx`
- **Base**: Protótipo em `/Prototipo/escutaInicial.html`
- **Componentes principais**:
  - Cabeçalho com dados do paciente
  - Formulário de escuta inicial
  - Seção de sinais vitais
  - Classificação de risco
  - Desfecho e encaminhamento

#### **2.2 Campos e Validações**
**Seção 1: Dados do Paciente (readonly)**
- Nome completo, CPF, CNS, idade formatada
- Condições de saúde e alergias existentes
- Foto/avatar do paciente

**Seção 2: Escuta Inicial (obrigatório)**
- CIAP - Código Internacional de Atenção Primária (select obrigatório)
- Motivo da consulta (textarea obrigatório)
- Observações do profissional (textarea opcional)

**Seção 3: Sinais Vitais (opcional)**
- Pressão arterial (mmHg)
- Frequência cardíaca (bpm)
- Temperatura (°C)
- Altura (cm) e peso (kg) → cálculo automático IMC
- Saturação O2 (%)

**Seção 4: Classificação de Risco (obrigatório)**
- Seleção entre cores: Verde, Amarelo, Laranja, Vermelho
- Mapeamento para vulnerabilidade: Baixa, Média, Alta, Crítica
- Justificativa (opcional para Verde/Amarelo, obrigatório para Laranja/Vermelho)

**Seção 5: Desfecho (obrigatório)**
- Opções:
  - **Liberar paciente** (não precisa de mais atendimento)
  - **Adicionar à fila de atendimento** (encaminhar para médico/especialista)
  - **Vacina** (se motivo relacionado à vacinação)
  - **Agendamento** (marcar consulta para outro dia)

#### **2.3 Integração com Dados**
- **Hook**: Criar ou expandir `useQueue.ts` com função `completeInitialListening`
- **Estrutura Completa**:
```typescript
interface InitialListeningData {
  // Motivo da consulta (obrigatório)
  consultationReason: {
    ciapCode: string;
    description: string;
    category: string;
  };
  
  // Antropometria (opcional)
  anthropometry?: {
    weight?: number;        // kg
    height?: number;        // cm
    bmi?: number;          // calculado automaticamente
    abdominalCircumference?: number;
  };
  
  // Sinais vitais (opcional)
  vitalSigns?: {
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    respiratoryRate?: number;
  };
  
  // Classificações (obrigatórias)
  riskClassification: 'green' | 'yellow' | 'orange' | 'red';
  vulnerabilityRisk: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  riskJustification?: string;
  
  // Desfecho (obrigatório)
  outcome: {
    type: 'release' | 'queue' | 'vaccination' | 'schedule';
    details?: any;
    observations?: string;
  };
  
  // Metadados
  executedBy: string;       // ID do profissional
  startedAt: Date;
  completedAt?: Date;
  duration?: number;        // em minutos
}
```

---

### **FASE 3: Lógica de Negócio e Fluxos (1 dia)**

#### **3.1 Processamento da Escuta Inicial**
- **Arquivo**: `/frontend/src/hooks/useQueue.ts`
- **Função**: `completeInitialListening(appointmentId, data)`
- **Ações**:
  1. Atualizar status: `waiting` → `initial_listening`
  2. Registrar dados da escuta no agendamento
  3. Definir `initialListeningCompleted: true`
  4. Aplicar classificação de vulnerabilidade
  5. Processar desfecho escolhido

#### **3.2 Fluxos de Desfecho**

**Desfecho: Liberar Paciente**
- Status final: `completed`
- Não vai para fila de atendimento
- Gerar declaração automática (opcional)

**Desfecho: Adicionar à Fila**
- Status: `waiting`
- Reposicionar na fila conforme classificação de risco
- Aplicar ordenação SN001 (risco > horário)

**Desfecho: Vacinação**
- Verificar se tipo de serviço permite
- Redirecionar para fluxo de vacinação específico
- Status: `waiting` (fila de vacinação)

**Desfecho: Agendamento**
- Marcar consulta para data futura
- Status atual: `completed`
- Criar novo agendamento (se aplicável)

#### **3.3 Reordenação Automática da Fila**
- **Arquivo**: `/frontend/src/hooks/useQueue_new.ts`
- **Ação**: Aplicar algoritmo SN001 após escuta inicial
- **Regra**: Pacientes com escuta completa e alta vulnerabilidade sobem na fila

---

### **FASE 4: Integração e Validações (1 dia)**

#### **4.1 Navegação e Redirecionamento**
- **Arquivo**: `/frontend/src/pages/QueuePage.tsx`
- **Implementação**:
  - Modal: Abrir `InitialListeningModal` no clique do botão
  - Página: Navegar para `/escuta-inicial/:appointmentId`
  - Breadcrumb: "Home → Fila de Atendimento → Escuta Inicial"

#### **4.2 Validações e Controles**
- **Perfil profissional**: Apenas enfermeiros e médicos
- **Status válido**: Apenas para `waiting` ou `scheduled`
- **Demanda tipo**: Apenas para `spontaneous` (demanda espontânea)
- **Campos obrigatórios**: CIAP, motivo, classificação de risco, desfecho

#### **4.3 Feedback Visual e UX**
- Loading states durante processamento
- Confirmação antes de salvar escuta inicial
- Mensagem de sucesso com desfecho escolhido
- Retorno automático para fila de atendimento
- Atualização em tempo real dos cards na fila

---

### **FASE 5: Testes e Integração Backend (1 dia)**

#### **5.1 Mocks e Simulação**
- **Arquivo**: `/frontend/src/services/api.ts`
- **Endpoints simulados**:
  - `POST /api/v1/appointments/:id/initial-listening` - Registrar escuta
  - `GET /api/v1/ciap-codes` - Buscar códigos CIAP
  - `PATCH /api/v1/appointments/:id/status` - Atualizar status/posição

#### **5.2 Testes de Fluxo**
- Teste do botão específico por tipo de demanda
- Teste de restrição por perfil profissional
- Teste dos desfechos (liberar, fila, vacina, agendar)
- Teste da reordenação automática por risco
- Teste de validações e campos obrigatórios

#### **5.3 Preparação para Backend Real**
- Estrutura de dados compatível com Rails
- Endpoints documentados para implementação
- Validações frontend e backend alinhadas
- Logs de auditoria preparados (LGPD)

---

## 📋 **REQUISITOS TÉCNICOS ESPECÍFICOS**

### **Interface e UX**
- **Modal responsivo** ou página full-screen para mobile
- **Formulário dividido em etapas** para melhor usabilidade
- **Validação em tempo real** dos campos obrigatórios
- **Cálculo automático** do IMC baseado em altura/peso
- **Seleção visual** da classificação de risco (cards coloridos)

### **Dados e Persistência**
- **Estrutura flexível** para diferentes tipos de desfecho
- **Histórico completo** da escuta inicial no agendamento
- **Integração com ordenação** SN001 existente
- **Campos adicionais** no QueuePatient para dados da escuta

### **Controles e Segurança**
- **Verificação de perfil** em frontend e backend
- **Logs de auditoria** para todas as ações da escuta
- **Validação de status** válidos para escuta inicial
- **Controle de concorrência** (dois profissionais na mesma escuta)

---

## 🎯 **IMPACTOS E INTEGRAÇÃO**

### **No Fluxo da UBS**
1. **Acolhimento estruturado**: Escuta inicial padronizada
2. **Classificação de risco**: Priorização automática na fila
3. **Redução de espera**: Pacientes de baixo risco podem ser liberados
4. **Encaminhamento eficiente**: Desfecho direcionado por necessidade

### **Na Interface da Fila**
1. **Botões diferenciados**: Cada tipo de demanda tem ação específica
2. **Status visual**: Pacientes com escuta realizada identificados
3. **Ordenação inteligente**: Risco impacta posição na fila
4. **Histórico completo**: Dados da escuta acessíveis via "Mais Opções"

### **Para os Profissionais**
1. **Controle de acesso**: Apenas enfermeiros e médicos fazem escuta
2. **Processo guiado**: Interface estruturada para coleta de dados
3. **Decisão assistida**: Opções de desfecho claras e orientadas
4. **Eficiência operacional**: Menos tempo na triagem manual

---

## � **CAMPOS DETALHADOS E REGRAS DE NEGÓCIO**

### **Campos do Formulário de Escuta Inicial**

#### **1. Motivo da Consulta (Obrigatório)**
```typescript
interface ConsultationReason {
  ciapCode: string;        // Código CIAP (obrigatório)
  description: string;     // Descrição do motivo
  category: string;        // Categoria do código CIAP
}
```

#### **2. Antropometria (Opcional)**
```typescript
interface Anthropometry {
  weight?: number;         // Peso em kg
  height?: number;         // Altura em cm
  bmi?: number;           // Calculado automaticamente
  abdominalCircumference?: number; // Circunferência abdominal
}
```

#### **3. Sinais Vitais (Opcional)**
```typescript
interface VitalSigns {
  systolicBP?: number;     // Pressão arterial sistólica
  diastolicBP?: number;    // Pressão arterial diastólica
  heartRate?: number;      // Frequência cardíaca
  temperature?: number;    // Temperatura corporal
  oxygenSaturation?: number; // Saturação de O2
  respiratoryRate?: number;  // Frequência respiratória
}
```

#### **4. Classificação de Risco (Obrigatório)**
```typescript
type RiskClassification = 'green' | 'yellow' | 'orange' | 'red';
// Verde: Não urgente | Amarelo: Pouco urgente | Laranja: Urgente | Vermelho: Muito urgente
```

#### **5. Classificação de Vulnerabilidade (Obrigatório)**
```typescript
type VulnerabilityRisk = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
```

#### **6. Desfecho da Escuta (Obrigatório)**
```typescript
interface InitialListeningOutcome {
  type: 'release' | 'queue' | 'vaccination' | 'schedule';
  details?: {
    // Para 'release': observações da liberação
    // Para 'queue': prioridade na fila
    // Para 'vaccination': tipo de vacina
    // Para 'schedule': data/profissional preferido
  };
}
```

### **Regras de Negócio Detalhadas**

#### **RN00: Controle de Acesso**
- Apenas profissionais com perfil "Enfermeiro" ou "Médico" podem executar escuta inicial
- Botão desabilitado para outros perfis com tooltip explicativo

#### **RN01: Tipos de Demanda Elegíveis**
- Escuta inicial disponível apenas para demanda espontânea (`appointmentType: 'spontaneous'`)
- Demandas agendadas seguem fluxo de pré-atendimento

#### **RN02: Status Válidos**
- Escuta inicial apenas para pacientes com status `waiting`
- Pacientes em `initial_listening` mostram botão de continuar/finalizar

#### **RN03: Código CIAP Obrigatório**
- Campo obrigatório com busca por código ou descrição
- Validação de código válido na tabela CIAP
- Categorização automática baseada no código

#### **RN04: Classificação de Risco Automática**
- Algoritmo baseado em sinais vitais + código CIAP
- Profissional pode sobrescrever classificação com justificativa
- Vermelho e laranja sempre têm prioridade na fila

#### **RN05: Cálculo de IMC**
- IMC calculado automaticamente quando peso e altura informados
- Classificação (baixo peso, normal, sobrepeso, obesidade I-III)
- Integração com classificação de vulnerabilidade

#### **RN06: Validação de Sinais Vitais**
- Valores fora dos parâmetros normais geram alertas
- PA sistólica 180+ ou diastólica 110+ → classificação vermelha automática
- Saturação O2 < 90% → classificação vermelha automática

#### **RN07: Desfecho "Liberar Paciente"**
- Remove paciente da fila de atendimento
- Status final: `completed`
- Possibilidade de gerar declaração/atestado

#### **RN08: Desfecho "Adicionar à Fila"**
- Reposiciona paciente conforme nova classificação de risco
- Aplica algoritmo SN001 (risco > vulnerabilidade > horário chegada)
- Status: `waiting` com `initialListeningCompleted: true`

#### **RN09: Desfecho "Vacinação"**
- Valida se tipo de serviço permite vacinação
- Redireciona para fila específica de vacinação
- Mantém dados da escuta inicial

#### **RN10: Desfecho "Agendamento"**
- Permite agendar consulta para data futura
- Status atual: `completed`
- Cria novo agendamento vinculado (se aplicável)

#### **RN11: Reordenação da Fila**
- Escuta inicial completa ativa algoritmo SN001
- Pacientes com risco vermelho/laranja sobem na fila
- Vulnerabilidade crítica/alta também influencia posição

#### **RN12: Persistência de Dados**
- Todos os dados da escuta são salvos no histórico do paciente
- Possibilidade de consultar escuta anterior em retornos
- Integração com prontuário eletrônico

#### **RN13: Validações de Campos**
- Peso: 0.5kg - 300kg
- Altura: 30cm - 250cm  
- PA: Sistólica 50-300mmHg, Diastólica 30-200mmHg
- FC: 30-200bpm
- Temperatura: 30-45°C
- Saturação O2: 50-100%

#### **RN14: Timeouts e Sessão**
- Escuta inicial em andamento expira em 30 minutos
- Dados salvos automaticamente (rascunho)
- Possibilidade de retomar escuta não finalizada

#### **RN15: Auditoria e Logs**
- Registro de quem executou a escuta inicial
- Timestamp de início e finalização
- Log de alterações na classificação de risco

#### **RN16: Integração Mobile**
- Formulário responsivo para tablets
- Inputs otimizados para touch
- Validação offline para campos obrigatórios

---

## �📊 **CRONOGRAMA ESTIMADO**

| Fase | Duração | Entregas |
|------|---------|-----------|
| **Fase 1** | 1 dia | Botão específico, controle de perfil, tooltips |
| **Fase 2** | 2 dias | Modal/página de escuta, formulário completo |
| **Fase 3** | 1 dia | Lógica de desfecho, reordenação, fluxos |
| **Fase 4** | 1 dia | Navegação, validações, feedback UX |
| **Fase 5** | 1 dia | Testes, mocks, preparação backend |
| **TOTAL** | **6 dias** | **Fluxo completo funcionando** |

---

## ✅ **CRITÉRIOS DE SUCESSO**

### **Funcional**
- [ ] Botão "Escuta Inicial" aparece apenas para demanda espontânea
- [ ] Apenas enfermeiros e médicos podem executar escuta inicial
- [ ] Formulário coleta todos os dados necessários com validações
- [ ] Classificação de risco reordena automaticamente a fila
- [ ] Todos os desfechos funcionam corretamente (liberar, fila, vacina, agendar)

### **Técnico**
- [ ] Interface responsiva em desktop, tablet e mobile
- [ ] Integração com dados existentes sem quebrar funcionalidades
- [ ] Performance adequada com 50+ pacientes na fila
- [ ] Código preparado para integração com backend Rails

### **UX/Usabilidade**
- [ ] Fluxo intuitivo e autoexplicativo para profissionais
- [ ] Feedback visual claro em todas as etapas
- [ ] Tempo de preenchimento < 3 minutos por paciente
- [ ] Erros e validações bem comunicados

---

**🚀 Próximo passo**: Implementar a **Fase 1** com foco no botão específico e controle de perfil, estabelecendo a base para as fases seguintes.
