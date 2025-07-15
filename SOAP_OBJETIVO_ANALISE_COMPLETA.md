# SOAP - Bloco Objetivo - Análise Completa dos Requisitos

## Resumo Executivo
O bloco "Objetivo" do SOAP permite registrar achados clínicos identificados em exame físico, sinais e sintomas, resultados de exames laboratoriais ou de imagem, marcadores de consumo alimentar e situação vacinal.

## Estrutura Geral do Bloco Objetivo

### 1. Acesso e Layout
- **Acesso**: Após o profissional entrar no SOAP e clicar em "Objetivo"
- **Usuários autorizados**: Médicos, enfermeiros, técnicos de enfermagem, cirurgião dentista
- **Conformidade**: Deve respeitar LGPD

### 2. Botões de Habilitação por Faixa Etária/Condição
Após o campo vacinação, apresentar botões condicionais:

#### 2.1. Puericultura
- **Condição**: Pacientes de 0 anos a 18 anos 11 meses e 29 dias
- **Momento**: No momento da consulta
- **Status**: Campos detalhados em documentação futura

#### 2.2. Idoso
- **Condição**: Pacientes com idade ≥ 60 anos
- **Momento**: No momento da consulta
- **Status**: Campos detalhados em documentação futura

#### 2.3. Pré-natal
- **Condição**: Pacientes sexo feminino + problema/condição = "gravidez" ou "gravidez não desejada" (informado no bloco Avaliação)
- **Status**: Campos detalhados em documentação futura

---

## 3. Campo de Texto Livre

### 3.1. Especificações Técnicas
- **Tipo**: Caixa de texto livre
- **Limite**: 4.000 caracteres
- **Obrigatoriedade**: Não obrigatório

