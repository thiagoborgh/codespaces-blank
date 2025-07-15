import React from 'react';
import CoverSheetTab from './tabs/CoverSheetTab';
import SOAPTab from './tabs/SOAPTab';
import VaccinationTab from './tabs/VaccinationTab';
import HistoryTab from './tabs/HistoryTab';
import AppointmentsTab from './tabs/AppointmentsTab';

interface AttendanceTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  patient: any;
  consultation: any;
  soapRecords: any[];
  vitalSigns: any[];
  measurements: any[];
  medications: any[];
  onSaveSOAP: (section: string, data: any) => void;
  onFinalize: (data: any) => void;
}

const AttendanceTabs: React.FC<AttendanceTabsProps> = ({
  activeTab,
  onTabChange,
  patient,
  consultation,
  soapRecords,
  vitalSigns,
  measurements,
  medications,
  onSaveSOAP,
  onFinalize
}) => {
  const tabs = [
    {
      id: 'folha-rosto',
      label: 'Folha rosto'
    },
    {
      id: 'soap',
      label: 'SOAP'
    },
    {
      id: 'vacinacao',
      label: 'Vacinação'
    },
    {
      id: 'historico',
      label: 'Histórico'
    },
    {
      id: 'agendamentos',
      label: 'Agendamentos'
    }
  ];

  const handleUpdateCoverSheet = (data: any) => {
    console.log('Updating cover sheet:', data);
    // TODO: Implementar atualização da folha de rosto
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'folha-rosto':
        return (
          <CoverSheetTab 
            consultation={consultation}
            patient={patient}
            onUpdate={handleUpdateCoverSheet}
          />
        );
      case 'soap':
        return (
          <SOAPTab 
            consultation={consultation}
            soapRecords={soapRecords || []}
            onUpdateSOAP={onSaveSOAP}
          />
        );
      case 'vacinacao':
        return (
          <VaccinationTab 
            patient={patient}
          />
        );
      case 'historico':
        return (
          <HistoryTab 
            patient={patient}
          />
        );
      case 'agendamentos':
        return (
          <AppointmentsTab 
            patient={patient}
          />
        );
      default:
        return <div>Selecione uma aba</div>;
    }
  };

  return (
    <div className="bg-white">
      {/* Tab Headers - seguindo exatamente o estilo do protótipo */}
      <div className="border-b border-gray-200">
        <ul className="nav nav-tabs flex flex-wrap" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <li key={tab.id} className="nav-item" role="presentation">
                <button
                  onClick={() => onTabChange(tab.id)}
                  className={`nav-link px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  role="tab"
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AttendanceTabs;