import { useNavigate } from 'react-router-dom';

interface AttendanceNavigation {
  handleConsultation: (patientId: number) => void;
  handleVaccination: (patientId: number) => void;
}

export const useAttendanceNavigation = (): AttendanceNavigation => {
  const navigate = useNavigate();

  const handleConsultation = (patientId: number) => {
    console.log('🏥 Navegando para folha rosto Rails atualizada:', patientId);
    // Redirecionar para a nova folha rosto Rails
    window.location.href = `http://localhost:3001/test/folha_rosto?patientId=${patientId}`;
  };

  const handleVaccination = (patientId: number) => {
    console.log('💉 Navegando para vacinação:', patientId);
    // Redirecionar para Atendimento de Vacinação
    navigate(`/attendance/vaccination/${patientId}`);
  };

  return {
    handleConsultation,
    handleVaccination
  };
};
