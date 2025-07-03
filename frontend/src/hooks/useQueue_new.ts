import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { QueueFilters } from '../components/queue/FilterModal';

export interface QueuePatient {
  id: number;
  name: string;
  age: number;
  ageFormatted: string; // formato: "21a 4m 8d"
  phone?: string;
  arrivalTime: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled' | 'initial_listening';
  serviceType: string;
  estimatedWaitTime: number;
  notes?: string;
  position: number;
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
}

export interface QueueStats {
  waiting: number;
  inProgress: number;
  completed: number;
  totalToday: number;
  averageWaitTime: number;
}

export const useQueue = () => {
  const [patients, setPatients] = useState<QueuePatient[]>([]);
  const [currentPatient, setCurrentPatient] = useState<QueuePatient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueueFilters | null>(null);

  // Dados mock para desenvolvimento com regras SN001
  const mockPatients: QueuePatient[] = [
    {
      id: 1,
      name: 'Maria Silva',
      age: 45,
      ageFormatted: '45a 0m 0d',
      phone: '(11) 99999-1111',
      arrivalTime: '08:30',
      priority: 'high',
      status: 'in_progress',
      serviceType: 'Consulta Médica',
      estimatedWaitTime: 0,
      notes: 'Retorno - pressão alta',
      position: 0,
      cpf: '123.456.789-00',
      professional: 'Dra. Maria Assunção',
      team: 'Equipe 1',
      motherName: 'Ana Maria Silva',
      appointmentType: 'spontaneous',
      initialListeningCompleted: true,
      insertionTime: '08:30',
      vulnerabilityRisk: 'Alta'
    },
    {
      id: 2,
      name: 'João Santos',
      age: 62,
      ageFormatted: '62a 0m 0d',
      phone: '(11) 99999-2222',
      arrivalTime: '09:15',
      priority: 'urgent',
      status: 'waiting',
      serviceType: 'Escuta Inicial',
      estimatedWaitTime: 15,
      notes: 'Dor no peito',
      position: 1,
      cpf: '987.654.321-00',
      professional: 'Dr. João Silva',
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
      ageFormatted: '35a 6m 22d',
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
      ageFormatted: '58a 2m 10d',
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
      team: 'Equipe 1',
      motherName: 'Antônia Silva',
      appointmentType: 'scheduled',
      initialListeningCompleted: true,
      insertionTime: '07:30',
      scheduledTime: '07:45',
      vulnerabilityRisk: 'Baixa'
    }
  ];

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
    setCurrentPatient(sortedPatients.find(p => p.status === 'in_progress') || null);
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

  // Filtrar pacientes mantendo ordenação padrão (SN001)
  const getFilteredPatients = useCallback((statusFilter?: string) => {
    let filtered = [...patients];

    // Filtro por status específico
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    // Aplicar filtros avançados se houver
    if (filters) {
      // Filtro por status
      if (filters.status.length > 0) {
        filtered = filtered.filter(p => filters.status.includes(p.status));
      }

      // Filtro por tipo de serviço
      if (filters.serviceTypes.length > 0) {
        filtered = filtered.filter(p => 
          filters.serviceTypes.some(st => p.serviceType.toLowerCase().includes(st))
        );
      }

      // Filtro por equipe
      if (filters.teams.length > 0) {
        filtered = filtered.filter(p => p.team && filters.teams.includes(p.team));
      }

      // Filtro por profissional
      if (filters.professionals.length > 0) {
        filtered = filtered.filter(p => p.professional && filters.professionals.includes(p.professional));
      }

      // Filtro de não finalizados
      if (filters.onlyUnfinished) {
        filtered = filtered.filter(p => p.status !== 'completed' && p.status !== 'cancelled');
      }
    }

    // IMPORTANTE: Aplicar ordenação padrão nos resultados filtrados (SN001)
    return applyDefaultSorting(filtered);
  }, [patients, filters, applyDefaultSorting]);

  // Buscar pacientes
  const searchPatients = useCallback((query: string) => {
    if (!query.trim()) return patients;

    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.cpf?.includes(query) ||
      patient.cns?.includes(query) ||
      patient.phone?.includes(query)
    );

    // Manter ordenação padrão nos resultados da busca
    return applyDefaultSorting(filtered);
  }, [patients, applyDefaultSorting]);

  // Adicionar paciente
  const addPatient = useCallback(async (patientData: any) => {
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
        phone: patientData.phone,
        arrivalTime: currentTime,
        priority: patientData.priority || 'normal',
        status: 'waiting',
        serviceType: patientData.serviceTypes?.join(', ') || 'Consulta',
        estimatedWaitTime: patients.filter(p => p.status === 'waiting').length * 15 + 15,
        notes: patientData.notes,
        position: patients.filter(p => p.status === 'waiting').length,
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
      const waitingPatients = patients.filter(p => p.status === 'waiting');
      const sortedWaiting = applyDefaultSorting(waitingPatients);
      
      if (sortedWaiting.length === 0) {
        throw new Error('Não há pacientes aguardando');
      }

      const nextPatient = sortedWaiting[0];
      
      // Atualizar status do paciente atual para completed
      const updatedPatients = patients.map(p => {
        if (p.status === 'in_progress') {
          return { ...p, status: 'completed' as const };
        }
        if (p.id === nextPatient.id) {
          return { ...p, status: 'in_progress' as const };
        }
        return p;
      });

      setPatients(applyDefaultSorting(updatedPatients));
      setCurrentPatient(nextPatient);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao chamar próximo paciente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients, applyDefaultSorting]);

  // Remover paciente da fila
  const removePatient = useCallback(async (patientId: number) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPatients = patients.filter(p => p.id !== patientId);
      setPatients(applyDefaultSorting(updatedPatients));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover paciente';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients, applyDefaultSorting]);

  // Atualizar status do paciente
  const updatePatientStatus = useCallback(async (patientId: number, status: QueuePatient['status']) => {
    setLoading(true);
    setError(null);

    try {
      const updatedPatients = patients.map(p => 
        p.id === patientId ? { ...p, status } : p
      );
      
      setPatients(applyDefaultSorting(updatedPatients));

      // Atualizar paciente atual se necessário
      if (status === 'in_progress') {
        const patient = patients.find(p => p.id === patientId);
        if (patient) setCurrentPatient(patient);
      } else if (currentPatient?.id === patientId) {
        setCurrentPatient(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [patients, currentPatient, applyDefaultSorting]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: QueueFilters) => {
    setFilters(newFilters);
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters(null);
  }, []);

  // Refresh da fila
  const refreshQueue = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Integrar com API real
      // const response = await api.get('/api/v1/queue');
      // setPatients(applyDefaultSorting(response.data));
      
      // Por enquanto, apenas reaplica a ordenação
      setPatients(prev => applyDefaultSorting([...prev]));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar fila';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [applyDefaultSorting]);

  return {
    patients,
    currentPatient,
    loading,
    error,
    queueStats: getQueueStats(),
    getFilteredPatients,
    searchPatients,
    addPatient,
    removePatient,
    updatePatientStatus,
    callNextPatient,
    updateFilters,
    clearFilters,
    refreshQueue,
    setError
  };
};