### 3.2. Barra de Formatação
Opções de formatação disponíveis:
- **"B"**: Negrito
- **"I"**: Itálico
- **"U"**: Sublinhado
- **"S"**: Tachado
- **"""**: Citação
- **"⤺"**: Desfazer
- **"↷"**: Refazer

---

## 4. Data da Última Menstruação (DUM)

### 4.1. Condições de Exibição
- **Quem vê**: Pacientes sexo biológico feminino
- **Idade**: ≥ 10 anos no momento da consulta
- **Obrigatoriedade**: Não obrigatório

### 4.2. Funcionalidades Especiais
- **Tooltip**: Ao passar cursor sobre "DUM" → "Preencher mesmo se a cidadã estiver com dúvidas"
- **Histórico**: No próximo atendimento, exibir:
  - Data DUM do atendimento anterior
  - Diferença em dias (DUM vs Data atual)
  - Data de registro da DUM anterior

### 4.3. Formato
- **Entrada**: DD/MM/AAAA
- **Tipo**: Campo data

---

## 5. Antropometria, Sinais Vitais e Glicemia Capilar

### 5.1. Interface
- **Tipo**: Botão expansível
- **Obrigatoriedade**: Campos opcionais

### 5.2. Campos Incluídos

#### 5.2.1. Campos da Escuta Inicial (já implementados)
Referenciar regras do documento Sprint 1:
- **Peso (kg)**: RN03
- **Altura (cm)**: RN04  
- **IMC**: RN03 (calculado automaticamente)
- **Pressão arterial (mmHg)**: RN05 e RN06
- **Frequência respiratória (mpm)**: RN08
- **Frequência cardíaca (bpm)**: RN07
- **Temperatura (ºC)**: RN09
- **Saturação de O2 (%)**: RN10
- **Glicemia capilar (mg/dL)**: RN11

#### 5.2.2. Perímetro Cefálico (cm)
- **Formato**: 000,0 cm
- **Validação**: 10-200 cm
- **Erro**: "Deve ter valor entre 10 e 200"
- **Decimal**: Até 1 casa após vírgula
- **Vírgula**: Apenas após pelo menos 1 dígito

**Interpretações de entrada**:
```
Entrada     → Interpretação
20,5        → 20,5 cm
00020       → 20 cm  
100,        → 100 cm (vírgula sem decimal)
00180       → 180 cm
```

#### 5.2.3. Circunferência Abdominal (cm)
- **Formato**: 000,0 cm
- **Decimal**: Até 1 casa após vírgula
- **Vírgula**: Apenas após pelo menos 1 dígito
- **Interpretações**: Mesmas do perímetro cefálico

**Alerta de Risco Cardiovascular**:
- **Baseado**: Tabela OMS
- **Critério**: Sexo biológico (independente da idade)
- **Ativação**: Ao inserir valor numérico

#### 5.2.4. Perímetro da Panturrilha (cm)
- **Formato**: 000,0 cm
- **Validação**: 10-99 cm
- **Erro**: "Deve ter valor entre 10 e 99"
- **Decimal**: Até 1 casa após vírgula
- **Vírgula**: Apenas após pelo menos 1 dígito
- **Interpretações**: Mesmas do perímetro cefálico

---

## 6. Marcadores de Consumo Alimentar

### 6.1. Interface Geral
- **Tipo**: Botão expansível
- **Botão "Limpar campos"**: 
  - Inativo por padrão
  - Ativado quando qualquer campo preenchido
  - Remove todos os dados quando clicado

### 6.2. Mensagens Informativas (fixas por idade)
- **< 6 meses**: "Criança menor de 6 meses"
- **6-23 meses**: "Criança de 6 a 23 meses"  
- **≥ 2 anos**: "Crianças com 2 anos ou mais, adolescentes, adultos, gestantes e pessoas idosas"
- **Aviso geral**: "Para registrar os marcadores de consumo alimentar todas as perguntas devem ser respondidas" (caixa destaque com símbolo informativo)

### 6.3. Menores de 6 meses

#### 6.3.1. Opções de Resposta
- Sim / Não / Não sabe (seleção única)

#### 6.3.2. Perguntas
1. **A criança ontem tomou leite do peito?**
2. **Ontem a criança consumiu:**
   - Mingau
   - Água/Chá
   - Leite de vaca
   - Fórmula infantil
   - Suco de fruta
   - Fruta
   - Comida de sal (de panela, papa ou sopa)
   - Outros alimentos/bebidas

### 6.4. De 6 a 23 meses

#### 6.4.1. Opções de Resposta
- **Principal**: Sim / Não / Não sabe (seleção única)
- **Condicionais**: 1 vez / 2 vezes / 3 vezes / Não sabe (seleção única)

#### 6.4.2. Perguntas com Condicionais
1. **A criança ontem tomou leite do peito?**

2. **Ontem a criança comeu fruta inteira, em pedaços ou amassada?**
   - Se sim: quantas vezes?

3. **Ontem a criança comeu comida de sal (de panela, papa ou sopa)?**
   - Se sim: quantas vezes?
   - Se sim: essa comida foi oferecida:
     - Em pedaço / Amassada / Passada na peneira / Liquidificada / Só o caldo / Não sabe

#### 6.4.3. Perguntas Simples (Ontem a criança consumiu:)
- Outro leite que não o leite de peito
- Mingau com leite
- Iogurte
- Legumes (não considerar temperos, nem batata, mandioca/aipim/macaxeira, cará, inhame)
- Vegetal ou fruta de cor alaranja (abóbora/jerimum, cenoura, mamão, manga) ou folhas verde-escuras (couve, caruru, beldroega, bertalha, espinafre, mostarda)
- Verdura de folha (alface, acelga, repolho)
- Carne (boi, frango, peixe, porco, miúdos, outras) ou ovo
- Fígado
- Feijão
- Arroz, batata, inhame, aipim/macaxeira/mandioca, farinha ou macarrão (sem ser instantâneo)
- Hambúrguer e/ou embutidos (presunto, mortadela, salame, linguiça, salsicha)
- Bebidas adoçadas (refrigerante, suco de caixinha, suco em pó, água de coco de caixinha, xaropes de guaraná/groselha ou suco de fruta com adição de açúcar)
- Biscoito recheado, doces ou guloseimas (balas, pirulitos, chiclete, caramelo, gelatina)

### 6.5. Maior ou Igual a 2 Anos

#### 6.5.1. Opções de Resposta
- Sim / Não / Não sabe (seleção única)

#### 6.5.2. Perguntas
1. **Você tem costume de realizar as refeições assistindo à TV, mexendo no computador e/ou celular?**

2. **Quais refeições você faz ao longo do dia?** (múltipla seleção)
   - Café da manhã
   - Lanche da manhã
   - Almoço
   - Lanche da tarde
   - Jantar
   - Ceia

3. **Ontem você consumiu:**
   - Feijão
   - Frutas frescas (não considerar suco de frutas)
   - Verduras e/ou legumes (não considerar batata, mandioca, aipim, macaxeira, cará e inhame)
   - Hambúrguer e/ou embutidos (presunto, mortadela, salame, linguiça, salsicha)
   - Bebidas adoçadas (refrigerante, suco de caixinha, suco em pó, água de coco de caixinha, xaropes de guaraná/groselha ou suco de fruta com adição de açúcar)
   - Macarrão instantâneo, salgadinhos de pacote ou biscoitos salgados
   - Biscoito recheado, doces ou guloseimas (balas, pirulitos, chiclete, caramelo, gelatina)

---

## 7. Vacinação em Dia

### 7.1. Especificações
- **Tipo**: Seleção única
- **Opções**: SIM / Não
- **Funcionalidade**: Símbolo "X" ao lado da opção selecionada para limpar seleção
- **Obrigatoriedade**: Não obrigatório

---

## 8. Resultados de Exames

### 8.1. Botão Principal
- **Ação**: Abrir modal "Adicionar resultados de exames"
- **Campo busca**: "Adicionar exame sem solicitação"

### 8.2. Modal de Adição

#### 8.2.1. Busca de Exames
- **Critério**: Nome do exame OU código SIGTAP
- **Resultado**: Lista para seleção

#### 8.2.2. Campos Após Seleção

**Campos Opcionais**:
- **Exame realizado em**: DD/MM/AAAA
- **Resultado em**: DD/MM/AAAA

**Campos Obrigatórios**:
- **Resultado de exame**: Texto livre, 2.000 caracteres (incluindo espaços)
- **Realizado em**: DD/MM/AAAA

#### 8.2.3. Funcionalidades do Modal

**Ícone Excluir (🗑️)**:
- **Local**: Próximo ao nome do exame
- **Ação**: Modal "Deseja excluir este exame? Os dados deste exame não serão salvos."
- **Botões**: Cancelar / Fechar(X) / Excluir

**Botão Salvar**:
- **Ação**: Salva dados e retorna ao modal

**Botão Cancelar**:
- **Ação**: Modal "Deseja sair sem salvar? As alterações realizadas serão perdidas"
- **Opções**: 
  - "Sim, sair da tela" → Encerra sem salvar
  - "Não, continuar aqui" → Retorna ao modal

### 8.3. Exames com Campos Numéricos Especiais

#### 8.3.1. Lista de Exames SIGTAP
| Código SIGTAP | Exame |
|---------------|-------|
| 0202010295 | Dosagem de Colesterol Total |
| 0202010279 | Dosagem de Colesterol HDL |
| 0202010287 | Dosagem de Colesterol LDL |
| 0202010678 | Dosagem de Triglicerídeos |
| 0202010317 | Dosagem de Creatinina |
| 0202050025 | Clearance de Creatinina |

#### 8.3.2. Regras para Exames Numéricos
- **Campo numérico obrigatório**: Valor inteiro 1-10000
- **Validação**: "Deve ter valor entre 1 e 10000"
- **Campo descrição**: Habilitado após preenchimento numérico (2.000 caracteres)

---

## 9. Lista de Resultados de Exames Incluídos

### 9.1. Ordenação e Marcação
- **Ordem**: Alfabética
- **Tag**: "registrado agora"
- **Interface**: Botão expansível

### 9.2. Campos Exibidos
- **Nome do exame**
- **Data da realização**: DD/MM/AAAA
- **Data de resultado**: DD/MM/AAAA ou "-" (se vazio)
- **Data de solicitação**: DD/MM/AAAA ou "-" (se vazio)
- **Resultado (mg/dL)**: Para exames numéricos obrigatórios
- **Resultado**: Informação do campo resultado
- **Descrição**: Para exames com resultado numérico obrigatório

---

## 10. Histórico de Resultados de Exames

### 10.1. Condições de Habilitação
- **Requisito**: Pelo menos 1 resultado de exame em atendimento anterior
- **Estado inicial**: Desabilitado até primeiro registro

### 10.2. Modal de Histórico

#### 10.2.1. Interface
- **Título**: "Histórico de resultados de exames"
- **Busca**: "Pesquise por exame ou código"
- **Ordenação**: Último resultado no topo

#### 10.2.2. Lista de Exames
**Informações básicas**:
- Nome do exame + código SIGTAP
- **Realizado em**: Conforme registro
- **Última avaliação em**: Data de inserção no sistema

#### 10.2.3. Detalhes do Exame (ao clicar)
- **Realizado em**: DD/MM/AAAA
- **Resultado em**: DD/MM/AAAA ou "-"
- **Resultado (mg/dL)**: Para exames numéricos
- **Resultado**: Campo resultado
- **Descrição**: Para exames numéricos
- **Avaliado por**: Nome + especialidade + data

#### 10.2.4. Rodapé e Fechamento
- **Contador**: Total de exames exibidos
- **Detalhe**: Total de registros por exame
- **Botão fechar(X)**: Retorna à tela SOAP

---

## Próximos Passos para Implementação

### Fase 1: Estrutura Base
1. Criar componente principal do bloco Objetivo
2. Implementar campo de texto livre com formatação
3. Implementar lógica de botões condicionais (Puericultura/Idoso/Pré-natal)

### Fase 2: Campos Específicos
1. Implementar campo DUM com histórico
2. Criar seção antropometria/sinais vitais expansível
3. Implementar novos campos de perímetros com validações

### Fase 3: Marcadores de Consumo
1. Criar interface expansível por faixa etária
2. Implementar questões condicionais
3. Implementar botão "limpar campos"

### Fase 4: Vacinação e Exames
1. Implementar campo vacinação
2. Criar modal de adição de exames com integração SIGTAP
3. Implementar lista e histórico de exames

### Fase 5: Integrações
1. Integração com API SIGTAP para busca de exames
2. Implementação de alertas de risco cardiovascular (OMS)
3. Testes de integração e validação

---

## Considerações Técnicas

### Validações Especiais
- Máscaras numéricas com vírgula decimal
- Validações de faixa etária em tempo real
- Cálculos automáticos (diferença de dias DUM)
- Integração com tabelas OMS e SIGTAP

### UX/UI Importantes
- Tooltips informativos
- Mensagens de erro contextuais
- Botões condicionais baseados em dados do paciente
- Modais de confirmação para ações destrutivas
- Interface responsiva para diferentes campos por idade

### Integrações Necessárias
- API SIGTAP para códigos de exames
- Tabela OMS para risco cardiovascular
- Sistema de histórico de atendimentos
- Validações LGPD para dados sensíveis
