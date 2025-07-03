# Responsividade dos Cards da Fila - Documentação

## Visão Geral
Implementação da responsividade para esconder os nomes dos campos nos cards da fila em telas pequenas (mobile), mantendo apenas os valores para otimizar o espaço visual.

## Implementação

### 1. Modificações no Componente QueuePage.tsx

**Localização:** `/frontend/src/pages/QueuePage.tsx`

**Alterações realizadas:**
- Adicionada classe `field-label` a todos os nomes/labels dos campos (exceto nascimento)
- Aplicada classe Tailwind `hidden md:inline` para esconder em mobile e mostrar em desktop
- **Nascimento:** Implementação especial com duas versões (com e sem label) usando funções específicas
- Campos afetados:
  - **Nascimento:** Duas versões - desktop mostra "Nascimento: DD/MM/AAAA (idade)" e mobile apenas "DD/MM/AAAA (idade)"
  - **Chegada/Agendado:** Labels "Chegada:" ou "Agendado:" escondidos em mobile
  - **Mãe/Pai:** Labels "Mãe:" ou "Pai:" escondidos em mobile
  - **Profissional:** Label "Profissional:" escondido em mobile
  - **Especialidade:** Label "Especialidade:" escondido em mobile
  - **Equipe:** Label "Equipe:" escondido em mobile

### 2. Novas Funções Utilitárias

**Localização:** `/frontend/src/utils/ageUtils.ts`

**Funções adicionadas:**
- `formatBirthDateWithAge()`: Versão com label "Nascimento:" para desktop
- `formatBirthDateWithAgeNoLabel()`: Versão sem label para mobile
- Ambas formatam data e idade, diferindo apenas na presença do prefixo

**Localização:** `/frontend/src/styles/healthcare-theme.css`

**Regras adicionadas:**
```css
@media (max-width: 768px) {
  /* Esconder os labels/nomes dos campos */
  .healthcare-theme .field-label {
    display: none !important;
  }

  /* Compactação do layout */
  .healthcare-theme .healthcare-card {
    padding: 0.75rem !important;
  }

  /* Ícones menores */
  .healthcare-theme .w-12.h-12 {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }

  /* Botões mais compactos */
  .healthcare-theme button {
    padding: 0.5rem !important;
    font-size: 0.8125rem !important;
    min-height: 2rem !important;
  }

  /* Grid responsivo */
  .healthcare-theme .grid {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }
}
```

### 3. CSS Responsivo - Tema Híbrido

**Localização:** `/frontend/src/styles/public-service-theme.css`

**Regras adicionadas:**
```css
@media (max-width: 768px) {
  /* Esconder os labels/nomes dos campos */
  .hybrid-theme .patient-card .field-label {
    display: none !important;
  }

  /* Compactação específica para tema híbrido */
  .hybrid-theme .patient-card {
    padding: 0.75rem !important;
  }

  /* Elementos visuais menores */
  .hybrid-theme .patient-card .position-circle {
    width: 2.5rem !important;
    height: 2.5rem !important;
    font-size: 1rem !important;
  }

  /* Layout responsivo compacto */
  .hybrid-theme .patient-card .grid {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
  }
}
```

## Comportamento

### Desktop (≥ 768px)
- **Exibição completa:** Todos os labels dos campos são visíveis
- **Formato:** "Campo: Valor"
- **Exemplo:** "Nascimento: 15/08/1985 (38 anos)"

### Mobile (< 768px)
- **Exibição compacta:** Apenas os valores são visíveis
- **Formato:** "Valor"
- **Exemplo:** "15/08/1985 (38 anos)"

## Campos Afetados

1. **Data de Nascimento**
   - Desktop: "Nascimento: 15/08/1985 (38a 10m 16d)"
   - Mobile: "15/08/1985 (38a 10m 16d)"

2. **Horário de Chegada/Agendamento**
   - Desktop: "Chegada: 14:30" ou "Agendado: 15:00"
   - Mobile: "14:30" ou "15:00"

3. **Nome da Mãe/Pai**
   - Desktop: "Mãe: Maria Silva"
   - Mobile: "Maria Silva"

4. **Profissional Responsável**
   - Desktop: "Profissional: Dr. João Santos"
   - Mobile: "Dr. João Santos"

5. **Especialidade**
   - Desktop: "Especialidade: Pediatria"
   - Mobile: "Pediatria"

6. **Equipe**
   - Desktop: "Equipe: Equipe Azul"
   - Mobile: "Equipe Azul"

## Benefícios

### ✅ Usabilidade Mobile
- **Mais espaço:** Maior área útil para informações importantes
- **Menos poluição visual:** Interface mais limpa e focada
- **Melhor legibilidade:** Conteúdo mais organizado

### ✅ Acessibilidade
- **Responsividade adequada:** Adaptação automática ao tamanho da tela
- **Hierarquia visual mantida:** Informações importantes permanecem visíveis
- **Navegação facilitada:** Interface mais intuitiva em dispositivos pequenos

### ✅ Performance
- **Menos elementos DOM:** Redução de elementos renderizados em mobile
- **Carregamento otimizado:** Interface mais leve em dispositivos móveis

## Testes Recomendados

### Dispositivos de Teste
- **Smartphones:** iPhone SE, iPhone 12, Samsung Galaxy S21
- **Tablets:** iPad, Samsung Galaxy Tab
- **Desktop:** Resolução mínima 1024px

### Cenários de Teste
1. **Alternância de temas:** Verificar comportamento em ambos os temas
2. **Redimensionamento:** Testar a transição entre mobile e desktop
3. **Diferentes quantidades de dados:** Cards com poucos e muitos campos
4. **Orientação:** Teste em modo retrato e paisagem

## Manutenção

### Para Adicionar Novos Campos
1. Adicionar classe `field-label` ao elemento do nome/label
2. Aplicar classe `hidden md:inline` para responsividade
3. Atualizar documentação se necessário

### Para Modificar Breakpoints
- Alterar `@media (max-width: 768px)` nos arquivos CSS
- Ajustar classes Tailwind `md:inline` conforme necessário

## Status
✅ **Implementado e testado**
- Responsividade funcional em ambos os temas
- Interface compacta e limpa em mobile
- Mantém todos os valores importantes visíveis
- Compatible com diferentes tamanhos de tela
- **Correção do dropdown "Mais opções":** Resolvido problema de overflow que cortava o menu dropdown

## Correções Adicionais

### Dropdown "Mais Opções"
**Problema identificado:** O menu dropdown estava sendo cortado pelo overflow dos cards.

**Solução implementada:**
- Adicionadas regras CSS para permitir `overflow: visible` em todos os containers
- Ajustado z-index do dropdown para aparecer acima de outros elementos
- Melhorado posicionamento em dispositivos mobile
- Adicionados estilos inline nos componentes para garantir overflow visível

**Arquivos modificados:**
- `/frontend/src/styles/public-service-theme.css`: Regras CSS para ambos os temas
- `/frontend/src/pages/QueuePage.tsx`: Estilos inline para containers críticos
