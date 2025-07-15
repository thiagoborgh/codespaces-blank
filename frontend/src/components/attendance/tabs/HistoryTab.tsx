import React from 'react';

interface HistoryTabProps {
  patient: any;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ patient }) => {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Conteúdo da aba Histórico.</p>
        <p className="text-gray-400 text-sm mt-2">
          Implementação em desenvolvimento - Fase 3
        </p>
      </div>
    </div>
  );
};

export default HistoryTab;
