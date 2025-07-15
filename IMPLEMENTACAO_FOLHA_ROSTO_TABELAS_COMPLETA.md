# Implementação da Folha Rosto - Tabelas e Gráficos

## Resumo da Implementação

Foram implementadas as estruturas HTML da "folha rosto" do sistema de prontuário eletrônico, trazendo do protótipo original as seguintes funcionalidades:

### 1. **Informações do Atendimento**

#### **Informações Iniciais** 
- Cards com dados básicos do paciente:
  - Data de nascimento
  - Idade
  - Gênero  
  - Telefone
  - Endereço
  - Responsável

#### **Tabela de Últimas Consultas**
- Colunas implementadas:
  - **Data**: Data e hora da consulta
  - **CIAP 2**: Código e descrição CIAP 2
  - **CID 10**: Código e descrição CID 10
  - **Intervenções e/ou procedimentos**: Descrição das intervenções realizadas
  - **Idade**: Idade do paciente na época da consulta
  - **Tipo**: Badge colorido indicando o tipo (Escuta, Consulta, Procedimento)
  - **Ações**: Botão para visualizar detalhes

#### **Tabela de Encaminhamentos**
- Colunas implementadas:
  - **Data**: Data e hora do encaminhamento
  - **Profissional**: Nome do profissional que fez o encaminhamento
  - **Especialidade**: Especialidade para qual foi encaminhado
  - **Hipótese/Diagnóstico**: Hipótese diagnóstica ou motivo
  - **Ações**: Botão para visualizar detalhes

### 2. **Sub-aba Medições**

#### **Antropometria**
- **Tabela com dados**:
  - Data da medição
  - Peso (kg)
  - Altura (cm)
  - IMC (kg/m²) - calculado automaticamente
  - Perímetro cefálico (cm)
  - Circunferência abdominal (cm)
  - Perímetro da panturrilha (cm)
  - Status com badges coloridos

- **Gráfico de Linha** (Chart.js):
  - Evolução do peso ao longo do tempo
  - Evolução do IMC com eixo Y secundário
  - Filtro por faixa etária

#### **Sinais Vitais**
- **Tabela com dados**:
  - Data da medição
  - Pressão arterial (mmHg)
  - Frequência respiratória (mpm)
  - Frequência cardíaca (bpm)
  - Saturação de O₂ (%)
  - Temperatura (°C)
  - Status com interpretação clínica

- **Gráfico de Linha** (Chart.js):
  - Múltiplas linhas para pressão sistólica, diastólica e frequência cardíaca
  - Filtro por competência (mês/ano)

#### **Glicemia**
- **Tabela com dados**:
  - Data da medição
  - Glicemia capilar (mg/dL)
  - Momento da coleta (Jejum, Pré-prandial, Pós-prandial)
  - Status com interpretação clínica baseada no momento

- **Gráfico de Linha** (Chart.js):
  - Evolução da glicemia com área preenchida
  - Linhas de referência para hipoglicemia e hiperglicemia
  - Filtro por competência

## Arquivos Implementados/Modificados

### **Ruby on Rails (Backend)**

1. **`/backend/app/views/medical_records/_folha_rosto_info_atendimento.html.erb`**
   - Tabela de últimas consultas
   - Tabela de encaminhamentos
   - Cards de informações iniciais

2. **`/backend/app/views/medical_records/_folha_rosto_medicoes.html.erb`**
   - Tabelas de antropometria, sinais vitais e glicemia
   - Estrutura para gráficos Chart.js
   - Sub-abas para organização

3. **`/backend/app/views/medical_records/_folha_rosto_charts.html.erb`**
   - JavaScript para inicialização dos gráficos
   - Funções para células editáveis
   - Helpers para cálculos médicos
   - CSS personalizado

4. **`/backend/app/helpers/application_helper.rb`**
   - Funções auxiliares para cálculos médicos
   - Formatação de dados
   - Status e interpretações clínicas

5. **`/backend/app/controllers/medical_records_controller.rb`**
   - Carregamento de dados para as tabelas
   - Variáveis para consultas, encaminhamentos, medições

### **Demonstração Standalone**

6. **`/demo-folha-rosto.html`**
   - Página HTML completa demonstrando a implementação
   - Dados de exemplo para visualização
   - Gráficos funcionais com Chart.js

## Funcionalidades Implementadas

### **Interatividade**
- ✅ **Células editáveis**: Click para editar valores diretamente na tabela
- ✅ **Gráficos responsivos**: Charts.js com redimensionamento automático
- ✅ **Filtros dinâmicos**: Por faixa etária e competência
- ✅ **Navegação por abas**: Organização clara do conteúdo
- ✅ **Badges coloridos**: Status visuais para diferentes condições

### **Cálculos Automáticos**
- ✅ **IMC**: Calculado automaticamente peso/altura²
- ✅ **Interpretação clínica**: Status baseado em valores de referência
- ✅ **Idade na consulta**: Cálculo da idade no momento da consulta
- ✅ **Formatação de dados**: CPF, telefone, datas

### **Gráficos Chart.js**
- ✅ **Antropometria**: Peso e IMC com eixos duplos
- ✅ **Sinais Vitais**: Múltiplas linhas para diferentes parâmetros
- ✅ **Glicemia**: Área preenchida com linhas de referência
- ✅ **Responsividade**: Adaptação a diferentes tamanhos de tela

## Integração com Ruby on Rails

### **Models Necessários**
```ruby
# Consultas
has_many :consultations
# Encaminhamentos  
has_many :referrals
# Medições antropométricas
has_many :measurements
# Sinais vitais
has_many :vital_signs
# Glicemia
has_many :glycemia_measurements
```

### **Helpers Implementados**
- `calculate_age_at_date()` - Idade em data específica
- `calculate_bmi()` - Cálculo do IMC
- `bmi_status()` - Interpretação do IMC
- `blood_pressure_status()` - Interpretação da pressão arterial
- `glycemia_status()` - Interpretação da glicemia
- `temperature_status()` - Interpretação da temperatura
- `oxygen_saturation_status()` - Interpretação da saturação
- `heart_rate_status()` - Interpretação da frequência cardíaca

### **Controller Actions**
- Carregamento de dados relacionados para as views
- Preparação de variáveis para gráficos
- Endpoint para atualização de medições via AJAX

## Tecnologias Utilizadas

- **Backend**: Ruby on Rails 8.0+
- **Frontend**: Bootstrap 5.3, Bootstrap Icons
- **Gráficos**: Chart.js
- **Interatividade**: JavaScript vanilla, Alpine.js
- **Responsividade**: CSS Grid, Flexbox
- **Tipografia**: Inter Font Family

## Como Visualizar

### **No Projeto Ruby**
1. Acesse a rota do prontuário: `/medical_records/:id`
2. Navegue para a aba "Folha Rosto"
3. Alterne entre "Informações do atendimento" e "Medições"

### **Demonstração Standalone**
1. Abra o arquivo `demo-folha-rosto.html` no navegador
2. Explore as funcionalidades interativas
3. Teste a edição de células e navegação por abas

## Próximos Passos

1. **Integração completa**: Conectar com models e dados reais
2. **Validações**: Adicionar validações nos formulários de edição
3. **Permissões**: Controle de acesso para edição de dados
4. **Export**: Funcionalidade para exportar dados e gráficos
5. **Filtros avançados**: Mais opções de filtro e busca
6. **Notificações**: Alertas para valores fora dos parâmetros normais

---

A implementação traz uma interface moderna e funcional para visualização e gestão de dados clínicos, mantendo a usabilidade e acessibilidade como prioridades principais.
