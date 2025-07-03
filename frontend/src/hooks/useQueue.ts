import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { QueueFilters } from '../components/queue/FilterModal';

// IMPORTANTE: Cada item na fila é um AGENDAMENTO, não apenas um paciente
// Um paciente pode ter múltiplos agendamentos (ex: consulta + vacina)
// Cada agendamento tem seu próprio status independente
export interface QueuePatient {
  id: number; // ID do AGENDAMENTO (não do paciente)
  name: string; // Nome do paciente
  age: number;
  ageFormatted: string; // formato: "21a 4m 8d"
  birthDate: string; // data de nascimento YYYY-MM-DD
  phone?: string;
  arrivalTime: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'initial_listening' | 'no_show';
  serviceType: string; // O serviço específico deste agendamento
  estimatedWaitTime: number;
  notes?: string;
  position: number; // Posição deste agendamento na fila
  cpf?: string;
  cns?: string;
  professional?: string;
  team?: string;
  appointmentDate?: string;
  motherName?: string;
  fatherName?: string;
  photo?: string; // URL da foto ou null
  specialty?: string;
  vulnerabilityRisk?: 'Alta' | 'Média' | 'Baixa'; // após escuta inicial
  appointmentType: 'spontaneous' | 'scheduled'; // espontâneo ou programado
  initialListeningCompleted: boolean;
  insertionTime: string; // horário de inserção na fila
  scheduledTime?: string; // horário agendado (se programado)
  patientId?: number; // ID real do paciente (para relacionar múltiplos agendamentos)
}

export interface QueueStats {
  waiting: number;
  inProgress: number;
  completed: number;
  totalToday: number;
  averageWaitTime: number;
}

