import React from 'react';
import { 
  HeartIcon,
  ScaleIcon,
  BeakerIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface CoverSheetProps {
  patient: any;
  consultation: any;
  vitalSigns: any[];
  measurements: any[];
  medications: any[];
}

const CoverSheet: React.FC<CoverSheetProps> = ({
  patient,
  consultation,
  vitalSigns,
  measurements,
  medications
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getLatestVitalSign = (type: string) => {
    return vitalSigns?.find(vs => vs.vital_sign_type === type);
  };

  const getLatestMeasurement = (type: string) => {
    return measurements?.find(m => m.measurement_type === type);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Folha de Rosto do Atendimento
        </h2>
        <p className="text-gray-600">
          Resumo geral das informações do paciente e atendimento
        </p>
      </div>

      {/* Patient Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Informações do Paciente
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Nome:</span>
              <span className="text-gray-900">{patient?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">CPF:</span>
              <span className="text-gray-900">{patient?.cpf}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Data de Nascimento:</span>
              <span className="text-gray-900">{formatDate(patient?.birth_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Gênero:</span>
              <span className="text-gray-900">
                {patient?.gender === 'male' ? 'Masculino' : 'Feminino'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Idade:</span>
              <span className="text-gray-900">
                {patient?.birth_date ? 
                  Math.floor((new Date().getTime() - new Date(patient.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365)) 
                  : 'N/A'
                } anos
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Atendimento
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Data/Hora:</span>
              <span className="text-gray-900">
                {new Date(consultation?.consultation_date).toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Tipo:</span>
              <span className="text-gray-900">{consultation?.consultation_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                consultation?.status === 'completed' ? 'bg-green-100 text-green-800' : 
                consultation?.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {consultation?.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Profissional:</span>
              <span className="text-gray-900">{consultation?.professional?.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vital Signs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
          Sinais Vitais
        </h3>
        {vitalSigns && vitalSigns.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Pressão Arterial</p>
              <p className="text-lg font-bold text-red-600">
                {getLatestVitalSign('systolic_pressure')?.value || '--'}/
                {getLatestVitalSign('diastolic_pressure')?.value || '--'} mmHg
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Frequência Cardíaca</p>
              <p className="text-lg font-bold text-blue-600">
                {getLatestVitalSign('heart_rate')?.value || '--'} bpm
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Temperatura</p>
              <p className="text-lg font-bold text-green-600">
                {getLatestVitalSign('temperature')?.value || '--'} °C
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Saturação O₂</p>
              <p className="text-lg font-bold text-purple-600">
                {getLatestVitalSign('oxygen_saturation')?.value || '--'} %
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhum sinal vital registrado ainda
          </p>
        )}
      </div>

      {/* Measurements */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ScaleIcon className="h-5 w-5 mr-2 text-blue-500" />
          Medições Antropométricas
        </h3>
        {measurements && measurements.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Peso</p>
              <p className="text-lg font-bold text-blue-600">
                {getLatestMeasurement('weight')?.value || '--'} kg
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Altura</p>
              <p className="text-lg font-bold text-green-600">
                {getLatestMeasurement('height')?.value || '--'} cm
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">IMC</p>
              <p className="text-lg font-bold text-orange-600">
                {getLatestMeasurement('bmi')?.value || '--'} kg/m²
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Circunferência Abdominal</p>
              <p className="text-lg font-bold text-purple-600">
                {getLatestMeasurement('waist_circumference')?.value || '--'} cm
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhuma medição registrada ainda
          </p>
        )}
      </div>

      {/* Current Medications */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BeakerIcon className="h-5 w-5 mr-2 text-green-500" />
          Medicamentos Prescritos
        </h3>
        {medications && medications.length > 0 ? (
          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{med.medication?.name}</p>
                  <p className="text-sm text-gray-600">
                    {med.dosage} - {med.frequency}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {med.duration}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            Nenhum medicamento prescrito ainda
          </p>
        )}
      </div>
    </div>
  );
};

export default CoverSheet;
