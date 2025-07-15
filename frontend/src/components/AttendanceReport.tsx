import React from 'react';
import { Patient } from '../types/types';

interface AttendanceReportProps {
  patient: Patient;
  soapData: any;
  onClose: () => void;
  onPrint: () => void;
}

const AttendanceReport: React.FC<AttendanceReportProps> = ({ 
  patient, 
  soapData, 
  onClose, 
  onPrint 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            📋 Relatório de Atendimento
          </h2>
          <div className="flex gap-2">
            <button
              onClick={onPrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              ✖️ Fechar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6" id="attendance-report">
          {/* Cabeçalho da Unidade */}
          <div className="text-center border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-gray-900">UNIDADE BÁSICA DE SAÚDE</h1>
            <p className="text-gray-600">Relatório de Atendimento Médico</p>
            <p className="text-sm text-gray-500">Data: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          {/* Dados do Paciente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Dados do Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Nome:</span>
                <span className="ml-2 text-gray-900">{patient.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">CPF:</span>
                <span className="ml-2 text-gray-900">{formatCPF(patient.cpf)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Idade:</span>
                <span className="ml-2 text-gray-900">{calculateAge(patient.birth_date)} anos</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Data de Nascimento:</span>
                <span className="ml-2 text-gray-900">{formatDate(patient.birth_date)}</span>
              </div>
              {patient.phone && (
                <div>
                  <span className="font-medium text-gray-700">Telefone:</span>
                  <span className="ml-2 text-gray-900">{patient.phone}</span>
                </div>
              )}
              {patient.email && (
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{patient.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* SOAP */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Registro SOAP</h3>
            
            {/* Subjetivo */}
            {soapData.subjective && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🗣️ Subjetivo</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{soapData.subjective}</p>
              </div>
            )}

            {/* Objetivo */}
            {(soapData.objective || Object.values(soapData.vital_signs).some(v => v) || Object.values(soapData.measurements).some(v => v)) && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">👁️ Objetivo</h4>
                
                {/* Sinais Vitais */}
                {Object.values(soapData.vital_signs).some(v => v) && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-800 mb-2">Sinais Vitais:</h5>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {soapData.vital_signs.systolic_pressure && soapData.vital_signs.diastolic_pressure && (
                        <div>PA: {soapData.vital_signs.systolic_pressure}/{soapData.vital_signs.diastolic_pressure} mmHg</div>
                      )}
                      {soapData.vital_signs.heart_rate && (
                        <div>FC: {soapData.vital_signs.heart_rate} bpm</div>
                      )}
                      {soapData.vital_signs.temperature && (
                        <div>Temp: {soapData.vital_signs.temperature}°C</div>
                      )}
                      {soapData.vital_signs.respiratory_rate && (
                        <div>FR: {soapData.vital_signs.respiratory_rate} irpm</div>
                      )}
                      {soapData.vital_signs.oxygen_saturation && (
                        <div>SpO2: {soapData.vital_signs.oxygen_saturation}%</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Medidas */}
                {Object.values(soapData.measurements).some(v => v) && (
                  <div className="mb-3">
                    <h5 className="font-medium text-gray-800 mb-2">Medidas Antropométricas:</h5>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      {soapData.measurements.weight && (
                        <div>Peso: {soapData.measurements.weight} kg</div>
                      )}
                      {soapData.measurements.height && (
                        <div>Altura: {soapData.measurements.height} cm</div>
                      )}
                      {soapData.measurements.bmi && (
                        <div>IMC: {soapData.measurements.bmi}</div>
                      )}
                    </div>
                  </div>
                )}

                {soapData.objective && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Exame Físico:</h5>
                    <p className="text-gray-800 whitespace-pre-wrap">{soapData.objective}</p>
                  </div>
                )}
              </div>
            )}

            {/* Avaliação */}
            {soapData.assessment && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">📋 Avaliação</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{soapData.assessment}</p>
              </div>
            )}

            {/* Plano */}
            {soapData.plan && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">📝 Plano</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{soapData.plan}</p>
              </div>
            )}
          </div>

          {/* Prescrições */}
          {soapData.prescriptions && soapData.prescriptions.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-3">💊 Prescrições</h4>
              <div className="space-y-3">
                {soapData.prescriptions.map((prescription: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-900">{prescription.medication}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>Dosagem: {prescription.dosage}</div>
                      <div>Frequência: {prescription.frequency}</div>
                      {prescription.duration && <div>Duração: {prescription.duration}</div>}
                      {prescription.instructions && <div>Instruções: {prescription.instructions}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retorno */}
          {soapData.follow_up && (soapData.follow_up.date || soapData.follow_up.notes) && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-medium text-indigo-900 mb-3">📅 Retorno</h4>
              {soapData.follow_up.date && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Data do retorno:</span>
                  <span className="ml-2 text-gray-900">{formatDate(soapData.follow_up.date)}</span>
                </div>
              )}
              {soapData.follow_up.type && (
                <div className="mb-2">
                  <span className="font-medium text-gray-700">Tipo:</span>
                  <span className="ml-2 text-gray-900">{soapData.follow_up.type}</span>
                </div>
              )}
              {soapData.follow_up.notes && (
                <div>
                  <span className="font-medium text-gray-700">Observações:</span>
                  <p className="text-gray-800 mt-1 whitespace-pre-wrap">{soapData.follow_up.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Assinatura */}
          <div className="border-t border-gray-200 pt-4 text-center">
            <div className="space-y-2">
              <div className="text-gray-900">Dr(a). Nome do Profissional</div>
              <div className="text-sm text-gray-600">CRM: 123456 - UF</div>
              <div className="text-sm text-gray-500">Data: {new Date().toLocaleDateString('pt-BR')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
