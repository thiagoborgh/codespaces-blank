import React from 'react';

interface Patient {
  id: number;
  name: string;
  cpf: string;
  birthDate: string;
  ageFormatted: string;
  gender: 'male' | 'female';
  photo?: string;
  motherName?: string;
  address?: string;
  phone?: string;
  conditions?: string[];
  allergies?: string[];
}

interface PatientHeaderProps {
  patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
  const getAvatarText = () => {
    return patient.name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6 py-6">
        <div className="flex items-start space-x-6">
          {/* Foto/Avatar */}
          <div className="flex-shrink-0">
            {patient.photo ? (
              <img 
                src={patient.photo} 
                alt={patient.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                <span className="text-blue-600 font-semibold text-lg">
                  {getAvatarText()}
                </span>
              </div>
            )}
          </div>

          {/* Informações Principais */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna 1 - Dados Pessoais */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {patient.name}
                </h1>
                {patient.motherName && (
                  <p className="text-gray-600 mb-1">
                    ({patient.motherName})
                  </p>
                )}
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">CPF:</span> {patient.cpf}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Data de nascimento:</span> {patient.birthDate} - {patient.ageFormatted}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Sexo:</span> {patient.gender === 'male' ? 'Masculino' : 'Feminino'}
                </p>
                {patient.address && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Endereço:</span> {patient.address}
                  </p>
                )}
                {patient.phone && (
                  <p className="text-gray-600">
                    <span className="font-medium">Telefone:</span> {patient.phone}
                  </p>
                )}
              </div>

              {/* Coluna 2 - Condições e Alergias */}
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Condições e situações de saúde
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions && patient.conditions.length > 0 ? (
                      patient.conditions.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Nenhuma condição registrada</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Alergias/Reações adversas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">Nenhuma alergia registrada</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