// Dados mock para desenvolvimento
const mockPatients: QueuePatient[] = [
  {
    id: 1,
    name: 'Maria Silva',
    age: 45,
    ageFormatted: '45a 2m 15d',
    birthDate: '1979-04-15',
    phone: '(11) 99999-1111',
    arrivalTime: '08:30',
    priority: 'high',
    status: 'in_progress',
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 0,
    notes: 'Retorno - pressão alta',
    position: 0,
    cpf: '123.456.789-00',
    cns: '123456789012345',
    professional: 'Dra. Maria Assunção',
    specialty: 'Clínica Médica',
    team: 'Equipe 1',
    motherName: 'Ana Maria Silva',
    appointmentType: 'spontaneous',
    initialListeningCompleted: true,
    insertionTime: '08:30',
    vulnerabilityRisk: 'Alta',
    patientId: 1 // ID do paciente Maria Silva
  },
  {
    id: 2,
    name: 'João Santos',
    age: 62,
    ageFormatted: '62a 8m 3d',
    birthDate: '1961-10-27',
    phone: '(11) 99999-2222',
    arrivalTime: '09:15',
    priority: 'urgent',
    status: 'waiting',
    serviceType: 'Escuta Inicial',
    estimatedWaitTime: 15,
    notes: 'Dor no peito',
    position: 1,
    cpf: '987.654.321-00',
    cns: '987654321098765',
    professional: 'Dr. João Silva',
    specialty: 'Cardiologia',
    team: 'Equipe 1',
    motherName: 'Carmen Santos',
    appointmentType: 'spontaneous',
    initialListeningCompleted: false,
    insertionTime: '09:15'
  },
  {
    id: 3,
    name: 'Ana Costa',
    age: 28,
    ageFormatted: '28a 3m 15d',
    birthDate: '1996-03-15',
    phone: '(11) 99999-3333',
    arrivalTime: '09:30',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 45,
    notes: 'Consulta de rotina',
    position: 2,
    cpf: '456.789.123-00',
    professional: 'Dr. Carlos Pereira',
    specialty: 'Clínica Geral',
    team: 'Equipe 2',
    motherName: 'Lucia Costa',
    appointmentType: 'scheduled',
    initialListeningCompleted: true,
    insertionTime: '09:00',
    scheduledTime: '09:30',
    vulnerabilityRisk: 'Baixa'
  },
  {
    id: 4,
    name: 'Pedro Oliveira',
    age: 35,
    ageFormatted: '35a 11m 2d',
    birthDate: '1988-07-28',
    phone: '(11) 99999-4444',
    arrivalTime: '09:45',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Exames',
    estimatedWaitTime: 60,
    notes: 'Exame de sangue',
    position: 3,
    cpf: '789.123.456-00',
    professional: 'Enf. Maria Assunção',
    specialty: 'Enfermagem',
    team: 'Equipe 1',
    fatherName: 'José Oliveira',
    appointmentType: 'scheduled',
    initialListeningCompleted: false,
    insertionTime: '09:45',
    scheduledTime: '09:45'
  },
  {
    id: 5,
    name: 'Lucia Ferreira',
    age: 58,
    ageFormatted: '58a 1m 28d',
    birthDate: '1966-05-02',
    phone: '(11) 99999-5555',
    arrivalTime: '10:00',
    priority: 'low',
    status: 'waiting',
    serviceType: 'Administração de Medicamento',
    estimatedWaitTime: 75,
    notes: 'Acompanhamento diabetes',
    position: 4,
    cpf: '321.654.987-00',
    professional: 'Enf. João Silva',
    specialty: 'Enfermagem',
    team: 'Equipe 2',
    motherName: 'Rosa Ferreira',
    appointmentType: 'spontaneous',
    initialListeningCompleted: true,
    insertionTime: '10:00',
    vulnerabilityRisk: 'Média'
  },
  {
    id: 6,
    name: 'Roberto Silva',
    age: 42,
    ageFormatted: '42a 8m 3d',
    birthDate: '1981-10-27',
    phone: '(11) 99999-6666',
    arrivalTime: '07:45',
    priority: 'normal',
    status: 'completed',
    serviceType: 'Vacina',
    estimatedWaitTime: 0,
    notes: 'Vacina da gripe',
    position: 0,
    cpf: '159.753.486-00',
    professional: 'Enf. Maria Assunção',
    specialty: 'Enfermagem',
    team: 'Equipe 1',
    motherName: 'Antônia Silva',
    appointmentType: 'scheduled',
    initialListeningCompleted: true,
    insertionTime: '07:30',
    scheduledTime: '07:45',
    vulnerabilityRisk: 'Baixa'
  },
  {
    id: 7,
    name: 'Ana Beatriz Santos',
    age: 0,
    ageFormatted: '0a 8m 12d',
    birthDate: '2024-10-18',
    phone: '(11) 98765-4321',
    arrivalTime: '09:15',
    priority: 'high',
    status: 'waiting',
    serviceType: 'Consulta Pediátrica',
    estimatedWaitTime: 45,
    notes: 'Primeira consulta',
    position: 5,
    cpf: '987.654.321-10',
    professional: 'Dr. Pedro Almeida',
    specialty: 'Pediatria',
    team: 'Equipe 3',
    motherName: 'Carla Santos',
    fatherName: 'João Santos',
    appointmentType: 'scheduled',
    initialListeningCompleted: false,
    insertionTime: '09:00',
    scheduledTime: '09:15',
    vulnerabilityRisk: 'Alta'
  },
  {
    id: 8,
    name: 'Miguel Oliveira',
    age: 3,
    ageFormatted: '3a 2m 28d',
    birthDate: '2021-04-02',
    phone: '(11) 91234-5678',
    arrivalTime: '10:30',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Vacina Infantil',
    estimatedWaitTime: 20,
    notes: 'Vacinação de rotina',
    position: 6,
    cpf: '456.789.123-45',
    professional: 'Enf. Lucia Costa',
    specialty: 'Enfermagem',
    team: 'Equipe 1',
    motherName: 'Sandra Oliveira',
    appointmentType: 'spontaneous',
    initialListeningCompleted: true,
    insertionTime: '10:15',
    vulnerabilityRisk: 'Baixa'
  },
  {
    id: 9,
    name: 'Dona Francisca Lima',
    age: 89,
    ageFormatted: '89a 5m 7d',
    birthDate: '1935-01-23',
    phone: '(11) 95555-1234',
    arrivalTime: '08:00',
    priority: 'urgent',
    status: 'in_progress',
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 0,
    notes: 'Hipertensão - consulta urgente',
    position: 0,
    cpf: '123.456.789-87',
    professional: 'Dr. Carlos Medeiros',
    specialty: 'Geriatria',
    team: 'Equipe 2',
    motherName: 'Maria Lima',
    appointmentType: 'spontaneous',
    initialListeningCompleted: true,
    insertionTime: '07:45',
    vulnerabilityRisk: 'Alta'
  },
  {
    id: 10,
    name: 'José da Conceição',
    age: 67,
    ageFormatted: '67a 3m 12d',
    birthDate: '1957-03-18',
    phone: '(11) 98888-7777',
    arrivalTime: '10:45',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 30,
    notes: 'Acompanhamento diabetes',
    position: 7,
    cpf: '555.666.777-88',
    cns: '555666777889900',
    professional: 'Dra. Ana Lúcia',
    specialty: 'Endocrinologia',
    team: 'Equipe 1',
    motherName: 'Rosa da Conceição',
    appointmentType: 'spontaneous',
    initialListeningCompleted: false,
    insertionTime: '10:45'
  },
  {
    id: 11,
    name: 'María José González',
    age: 34,
    ageFormatted: '34a 6m 22d',
    birthDate: '1990-01-08',
    phone: '(11) 97777-8888',
    arrivalTime: '11:00',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Consulta Ginecológica',
    estimatedWaitTime: 40,
    notes: 'Consulta de rotina - preventivo',
    position: 8,
    cpf: '444.555.666-77',
    cns: '444555666778899',
    professional: 'Dra. Patrícia Müller',
    specialty: 'Ginecologia',
    team: 'Equipe 3',
    motherName: 'Carmen González',
    appointmentType: 'scheduled',
    initialListeningCompleted: true,
    insertionTime: '10:50',
    scheduledTime: '11:00',
    vulnerabilityRisk: 'Baixa'
  },
  {
    id: 12,
    name: 'Lucas Silva Santos',
    age: 25,
    ageFormatted: '25a 4m 10d',
    birthDate: '1999-02-20',
    phone: '(11) 96666-5555',
    arrivalTime: '11:15',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 35,
    notes: 'Consulta de rotina',
    position: 9,
    cpf: '333.444.555-66',
    cns: '333444555667788',
    professional: 'Dr. Rafael Costa',
    specialty: 'Clínica Geral',
    team: 'Equipe 1',
    motherName: 'Fernanda Silva',
    appointmentType: 'spontaneous',
    initialListeningCompleted: false,
    insertionTime: '11:15'
  },
  {
    // AGENDAMENTO ADICIONAL: Maria Silva tem outro agendamento (vacina) além da consulta médica
    id: 13,
    name: 'Maria Silva', // Mesmo paciente, agendamento diferente
    age: 45,
    ageFormatted: '45a 2m 15d',
    birthDate: '1979-04-15',
    phone: '(11) 99999-1111',
    arrivalTime: '11:30',
    priority: 'normal',
    status: 'waiting',
    serviceType: 'Vacina da Gripe', // Serviço diferente
    estimatedWaitTime: 10,
    notes: 'Vacina anual - mesma paciente',
    position: 10,
    cpf: '123.456.789-00', // Mesmo CPF
    cns: '123456789012345', // Mesmo CNS
    professional: 'Enf. Maria Assunção',
    specialty: 'Enfermagem',
    team: 'Equipe 1',
    motherName: 'Ana Maria Silva',
    appointmentType: 'scheduled',
    initialListeningCompleted: true,
    insertionTime: '11:20',
    scheduledTime: '11:30',
    vulnerabilityRisk: 'Baixa',
    patientId: 1 // Mesmo ID de paciente do agendamento ID 1
  },
  {
    // EXEMPLO DE AGENDAMENTO QUE JÁ FOI MARCADO COMO "NÃO AGUARDOU"
    id: 14,
    name: 'Carlos Teste',
    age: 40,
    ageFormatted: '40a 0m 0d',
    birthDate: '1984-01-01',
    phone: '(11) 99999-9999',
    arrivalTime: '10:00',
    priority: 'normal',
    status: 'no_show', // Status já definido como "não aguardou"
    serviceType: 'Consulta Médica',
    estimatedWaitTime: 0,
    notes: 'Paciente não aguardou o atendimento',
    position: 11,
    cpf: '999.888.777-66',
    professional: 'Dr. Teste',
    specialty: 'Clínica Geral',
    team: 'Equipe 1',
    motherName: 'Mãe do Teste',
    appointmentType: 'scheduled',
    initialListeningCompleted: false,
    insertionTime: '09:45',
    scheduledTime: '10:00',
    patientId: 14
  },
  {
    // TESTE: Agendamento para demonstrar a funcionalidade "Cidadão não aguardou"
    id: 15,
    name: 'Teste Funcionalidade',
    age: 30,
    ageFormatted: '30a 0m 0d',
    birthDate: '1994-01-01',
    phone: '(11) 99999-0000',
    arrivalTime: '14:00',
    priority: 'normal',
    status: 'waiting', // Status aguardando para testar
    serviceType: 'Consulta de Teste',
    estimatedWaitTime: 20,
    notes: 'Agendamento para testar funcionalidade "não aguardou"',
    position: 12,
    cpf: '111.222.333-44',
    professional: 'Dr. Teste',
    specialty: 'Teste',
    team: 'Equipe Teste',
    motherName: 'Mãe do Teste',
    appointmentType: 'spontaneous',
    initialListeningCompleted: false,
    insertionTime: '14:00',
    patientId: 15
  }
];

