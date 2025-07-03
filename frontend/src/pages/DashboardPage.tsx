import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ThemeDemo from '../components/demo/ThemeDemo';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { Appointment } from '../types';
import { 
  UsersIcon, 
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatTime, getStatusText, getStatusColor } from '../utils/format';

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Em modo desenvolvimento, usar dados mock
        if (process.env.NODE_ENV === 'development') {
          // Dados mock para desenvolvimento
          setStats({
            totalPatients: 127,
            todayAppointments: 8,
            pendingAppointments: 3,
            completedAppointments: 5,
          });

          // Agendamentos mock para hoje
          const mockAppointments: Appointment[] = [
            {
              id: 1,
              patient_id: 1,
              user_id: 1,
              team_id: undefined,
              appointment_date: new Date().toISOString().split('T')[0],
              appointment_time: '09:00',
              status: 'confirmed',
              notes: 'Consulta de rotina',
              priority: 'normal',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              patient: {
                id: 1,
                name: 'Maria Silva',
                cpf: '123.456.789-00',
                birth_date: '1980-05-15',
                gender: 'female',
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: 2,
              patient_id: 2,
              user_id: 1,
              team_id: undefined,
              appointment_date: new Date().toISOString().split('T')[0],
              appointment_time: '10:30',
              status: 'scheduled',
              notes: 'Retorno - exames',
              priority: 'high',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              patient: {
                id: 2,
                name: 'João Santos',
                cpf: '987.654.321-00',
                birth_date: '1975-08-22',
                gender: 'male',
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: 3,
              patient_id: 3,
              user_id: 1,
              team_id: undefined,
              appointment_date: new Date().toISOString().split('T')[0],
              appointment_time: '14:00',
              status: 'completed',
              notes: 'Consulta realizada',
              priority: 'normal',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              patient: {
                id: 3,
                name: 'Ana Costa',
                cpf: '456.789.123-00',
                birth_date: '1990-12-03',
                gender: 'female',
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ];

          setTodayAppointments(mockAppointments);
          setLoading(false);
          return;
        }
        
        // Carregar dados reais da API
        const [patientsResponse, appointmentsResponse] = await Promise.all([
          apiService.getPatients(1, 1), // Só precisamos do total
          apiService.getAppointments(1, 100, { date: new Date().toISOString().split('T')[0] })
        ]);

        const todayAppts = appointmentsResponse.data;
        
        setStats({
          totalPatients: patientsResponse.meta.total_count,
          todayAppointments: todayAppts.length,
          pendingAppointments: todayAppts.filter(apt => 
            ['scheduled', 'confirmed'].includes(apt.status)
          ).length,
          completedAppointments: todayAppts.filter(apt => 
            apt.status === 'completed'
          ).length,
        });

        setTodayAppointments(todayAppts);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Funções de navegação
  const handleNewPatient = () => {
    navigate('/patients');
  };

  const handleScheduleAppointment = () => {
    navigate('/appointments');
  };

  const handleQueue = () => {
    navigate('/queue');
  };

  const statsCards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPatients,
      icon: UsersIcon,
      color: 'blue',
    },
    {
      title: 'Consultas Hoje',
      value: stats.todayAppointments,
      icon: CalendarDaysIcon,
      color: 'green',
    },
    {
      title: 'Pendentes',
      value: stats.pendingAppointments,
      icon: ClockIcon,
      color: 'orange',
    },
    {
      title: 'Concluídas',
      value: stats.completedAppointments,
      icon: CheckCircleIcon,
      color: 'red',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Aqui está um resumo das atividades de hoje
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={theme === 'hybrid' ? 'healthcare-stat-card' : 'bg-white rounded-lg shadow-sm border border-gray-200 p-6'}
            >
              <div className="flex items-center">
                <div className={theme === 'hybrid' ? `healthcare-stat-icon ${card.color}` : `${card.color === 'blue' ? 'bg-blue-500' : card.color === 'green' ? 'bg-green-500' : card.color === 'orange' ? 'bg-yellow-500' : 'bg-purple-500'} rounded-lg p-3`}>
                  <card.icon className={theme === 'hybrid' ? 'h-6 w-6' : 'h-6 w-6 text-white'} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className={theme === 'hybrid' ? 'healthcare-card' : 'bg-white rounded-lg shadow-sm border border-gray-200'}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Agendamentos de Hoje
            </h2>
          </div>
          
          <div className="p-6">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Nenhum agendamento hoje
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Você não tem consultas agendadas para hoje.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {appointment.patient?.name || 'Paciente'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatTime(appointment.appointment_time)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                      
                      {appointment.priority === 'urgent' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={theme === 'hybrid' ? 'healthcare-card' : 'bg-white rounded-lg shadow-sm border border-gray-200'}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleNewPatient}
                className={theme === 'hybrid' ? 'healthcare-btn flex items-center justify-center px-4 py-3' : 'flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors'}
              >
                <UsersIcon className="h-5 w-5 mr-2" />
                Novo Paciente
              </button>
              
              <button 
                onClick={handleScheduleAppointment}
                className={theme === 'hybrid' ? 'healthcare-btn flex items-center justify-center px-4 py-3' : 'flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors'}
              >
                <CalendarDaysIcon className="h-5 w-5 mr-2" />
                Agendar Consulta
              </button>
              
              <button 
                onClick={handleQueue}
                className={theme === 'hybrid' ? 'healthcare-btn flex items-center justify-center px-4 py-3' : 'flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors'}
              >
                <ClockIcon className="h-5 w-5 mr-2" />
                Fila de Atendimento
              </button>
            </div>
          </div>
        </div>

        {/* Demo Component */}
        <ThemeDemo />
      </div>
    </Layout>
  );
};

export default DashboardPage;
