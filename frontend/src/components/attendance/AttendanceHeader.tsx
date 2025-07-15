import React from 'react';
import { 
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AttendanceHeaderProps {
  patient: any;
  consultation: any;
  onCancel: () => void;
  onBack: () => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({
  patient,
  consultation,
  onCancel,
  onBack
}) => {
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}a ${months}m e ${days}d`;
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="px-6 py-3 border-b border-gray-200">
        <ol className="flex space-x-2 text-sm text-gray-600">
          <li>
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Fila de Atendimento
            </button>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium">Atendimento</li>
        </ol>
      </nav>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Atendimento</h2>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Cancelar Atendimento
          </button>
        </div>

        {/* Patient Data Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Patient Photo */}
            <div className="col-span-2">
              <img 
                src="https://via.placeholder.com/100" 
                alt="Foto do Paciente" 
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>

            {/* Patient Basic Info */}
            <div className="col-span-5">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                {patient?.name || 'Maria Antoinieta Albuquerque Soares'}
              </p>
              <p className="text-gray-600 mb-2">
                ({patient?.social_name || 'Mário Henrique da Silva Oliveira Gomes dos Santos Albuquerque Soares'})
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">CPF:</span> {patient?.cpf || '094556799-80'}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Data de nascimento:</span> {' '}
                {patient?.birth_date ? 
                  `${new Date(patient.birth_date).toLocaleDateString('pt-BR')} - ${calculateAge(patient.birth_date)}` 
                  : '10/02/2004 - 21a 4m e 8d'
                }
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Sexo:</span> {patient?.gender || 'Feminino'}
              </p>
            </div>

            {/* Health Conditions and Allergies */}
            <div className="col-span-5">
              <div className="mb-4">
                <p className="font-semibold text-gray-900 mb-2">
                  Condições e situações de saúde
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Hipertenso
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Diabético
                  </span>
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  Alergias/Reações adversas
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Dipirona
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Leite
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Mofo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHeader;
