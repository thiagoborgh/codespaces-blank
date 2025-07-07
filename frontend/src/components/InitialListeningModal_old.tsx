// TODO: Implementar modal de escuta inicial na Fase 2
import React, { useState, useEffect } from 'react';
import { XMarkIcon, UserIcon, CalendarIcon, MicrophoneIcon, ScaleIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

interface Patient {
  id: number;
  name: string;
  birthDate: string;
  cpf?: string;
  phone?: string;
  serviceType: string;
  arrivalTime: string;
}

interface SigtapProcedure {
  code: string;
  description: string;
  isAutomatic: boolean;
  originData?: string; // qual dado originou o procedimento automático
}

interface RiskClassification {
  code: string;
  name: string;
  description: string;
  color: string;
  priority: number; // 1 = maior prioridade, 4 = menor prioridade
}

interface InitialListeningData {
  // RN01: Motivo da consulta CIAP2 (obrigatório)
  ciapCode: string;
  ciapDescription: string;
  
  // RN02: Descrição livre (opcional)
  consultationDescription: string;
  
  // RN03-RN04: Antropometria (opcional)
  weight?: number; // em kg
  height?: number; // em cm
  
  // RN05-RN11: Sinais vitais (opcional)
  systolicBP?: number; // mmHg
  diastolicBP?: number; // mmHg
  heartRate?: number; // bpm
  respiratoryRate?: number; // irpm
  temperature?: number; // °C
  oxygenSaturation?: number; // %
  capillaryGlycemia?: number; // mg/dL
  glycemiaMoment?: string; // momento da coleta de glicemia
  
  // RN12: Procedimentos realizados
  procedures: SigtapProcedure[]; // procedimentos automáticos e manuais
  
  // RN13: Classificação de risco/vulnerabilidade (obrigatório para demanda espontânea)
  riskClassification?: string; // código da classificação selecionada
  
  // RN14: Vulnerabilidade social/familiar (opcional)
  vulnerabilityLevel?: string; // 'baixa' | 'media' | 'alta' | 'critica'
  vulnerabilityDescription?: string; // descrição livre da vulnerabilidade
  
  // RN14: Desfecho da escuta inicial (obrigatório)
  outcome?: string; // 'release' | 'queue' | 'vaccination' | 'schedule'
  outcomeDetails?: string; // observações específicas do desfecho
  
  // RN16: Estado e metadados da escuta
  status?: 'draft' | 'completed'; // status da escuta inicial
  completedAt?: string; // timestamp da finalização
  completedBy?: string; // profissional que finalizou
  canPrint?: boolean; // flag para impressão
}

interface InitialListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onSave: (data: InitialListeningData) => Promise<void>;
  onCancel?: (patientId: number, justification?: string) => Promise<void>; // RN15: Callback para cancelamento
}
