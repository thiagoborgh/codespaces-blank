import React from 'react';

interface VaccinationTabProps {
  patient: any;
}

const VaccinationTab: React.FC<VaccinationTabProps> = ({ patient }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Conteúdo da aba Vacinação.</p>
        <p className="text-gray-400 text-sm mt-2">
          Implementação em desenvolvimento - Fase 3
        </p>
      </div>
    </div>
  );
};

export default VaccinationTab;
