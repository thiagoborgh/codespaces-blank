import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AddPatientModal from '../components/queue/AddPatientModal';
import FilterModal, { QueueFilters } from '../components/queue/FilterModal';
import AttendanceStatementModal from '../components/queue/AttendanceStatementModal';
import EditPatientModal from '../components/queue/EditPatientModal';
import MedicalRecordModal from '../components/queue/MedicalRecordModal';
import DayAttendancesModal from '../components/queue/DayAttendancesModal';
import { useQueue } from '../hooks/useQueue';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatAgeFromShort, formatAgeCompact, formatBirthDateWithAge, formatBirthDateWithAgeNoLabel } from '../utils/ageUtils';
import { Patient } from '../types/types';
import {
  ClockIcon,
  UserIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlayIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  MapPinIcon,
  HeartIcon,
  SpeakerWaveIcon,
  MicrophoneIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
  DocumentTextIcon,
  BeakerIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const QueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const {
    patients,
    currentPatient,
    loading,
    error,
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
    refreshQueue,
    setError
  } = useQueue();

  const [filter, setFilter] = useState<'all' | 'waiting' | 'in_progress' | 'completed' | 'no_show'>('waiting');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMedicalRecordModalOpen, setIsMedicalRecordModalOpen] = useState(false);
  const [isDayAttendancesModalOpen, setIsDayAttendancesModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<{ id: number; name: string } | null>(null);
  const [selectedPatientForAttendances, setSelectedPatientForAttendances] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMyAttendances, setShowMyAttendances] = useState(false);
  const [sortBy, setSortBy] = useState('arrival');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [searchFeedback, setSearchFeedback] = useState(false);

  // Debug log para dropdown
  useEffect(() => {
    console.log('🔵 openDropdown state changed:', openDropdown);
  }, [openDropdown]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isVaccineService = (serviceType: string) => {
    return serviceType.toLowerCase().includes('vacina');
  };

  const handleAddPatient = async (patientData: any) => {
    try {
      await addPatientToQueue(patientData);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Erro ao adicionar paciente:', err);
    }
  };

  const handleApplyFilter = (filters: QueueFilters) => {
    updateFilters(filters);
    setIsFilterModalOpen(false);
  };

  const handleResetFilter = () => {
    // Limpar todos os filtros e configurações
    updateFilters(null);
    setFilter('waiting');
    setSearchTerm('');
    setShowMyAttendances(false);
    setSortBy('arrival');
    setIsFilterModalOpen(false);
    setSearchFeedback(false);
  };

  const handleSearchSubmit = () => {
    // Dar feedback visual de busca executada
    setSearchFeedback(true);
    setTimeout(() => setSearchFeedback(false), 1000);
  };

  const handleCallNext = async () => {
    try {
      await callNextPatient();
    } catch (err) {
      console.error('Erro ao chamar próximo paciente:', err);
    }
  };

  const handleCompletePatient = async () => {
    try {
      await completeCurrentPatient();
    } catch (err) {
      console.error('Erro ao finalizar atendimento:', err);
    }
  };

  const handleCancelPatient = async (patientId: number) => {
    if (window.confirm('Tem certeza que deseja cancelar este paciente?')) {
      try {
        await cancelPatient(patientId);
      } catch (err) {
        console.error('Erro ao cancelar paciente:', err);
      }
    }
  };

  const handleListening = async (patientId: number) => {
    // TODO: Implementar abertura da tela de escuta inicial
    console.log('Iniciando escuta inicial para paciente:', patientId);
    setOpenDropdown(null);
  };

  const handleAttend = async (patientId: number) => {
    // TODO: Implementar início do atendimento
    console.log('Iniciando atendimento para paciente:', patientId);
    setOpenDropdown(null);
  };

  const handleCallPatient = async (patientId: number) => {
    // TODO: Implementar chamada individual do paciente
    console.log('Chamando paciente:', patientId);
    setOpenDropdown(null);
  };

  // Função para converter QueuePatient para Patient
  const queuePatientToPatient = (queuePatient: any): Patient => {
    return {
      id: queuePatient.id,
      name: queuePatient.name,
      cpf: queuePatient.cpf || '',
      rg: '',
      birth_date: queuePatient.birthDate,
      gender: 'other', // Valor padrão, pode ser ajustado conforme necessário
      phone: queuePatient.phone,
      email: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      emergency_contact: '',
      emergency_phone: '',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  };

  const handlePatientDidNotWait = async (appointmentId: number) => {
    console.log('🔴 handlePatientDidNotWait chamado para AGENDAMENTO ID:', appointmentId);
    
    // Buscar informações do agendamento para o diálogo
    const appointment = patients.find(p => p.id === appointmentId);
    if (!appointment) {
      alert('Agendamento não encontrado');
      return;
    }
    
    const confirmMessage = `Confirma que o cidadão não aguardou este atendimento?\n\nPaciente: ${appointment.name}\nServiço: ${appointment.serviceType}\nHorário: ${appointment.arrivalTime}`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('🔄 Usuário confirmou, chamando markPatientAsNoShow...');
        await markPatientAsNoShow(appointmentId);
        console.log('✅ markPatientAsNoShow retornou com sucesso');
        setOpenDropdown(null);
        
        // Feedback visual de sucesso
        console.log(`✅ Agendamento "${appointment.serviceType}" de ${appointment.name} marcado como "não aguardou"`);
      } catch (error) {
        console.error('❌ Erro ao alterar status do agendamento:', error);
        alert('Erro ao alterar status. Tente novamente.');
      }
    } else {
      console.log('🚫 Usuário cancelou a operação');
    }
  };

  const handleGenerateAttendanceStatement = async (patientId: number) => {
    try {
      // Buscar dados do paciente
      const queuePatient = patients.find(p => p.id === patientId);
      if (queuePatient) {
        const patient = queuePatientToPatient(queuePatient);
        setSelectedPatient(patient);
        setIsAttendanceModalOpen(true);
      } else {
        alert('Paciente não encontrado');
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
      alert('Erro ao carregar dados do paciente. Tente novamente.');
    }
  };

  const handleViewMedicalRecord = async (patientId: number) => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        // Abrir modal de justificativa conforme RF24
        setSelectedPatientForModal({ id: patientId, name: patient.name });
        setIsMedicalRecordModalOpen(true);
      } else {
        alert('Paciente não encontrado');
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error('Erro ao abrir modal de prontuário:', error);
      alert('Erro ao abrir modal de prontuário. Tente novamente.');
    }
  };

  const handleEditPatient = async (patientId: number) => {
    try {
      // Buscar dados do paciente
      const queuePatient = patients.find(p => p.id === patientId);
      if (queuePatient) {
        const patient = queuePatientToPatient(queuePatient);
        setSelectedPatient(patient);
        setIsEditModalOpen(true);
      } else {
        alert('Paciente não encontrado');
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
      alert('Erro ao carregar dados do paciente. Tente novamente.');
    }
  };

  const handleSavePatient = async (patientData: Partial<Patient>) => {
    try {
      // Implementar chamada para API para salvar alterações
      console.log('Salvando alterações do paciente:', patientData);
      
      // Aqui seria feita a chamada real para a API
      // await api.updatePatient(selectedPatient?.id, patientData);
      
      // Simular salvamento (remover em produção)
      alert('Dados do cidadão atualizados com sucesso!');
      
      // Atualizar a fila
      await refreshQueue();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      throw error; // Re-throw para que o modal possa tratar o erro
    }
  };

  const filteredPatients = getFilteredPatients(
    searchTerm && searchTerm.trim() ? 'all' : filter, // Se há busca, mostrar todos os status
    searchTerm,
    showMyAttendances,
    sortBy,
    user?.id
  );
  const queueStats = getQueueStats();

  // Debug: Log do estado atual dos pacientes
  useEffect(() => {
    console.log('🔵 Estado atual dos pacientes:', patients.map(p => ({ id: p.id, name: p.name, status: p.status })));
    console.log('🔵 Pacientes filtrados:', filteredPatients.map(p => ({ id: p.id, name: p.name, status: p.status })));
    console.log('🔵 Filtro atual:', filter);
  }, [patients, filteredPatients, filter]);

  // Debug: Log específico para rastrear mudanças no status no_show
  useEffect(() => {
    const noShowAppointments = patients.filter(p => p.status === 'no_show');
    if (noShowAppointments.length > 0) {
      console.log('🟠 Agendamentos com status no_show encontrados:', noShowAppointments.map(p => ({ 
        id: p.id, 
        name: p.name, 
        serviceType: p.serviceType, 
        status: p.status 
      })));
    }
  }, [patients]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown !== null) {
        const target = event.target as Element;
        // Verifica se o clique foi fora do dropdown e fora do botão "Mais opções"
        const isDropdownClick = target.closest('[data-dropdown-menu]');
        const isDropdownButton = target.closest('[data-dropdown-button]');
        
        if (!isDropdownClick && !isDropdownButton) {
          console.log('🔵 Clique fora do dropdown detectado, fechando...');
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Função para marcar "Cidadão retornou" (para status no_show)
  const handlePatientReturned = async (appointmentId: number) => {
    const appointment = patients.find(p => p.id === appointmentId);
    if (!appointment) {
      alert('Agendamento não encontrado');
      return;
    }
    
    const confirmMessage = `Confirma que o cidadão retornou?\n\nPaciente: ${appointment.name}\nServiço: ${appointment.serviceType}\n\nO agendamento será recolocado na fila de espera.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('🔄 Marcando cidadão como retornado...');
        await markPatientAsReturned(appointmentId);
        setOpenDropdown(null);
        console.log(`✅ Cidadão ${appointment.name} marcado como retornado`);
      } catch (error) {
        console.error('❌ Erro ao marcar cidadão como retornado:', error);
        alert('Erro ao processar retorno. Tente novamente.');
      }
    }
  };

  // Função para visualizar atendimentos do dia
  const handleViewDayAttendances = async (patientId: number) => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        // Abrir modal com dados completos conforme RF24
        setSelectedPatientForAttendances(patient);
        setIsDayAttendancesModalOpen(true);
      } else {
        alert('Paciente não encontrado');
      }
      setOpenDropdown(null);
    } catch (error) {
      console.error('Erro ao visualizar atendimentos do dia:', error);
      alert('Erro ao carregar atendimentos. Tente novamente.');
    }
  };

  // Função para excluir agendamento (apenas quem inseriu pode excluir)
  const handleDeleteAppointment = async (appointmentId: number) => {
    const appointment = patients.find(p => p.id === appointmentId);
    if (!appointment) {
      alert('Agendamento não encontrado');
      return;
    }
    
    const confirmMessage = `⚠️ ATENÇÃO: Esta ação não pode ser desfeita!\n\nConfirma a exclusão do agendamento?\n\nPaciente: ${appointment.name}\nServiço: ${appointment.serviceType}\n\nO agendamento será removido permanentemente da fila.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('🗑️ Excluindo agendamento...');
        await deleteAppointment(appointmentId);
        setOpenDropdown(null);
        console.log(`✅ Agendamento de ${appointment.name} excluído com sucesso`);
      } catch (error) {
        console.error('❌ Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento. Tente novamente.');
      }
    }
  };

  // Verificar se o usuário pode excluir o agendamento (apenas quem inseriu)
  const canDeleteAppointment = (appointment: any) => {
    // EXCLUIR: Apenas o usuário que inseriu pode excluir
    // TODO: Implementar lógica real baseada no profissional que inseriu
    // Por enquanto, simular que o usuário logado pode excluir agendamentos com IDs ímpares
    return user?.id === 1 ? appointment.id % 2 === 1 : appointment.id % 2 === 0;
  };

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fila de Atendimento</h1>
          <p className="text-gray-600">Gerencie a fila de pacientes e controle o fluxo de atendimento</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-sm text-blue-800">Carregando fila de atendimento...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Controls Header */}
        <div className={theme === 'hybrid' ? 'healthcare-card p-6 mb-6' : 'bg-white shadow-sm border border-gray-200 p-6 mb-6 rounded-xl'}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="relative">
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                searchFeedback ? 'text-green-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  }
                }}
                placeholder="Pesquisar por Nome, CPF, CNS, Data de Nascimento... (Enter para buscar)"
                className={theme === 'hybrid' 
                  ? `healthcare-input w-full pl-10 pr-4 py-3 ${searchFeedback ? 'ring-2 ring-green-500 border-green-500' : ''}`
                  : `w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all ${
                    searchFeedback ? 'ring-2 ring-green-500 border-green-500' : ''
                  }`
                }
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                  title="Limpar busca"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="showMyAttendances"
                checked={showMyAttendances}
                onChange={(e) => setShowMyAttendances(e.target.checked)}
                className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showMyAttendances" className="text-sm font-medium text-gray-700">
                Meus atendimentos
              </label>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="arrival">⏰ Hora de chegada</option>
                <option value="priority">🚨 Classificação de risco</option>
                <option value="name">👤 Nome (alfabética)</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={
                  theme === 'hybrid'
                    ? 'healthcare-btn-primary px-4 py-3 flex items-center font-medium'
                    : 'bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center font-medium shadow-sm transition-all'
                }
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filtros
              </button>
              <button
                onClick={handleResetFilter}
                className={
                  theme === 'hybrid'
                    ? 'healthcare-btn px-4 py-3 font-medium'
                    : 'bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 font-medium transition-all'
                }
              >
                Limpar
              </button>
            </div>
            
            <div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className={theme === 'hybrid' ? 'healthcare-btn-primary px-4 py-3 w-full flex items-center justify-center font-medium' : 'bg-blue-600 text-white px-4 py-3 rounded-lg w-full hover:bg-blue-700 flex items-center justify-center font-medium shadow-sm transition-all'}
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Adicionar à Fila
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={theme === 'hybrid' ? 'healthcare-stat-card warning' : 'bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl shadow-sm border border-yellow-200 p-6'}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={theme === 'hybrid' ? 'healthcare-stat-icon warning' : 'w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center'}>
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className={theme === 'hybrid' ? 'text-sm font-medium text-gray-600' : 'text-sm font-medium text-yellow-700'}>Aguardando</p>
                <p className={theme === 'hybrid' ? 'text-3xl font-bold text-gray-900' : 'text-3xl font-bold text-yellow-900'}>{queueStats.waiting}</p>
                <p className={theme === 'hybrid' ? 'text-xs text-gray-500' : 'text-xs text-yellow-600'}>pacientes na fila</p>
              </div>
            </div>
          </div>

          <div className={theme === 'hybrid' ? 'healthcare-stat-card info' : 'bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6'}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={theme === 'hybrid' ? 'healthcare-stat-icon info' : 'w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center'}>
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className={theme === 'hybrid' ? 'text-sm font-medium text-gray-600' : 'text-sm font-medium text-green-700'}>Em Atendimento</p>
                <p className={theme === 'hybrid' ? 'text-3xl font-bold text-gray-900' : 'text-3xl font-bold text-green-900'}>{queueStats.inProgress}</p>
                <p className={theme === 'hybrid' ? 'text-xs text-gray-500' : 'text-xs text-green-600'}>sendo atendidos</p>
              </div>
            </div>
          </div>

          <div className={theme === 'hybrid' ? 'healthcare-stat-card success' : 'bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6'}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={theme === 'hybrid' ? 'healthcare-stat-icon success' : 'w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center'}>
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className={theme === 'hybrid' ? 'text-sm font-medium text-gray-600' : 'text-sm font-medium text-blue-700'}>Atendidos</p>
                <p className={theme === 'hybrid' ? 'text-3xl font-bold text-gray-900' : 'text-3xl font-bold text-blue-900'}>{queueStats.completed}</p>
                <p className={theme === 'hybrid' ? 'text-xs text-gray-500' : 'text-xs text-blue-600'}>finalizados hoje</p>
              </div>
            </div>
          </div>

          <div className={theme === 'hybrid' ? 'healthcare-stat-card primary' : 'bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6'}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={theme === 'hybrid' ? 'healthcare-stat-icon primary' : 'w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center'}>
                  <UserIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className={theme === 'hybrid' ? 'text-sm font-medium text-gray-600' : 'text-sm font-medium text-purple-700'}>Total Hoje</p>
                <p className={theme === 'hybrid' ? 'text-3xl font-bold text-gray-900' : 'text-3xl font-bold text-purple-900'}>{queueStats.totalToday}</p>
                <p className={theme === 'hybrid' ? 'text-xs text-gray-500' : 'text-xs text-purple-600'}>pacientes registrados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Patient Panel */}
        {currentPatient && (
          <div className={
            theme === 'hybrid' 
              ? 'healthcare-card current-patient-card p-6 mb-6' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6 shadow-sm'
          }>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <PlayIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-1">Paciente em Atendimento</h3>
                  <p className="text-green-700">
                    <span className="font-semibold text-lg">{currentPatient.name}</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                    <span className="flex items-center">
                      <HeartIcon className="h-4 w-4 mr-1" />
                      {currentPatient.serviceType}
                    </span>
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Chegada: {currentPatient.arrivalTime}
                    </span>
                    <span className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {formatBirthDateWithAge(currentPatient.birthDate)}
                    </span>
                  </div>
                  {currentPatient.notes && (
                    <div className="mt-3 p-3 bg-white/50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <span className="font-medium">Observações:</span> {currentPatient.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCompletePatient}
                  disabled={loading}
                  className={theme === 'hybrid' ? 'healthcare-btn-success px-6 py-3 flex items-center font-medium disabled:opacity-50' : 'bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400 flex items-center shadow-sm transition-all'}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Finalizar Atendimento
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Queue */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Fila de Pacientes</h3>
              
              {/* Filter Tabs */}
              <div className="flex space-x-1">
                {(['all', 'waiting', 'in_progress', 'completed', 'no_show'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      filter === status
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : 
                     status === 'waiting' ? 'Aguardando' :
                     status === 'in_progress' ? 'Em Atendimento' : 
                     status === 'completed' ? 'Atendidos' : 'Não Aguardaram'}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Cards Grid */}
            {filteredPatients.length === 0 ? (
              <div className={theme === 'hybrid' ? 'healthcare-card p-8 text-center text-gray-500' : 'bg-white rounded-lg shadow p-8 text-center text-gray-500'}>
                <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum paciente na fila</p>
              </div>
            ) : (
              <div className="grid gap-4 relative" style={{ overflow: 'visible' }}>
                {filteredPatients.map((patient, index) => {
                  // Determinar classes baseadas no status do paciente
                  const getPatientCardClasses = () => {
                    if (theme === 'hybrid') {
                      let classes = 'healthcare-card patient-card p-4';
                      
                      // Adicionar classe de status (prioridade principal)
                      if (patient.status === 'waiting') classes += ' waiting';
                      else if (patient.status === 'in_progress') classes += ' in-progress';
                      else if (patient.status === 'completed') classes += ' completed';
                      else if (patient.status === 'cancelled') classes += ' cancelled';
                      
                      // Para pacientes urgentes aguardando, usar uma classe especial
                      if (patient.priority === 'urgent' && patient.status === 'waiting') {
                        classes += ' urgent-waiting';
                      }
                      
                      return classes;
                    }
                    return 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 p-4';
                  };

                  return (
                  <div key={patient.id} className={getPatientCardClasses()} style={{ overflow: 'visible' }}>
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                        {/* Conteúdo principal do paciente */}
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          {/* Position/Status Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {patient.status === 'waiting' && (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-lg font-bold text-blue-600">
                                  {patient.position + 1}
                                </span>
                              </div>
                            )}
                            {patient.status === 'in_progress' && (
                              <div className="w-12 h-12 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-full flex items-center justify-center shadow-sm">
                                <PlayIcon className="w-6 h-6 text-green-600" />
                              </div>
                            )}
                            {patient.status === 'completed' && (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-full flex items-center justify-center shadow-sm">
                                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                          </div>

                          {/* Patient Info */}
                          <div className="flex-1 min-w-0">
                            {/* Nome e Status com Prioridade */}
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="text-xl font-bold text-gray-900 truncate">
                                {patient.name}
                              </h4>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(patient.status)}`}>
                                {patient.status === 'waiting' ? 'Aguardando' :
                                 patient.status === 'in_progress' ? 'Em Atendimento' :
                                 patient.status === 'completed' ? 'Atendido' : 
                                 patient.status === 'no_show' ? 'Não Aguardou' : 'Cancelado'}
                              </span>
                              {/* Priority Badge ao lado do status */}
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(patient.priority)}`}>
                                {getPriorityIcon(patient.priority)}
                                <span className="ml-1">
                                  {patient.priority === 'urgent' ? 'Urgente' :
                                   patient.priority === 'high' ? 'Alta' :
                                   patient.priority === 'normal' ? 'Normal' : 'Baixa'}
                                </span>
                              </span>
                            </div>

                            {/* Service Type e Tempo Estimado */}
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <HeartIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <span className="text-base font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                                {patient.serviceType}
                              </span>
                              {/* Tempo estimado ao lado do serviço */}
                              {patient.status === 'waiting' && (
                                <div className="flex items-center space-x-1 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1">
                                  <span>⏱️</span>
                                  <span className="font-medium">~{patient.estimatedWaitTime}min</span>
                                </div>
                              )}
                            </div>

                            {/* Nascimento e Chegada na mesma linha */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm">
                              <div className="flex items-center">
                                {/* Versão desktop com label */}
                                <span className="text-gray-800 font-medium hidden md:inline">{formatBirthDateWithAge(patient.birthDate)}</span>
                                {/* Versão mobile sem label */}
                                <span className="text-gray-800 font-medium md:hidden">{formatBirthDateWithAgeNoLabel(patient.birthDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="field-label font-medium text-gray-700 hidden md:inline">
                                  {patient.appointmentType === 'scheduled' ? 'Agendado:' : 'Chegada:'}
                                </span>
                                <span className="text-gray-800 font-medium">
                                  {patient.appointmentType === 'scheduled' && patient.scheduledTime 
                                    ? patient.scheduledTime 
                                    : patient.arrivalTime}
                                </span>
                              </div>
                            </div>

                            {/* Mãe/Pai */}
                            {(patient.motherName || patient.fatherName) && (
                              <div className="mb-3 text-sm flex items-center space-x-2">
                                <span className="field-label font-medium text-gray-700 hidden md:inline">
                                  {patient.motherName ? 'Mãe:' : 'Pai:'}
                                </span>
                                <span className="truncate text-gray-800 font-medium">
                                  {patient.motherName || patient.fatherName}
                                </span>
                              </div>
                            )}

                            {/* Profissional, Especialidade e Equipe */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-3">
                              {patient.professional && (
                                <div className="flex items-center space-x-2">
                                  <span className="field-label font-medium text-gray-700 hidden md:inline">Profissional:</span>
                                  <span className="truncate text-gray-800 font-medium">{patient.professional}</span>
                                </div>
                              )}
                              {patient.specialty && (
                                <div className="flex items-center space-x-2">
                                  <span className="field-label font-medium text-gray-700 hidden md:inline">Especialidade:</span>
                                  <span className="truncate text-gray-800 font-medium">{patient.specialty}</span>
                                </div>
                              )}
                              {patient.team && (
                                <div className="flex items-center space-x-2">
                                  <span className="field-label font-medium text-gray-700 hidden md:inline">Equipe:</span>
                                  <span className="truncate text-gray-800 font-medium">{patient.team}</span>
                                </div>
                              )}
                            </div>

                            {/* Notes */}
                            {patient.notes && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-800">
                                  <span className="font-medium">💬 Observações:</span> {patient.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons - À direita do card */}
                        <div className="flex lg:flex-col flex-wrap gap-2 lg:min-w-[160px] xl:min-w-[180px]" style={{ overflow: 'visible' }}>
                          {/* Escuta Inicial */}
                          <button
                            onClick={() => handleListening(patient.id)}
                            disabled={patient.initialListeningCompleted}
                            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap shadow-sm ${
                              patient.initialListeningCompleted
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 hover:shadow-md hover:scale-105'
                            }`}
                            title={patient.initialListeningCompleted ? 'Escuta já realizada' : 'Realizar escuta inicial'}
                          >
                            <MicrophoneIcon className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">
                              {patient.initialListeningCompleted ? 'Escuta Feita' : 'Escuta'}
                            </span>
                          </button>

                          {/* Atender/Vacina */}
                          <button
                            onClick={() => handleAttend(patient.id)}
                            className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap shadow-sm hover:shadow-md hover:scale-105 ${
                              isVaccineService(patient.serviceType)
                                ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                            }`}
                            title={isVaccineService(patient.serviceType) ? 'Aplicar vacina' : 'Iniciar atendimento'}
                          >
                            {isVaccineService(patient.serviceType) ? (
                              <>
                                <BeakerIcon className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Vacina</span>
                              </>
                            ) : (
                              <>
                                <CheckIcon className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Atender</span>
                              </>
                            )}
                          </button>

                          {/* Chamar */}
                          <button
                            onClick={() => handleCallPatient(patient.id)}
                            className="px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm hover:shadow-md hover:scale-105"
                            title="Chamar paciente"
                          >
                            <SpeakerWaveIcon className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Chamar</span>
                          </button>

                          {/* Mais opções */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                console.log('🔵 Dropdown toggle clicked for patient:', patient.id);
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === patient.id ? null : patient.id);
                              }}
                              className="w-full px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm hover:shadow-md"
                              title="Mais opções"
                              data-dropdown-button="true"
                            >
                              <EllipsisHorizontalIcon className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Mais opções</span>
                            </button>

                            {/* Dropdown Menu */}
                            {openDropdown === patient.id && (
                              <div 
                                className="absolute right-0 lg:left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-[9999] overflow-hidden"
                                style={{ zIndex: 9999 }}
                                data-dropdown-menu="true"
                                onClick={(e) => {
                                  console.log('🔵 Dropdown menu clicked, preventing propagation');
                                  e.stopPropagation();
                                }}
                              >
                                <div className="py-2">
                                  {/* OPÇÕES POR STATUS - Conforme RF23 */}
                                  
                                  {/* STATUS: AGUARDANDO ATENDIMENTO */}
                                  {patient.status === 'waiting' && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          console.log('🔴 Botão "Cidadão não aguardou" clicado para agendamento:', patient.id, 'Serviço:', patient.serviceType);
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handlePatientDidNotWait(patient.id);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 flex items-center transition-colors"
                                        title={`Marcar agendamento "${patient.serviceType}" como não aguardou`}
                                      >
                                        <XMarkIcon className="h-4 w-4 mr-3 text-red-500" />
                                        <span>Cidadão não aguardou</span>
                                      </button>
                                      <div className="border-t border-gray-100"></div>
                                      
                                      <button
                                        onClick={() => handleGenerateAttendanceStatement(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                                      >
                                        <DocumentTextIcon className="h-4 w-4 mr-3 text-blue-500" />
                                        <span>Gerar declaração de comparecimento</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleViewMedicalRecord(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <EyeIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Visualizar prontuário</span>
                                      </button>
                                      
                                      {/* Editar: Qualquer usuário pode editar os dados da fila */}
                                      <div className="border-t border-gray-100"></div>
                                      <button
                                        onClick={() => handleEditPatient(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 flex items-center transition-colors"
                                        title="Editar dados do agendamento na fila"
                                      >
                                        <PencilIcon className="h-4 w-4 mr-3 text-orange-500" />
                                        <span>Editar</span>
                                      </button>
                                      
                                      {/* Excluir: Apenas quem inseriu pode excluir */}
                                      {canDeleteAppointment(patient) && (
                                        <button
                                          onClick={() => handleDeleteAppointment(patient.id)}
                                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 flex items-center transition-colors"
                                          title="Excluir agendamento (inserido por você)"
                                        >
                                          <TrashIcon className="h-4 w-4 mr-3 text-red-500" />
                                          <span>Excluir</span>
                                        </button>
                                      )}
                                    </>
                                  )}
                                  
                                  {/* STATUS: EM ATENDIMENTO */}
                                  {patient.status === 'in_progress' && (
                                    <>
                                      <button
                                        onClick={() => handleGenerateAttendanceStatement(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                                      >
                                        <DocumentTextIcon className="h-4 w-4 mr-3 text-blue-500" />
                                        <span>Gerar declaração de comparecimento</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleViewMedicalRecord(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <EyeIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Visualizar prontuário</span>
                                      </button>
                                    </>
                                  )}
                                  
                                  {/* STATUS: ATENDIMENTO REALIZADO */}
                                  {patient.status === 'completed' && (
                                    <>
                                      <button
                                        onClick={() => handleGenerateAttendanceStatement(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                                      >
                                        <DocumentTextIcon className="h-4 w-4 mr-3 text-blue-500" />
                                        <span>Gerar declaração de comparecimento</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleViewMedicalRecord(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <EyeIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Visualizar prontuário</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleViewDayAttendances(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 flex items-center transition-colors"
                                      >
                                        <ListBulletIcon className="h-4 w-4 mr-3 text-purple-500" />
                                        <span>Visualizar atendimentos do dia</span>
                                      </button>
                                    </>
                                  )}
                                  
                                  {/* STATUS: NÃO AGUARDOU */}
                                  {patient.status === 'no_show' && (
                                    <>
                                      <button
                                        onClick={() => handlePatientReturned(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <ArrowUturnLeftIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Cidadão retornou</span>
                                      </button>
                                      
                                      <div className="border-t border-gray-100"></div>
                                      
                                      <button
                                        onClick={() => handleGenerateAttendanceStatement(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 flex items-center transition-colors"
                                      >
                                        <DocumentTextIcon className="h-4 w-4 mr-3 text-blue-500" />
                                        <span>Gerar declaração de comparecimento</span>
                                      </button>
                                      
                                      <button
                                        onClick={() => handleViewMedicalRecord(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <EyeIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Visualizar prontuário</span>
                                      </button>
                                    </>
                                  )}
                                  
                                  {/* STATUS: CANCELADO - Opções mínimas */}
                                  {patient.status === 'cancelled' && (
                                    <>
                                      <button
                                        onClick={() => handleViewMedicalRecord(patient.id)}
                                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 flex items-center transition-colors"
                                      >
                                        <EyeIcon className="h-4 w-4 mr-3 text-green-500" />
                                        <span>Visualizar prontuário</span>
                                      </button>
                                    </>
                                  )}
                                  
                                  {/* Se não há opções para o status, mostrar mensagem */}
                                  {!['waiting', 'in_progress', 'completed', 'no_show', 'cancelled'].includes(patient.status) && (
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                      Nenhuma ação disponível para este status
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Queue Controls - Sticky Panel (moved to right) */}
          <div className="lg:col-span-1">
            <div className={theme === 'hybrid' ? 'healthcare-card sticky top-6 p-6 max-h-[calc(100vh-3rem)] overflow-y-auto' : 'sticky top-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-[calc(100vh-3rem)] overflow-y-auto'}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <PlayIcon className="h-5 w-5 text-blue-600" />
                </div>
                Controles da Fila
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={handleCallNext}
                  disabled={queueStats.waiting === 0 || loading}
                  className={theme === 'hybrid' 
                    ? 'healthcare-btn-success w-full px-6 py-4 flex items-center justify-center font-medium disabled:opacity-50'
                    : 'w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center shadow-sm font-medium transition-all'
                  }
                >
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Chamar Próximo
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className={theme === 'hybrid' 
                    ? 'healthcare-btn-primary w-full px-6 py-4 flex items-center justify-center font-medium'
                    : 'w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 flex items-center justify-center shadow-sm font-medium transition-all'
                  }
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar à Fila
                </button>

                <button
                  onClick={refreshQueue}
                  disabled={loading}
                  className={theme === 'hybrid' 
                    ? 'healthcare-btn w-full px-6 py-4 flex items-center justify-center font-medium disabled:opacity-50'
                    : 'w-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-4 rounded-xl hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 flex items-center justify-center shadow-sm font-medium transition-all'
                  }
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  {loading ? 'Atualizando...' : 'Atualizar Fila'}
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tempo Médio</h4>
                  <p className="text-3xl font-bold text-blue-600 mb-1">{queueStats.averageWaitTime}</p>
                  <p className="text-sm text-gray-500">minutos de espera</p>
                </div>
              </div>

              {/* Current Time */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <span>Hoje, {new Date().toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="text-center mt-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Modals */}
        <AddPatientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPatient}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilter={handleApplyFilter}
          onResetFilter={handleResetFilter}
        />

        <AttendanceStatementModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          patient={selectedPatient}
        />

        <EditPatientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          patient={selectedPatient}
          onSave={handleSavePatient}
        />

        <MedicalRecordModal
          isOpen={isMedicalRecordModalOpen}
          onClose={() => {
            setIsMedicalRecordModalOpen(false);
            setSelectedPatientForModal(null);
          }}
          patientId={selectedPatientForModal?.id || 0}
          patientName={selectedPatientForModal?.name || ''}
        />

        <DayAttendancesModal
          isOpen={isDayAttendancesModalOpen}
          onClose={() => {
            setIsDayAttendancesModalOpen(false);
            setSelectedPatientForAttendances(null);
          }}
          patient={selectedPatientForAttendances}
        />
      </div>
    </Layout>
  );
};

export default QueuePage;
