import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const VaccinationPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/queue')}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center"
          >
            <span className="mr-2">←</span>
            Voltar para a fila
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Atendimento de Vacinação
          </h1>
          <p className="text-gray-600">Paciente ID: {patientId}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Sistema de Vacinação
            </h2>
            <p className="text-gray-500 mb-6">
              Aqui será implementado o sistema específico para vacinação
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Verificação</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Carteira de vacinação</li>
                  <li>• Histórico de doses</li>
                  <li>• Contraindicações</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Seleção</h3>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Vacinas disponíveis</li>
                  <li>• Lotes e validade</li>
                  <li>• Doses necessárias</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Aplicação</h3>
                <ul className="space-y-1 text-sm text-purple-700">
                  <li>• Registro da aplicação</li>
                  <li>• Via de administração</li>
                  <li>• Local da aplicação</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-800 mb-2">Acompanhamento</h3>
                <ul className="space-y-1 text-sm text-amber-700">
                  <li>• Reações adversas</li>
                  <li>• Próximas doses</li>
                  <li>• Orientações</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Regras implementadas:</strong> Botão "Realizar Vacinação" (#09)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Controle por profissional • Tooltips inteligentes por estado
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Estados do Botão:</h4>
              <div className="text-xs text-yellow-700 space-y-1">
                <p><strong>Não iniciado:</strong> "Vacinar" → Aplicar vacina</p>
                <p><strong>Em andamento (mesmo profissional):</strong> "Continuar" → continuar vacinação</p>
                <p><strong>Em andamento (outro profissional):</strong> "Em Vacinação" → cidadão está em atendimento</p>
                <p><strong>Finalizado:</strong> "Visualizar" → atendimento de vacinação realizado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VaccinationPage;
