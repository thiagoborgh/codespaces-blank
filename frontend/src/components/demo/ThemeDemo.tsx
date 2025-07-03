import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeDemo: React.FC = () => {
  const { theme } = useTheme();

  const sampleData = [
    { label: 'Paciente', value: 'Maria Silva', status: 'active' },
    { label: 'Última consulta', value: '15/06/2024', status: 'completed' },
    { label: 'Próxima consulta', value: '02/07/2024', status: 'scheduled' },
    { label: 'Status', value: 'Em tratamento', status: 'in-progress' },
  ];

  return (
    <div className={theme === 'hybrid' ? 'healthcare-card' : 'bg-white rounded-lg shadow-sm border border-gray-200'}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Demo de Componentes - Tema {theme === 'hybrid' ? 'Híbrido' : 'Padrão'}
        </h2>
        <p className="text-sm text-gray-500">
          Exemplo de como os componentes aparecem no tema atual
        </p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Botões de exemplo */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Botões</h3>
          <div className="flex flex-wrap gap-3">
            <button className={theme === 'hybrid' ? 'healthcare-btn' : 'px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'}>
              Botão Padrão
            </button>
            <button className={theme === 'hybrid' ? 'healthcare-btn-primary' : 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'}>
              Botão Primário
            </button>
            <button className={theme === 'hybrid' ? 'healthcare-btn' : 'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'}>
              Ação
            </button>
          </div>
        </div>

        {/* Badges de exemplo */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Status Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className={theme === 'hybrid' ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'}>
              Concluído
            </span>
            <span className={theme === 'hybrid' ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'}>
              Pendente
            </span>
            <span className={theme === 'hybrid' ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'}>
              Agendado
            </span>
            <span className={theme === 'hybrid' ? 'px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800' : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'}>
              Cancelado
            </span>
          </div>
        </div>

        {/* Lista de exemplo */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Lista de Dados</h3>
          <div className="space-y-3">
            {sampleData.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-600">{item.label}:</span>
                <span className="text-sm text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Input de exemplo */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Campos de Input</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nome do paciente"
              className={theme === 'hybrid' ? 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' : 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
            />
            <textarea
              placeholder="Observações"
              rows={3}
              className={theme === 'hybrid' ? 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500' : 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
