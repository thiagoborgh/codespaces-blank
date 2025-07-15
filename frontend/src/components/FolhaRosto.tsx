import React, { useState } from 'react';
import { Patient } from '../types/types';

interface FolhaRostoProps {
  patient: Patient;
}

interface Consultation {
  id: number;
  date: string;
  ciap2: string;
  cid10: string;
  interventions: string;
  age: string;
  type: 'escuta' | 'consulta' | 'procedimento';
}

interface Referral {
  id: number;
  date: string;
  professional: string;
  specialty: string;
  hypothesis: string;
}

interface Measurement {
  id: number;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  cephalicPerimeter?: number;
  abdominalCircumference?: number;
  calfPerimeter?: number;
}

interface VitalSign {
  id: number;
  date: string;
  bloodPressure: string;
  respiratoryRate: number;
  heartRate: number;
  oxygenSaturation: number;
  temperature: number;
}

interface GlycemiaMeasurement {
  id: number;
  date: string;
  value: number;
  collectionMoment: 'jejum' | 'pre-prandial' | 'pos-prandial' | 'nao-especificado';
}

const FolhaRosto: React.FC<FolhaRostoProps> = ({ patient }) => {
  const [activeSubTab, setActiveSubTab] = useState<'atendimento' | 'medicoes'>('atendimento');
  const [medicalSubTab, setMedicalSubTab] = useState<'vitais' | 'glicemia'>('vitais');

  // Log para debug
  console.log('FolhaRosto - activeSubTab atual:', activeSubTab);

  const handleTabChange = (tab: 'atendimento' | 'medicoes') => {
    console.log('Mudando tab para:', tab);
    setActiveSubTab(tab);
  };

  // Dados mock - em produção viriam de uma API
  const [consultations] = useState<Consultation[]>([
    {
      id: 1,
      date: '18/09/2024 às 12:00',
      ciap2: 'Dores musculares - L18',
      cid10: 'M79.3 - Dor muscular',
      interventions: 'Prescrição de analgésico',
      age: '21 anos 4 meses',
      type: 'escuta'
    },
    {
      id: 2,
      date: '18/08/2024 às 12:00',
      ciap2: 'Dores musculares - L18',
      cid10: 'M79.3 - Dor muscular',
      interventions: 'Fisioterapia recomendada',
      age: '21 anos 3 meses',
      type: 'consulta'
    },
    {
      id: 3,
      date: '18/07/2024 às 12:00',
      ciap2: 'Dores musculares - L18',
      cid10: 'M79.3 - Dor muscular',
      interventions: 'Exame radiológico',
      age: '21 anos 2 meses',
      type: 'procedimento'
    }
  ]);

  const [referrals] = useState<Referral[]>([
    {
      id: 1,
      date: '18/09/2024 às 12:00',
      professional: 'Dr. Chelsea Elizabeth Manning',
      specialty: 'Médico Clínico',
      hypothesis: 'Investigação dor muscular'
    },
    {
      id: 2,
      date: '18/08/2024 às 12:00',
      professional: 'Dr. Chelsea Elizabeth Manning',
      specialty: 'Fisioterapeuta',
      hypothesis: 'Reabilitação muscular'
    },
    {
      id: 3,
      date: '18/07/2024 às 12:00',
      professional: 'Dr. Chelsea Elizabeth Manning',
      specialty: 'Radiologista',
      hypothesis: 'Avaliação por imagem'
    }
  ]);

  const [measurements] = useState<Measurement[]>([
    {
      id: 1,
      date: '18/09/2024 às 12:00',
      weight: 65.2,
      height: 165,
      bmi: 23.9,
      abdominalCircumference: 72
    },
    {
      id: 2,
      date: '18/08/2024 às 12:00',
      weight: 64.8,
      height: 165,
      bmi: 23.8,
      abdominalCircumference: 73
    },
    {
      id: 3,
      date: '18/07/2024 às 12:00',
      weight: 65.0,
      height: 165,
      bmi: 23.9,
      abdominalCircumference: 71
    }
  ]);

  const [vitalSigns] = useState<VitalSign[]>([
    {
      id: 1,
      date: '18/09/2024 às 12:00',
      bloodPressure: '120/80',
      respiratoryRate: 16,
      heartRate: 72,
      oxygenSaturation: 98,
      temperature: 36.5
    },
    {
      id: 2,
      date: '18/08/2024 às 12:00',
      bloodPressure: '118/78',
      respiratoryRate: 15,
      heartRate: 70,
      oxygenSaturation: 97,
      temperature: 36.2
    },
    {
      id: 3,
      date: '18/07/2024 às 12:00',
      bloodPressure: '122/82',
      respiratoryRate: 16,
      heartRate: 74,
      oxygenSaturation: 98,
      temperature: 36.8
    }
  ]);

  const [glycemiaMeasurements] = useState<GlycemiaMeasurement[]>([
    {
      id: 1,
      date: '18/09/2024 às 12:00',
      value: 95,
      collectionMoment: 'jejum'
    },
    {
      id: 2,
      date: '18/08/2024 às 12:00',
      value: 92,
      collectionMoment: 'jejum'
    },
    {
      id: 3,
      date: '18/07/2024 às 12:00',
      value: 98,
      collectionMoment: 'jejum'
    }
  ]);

  // Criar gráficos simples usando SVG
  const createLineChart = (data: number[], labels: string[], title: string, color: string = '#3B82F6') => {
    // Validação de dados
    if (!data || data.length === 0 || !labels || labels.length === 0) {
      return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h6 className="text-sm font-medium text-gray-900 mb-2">{title}</h6>
          <div className="flex items-center justify-center h-48 text-gray-500">
            Não há dados suficientes para gerar o gráfico
          </div>
        </div>
      );
    }

    const width = 400;
    const height = 200;
    const padding = 40;
    const maxValue = Math.max(...data) * 1.1;
    const minValue = Math.min(...data) * 0.9;
    const range = maxValue - minValue;
    
    // Evitar divisão por zero
    if (range === 0 || data.length < 2) {
      return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h6 className="text-sm font-medium text-gray-900 mb-2">{title}</h6>
          <div className="flex items-center justify-center h-48 text-gray-500">
            Dados insuficientes para plotar gráfico
          </div>
        </div>
      );
    }
    
    const points = data.map((value, index) => {
      const x = padding + (index * (width - 2 * padding)) / Math.max(data.length - 1, 1);
      const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h6 className="text-sm font-medium text-gray-900 mb-2">{title}</h6>
        <svg width={width} height={height} className="border border-gray-100">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={padding}
              y1={padding + i * (height - 2 * padding) / 4}
              x2={width - padding}
              y2={padding + i * (height - 2 * padding) / 4}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          
          {/* Data points */}
          {data.map((value, index) => {
            const x = padding + (index * (width - 2 * padding)) / Math.max(data.length - 1, 1);
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
              />
            );
          })}
          
          {/* Labels */}
          {labels.map((label, index) => {
            const x = padding + (index * (width - 2 * padding)) / Math.max(labels.length - 1, 1);
            return (
              <text
                key={index}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'escuta': return 'bg-blue-100 text-blue-800';
      case 'consulta': return 'bg-green-100 text-green-800';
      case 'procedimento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Folha Rosto - {patient.name}
        </h3>
        <p className="text-sm text-gray-600">
          Informações do atendimento e medições
        </p>
      </div>

      {/* Navegação entre sub-abas */}
      <div className="px-6 pt-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('atendimento')}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer relative z-10 ${
                activeSubTab === 'atendimento'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              <span className="mr-2">📋</span>
              Informações do atendimento
            </button>
            <button
              onClick={() => handleTabChange('medicoes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm cursor-pointer relative z-10 ${
                activeSubTab === 'medicoes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              <span className="mr-2">📊</span>
              Medições
            </button>
          </nav>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Informações do atendimento */}
        {activeSubTab === 'atendimento' && (
          <div className="space-y-6">
            {/* Informações Iniciais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h6 className="text-sm font-medium text-gray-700 mb-1">Data de Nascimento</h6>
                <p className="text-lg font-bold text-blue-600">10/02/2004</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h6 className="text-sm font-medium text-gray-700 mb-1">Idade</h6>
                <p className="text-lg font-bold text-green-600">21 anos</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h6 className="text-sm font-medium text-gray-700 mb-1">Gênero</h6>
                <p className="text-lg font-bold text-purple-600">Feminino</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <h6 className="text-sm font-medium text-gray-700 mb-1">Telefone</h6>
                <p className="text-lg font-bold text-orange-600">(11) 99999-9999</p>
              </div>
            </div>

            {/* Últimas Consultas */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 bg-blue-50 border-b border-gray-200">
                <h6 className="font-medium text-blue-900">
                  <span className="mr-2">📅</span>
                  Últimas Consultas
                </h6>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIAP 2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CID 10</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervenções</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Idade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consultations.map((consultation) => (
                      <tr key={consultation.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{consultation.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{consultation.ciap2}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{consultation.cid10}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{consultation.interventions}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{consultation.age}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(consultation.type)}`}>
                            {consultation.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            👁️ Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Encaminhamentos */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h6 className="font-medium text-gray-900">
                  <span className="mr-2">➡️</span>
                  Encaminhamentos
                </h6>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profissional</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hipótese/Diagnóstico</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{referral.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{referral.professional}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{referral.specialty}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{referral.hypothesis}</td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            👁️ Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Medições */}
        {activeSubTab === 'medicoes' && (
          <div className="space-y-6">
            {/* Antropometria */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-4 py-3 bg-green-50 border-b border-gray-200 flex justify-between items-center">
                <h6 className="font-medium text-green-900">
                  <span className="mr-2">📏</span>
                  Antropometria
                </h6>
                <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                  <option value="20a30">20 a 30 anos</option>
                  <option value="30a40">30 a 40 anos</option>
                  <option value="todos">Todos os registros</option>
                </select>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Altura (cm)</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMC</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Circ. Abdominal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {measurements.map((measurement) => (
                        <tr key={measurement.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{measurement.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{measurement.weight}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{measurement.height}</td>
                          <td className={`px-4 py-3 text-sm font-medium ${getBMIStatus(measurement.bmi)}`}>
                            {measurement.bmi}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{measurement.abdominalCircumference || '-'}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Normal
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Gráfico de Antropometria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createLineChart(
                    measurements.map(m => m.weight),
                    measurements.map(m => {
                      try {
                        // Extrair data de forma mais segura
                        const dateParts = m.date.split(' ')[0].split('/');
                        return dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : m.date.substring(0, 5);
                      } catch (e) {
                        return m.date.substring(0, 5);
                      }
                    }),
                    'Evolução do Peso',
                    '#10B981'
                  )}
                  {createLineChart(
                    measurements.map(m => m.bmi),
                    measurements.map(m => {
                      try {
                        const dateParts = m.date.split(' ')[0].split('/');
                        return dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : m.date.substring(0, 5);
                      } catch (e) {
                        return m.date.substring(0, 5);
                      }
                    }),
                    'Evolução do IMC',
                    '#F59E0B'
                  )}
                </div>
              </div>
            </div>

            {/* Sub-abas para Sinais Vitais e Glicemia */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4">
                  <button
                    onClick={() => setMedicalSubTab('vitais')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      medicalSubTab === 'vitais'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">❤️</span>
                    Sinais vitais
                  </button>
                  <button
                    onClick={() => setMedicalSubTab('glicemia')}
                    className={`py-3 px-1 border-b-2 font-medium text-sm ${
                      medicalSubTab === 'glicemia'
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">🩸</span>
                    Glicemia
                  </button>
                </nav>
              </div>

              <div className="p-4">
                {medicalSubTab === 'vitais' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h6 className="font-medium text-gray-900">Sinais Vitais</h6>
                      <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                        <option value="jul2024">Jul 2024</option>
                        <option value="jun2024">Jun 2024</option>
                        <option value="todos">Todos os registros</option>
                      </select>
                    </div>
                    
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pressão Arterial</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freq. Respiratória</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freq. Cardíaca</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saturação O₂</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperatura</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {vitalSigns.map((vital) => (
                            <tr key={vital.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.bloodPressure}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.respiratoryRate}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.heartRate}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.oxygenSaturation}%</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{vital.temperature}°C</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Normal
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Gráfico de Sinais Vitais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {createLineChart(
                        vitalSigns.map(v => {
                          try {
                            return parseInt(v.bloodPressure.split('/')[0]) || 0;
                          } catch (e) {
                            return 0;
                          }
                        }),
                        vitalSigns.map(v => {
                          try {
                            const dateParts = v.date.split(' ')[0].split('/');
                            return dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : v.date.substring(0, 5);
                          } catch (e) {
                            return v.date.substring(0, 5);
                          }
                        }),
                        'Pressão Sistólica',
                        '#EF4444'
                      )}
                      {createLineChart(
                        vitalSigns.map(v => v.heartRate || 0),
                        vitalSigns.map(v => {
                          try {
                            const dateParts = v.date.split(' ')[0].split('/');
                            return dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : v.date.substring(0, 5);
                          } catch (e) {
                            return v.date.substring(0, 5);
                          }
                        }),
                        'Frequência Cardíaca',
                        '#8B5CF6'
                      )}
                    </div>
                  </div>
                )}

                {medicalSubTab === 'glicemia' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h6 className="font-medium text-gray-900">Glicemia</h6>
                      <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                        <option value="jul2024">Jul 2024</option>
                        <option value="jun2024">Jun 2024</option>
                        <option value="todos">Todos os registros</option>
                      </select>
                    </div>
                    
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glicemia (mg/dL)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Momento da Coleta</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {glycemiaMeasurements.map((glycemia) => (
                            <tr key={glycemia.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">{glycemia.date}</td>
                              <td className="px-4 py-3 text-sm text-gray-900">{glycemia.value}</td>
                              <td className="px-4 py-3 text-sm text-gray-900 capitalize">{glycemia.collectionMoment.replace('-', ' ')}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Normal
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Gráfico de Glicemia */}
                    <div className="max-w-md">
                      {createLineChart(
                        glycemiaMeasurements.map(g => g.value || 0),
                        glycemiaMeasurements.map(g => {
                          try {
                            const dateParts = g.date.split(' ')[0].split('/');
                            return dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : g.date.substring(0, 5);
                          } catch (e) {
                            return g.date.substring(0, 5);
                          }
                        }),
                        'Evolução da Glicemia',
                        '#06B6D4'
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolhaRosto;
