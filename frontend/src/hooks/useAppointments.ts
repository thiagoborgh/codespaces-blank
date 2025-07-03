import { useState, useEffect } from 'react';
import { Appointment, PaginatedResponse } from '../types';
import { apiService } from '../services/api';

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  filters: {
    status?: string;
    date?: string;
    patient_id?: number;
  };
  setFilters: (filters: { status?: string; date?: string; patient_id?: number }) => void;
  setPage: (page: number) => void;
  refreshAppointments: () => void;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: number, data: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: number) => Promise<void>;
}

export const useAppointments = (initialPage = 1, perPage = 20): UseAppointmentsResult => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<{
    status?: string;
    date?: string;
    patient_id?: number;
  }>({});

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Appointment> = await apiService.getAppointments(
        currentPage,
        perPage,
        filters
      );
      setAppointments(response.data);
      setTotalPages(response.meta.total_pages);
      setTotalCount(response.meta.total_count);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filters]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshAppointments = () => {
    fetchAppointments();
  };

  const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const newAppointment = await apiService.createAppointment(data);
      refreshAppointments();
      return newAppointment;
    } catch (error) {
      throw error;
    }
  };

  const updateAppointment = async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    try {
      const updatedAppointment = await apiService.updateAppointment(id, data);
      refreshAppointments();
      return updatedAppointment;
    } catch (error) {
      throw error;
    }
  };

  const deleteAppointment = async (id: number): Promise<void> => {
    try {
      await apiService.deleteAppointment(id);
      refreshAppointments();
    } catch (error) {
      throw error;
    }
  };

  return {
    appointments,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    filters,
    setFilters,
    setPage,
    refreshAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
