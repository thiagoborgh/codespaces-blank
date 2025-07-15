import React, { useState } from 'react';
import { PencilIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

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

interface CoverSheetData {
  motivo: string;
  profissional: string;
  observacoes: string;
  dataHora: Date;
}

interface CoverSheetProps {
  patient: Patient;
  data: CoverSheetData;
  onDataChange: (data: CoverSheetData) => void;
}

const CoverSheetNew: React.FC<CoverSheetProps> = ({ patient, data, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'atendimento' | 'medicoes'>('atendimento');
  const [showTimeline, setShowTimeline] = useState(true);

  const handleChange = (field: keyof CoverSheetData, value: any) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onDataChange(newData);
  };

  const handleTabChange = (tab: 'atendimento' | 'medicoes') => {
    console.log('Mudando tab para:', tab);
    setActiveTab(tab);
  };

  const handleCardEdit = (cardId: string) => {
    setEditingCard(editingCard === cardId ? null : cardId);
  };

  // Cards informativos baseados no protótipo
  const informationCards = [
    {
      id: 'vacinacao',
      title: 'Vacinação',
      content: [
        '💉 Dupla adulto - 2ª dose 00/00/0000',
        '💉 Dupla adulto - 2ª dose 00/00/0000',
        '💉 Dupla adulto - 2ª dose 00/00/0000',
        '💉 Dupla adulto - 2ª dose 00/00/0000'
      ]
    },
    {
      id: 'problemas',
      title: 'Lista de problemas/condições',
      content: [
        '🟢 Hipertenso sem complicações (K87)',
        'Início: 10/10/2010 | Há mais de 10 anos',
        'Última atualização: 10/10/2020',
        '🟢 Diabético não insulino-dependente (D-19)',
        'Início: 10/10/2010 | Há mais de 10 anos',
        'Última atualização: 10/10/2020'
      ]
    },
    {
      id: 'exames',
      title: 'Resultado de exames',
      content: [
        'Hemoglobina glicada',
        'Realizado em 10/10/2022',
        '5.6%',
        'HDL',
        'Realizado em 10/10/2022',
        '50 mg/dL'
      ]
    },
    {
      id: 'alergias',
      title: 'Alergias/Reações adversas',
      content: [
        '🟡 Dipirona',
        '🔴 Leite',
        '🔴 Mofo'
      ]
    },
    {
      id: 'lembretes',
      title: 'Lembretes',
      content: [
        'Sem lembretes'
      ]
    },
    {
      id: 'medicamentos',
      title: 'Medicamentos',
      content: [
        'Prednisolona 3mg/mL',
        '7 ampolas, dose única',
        'Gatifloxacino 10 mg/mL',
        '7 ampolas, dose única'
      ]
    },
    {
      id: 'antecedentes',
      title: 'Antecedentes',
      content: [
        'Remoção do apêndice'
      ]
    },
    {
      id: 'escuta',
      title: 'Escuta inicial',
      content: [
        'Não foi realizada Escuta inicial.'
      ]
    },
    {
      id: 'prenatal',
      title: 'Pré-natal',
      content: [
        'IG Cronológica: 25 semanas e 1 dia'
      ]
    }
  ];

  // Timeline de eventos
  const timelineEvents = [
    {
      date: '2 dias atrás',
      title: 'Consulta especialidade Oftalmologia',
      type: 'consulta'
    },
    {
      date: '2 dias atrás',
      title: 'Vacina campanha COVID-19',
      type: 'vacina'
    },
    {
      date: '6h atrás',
      title: 'Procedimento',
      badges: ['Procedimento', 'Consulta'],
      type: 'procedimento'
    },
    {
      date: '4 dias atrás',
      title: 'Escuta inicial',
      badges: ['Escuta', 'Consulta'],
      type: 'escuta'
    }
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Layout com Grid - Timeline à direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conteúdo principal (9 colunas) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Cards em três colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {informationCards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900">{card.title}</h3>
                  <button
                    onClick={() => handleCardEdit(card.id)}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  {card.content.map((item, index) => (
                    <p key={index} className="text-sm text-gray-600 mb-1">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Abas de conteúdo (largura total) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Navegação das abas internas */}
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button 
                  onClick={() => handleTabChange('atendimento')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'atendimento' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Informações do atendimento
                </button>
                <button 
                  onClick={() => handleTabChange('medicoes')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'medicoes' 
                      ? 'text-blue-600 border-b-2 border-blue-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Medições
                </button>
              </nav>
            </div>

            {/* Conteúdo da aba */}
            <div className="p-6">
              {/* Aba Informações do atendimento */}
              {activeTab === 'atendimento' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Informações do atendimento</h4>
                  <p className="text-gray-600 mb-4">Informações iniciais e de consultas do município.</p>
                  <p className="text-gray-600 mb-6">Últimas consultas.</p>

                  {/* Tabela de consultas */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 text-gray-600">Data</th>
                          <th className="text-left py-2 text-gray-600">CIAP 2</th>
                          <th className="text-left py-2 text-gray-600">CID 10</th>
                          <th className="text-left py-2 text-gray-600">Intervenções</th>
                          <th className="text-left py-2 text-gray-600">Idade</th>
                          <th className="text-left py-2 text-gray-600">Tipo</th>
                          <th className="text-left py-2 text-gray-600">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2">18/09/2024 às 12:00</td>
                          <td className="py-2">Dores musculares - L18</td>
                          <td className="py-2">Dores musculares - L18</td>
                          <td className="py-2">-</td>
                          <td className="py-2">21 anos 4 meses</td>
                          <td className="py-2">
                            <span className="inline-block px-2 py-1 text-xs bg-cyan-100 text-cyan-800 rounded">
                              Escuta
                            </span>
                          </td>
                          <td className="py-2">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Visualizar
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Aba Medições */}
              {activeTab === 'medicoes' && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Medições</h4>
                  
                  {/* Antropometria */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">📏 Antropometria</h5>
                      <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                        <option value="30a40">30 a 40 anos</option>
                        <option value="20a30">20 a 30 anos</option>
                        <option value="todos">Todos os registros</option>
                      </select>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-600">Data da medição</th>
                            <th className="px-4 py-2 text-left text-gray-600">Peso (kg)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Altura (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-600">IMC (kg/m²)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Perímetro cefálico (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Circ. abdominal (cm)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Per. panturrilha (cm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">18/09/2025 às 12:00</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>80</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>150</td>
                            <td className="px-4 py-2">35,56</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>26 anos 2 meses</td>
                            <td className="px-4 py-2">-</td>
                            <td className="px-4 py-2">-</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">15/08/2025 às 10:30</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>78</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>150</td>
                            <td className="px-4 py-2">34,67</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>-</td>
                            <td className="px-4 py-2">85</td>
                            <td className="px-4 py-2">32</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Sinais Vitais */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">❤️ Sinais vitais</h5>
                      <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                        <option value="jul2024">Jul 2024</option>
                        <option value="jun2024">Jun 2024</option>
                        <option value="todos">Todos os registros</option>
                      </select>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-600">Data da medição</th>
                            <th className="px-4 py-2 text-left text-gray-600">Pressão arterial (mmHg)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Freq. respiratória (mpm)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Freq. cardíaca (bpm)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Saturação O₂ (%)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Temperatura (°C)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">18/09/2025 às 12:00</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>120/80</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>16</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>72</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>98</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>36.5</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">15/08/2025 às 10:30</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>118/78</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>15</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>70</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>97</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>36.2</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Glicemia */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium text-gray-900">🩸 Glicemia</h5>
                      <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                        <option value="jul2024">Jul 2024</option>
                        <option value="jun2024">Jun 2024</option>
                        <option value="todos">Todos os registros</option>
                      </select>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-gray-600">Data da medição</th>
                            <th className="px-4 py-2 text-left text-gray-600">Glicemia (mg/dL)</th>
                            <th className="px-4 py-2 text-left text-gray-600">Momento da coleta</th>
                            <th className="px-4 py-2 text-left text-gray-600">Observações</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">18/09/2025 às 12:00</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>95</td>
                            <td className="px-4 py-2">
                              <select className="text-sm border-0 bg-transparent">
                                <option>Jejum</option>
                                <option>Pré-prandial</option>
                                <option>Pós-prandial</option>
                                <option>Não especificado</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>Normal</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="px-4 py-2">15/08/2025 às 10:30</td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>92</td>
                            <td className="px-4 py-2">
                              <select className="text-sm border-0 bg-transparent">
                                <option>Jejum</option>
                                <option>Pré-prandial</option>
                                <option>Pós-prandial</option>
                                <option>Não especificado</option>
                              </select>
                            </td>
                            <td className="px-4 py-2 bg-yellow-50 cursor-pointer" contentEditable>Normal</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Lateral Fixa (3 colunas) */}
        {showTimeline && (
          <div className="lg:col-span-3">
            <div className="sticky top-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                </div>
                Timeline
                <button
                  onClick={() => setShowTimeline(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </h3>
              
              {/* Eventos da Timeline */}
              <div className="space-y-4">
                {timelineEvents.map((event, index) => (
                  <div key={index} className="border-l-3 border-blue-200 pl-4 pb-4 last:pb-0 relative">
                    <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    <span className="text-xs text-gray-500 font-medium">{event.date}</span>
                    <p className="font-medium text-sm text-gray-900 mt-1">{event.title}</p>
                    {event.badges && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                              badge === 'Procedimento' ? 'bg-yellow-100 text-yellow-800' :
                              badge === 'Consulta' ? 'bg-blue-100 text-blue-800' :
                              badge === 'Escuta' ? 'bg-cyan-100 text-cyan-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Info simples */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Histórico de eventos do paciente</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botão para mostrar Timeline (quando escondida) */}
      {!showTimeline && (
        <button
          onClick={() => setShowTimeline(true)}
          className="fixed right-4 top-32 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          title="Mostrar Timeline"
        >
          <ClockIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default CoverSheetNew;
