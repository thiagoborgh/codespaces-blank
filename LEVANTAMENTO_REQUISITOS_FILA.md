# 📋 Levantamento de Requisitos - Fila de Atendimento

## 🔍 Análise do Estado Atual vs Requisitos

### ✅ **O QUE JÁ ESTÁ IMPLEMENTADO**

#### Frontend React/TypeScript
- ✅ Layout responsivo com sidebar e tema configurável
- ✅ Componente QueuePage principal com interface completa
- ✅ Sistema de busca de pacientes com feedback visual (RF04)
- ✅ Filtros por status com checkboxes (RF09 - parcial)
- ✅ Ordenação por hora de chegada e prioridade (RF07, RF08)
- ✅ Cards de pacientes com informações básicas
- ✅ Dropdown "Mais Opções" com ações principais (RF23 - parcial)
- ✅ Tags de status coloridas (RF03, RI02 - cores diferentes das especificadas)
- ✅ Responsividade mobile completa
- ✅ Sistema de temas (healthcare, public-service, hybrid)

#### Modais Implementados
- ✅ **AddPatientModal**: Adicionar paciente com busca e cadastro (RF27-RF30 - parcial)
- ✅ **FilterModal**: Filtros avançados com múltiplos critérios (RF09-RF11 - parcial)
- ✅ **EditPatientModal**: Edição completa de dados do paciente (RF24 - Editar)
- ✅ **AttendanceStatementModal**: Gerar declaração de comparecimento (RF24 - parcial)
- ✅ **MedicalRecordModal**: Acesso ao prontuário com justificativa LGPD (RF24)
- ✅ **DayAttendancesModal**: Visualizar atendimentos do dia (RF24)

#### Backend Rails
- ✅ **Models**: Patient, Appointment, User, Team, Consultation
- ✅ **Controllers**: AppointmentsController, PatientsController, UsersController, TeamsController
- ✅ **Serializers**: Para formatação JSON de todas as entidades
- ✅ **Sistema de autenticação**: Login/logout básico
- ✅ **Migrations**: Estrutura de banco completa
- ✅ **Seeds**: Dados de exemplo para desenvolvimento
- ✅ **Validações**: Básicas nos models

#### Hooks e Utilitários
- ✅ **useQueue**: Hook para gerenciamento da fila com estados
- ✅ **useAuth**: Contexto de autenticação
- ✅ **useTheme**: Sistema de temas configurável
- ✅ **ageUtils**: Formatação de idade (formato atual diferente do especificado)
- ✅ **API Service**: Cliente HTTP para comunicação com backend

## ❌ **O QUE FALTA IMPLEMENTAR**

### 🔴 **CRÍTICO - RF Principais Faltantes**

#### **RF01 - Acesso à Tela**
- ❌ Menu lateral não possui link direto para "Fila de Atendimento"
- ❌ Acesso via menu lateral precisa ser implementado

#### **RF02 - Elementos da Tela Superior**
- ❌ Layout não conforme especificação da documentação
- ❌ Checkbox "Ver somente meus atendimentos" existe mas não está funcional
- ❌ Posicionamento dos elementos não está correto
- ❌ Botão "Voltar para padrão" não reseta filtros corretamente

#### **RF03 - Lista de Atendimento Completa**
- ❌ **Barra lateral colorida**: Não implementada nos cards
- ❌ **Tag de vulnerabilidade**: Não existe (após escuta inicial)
- ❌ **Idade formato específico**: Atual é "25 anos", necessário "21a 4m e 8d"
- ❌ **Botões específicos**: Não diferencia entre "Escuta Inicial", "Atender", "Vacinação"
- ❌ **Profissional e Equipe**: Exibidos mas não com dados reais

#### **RF05 - Cadastro de Cidadão**
- ❌ Botão "Cadastrar Cidadão" não aparece quando busca não retorna resultados
- ❌ Fluxo de cadastro existe mas não está integrado corretamente

#### **RF06 - Ver Somente Meus Atendimentos**
- ❌ Checkbox existe mas funcionalidade não implementada
- ❌ Filtro por profissional logado não funciona

#### **RF12-RF14 - Escuta Inicial (Demanda Espontânea)**
- ❌ Botão genérico "Atender" não diferencia tipo de atendimento
- ❌ Restrição por perfil (Enfermeiro e Médico) não implementada
- ❌ Redirecionamento para página específica não existe
- ❌ Tooltips específicos por status não implementados

