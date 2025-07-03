import React, { useState } from 'react';
import { Patient } from '../../types/types';
import { XMarkIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface AttendanceStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

interface AttendanceData {
  arrivalTime: string;
  departureTime: string;
  serviceDescription: string;
  attendingPhysician: string;
  observations: string;
}

const AttendanceStatementModal: React.FC<AttendanceStatementModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({
    arrivalTime: '',
    departureTime: '',
    serviceDescription: 'Atendimento médico',
    attendingPhysician: '',
    observations: ''
  });

  if (!isOpen || !patient) return null;

  const handleInputChange = (field: keyof AttendanceData, value: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = () => {
    // Simular geração de PDF
    const printContent = document.getElementById('statement-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Declaração de Comparecimento - ${patient.name}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 20px; 
                  line-height: 1.6;
                  color: #333;
                }
                .header { 
                  text-align: center; 
                  margin-bottom: 30px; 
                  border-bottom: 2px solid #2563eb;
                  padding-bottom: 20px;
                }
                .header h1 { 
                  color: #2563eb; 
                  margin: 0;
                  font-size: 24px;
                }
                .header p { 
                  margin: 5px 0; 
                  color: #666;
                }
                .content { 
                  margin: 30px 0; 
                  text-align: justify;
                }
                .patient-info { 
                  background: #f8fafc; 
                  padding: 20px; 
                  border-radius: 8px; 
                  margin: 20px 0;
                  border-left: 4px solid #2563eb;
                }
                .signature { 
                  margin-top: 60px; 
                  text-align: center; 
                }
                .signature-line { 
                  border-top: 1px solid #333; 
                  width: 300px; 
                  margin: 50px auto 10px; 
                }
                .footer { 
                  margin-top: 40px; 
                  padding-top: 20px; 
                  border-top: 1px solid #ddd; 
                  font-size: 12px; 
                  color: #666; 
                  text-align: center;
                }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const downloadPDF = () => {
    // Para uma implementação real, você usaria uma biblioteca como jsPDF ou html2pdf
    alert('Funcionalidade de download em PDF será implementada com biblioteca específica (jsPDF)');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Declaração de Comparecimento
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Form Section */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto max-h-[calc(90vh-80px)]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Dados do Atendimento
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Chegada *
                </label>
                <input
                  type="time"
                  value={attendanceData.arrivalTime}
                  onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horário de Saída *
                </label>
                <input
                  type="time"
                  value={attendanceData.departureTime}
                  onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição do Serviço
                </label>
                <input
                  type="text"
                  value={attendanceData.serviceDescription}
                  onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Consulta médica, Vacinação, Exame..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profissional Responsável
                </label>
                <input
                  type="text"
                  value={attendanceData.attendingPhysician}
                  onChange={(e) => handleInputChange('attendingPhysician', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome do profissional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={attendanceData.observations}
                  onChange={(e) => handleInputChange('observations', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações adicionais..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={generatePDF}
                disabled={!attendanceData.arrivalTime || !attendanceData.departureTime}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PrinterIcon className="h-4 w-4" />
                Imprimir
              </button>
              <button
                onClick={downloadPDF}
                disabled={!attendanceData.arrivalTime || !attendanceData.departureTime}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto max-h-[calc(90vh-80px)]">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Pré-visualização
            </h3>
            
            <div id="statement-content" className="bg-white p-8 rounded-lg shadow-sm">
              <div className="header">
                <h1>DECLARAÇÃO DE COMPARECIMENTO</h1>
                <p>Unidade Básica de Saúde</p>
                <p>Sistema de Fila de Atendimento</p>
              </div>

              <div className="content">
                <p>
                  Declaramos para os devidos fins que o(a) cidadão(ã) abaixo identificado(a) 
                  compareceu a esta unidade de saúde na data de hoje, <strong>{new Date().toLocaleDateString('pt-BR')}</strong>, 
                  para {attendanceData.serviceDescription.toLowerCase()}.
                </p>

                <div className="patient-info">
                  <h3 style={{ margin: '0 0 15px 0', color: '#2563eb' }}>Dados do Cidadão:</h3>
                  <p><strong>Nome:</strong> {patient.name}</p>
                  <p><strong>CPF:</strong> {formatCPF(patient.cpf)}</p>
                  {patient.rg && <p><strong>RG:</strong> {patient.rg}</p>}
                  <p><strong>Data de Nascimento:</strong> {formatDate(patient.birth_date)}</p>
                  {patient.phone && <p><strong>Telefone:</strong> {patient.phone}</p>}
                </div>

                {(attendanceData.arrivalTime || attendanceData.departureTime) && (
                  <div className="patient-info">
                    <h3 style={{ margin: '0 0 15px 0', color: '#2563eb' }}>Horários:</h3>
                    {attendanceData.arrivalTime && (
                      <p><strong>Chegada:</strong> {attendanceData.arrivalTime}</p>
                    )}
                    {attendanceData.departureTime && (
                      <p><strong>Saída:</strong> {attendanceData.departureTime}</p>
                    )}
                  </div>
                )}

                {attendanceData.observations && (
                  <div className="patient-info">
                    <h3 style={{ margin: '0 0 15px 0', color: '#2563eb' }}>Observações:</h3>
                    <p>{attendanceData.observations}</p>
                  </div>
                )}

                <p>
                  Esta declaração é emitida para comprovação de comparecimento junto ao empregador, 
                  instituição de ensino ou outros fins legais.
                </p>
              </div>

              <div className="signature">
                <div className="signature-line"></div>
                <p><strong>{attendanceData.attendingPhysician || 'Profissional Responsável'}</strong></p>
                <p>Unidade Básica de Saúde</p>
              </div>

              <div className="footer">
                <p>
                  Documento emitido em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} 
                  pelo Sistema de Fila de Atendimento
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceStatementModal;
