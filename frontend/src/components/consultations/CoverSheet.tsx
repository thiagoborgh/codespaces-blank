import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  ClockIcon,
  UserIcon,
  HeartIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
}

interface Measurement {
  value: string;
  unit?: string;
  classification?: string;
  context?: string;
  time: string;
}

interface CoverSheetProps {
  patient: Patient;
  onCancelAppointment: () => void;
}

const CoverSheet: React.FC<CoverSheetProps> = ({ patient, onCancelAppointment }) => {
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'anthropometry' | 'vitals' | 'glycemia'>('anthropometry');

  // Mock data - em um app real, viria da API
  const initialListening = {
    hasRecord: true,
    riskClassification: "Risco intermediário",
    reason: "FEBRE – A03 (CIAP2)",
    procedures: ["Aferição de pressão arterial", "Medição de temperatura"],
    timestamp: "20:15",
    professional: "Consultoria Prontuário | Enfermeiro"
  };

  const lastContacts = [
    {
      type: "Escuta Inicial",
      date: "15/01/2025",
      time: "14:30",
      alert: "Urgência",
      reason: "DOR ABDOMINAL – D01 (CIAP2)"
    },
    {
      type: "Consulta Médica",
      date: "10/01/2025", 
      time: "09:15",
      alert: "Risco intermediário"
    }
  ];

  const todayMeasurements: Record<string, Measurement> = {
    weight: { value: "72", unit: "kg", time: "14:20" },
    height: { value: "165", unit: "cm", time: "14:20" },
    bmi: { value: "26.4", unit: "kg/m²", classification: "Sobrepeso", time: "14:20" },
    bloodPressure: { value: "140/90", unit: "mmHg", time: "14:25" },
    heartRate: { value: "82", unit: "bpm", time: "14:25" },
    temperature: { value: "37.2", unit: "°C", time: "14:25" },
    oxygenSaturation: { value: "98", unit: "%", time: "14:25" },
    glycemia: { value: "110", unit: "mg/dL", context: "Jejum", time: "08:30" }
  };

  const vaccinations = [
    { name: "COVID-19", dose: "3ª DOSE", date: "15/12/2024", applied: true },
    { name: "Influenza", dose: "DOSE ÚNICA", date: "20/01/2025", applied: false },
    { name: "Hepatite B", dose: "2ª DOSE", date: "10/11/2024", applied: true }
  ];

  const hasDelayedVaccines = vaccinations.some(v => !v.applied && new Date(v.date.split('/').reverse().join('-')) < new Date());

  const allergies = [
    {
      id: 1,
      agent: "Dipirona",
      category: "Medicamento",
      reaction: "Urticária",
      criticality: "Moderada"
    }
  ];

  const activeProblems = [
    {
      id: 1,
      description: "Hipertensão arterial essencial",
      ciap2: "K86",
      cid10: "I10",
      startDate: "15/10/2024",
      daysAgo: 95,
      lastUpdate: "20/12/2024"
    }
  ];

  const examResults = [
    { name: "Hemoglobina glicada", date: "18/12/2024", result: "5,60 %" },
    { name: "Colesterol total", date: "18/12/2024", result: "200 mg/dL" },
    { name: "Glicemia de jejum", date: "15/12/2024", result: "95 mg/dL" }
  ];

  const medications = [
    { name: "Atenolol 50 mg", dosage: "1 dose, a cada 12 horas" },
    { name: "Losartana 50 mg", dosage: "1 dose, ao dia" }
  ];

  const renderInitialListening = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center mb-3">
        <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="font-semibold text-gray-900">Escuta inicial</h3>
        {initialListening.riskClassification && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            {initialListening.riskClassification}
          </span>
        )}
      </div>
      
      {initialListening.hasRecord ? (
        <>
          <div className="mb-3">
            <p className="text-sm text-gray-700">
              <strong>Motivo da Consulta:</strong> {initialListening.reason}
            </p>
          </div>
          
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Intervenções e/ou procedimentos clínicos:</p>
            <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 max-h-20 overflow-y-auto">
              {initialListening.procedures.map((proc, index) => (
                <div key={index}>• {proc}</div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Realizado hoje às {initialListening.timestamp} por: {initialListening.professional}
          </p>
        </>
      ) : (
        <p className="text-gray-500 text-sm">Não foi realizada Escuta Inicial</p>
      )}
    </div>
  );

  const renderLastContacts = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Últimos contatos</h3>
      
      {lastContacts.length > 0 ? (
        <div className="space-y-3">
          {lastContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{contact.type}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="text-sm text-gray-600">{contact.date} - {contact.time}</span>
                </div>
                {contact.reason && (
                  <p className="text-xs text-gray-500 mt-1">{contact.reason}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  contact.alert === 'Urgência' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {contact.alert}
                </span>
                <button className="text-blue-600 hover:text-blue-800">
                  <DocumentTextIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhum contato anterior registrado</p>
      )}
      
      {/* Antecedentes - colapsado por padrão */}
      <details className="mt-4">
        <summary className="cursor-pointer bg-gray-50 p-2 rounded text-sm font-medium text-gray-700">
          Antecedentes
        </summary>
        <div className="mt-2 p-2 text-sm text-gray-600">
          Nenhum antecedente registrado
        </div>
      </details>
    </div>
  );

  const renderMeasurements = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <button 
        className="w-full text-left"
        onClick={() => setShowMeasurementsModal(true)}
      >
        <h3 className="font-semibold text-gray-900 mb-1">Medições</h3>
        <p className="text-sm text-gray-600 mb-3">De hoje:</p>
        
        <div className="space-y-2">
          {Object.entries(todayMeasurements).map(([key, measurement]) => (
            <div key={key} className="flex items-center text-sm">
              <HeartIcon className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-gray-700">
                {measurement.value} {measurement.unit || ''}
                {measurement.classification && ` (${measurement.classification})`}
                {measurement.context && ` - ${measurement.context}`}
              </span>
              <span className="ml-auto text-xs text-gray-500">{measurement.time}</span>
            </div>
          ))}
        </div>
      </button>
    </div>
  );

  const renderVaccinations = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="h-5 w-5 text-green-600 mr-2">💉</div>
        <h3 className="font-semibold text-gray-900">Vacinação</h3>
      </div>
      
      {vaccinations.length > 0 ? (
        <div className="space-y-2">
          {vaccinations.slice(0, 3).map((vaccine, index) => (
            <div key={index} className="flex items-center text-sm">
              <div className="h-4 w-4 text-green-600 mr-2">💉</div>
              <span className="text-gray-700">
                {vaccine.name} - {vaccine.dose}
              </span>
              <span className="ml-auto text-xs text-gray-500">{vaccine.date}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhuma vacina registrada</p>
      )}
      
      {hasDelayedVaccines && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
            <p className="text-sm text-orange-800">
              Existem vacinas atrasadas ou não registradas! Confira o cartão de vacinação do cidadão.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderAllergies = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Alergias/Reações adversas</h3>
      
      {allergies.length > 0 ? (
        <div className="space-y-2">
          {allergies.map((allergy) => (
            <div key={allergy.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-red-900">{allergy.agent}</p>
                  <p className="text-sm text-red-700">{allergy.category} • {allergy.reaction}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  allergy.criticality === 'Grave' ? 'bg-red-100 text-red-800' :
                  allergy.criticality === 'Moderada' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {allergy.criticality}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhuma alergia/reação adversa registrada</p>
      )}
    </div>
  );

  const renderProblems = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Lista de problemas/condições</h3>
      
      {activeProblems.length > 0 ? (
        <div className="space-y-3">
          {activeProblems.map((problem) => (
            <div key={problem.id} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600 mr-2" />
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Ativo</span>
                  </div>
                  <p className="font-medium text-gray-900">
                    {problem.description} ({problem.cid10})
                  </p>
                  <p className="text-sm text-gray-600">
                    Início: {problem.startDate} | Há {problem.daysAgo} dias
                  </p>
                  <p className="text-sm text-gray-600">
                    Última atualização: {problem.lastUpdate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhum problema/condição ativa</p>
      )}
    </div>
  );

  const renderExamResults = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-1">Resultados de exames</h3>
      <p className="text-sm text-gray-600 mb-3">Últimas 3 avaliações</p>
      
      {examResults.length > 0 ? (
        <div className="space-y-2">
          {examResults.map((exam, index) => (
            <div key={index}>
              <p className="font-medium text-gray-900">{exam.name}</p>
              <p className="text-sm text-gray-600">Realizado em {exam.date}</p>
              <p className="text-sm text-gray-900">{exam.result}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhum resultado de exame registrado</p>
      )}
    </div>
  );

  const renderMedications = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-1">MEDICAMENTOS</h3>
      <p className="text-sm text-gray-600 mb-3">Em uso:</p>
      
      {medications.length > 0 ? (
        <div className="space-y-2">
          {medications.map((med, index) => (
            <div key={index}>
              <p className="font-medium text-gray-900">{med.name}</p>
              <p className="text-sm text-gray-600">{med.dosage}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Nenhum medicamento em uso</p>
      )}
    </div>
  );

  const renderMeasurementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Histórico de medições</h2>
            <button 
              onClick={() => setShowMeasurementsModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="flex space-x-4 mt-4">
            {(['anthropometry', 'vitals', 'glycemia'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'anthropometry' ? 'Antropometria' :
                 tab === 'vitals' ? 'Sinais vitais' : 'Glicemia'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'anthropometry' && (
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Data da medição</th>
                    <th className="text-left py-2">Peso (kg)</th>
                    <th className="text-left py-2">Altura (cm)</th>
                    <th className="text-left py-2">IMC (kg/m²)</th>
                    <th className="text-left py-2">Per. cefálico (cm)</th>
                    <th className="text-left py-2">Circ. abdominal (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">15/01/2025 - 14:20</td>
                    <td className="py-2">72</td>
                    <td className="py-2">165</td>
                    <td className="py-2">26.4</td>
                    <td className="py-2">–</td>
                    <td className="py-2">–</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-4">1 resultado</p>
            </div>
          )}
          
          {activeTab === 'vitals' && (
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Data da medição</th>
                    <th className="text-left py-2">Pressão arterial (mmHg)</th>
                    <th className="text-left py-2">Freq. respiratória (ipm)</th>
                    <th className="text-left py-2">Freq. cardíaca (bpm)</th>
                    <th className="text-left py-2">Saturação de O₂ (%)</th>
                    <th className="text-left py-2">Temperatura (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">15/01/2025 - 14:25</td>
                    <td className="py-2">140/90</td>
                    <td className="py-2">–</td>
                    <td className="py-2">82</td>
                    <td className="py-2">98</td>
                    <td className="py-2">37.2</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-4">1 resultado</p>
            </div>
          )}
          
          {activeTab === 'glycemia' && (
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Data da medição</th>
                    <th className="text-left py-2">Glicemia capilar (mg/dL)</th>
                    <th className="text-left py-2">Momento da coleta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">15/01/2025 - 08:30</td>
                    <td className="py-2">110</td>
                    <td className="py-2">Jejum</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-sm text-gray-500 mt-4">1 resultado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Coluna principal - esquerda */}
      <div className="lg:col-span-2 space-y-4">
        {renderInitialListening()}
        {renderLastContacts()}
        {renderAllergies()}
        {renderProblems()}
        {renderExamResults()}
        {renderMedications()}
        
        {/* Botão Cancelar Atendimento */}
        <div className="pt-4">
          <button
            onClick={onCancelAppointment}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancelar atendimento individual
          </button>
        </div>
      </div>
      
      {/* Coluna lateral - direita */}
      <div className="space-y-4">
        {renderMeasurements()}
        {renderVaccinations()}
      </div>
      
      {/* Modal de medições */}
      {showMeasurementsModal && renderMeasurementsModal()}
    </div>
  );
};

export default CoverSheet;
