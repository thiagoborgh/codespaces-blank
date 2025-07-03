import { useState, useEffect, useCallback } from 'react';
import { Patient, PaginatedResponse } from '../types';
import { apiService } from '../services/api';

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  search: string;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  refreshPatients: () => void;
  createPatient: (data: Partial<Patient>) => Promise<Patient>;
  updatePatient: (id: number, data: Partial<Patient>) => Promise<Patient>;
  deletePatient: (id: number) => Promise<void>;
}

export const usePatients = (initialPage = 1, perPage = 20): UsePatientsResult => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response: PaginatedResponse<Patient> = await apiService.getPatients(
        currentPage,
        perPage,
        search || undefined
      );
      setPatients(response.data);
      setTotalPages(response.meta.total_pages);
      setTotalCount(response.meta.total_count);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const refreshPatients = () => {
    fetchPatients();
  };

  const createPatient = async (data: Partial<Patient>): Promise<Patient> => {
    try {
      const newPatient = await apiService.createPatient(data);
      refreshPatients();
      return newPatient;
    } catch (error) {
      throw error;
    }
  };

  const updatePatient = async (id: number, data: Partial<Patient>): Promise<Patient> => {
    try {
      const updatedPatient = await apiService.updatePatient(id, data);
      refreshPatients();
      return updatedPatient;
    } catch (error) {
      throw error;
    }
  };

  const deletePatient = async (id: number): Promise<void> => {
    try {
      await apiService.deletePatient(id);
      refreshPatients();
    } catch (error) {
      throw error;
    }
  };

  return {
    patients,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    search,
    setSearch,
    setPage,
    refreshPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
};