#### **RF15-RF17 - Pré-Atendimento (Demanda Agendada)**
- ❌ Não diferencia demanda espontânea de agendada
- ❌ Botão específico para pré-atendimento não existe
- ❌ Página de pré-atendimento não implementada

#### **RF18-RF20 - Realizar Atendimento**
- ❌ Redirecionamento para "Folha de Rosto" não implementado
- ❌ Tooltips específicos por status não existem
- ❌ Página de atendimento não criada

#### **RF21-RF22 - Realizar Vacinação**
- ❌ Botão específico "Realizar Vacinação" para tipo "Vacina" não existe
- ❌ Controle por profissional responsável não implementado
- ❌ Página de vacinação não criada

#### **RF23-RF24 - Mais Opções Completas**
- ❌ **Ações específicas por status** não implementadas:
  - "Cidadão não aguardou" (alterar para status específico)
  - "Cidadão retornou" (reverter status)
  - "Excluir" (apenas para quem inseriu)
- ❌ **Modal de declaração**: Layout não conforme especificação oficial
- ❌ **Controle de permissões**: Ações não controladas por perfil
- ❌ **Modal de confirmação**: Para exclusão não implementado

#### **RF25-RF26 - Cabeçalho/Breadcrumb**
- ❌ Breadcrumb atual não segue padrão "Home -> Fila de Atendimento"
- ❌ Navegação "Home" não salva dados como especificado

#### **RF27-RF30 - Adicionar Cidadão**
- ❌ **Agendamento do dia**: Campo existe mas não preenche automaticamente outros campos
- ❌ **Regras de validação RF28**:
  - Profissional não preenche automaticamente equipe
  - Equipe não desabilita campo profissional
  - Tipo "Vacina" não muda botão para "Realizar Vacinação"
- ❌ **Notificação específica**: "✅ Cidadão adicionado com sucesso" não implementada

### 🟡 **IMPORTANTE - Validações e Regras de Negócio**

#### **RF09-RF11 - Filtros Avançados**
- ❌ **Filtro por Equipe**: Lista hardcoded, não busca dados reais da API
- ❌ **Filtro por Profissional**: Lista hardcoded, não busca dados reais da API  
- ❌ **Tipos de Serviço**: Lista não confere com especificação exata
- ❌ **"Ver somente atendimentos não finalizados"**: Não desabilita período e status conforme regra
- ❌ **Aplicação simultânea**: Filtros não funcionam corretamente em conjunto

#### **Cores dos Status (RI02)**
- ❌ **Cores atuais incorretas**:
  - Aguardando: usando amarelo, deveria ser **verde**
  - Em atendimento: usando verde, deveria ser **roxo**  
  - Em escuta inicial: não existe, deveria ser **rosa**
  - Atendimento realizado: usando azul ✅ (correto)
  - Não aguardou: usando cinza ✅ (correto)

#### **Tipos de Serviço Específicos**
- ❌ **Lista atual não confere** com especificação:
  - **Especificado**: Administração de Medicamento, Curativo, Demanda Espontânea, Escuta Inicial, Exames, Nebulização, Odontologia, Procedimentos, Vacina
  - **Atual**: Consulta Médica, Administração de Medicamento, Escuta Inicial, Odontologia, Curativo, Exames, Procedimentos, Demanda Espontânea, Nebulização, Vacina

#### **Formato de Idade**
- ❌ **Atual**: "25 anos" (genérico)
- ❌ **Necessário**: "21a 4m e 8d" (anos, meses e dias específicos)
- ❌ Cálculo preciso baseado na data de nascimento

#### **Horários (RI01)**
- ❌ **Agendamento espontâneo**: Deveria mostrar horário do momento da inserção na fila
- ❌ **Agendamento programado**: Deveria mostrar horário do agendamento original
- ❌ Diferenciação entre tipos de agendamento não implementada

---

### 🟢 **MELHORIAS DE UX/UI**

#### **Interface Específica**
- ❌ **Barra lateral colorida** nos cards para indicação visual rápida do status
- ❌ **Ícones específicos** para cada tipo de atendimento
- ❌ **Tooltips informativos** ao passar o mouse nos botões
- ❌ **Feedback visual** para ações realizadas (além das notificações básicas)