export const useQueue = () => {
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<QueuePatient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueueFilters | null>(null);

  // Função para ordenação padrão conforme SN001
  const applyDefaultSorting = useCallback((patientList: QueuePatient[]) => {
    return [...patientList].sort((a, b) => {
      // 1. Primeiro, ordenar por horário de chegada crescente
      const timeA = a.appointmentType === 'scheduled' ? (a.scheduledTime || a.arrivalTime) : a.insertionTime;
      const timeB = b.appointmentType === 'scheduled' ? (b.scheduledTime || b.arrivalTime) : b.insertionTime;
      
      const timeComparison = timeA.localeCompare(timeB);
      
      // 2. Se horários iguais, aplicar prioridade por classificação de risco (após escuta inicial)
      if (timeComparison === 0) {
        // Verificar se ambos têm escuta inicial realizada
        if (a.initialListeningCompleted && b.initialListeningCompleted && 
            a.vulnerabilityRisk && b.vulnerabilityRisk) {
          
          const riskPriority = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
          const riskA = riskPriority[a.vulnerabilityRisk] || 0;
          const riskB = riskPriority[b.vulnerabilityRisk] || 0;
          
          // Maior risco primeiro (Alta > Média > Baixa)
          if (riskA !== riskB) {
            return riskB - riskA;
          }
        }
        
        // 3. Se ainda empate, manter ordem de inserção original
        return a.id - b.id;
      }
      
      return timeComparison;
    });
  }, []);

  // Inicializar dados mock com ordenação padrão
  useEffect(() => {
    const sortedPatients = applyDefaultSorting(mockPatients);
    setPatients(sortedPatients);
    setCurrentPatient(sortedPatients.find((p: QueuePatient) => p.status === 'in_progress') || null);
  }, [applyDefaultSorting]);

  // Estatísticas da fila
  const getQueueStats = useCallback((): QueueStats => {
    const waitingCount = patients.filter(p => p.status === 'waiting').length;
    const inProgressCount = patients.filter(p => p.status === 'in_progress').length;
    const completedCount = patients.filter(p => p.status === 'completed').length;
    const totalCount = patients.length;
    
    // Calcular tempo médio de espera (simulado)
    const waitingPatients = patients.filter(p => p.status === 'waiting');
    const averageWaitTime = waitingPatients.length > 0 
      ? Math.round(waitingPatients.reduce((sum, p) => sum + p.estimatedWaitTime, 0) / waitingPatients.length)
      : 0;

    return {
      waiting: waitingCount,
      inProgress: inProgressCount,
      completed: completedCount,
      totalToday: totalCount,
      averageWaitTime
    };
  }, [patients]);

  // Função para normalizar texto removendo acentos e caracteres especiais
  const normalizeText = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD') // Decompõe caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos (acentos)
      .trim();
  }, []);

  // Filtrar pacientes mantendo ordenação padrão
  const getFilteredPatients = useCallback((
    statusFilter?: string,
    searchTerm?: string,
    showMyAttendances?: boolean,
    sortBy?: string,
    currentUserId?: number
  ) => {
    let filtered = [...patients];
    const hasSearchTerm = searchTerm && searchTerm.trim();

    // Filtro por busca (nome, CPF, CNS, data de nascimento)
    // PRIORIDADE MÁXIMA: Se há busca, ela define o conjunto inicial
    if (hasSearchTerm) {
      const search = normalizeText(searchTerm);
      
      filtered = filtered.filter((p: QueuePatient) => {
        const normalizedName = normalizeText(p.name);
        
        // 1. Buscar por nome completo - deve conter o termo exato
        if (normalizedName.includes(search)) {
          return true;
        }
        
        // 2. Buscar por partes do nome - cada palavra da busca deve começar uma palavra do nome
        const nameParts = normalizedName.split(' ');
        const searchParts = search.split(' ').filter(part => part.length > 0);
        
        // Para busca por partes, cada parte da busca deve corresponder ao início de alguma parte do nome
        const namePartsMatch = searchParts.every(searchPart => {
          const found = nameParts.some(namePart => namePart.startsWith(searchPart));
          return found;
        });
        
        if (namePartsMatch && searchParts.length > 0) {
          return true;
        }
        
        // 3. Buscar por CPF (com ou sem formatação)
        if (p.cpf) {
          const cpfClean = p.cpf.replace(/\D/g, ''); // Remove formatação
          const searchClean = search.replace(/\D/g, '');
          if (searchClean.length > 0 && (cpfClean.includes(searchClean) || p.cpf.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return true;
          }
        }
        
        // 4. Buscar por CNS
        if (p.cns && searchTerm.length > 2 && p.cns.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        }
        
        // 5. Buscar por data de nascimento (formato YYYY-MM-DD ou DD/MM/YYYY)
        if (p.birthDate && searchTerm.length > 2) {
          const birthFormatted = new Date(p.birthDate).toLocaleDateString('pt-BR');
          if (birthFormatted.includes(searchTerm) || p.birthDate.includes(searchTerm)) {
            return true;
          }
        }
        
        return false;
      });
      
      // IMPORTANTE: Se há busca ativa, ignorar filtro de status padrão "waiting"
      // A busca deve mostrar TODOS os resultados encontrados independente do status
    } else {
      // Sem busca, aplicar filtros normalmente
      
      // Filtro por status específico (apenas quando não há busca)
      if (statusFilter && statusFilter !== 'all' && statusFilter !== 'undefined') {
        const beforeStatusFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => {
          const shouldInclude = p.status === statusFilter;
          if (!shouldInclude) {
          }
          return shouldInclude;
        });
      }
    }

    // Filtro "Meus atendimentos" - aplicar apenas se não conflitar com busca
    if (showMyAttendances && currentUserId) {
      // Para o mock, vamos simular que pacientes com IDs pares são do usuário logado
      // Em produção, isso seria baseado no campo user_id do paciente
      filtered = filtered.filter((p: QueuePatient) => {
        // Mock: Admin (id=1) atende pacientes com IDs 1,3,5,7,9,11
        // Mock: Dr. Silva (id=2) atende pacientes com IDs 2,4,6,8,10,12
        const shouldInclude = currentUserId === 1 ? p.id % 2 === 1 : p.id % 2 === 0;
        return shouldInclude;
      });
    }

    // Aplicar filtros avançados se houver (mas de forma mais permissiva com busca)
    if (filters) {
      
      // Filtro por status (apenas se não há busca ativa)
      if (filters.status.length > 0 && !hasSearchTerm) {
        const beforeStatusFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => filters.status.includes(p.status));
      } else if (filters.status.length > 0 && hasSearchTerm) {
      }

      // Filtro por tipo de serviço
      if (filters.serviceTypes.length > 0) {
        const beforeServiceFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => 
          filters.serviceTypes.some(st => p.serviceType.toLowerCase().includes(st))
        );
      }

      // Filtro por equipe
      if (filters.teams.length > 0) {
        const beforeTeamFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => p.team && filters.teams.includes(p.team));
      }

      // Filtro por profissional
      if (filters.professionals.length > 0) {
        const beforeProfessionalFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => p.professional && filters.professionals.includes(p.professional));
      }

      // Filtro de não finalizados (apenas se não há busca ativa)
      if (filters.onlyUnfinished && !hasSearchTerm) {
        const beforeUnfinishedFilter = filtered.length;
        filtered = filtered.filter((p: QueuePatient) => p.status !== 'completed' && p.status !== 'cancelled');
      } else if (filters.onlyUnfinished && hasSearchTerm) {
      }
    }

    // Aplicar ordenação
    if (sortBy && sortBy !== 'arrival') {
      filtered.sort((a: QueuePatient, b: QueuePatient) => {
        switch (sortBy) {
          case 'priority':
            const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
            const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
            return priorityDiff !== 0 ? priorityDiff : a.position - b.position;
          
          case 'name':
            return a.name.localeCompare(b.name, 'pt-BR');
          
          case 'arrival':
          default:
            const timeA = a.appointmentType === 'scheduled' ? (a.scheduledTime || a.arrivalTime) : a.arrivalTime;
            const timeB = b.appointmentType === 'scheduled' ? (b.scheduledTime || b.arrivalTime) : b.arrivalTime;
            return timeA.localeCompare(timeB);
        }
      });
    } else {
      // Manter ordenação padrão se não especificado
      filtered = applyDefaultSorting(filtered);
    }

    return filtered;
  }, [patients, filters, applyDefaultSorting, normalizeText]);

  // Adicionar paciente à fila
  const addPatientToQueue = useCallback(async (patientData: any) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // const response = await api.post('/api/v1/queue', patientData);
      
      // Simulação de adição
      const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const newPatient: QueuePatient = {
        id: Date.now(),
        name: patientData.name,
        age: patientData.age || 0,
        ageFormatted: `${patientData.age || 0}a 0m 0d`, // Simplificado, deveria calcular idade real
        birthDate: patientData.birthDate || '2000-01-01', // Campo obrigatório
        phone: patientData.phone,
        arrivalTime: currentTime,
        priority: patientData.priority || 'normal',
        status: 'waiting',
        serviceType: patientData.serviceTypes?.join(', ') || 'Consulta',
        estimatedWaitTime: patients.filter((p: QueuePatient) => p.status === 'waiting').length * 15 + 15,
        notes: patientData.notes,
        position: patients.filter((p: QueuePatient) => p.status === 'waiting').length,
        cpf: patientData.cpf,
        professional: patientData.professional,
        team: patientData.team,
        appointmentDate: patientData.appointmentDate,
        motherName: patientData.motherName,
        fatherName: patientData.fatherName,
        appointmentType: patientData.appointmentType || 'spontaneous',
        initialListeningCompleted: false,
        insertionTime: currentTime
      };

      const updatedPatients = applyDefaultSorting([...patients, newPatient]);
      setPatients(updatedPatients);
      return newPatient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar paciente à fila';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients, applyDefaultSorting]);

  // Chamar próximo paciente
  const callNextPatient = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const waitingPatients = patients
        .filter((p: QueuePatient) => p.status === 'waiting')
        .sort((a: QueuePatient, b: QueuePatient) => {
          // Prioridade: urgent > high > normal > low
          const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          // Se mesma prioridade, ordem de chegada
          return a.position - b.position;
        });

      if (waitingPatients.length > 0) {
        const nextPatient = waitingPatients[0];
        
        // TODO: Integrar com API real
        // await api.patch(`/api/v1/queue/${nextPatient.id}/call`);
        
        setPatients(prev => prev.map((p: QueuePatient) => 
          p.id === nextPatient.id 
            ? { ...p, status: 'in_progress' as const }
            : p.status === 'in_progress' 
              ? { ...p, status: 'completed' as const }
              : p
        ));
        
        setCurrentPatient(nextPatient);
        return nextPatient;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao chamar próximo paciente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients]);

  // Finalizar atendimento atual
  const completeCurrentPatient = useCallback(async () => {
    if (!currentPatient) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await api.patch(`/api/v1/queue/${currentPatient.id}/complete`);
      
      setPatients(prev => prev.map((p: QueuePatient) => 
        p.id === currentPatient.id 
          ? { ...p, status: 'completed' as const }
          : p
      ));
      setCurrentPatient(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar atendimento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // Cancelar paciente
  const cancelPatient = useCallback(async (patientId: number) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await api.patch(`/api/v1/queue/${patientId}/cancel`);
      
      setPatients(prev => prev.map((p: QueuePatient) => 
        p.id === patientId 
          ? { ...p, status: 'cancelled' as const }
          : p
      ));
      
      if (currentPatient?.id === patientId) {
        setCurrentPatient(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar paciente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // Marcar agendamento como "não aguardou"
  // IMPORTANTE: Marca apenas o AGENDAMENTO específico, não afeta outros agendamentos do mesmo paciente
  const markPatientAsNoShow = useCallback(async (appointmentId: number) => {
    console.log('🔴 markPatientAsNoShow chamado para AGENDAMENTO ID:', appointmentId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await api.patch(`/api/v1/appointments/${appointmentId}/no-show`);
      
      console.log('🔄 Atualizando status do AGENDAMENTO...');
      setPatients(prev => {
        console.log('📋 Agendamentos antes da alteração:', prev.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        const updated = prev.map((appointment: QueuePatient) => 
          appointment.id === appointmentId 
            ? { ...appointment, status: 'no_show' as const }
            : appointment
        );
        console.log('📋 Agendamentos após alteração:', updated.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        return updated;
      });
      
      // Se o agendamento que virou no_show estava em atendimento, limpar o paciente atual
      if (currentPatient?.id === appointmentId) {
        console.log('🚫 Removendo agendamento do atendimento atual');
        setCurrentPatient(null);
      }
      
      console.log('✅ markPatientAsNoShow concluído com sucesso');
    } catch (err) {
      console.error('❌ Erro em markPatientAsNoShow:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar agendamento como não aguardou';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // Marcar agendamento como "retornou" (de no_show para waiting)
  // IMPORTANTE: Permite que um cidadão que não aguardou volte para a fila
  const markPatientAsReturned = useCallback(async (appointmentId: number) => {
    console.log('🔵 markPatientAsReturned chamado para AGENDAMENTO ID:', appointmentId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await api.patch(`/api/v1/appointments/${appointmentId}/returned`);
      
      console.log('🔄 Atualizando status do AGENDAMENTO de no_show para waiting...');
      setPatients(prev => {
        console.log('📋 Agendamentos antes da alteração:', prev.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        const updated = prev.map((appointment: QueuePatient) => 
          appointment.id === appointmentId 
            ? { 
                ...appointment, 
                status: 'waiting' as const,
                // Reposicionar na fila - colocar no final da fila de espera
                position: Math.max(...prev.filter(p => p.status === 'waiting').map(p => p.position), 0) + 1
              }
            : appointment
        );
        console.log('📋 Agendamentos após alteração:', updated.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        return updated;
      });
      
      console.log('✅ markPatientAsReturned concluído com sucesso');
    } catch (err) {
      console.error('❌ Erro em markPatientAsReturned:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao marcar agendamento como retornado';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir agendamento (apenas quem inseriu pode excluir)
  // IMPORTANTE: Remove o agendamento da fila permanentemente
  const deleteAppointment = useCallback(async (appointmentId: number) => {
    console.log('🗑️ deleteAppointment chamado para AGENDAMENTO ID:', appointmentId);
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // await api.delete(`/api/v1/appointments/${appointmentId}`);
      
      console.log('🔄 Removendo agendamento da fila...');
      setPatients(prev => {
        console.log('📋 Agendamentos antes da exclusão:', prev.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        const updated = prev.filter((appointment: QueuePatient) => appointment.id !== appointmentId);
        console.log('📋 Agendamentos após exclusão:', updated.map(p => ({ id: p.id, name: p.name, status: p.status, serviceType: p.serviceType })));
        return updated;
      });
      
      // Se o agendamento excluído estava em atendimento, limpar o paciente atual
      if (currentPatient?.id === appointmentId) {
        console.log('🚫 Removendo agendamento do atendimento atual');
        setCurrentPatient(null);
      }
      
      console.log('✅ deleteAppointment concluído com sucesso');
    } catch (err) {
      console.error('❌ Erro em deleteAppointment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir agendamento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPatient]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: QueueFilters | null) => {
    setFilters(newFilters);
  }, []);

  // Buscar paciente
  const searchPatient = useCallback(async (searchTerm: string) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // const response = await api.get(`/api/v1/patients/search?q=${searchTerm}`);
      
      // Simulação de busca nos dados mock
      const results = mockPatients.filter((p: QueuePatient) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf?.includes(searchTerm) ||
        p.cns?.includes(searchTerm)
      );
      
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar paciente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar dados da fila
  const refreshQueue = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // const response = await api.get('/api/v1/queue');
      // setPatients(response.data);
      
      // Por enquanto, apenas recarrega os dados mock
      setPatients([...mockPatients]);
      setCurrentPatient(mockPatients.find((p: QueuePatient) => p.status === 'in_progress') || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar fila';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    patients,
    currentPatient,
    loading,
    error,
    filters,
    getQueueStats,
    getFilteredPatients,
    addPatientToQueue,
    callNextPatient,
    completeCurrentPatient,
    cancelPatient,
    markPatientAsNoShow,
    markPatientAsReturned,
    deleteAppointment,
    updateFilters,
    searchPatient,
    refreshQueue,
    setError
  };
};
