import React, { useState } from 'react';
import { 
  HeartIcon,
  ScaleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface MeasurementsTabProps {
  consultation: any;
  vitalSigns: any[];
  measurements: any[];
  onAddMeasurement: (type: string, data: any) => void;
}

const MeasurementsTab: React.FC<MeasurementsTabProps> = ({ 
  consultation, 
  vitalSigns, 
  measurements, 
  onAddMeasurement 
}) => {
  const [activeCategory, setActiveCategory] = useState<'vital_signs' | 'anthropometry'>('vital_signs');
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [newMeasurement, setNewMeasurement] = useState({
    type: '',
    value: '',
    unit: '',
    notes: ''
  });

  const vitalSignsTypes = [
    { id: 'blood_pressure', label: 'Pressão Arterial', unit: 'mmHg', icon: HeartIcon, color: 'text-red-600' },
    { id: 'heart_rate', label: 'Frequência Cardíaca', unit: 'bpm', icon: HeartIcon, color: 'text-red-600' },
    { id: 'temperature', label: 'Temperatura', unit: '°C', icon: ClockIcon, color: 'text-blue-600' },
    { id: 'respiratory_rate', label: 'Frequência Respiratória', unit: 'rpm', icon: ClockIcon, color: 'text-blue-600' },
    { id: 'oxygen_saturation', label: 'Saturação de O2', unit: '%', icon: ClockIcon, color: 'text-blue-600' },
    { id: 'blood_glucose', label: 'Glicemia', unit: 'mg/dL', icon: ClockIcon, color: 'text-green-600' }
  ];

  const anthropometryTypes = [
    { id: 'weight', label: 'Peso', unit: 'kg', icon: ScaleIcon, color: 'text-purple-600' },
    { id: 'height', label: 'Altura', unit: 'cm', icon: ScaleIcon, color: 'text-purple-600' },
    { id: 'bmi', label: 'IMC', unit: 'kg/m²', icon: ScaleIcon, color: 'text-purple-600' },
    { id: 'waist_circumference', label: 'Circunferência Abdominal', unit: 'cm', icon: ScaleIcon, color: 'text-purple-600' },
    { id: 'head_circumference', label: 'Perímetro Cefálico', unit: 'cm', icon: ScaleIcon, color: 'text-purple-600' }
  ];

  const handleAddMeasurement = () => {
    if (newMeasurement.type && newMeasurement.value) {
      onAddMeasurement(activeCategory, newMeasurement);
      setNewMeasurement({ type: '', value: '', unit: '', notes: '' });
      setIsAddingMeasurement(false);
    }
  };

  const getMeasurementsByType = (type: string) => {
    if (activeCategory === 'vital_signs') {
      return vitalSigns.filter(vs => vs.vital_sign_type === type);
    } else {
      return measurements.filter(m => m.measurement_type === type);
    }
  };

  const renderMeasurementCard = (measurementType: any) => {
    const Icon = measurementType.icon;
    const recentMeasurements = getMeasurementsByType(measurementType.id);
    const latestMeasurement = recentMeasurements[0];

    return (
      <div key={measurementType.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Icon className={`w-6 h-6 ${measurementType.color} mr-3`} />
            <div>
              <h3 className="font-semibold text-gray-900">{measurementType.label}</h3>
              <p className="text-sm text-gray-500">Unidade: {measurementType.unit}</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setNewMeasurement({ 
                ...newMeasurement, 
                type: measurementType.id, 
                unit: measurementType.unit 
              });
              setIsAddingMeasurement(true);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>

        {latestMeasurement ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {latestMeasurement.value} {measurementType.unit}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(latestMeasurement.measured_at || latestMeasurement.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-500 hover:text-blue-600 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {recentMeasurements.length > 1 && (
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">Últimas medições:</p>
                <div className="space-y-1">
                  {recentMeasurements.slice(1, 4).map((measurement, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">
                        {measurement.value} {measurementType.unit}
                      </span>
                      <span className="text-gray-500">
                        {new Date(measurement.measured_at || measurement.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <ChartBarIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Nenhuma medição registrada</p>
          </div>
        )}
      </div>
    );
  };

  const currentTypes = activeCategory === 'vital_signs' ? vitalSignsTypes : anthropometryTypes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Medições</h2>
            <p className="text-gray-600 mt-1">
              Registro de sinais vitais e medidas antropométricas
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveCategory('vital_signs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'vital_signs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <HeartIcon className="w-5 h-5 mr-2" />
                Sinais Vitais
              </div>
            </button>
            
            <button
              onClick={() => setActiveCategory('anthropometry')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeCategory === 'anthropometry'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <ScaleIcon className="w-5 h-5 mr-2" />
                Antropometria
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTypes.map(type => renderMeasurementCard(type))}
          </div>
        </div>
      </div>

      {/* Add Measurement Modal */}
      {isAddingMeasurement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Adicionar {currentTypes.find(t => t.id === newMeasurement.type)?.label}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={newMeasurement.value}
                    onChange={(e) => setNewMeasurement({ ...newMeasurement, value: e.target.value })}
                    className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite o valor"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-700">
                    {newMeasurement.unit}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={newMeasurement.notes}
                  onChange={(e) => setNewMeasurement({ ...newMeasurement, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Adicione observações..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddingMeasurement(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleAddMeasurement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTab;