#### **Responsividade Específica**
- ❌ **Adaptação dos botões** em mobile (alguns ficam muito pequenos)
- ❌ **Navegação por tabs** dos filtros em telas pequenas
- ❌ **Scrolling otimizado** para listas grandes de pacientes

---

### 🔵 **BACKEND - APIs e Integrações**

#### **Endpoints API Faltantes**
- ❌ `GET /api/v1/queue` - Fila de atendimento do dia com filtros
- ❌ `PATCH /api/v1/appointments/:id/start_initial_listening` - Iniciar escuta inicial
- ❌ `PATCH /api/v1/appointments/:id/start_pre_attendance` - Iniciar pré-atendimento  
- ❌ `PATCH /api/v1/appointments/:id/start_attendance` - Iniciar atendimento
- ❌ `PATCH /api/v1/appointments/:id/start_vaccination` - Iniciar vacinação
- ❌ `PATCH /api/v1/appointments/:id/mark_no_show` - Marcar como não aguardou
- ❌ `PATCH /api/v1/appointments/:id/mark_returned` - Marcar como retornou
- ❌ `POST /api/v1/appointments/:id/attendance_statement` - Gerar declaração de comparecimento
- ❌ `GET /api/v1/teams` - Listar equipes da unidade
- ❌ `GET /api/v1/users/professionals` - Listar profissionais da unidade

#### **Modelos e Relacionamentos Faltantes**
- ❌ **Modelo Vulnerability**: Para classificação de risco pós-escuta inicial
- ❌ **Enum de Status Completo**: Estados específicos da fila
- ❌ **Relacionamento Appointment <-> Vulnerability**
- ❌ **Campo professional_type** no User (Médico, Enfermeiro, Dentista)
- ❌ **Campo appointment_type** no Appointment (espontâneo vs agendado)

#### **Validações Backend Faltantes**
- ❌ **Controle de perfil**: Validar se profissional pode executar ação específica
- ❌ **Transições de estado**: Validar mudanças válidas de status
- ❌ **Logs LGPD**: Registrar acessos ao prontuário para auditoria
- ❌ **Autorização por criador**: Apenas quem inseriu pode excluir

#### **Integrações Necessárias**
- ❌ **Sistema de Agendamento**: Para diferenciar tipos de demanda
- ❌ **Prontuário Eletrônico**: Para redirecionamentos funcionais
- ❌ **Sistema de Vacinação**: Para página específica
- ❌ **Geração de PDF**: Para declarações de comparecimento oficiais

## 📊 **PRIORIZAÇÃO PARA IMPLEMENTAÇÃO**

### **FASE 1 - Interface e Funcionalidades Core (2-3 dias)**
1. 🔴 **RF02** - Corrigir layout da tela superior e posicionamento
2. 🔴 **RF06** - Implementar "Ver somente meus atendimentos" funcional
3. 🔴 **RI02** - Corrigir cores dos status conforme especificação
4. 🔴 **RF03** - Implementar formato de idade "21a 4m e 8d"
5. 🔴 **RF25-RF26** - Breadcrumb funcional "Home -> Fila de Atendimento"
6. 🔴 **RF03** - Adicionar barra lateral colorida nos cards

### **FASE 2 - Ações e Botões Específicos (3-4 dias)**
1. 🔴 **RF12-RF14** - Botão "Escuta Inicial" específico por perfil
2. 🔴 **RF15-RF17** - Botão "Pré-Atendimento" para demanda agendada
3. 🔴 **RF18-RF20** - Botão "Atender" com redirecionamento
4. 🔴 **RF21-RF22** - Botão "Realizar Vacinação" para tipo vacina
5. 🔴 **RF23-RF24** - Expandir "Mais Opções" com todas as ações
6. 🟡 **RF28** - Implementar regras de validação do formulário

### **FASE 3 - Backend APIs e Integrações (2-3 dias)**
1. 🔵 **Endpoints principais** - APIs para ações da fila
2. 🔵 **Modelo Vulnerability** - Para classificação de risco
3. 🔵 **Sistema de perfis** - Controle por tipo de profissional
4. 🔵 **Validações backend** - Transições de estado e permissões
5. 🔵 **APIs de dados** - Teams e Professionals reais

### **FASE 4 - Polimento e Recursos Avançados (2-3 dias)**
1. 🟡 **Filtros avançados** - Integração com dados reais
2. 🟡 **Tooltips e feedback** - UX melhorada
3. 🔴 **RF05** - Cadastro de novo cidadão completo
4. 🟢 **Responsividade específica** - Ajustes mobile
5. 🔵 **Logs LGPD** - Auditoria e compliance

