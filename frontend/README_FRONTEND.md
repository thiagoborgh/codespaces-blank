# Frontend - Sistema de Prontuário Eletrônico

Frontend em React/TypeScript para o sistema de prontuário eletrônico, integrado com backend Rails via API REST.

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para consumo de APIs
- **Heroicons** - Biblioteca de ícones

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── layout/         # Componentes de layout
│   ├── patients/       # Componentes específicos de pacientes
│   ├── appointments/   # Componentes de agendamentos
│   └── consultations/  # Componentes de consultas
├── pages/              # Páginas principais
├── contexts/           # Context API (AuthContext, etc.)
├── hooks/              # Custom hooks
├── services/           # Serviços (API, utilitários)
├── types/              # Definições de tipos TypeScript
└── utils/              # Funções utilitárias
```

## 🎨 Design System

### Cores Principais
- **Primary**: Azul (#3b82f6) - Elementos principais, botões primários
- **Success**: Verde (#22c55e) - Confirmações, status positivos
- **Warning**: Amarelo (#f59e0b) - Avisos, status de atenção
- **Danger**: Vermelho (#ef4444) - Erros, ações destrutivas

### Tipografia
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Backend Rails em execução (porta 3001)

### Instalação
```bash
# Ir para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

### Variáveis de Ambiente
```env
REACT_APP_API_URL=http://localhost:3001/api/v1
NODE_ENV=development
```

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Logout
- [x] Proteção de rotas
- [x] Context de autenticação
- [x] Interceptors para token JWT

### ✅ Dashboard
- [x] Estatísticas gerais
- [x] Agendamentos do dia
- [x] Ações rápidas
- [x] Layout responsivo

### ✅ Pacientes
- [x] Listagem com paginação
- [x] Busca por nome/CPF
- [x] Visualização de detalhes
- [x] Formatação de dados (CPF, telefone, etc.)

### 🔄 Em Desenvolvimento
- [ ] Cadastro/edição de pacientes
- [ ] Agendamentos (CRUD completo)
- [ ] Consultas médicas
- [ ] Prontuário SOAP
- [ ] Sinais vitais
- [ ] Medicamentos e prescrições

## 🏗️ Arquitetura

### Context API
- **AuthContext**: Gerenciamento de autenticação, login/logout, dados do usuário

### Custom Hooks
- **usePatients**: Hook para gerenciar estado e operações de pacientes
- **useAppointments**: Hook para agendamentos
- **useAuth**: Hook para autenticação

### Serviços
- **apiService**: Cliente HTTP centralizado com interceptors
- **formatUtils**: Funções de formatação (CPF, telefone, datas, etc.)

### Componentes
- **Layout**: Layout principal com sidebar e header
- **ProtectedRoute**: Proteção de rotas autenticadas

## 🔄 Integração com Backend

### Endpoints Utilizados
```
POST /api/v1/auth/login        # Login
DELETE /api/v1/auth/logout     # Logout
GET /api/v1/auth/me           # Dados do usuário atual
GET /api/v1/patients          # Listar pacientes
GET /api/v1/appointments      # Listar agendamentos
```

### Tratamento de Erros
- Interceptor automático para logout em caso de 401
- Exibição de mensagens de erro amigáveis
- Loading states para melhor UX

## 📱 Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Layout com sidebar fixa
- **Tablet**: Layout adaptativo
- **Mobile**: Sidebar colapsável com overlay

## 🚀 Como Executar

1. **Backend Rails** (porta 3001):
```bash
cd backend
rails s -p 3001
```

2. **Frontend React** (porta 3000):
```bash
cd frontend
npm start
```

3. **Acessar aplicação**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1

## 🎯 Próximos Passos

1. Implementar formulários de cadastro/edição de pacientes
2. Criar páginas de agendamentos
3. Desenvolver interface de consultas
4. Adicionar sistema de notificações
5. Implementar prontuário SOAP completo

---

**Desenvolvido com ❤️ para modernizar o atendimento médico**