---

## 🎯 **DECISÕES NECESSÁRIAS ANTES DE INICIAR**

### **📄 Páginas Externas**
**DECISÃO CRÍTICA**: As páginas abaixo existem ou precisam ser criadas?
- ❓ **Escuta Inicial** (`/escuta-inicial/:id`) - Para RF13, RF16
- ❓ **Pré-Atendimento** (`/pre-atendimento/:id`) - Para RF16  
- ❓ **Folha de Rosto** (`/folha-rosto/:id`) - Para RF19
- ❓ **Atendimento de Vacinação** (`/vacinacao/:id`) - Para RF21
- ❓ **Prontuário Eletrônico** (`/prontuario/:id`) - Para integração

**Alternativas**:
- ✅ **Criar páginas mock** para demonstração
- ✅ **Simular redirecionamento** com alert/modal
- ✅ **Implementar páginas básicas** sem funcionalidade completa

### **👤 Sistema de Perfis Profissionais**
**DECISÃO IMPORTANTE**: Como implementar controle de acesso?
- ❓ **Perfis específicos**: Médico, Enfermeiro, Cirurgião-Dentista?
- ❓ **Campo no User**: professional_type ou role?
- ❓ **Permissões**: Tabela separada ou enum simples?

**Sugestão**: Enum simples no User (`professional_type: ['doctor', 'nurse', 'dentist']`)

### **🔗 Integrações com Sistemas Existentes**
**DECISÃO ARQUITETURAL**:
- ❓ **Agendamento**: Integrar com sistema existente ou mock?
- ❓ **Prontuário**: API externa ou simulação?
- ❓ **Vacinação**: Sistema específico ou página própria?

**Sugestão**: Implementar como mock/simulação para MVP

### **📋 Dados de Demonstração**
**DECISÃO PRÁTICA**:
- ❓ **Pacientes**: Quantos e com que dados?
- ❓ **Profissionais**: Lista real ou mock?
- ❓ **Equipes**: Estrutura da unidade de saúde?

**Sugestão**: Seeds com 20-30 pacientes, 5-8 profissionais, 3-4 equipes

---

## 📋 **RESUMO EXECUTIVO ATUALIZADO**

### **📈 Métricas do Projeto**
- **Total de RFs Documentados:** 30 requisitos funcionais
- **✅ Implementados (Parcial/Completo):** ~40% (12/30)
- **❌ Não Implementados:** ~60% (18/30)
- **🔴 Críticos Faltantes:** 12 requisitos
- **🟡 Importantes Faltantes:** 6 requisitos

### **⏱️ Estimativa para Finalização**
- **FASE 1:** 2-3 dias (interface core e correções críticas)
- **FASE 2:** 3-4 dias (ações específicas e botões diferenciados)  
- **FASE 3:** 2-3 dias (backend APIs e novos endpoints)
- **FASE 4:** 2-3 dias (polimento e recursos avançados)
- **TOTAL:** 9-13 dias úteis para implementação completa

### **🚧 Complexidade**
- **Frontend:** Média (muitas mudanças de interface)
- **Backend:** Média-Alta (novos endpoints e modelos)
- **Integrações:** Alta (dependências externas)
- **Testes:** Média (muitas funcionalidades para validar)

### **🔑 Fatores Críticos de Sucesso**
1. **Definir escopo das páginas externas** antes de começar desenvolvimento
2. **Implementar sistema de perfis** simples mas eficaz
3. **Priorizar FASE 1** para estabelecer base sólida
4. **Criar APIs mock** para não bloquear desenvolvimento frontend
5. **Focar na conformidade** com especificações documentadas

### **📋 Recomendação Estratégica**
**Abordagem MVP (Minimum Viable Product):**
1. **Começar pela FASE 1** - Corrigir interface conforme especificação exata
2. **Páginas externas como mock** - Simulação para demonstração das funcionalidades
3. **Sistema de perfis simples** - Enum no User para controle de acesso
4. **APIs essenciais primeiro** - Endpoints críticos para funcionalidades principais
5. **Iterar e validar** - Testar cada fase antes de prosseguir

**Resultado esperado:** Versão funcional e conforme especificação em ~6-8 dias úteis, com possibilidade de expansão e refinamento posterior.
