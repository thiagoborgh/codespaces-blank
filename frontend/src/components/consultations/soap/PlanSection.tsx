import React from 'react';
import RichTextEditor from '../../ui/RichTextEditor';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import type { PlanData, TextFormatting } from '../../../types/soap';

interface PlanSectionProps {
  data: PlanData;
  onChange: (data: PlanData) => void;
}

const PlanSection: React.FC<PlanSectionProps> = ({ data, onChange }) => {
  const handleTextChange = (content: string, formatting: TextFormatting) => {
    onChange({
      ...data,
      freeText: { content, formatting }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Plano</h3>
        <p className="text-sm text-gray-600">
          Registre aqui o plano terapêutico, condutas, prescrições, 
          orientações ao paciente e seguimento proposto.
        </p>
      </div>

      {/* Free Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Plano Terapêutico e Condutas
        </label>
        
        <RichTextEditor
          value={data.freeText.content}
          formatting={data.freeText.formatting}
          onChange={handleTextChange}
          maxLength={4000}
          placeholder="Digite aqui o plano terapêutico completo, incluindo medicações prescritas, procedimentos indicados, exames solicitados, orientações gerais, cuidados específicos, retornos agendados e seguimento proposto..."
          className="w-full"
        />
        
        <div className="mt-2 text-xs text-gray-500">
          <p>
            <strong>Dicas:</strong> Inclua tratamento farmacológico, tratamento não-farmacológico, 
            procedimentos indicados, exames complementares, orientações de autocuidado, 
            modificações de estilo de vida, seguimento e reavaliação.
          </p>
        </div>
      </div>

      {/* Structured sections for guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prescrições */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <ClipboardDocumentListIcon className="h-5 w-5 text-green-600 mr-2" />
            <h4 className="font-medium text-green-900">💊 Prescrições</h4>
            <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
              Módulo dedicado em desenvolvimento
            </span>
          </div>
          <div className="text-sm text-green-800 space-y-1">
            <div>• Medicamentos prescritos</div>
            <div>• Dosagem e posologia</div>
            <div>• Duração do tratamento</div>
            <div>• Orientações especiais</div>
          </div>
        </div>

        {/* Exames e Procedimentos */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-3">🔬 Exames e Procedimentos</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <div>• Exames laboratoriais</div>
            <div>• Exames de imagem</div>
            <div>• Procedimentos indicados</div>
            <div>• Encaminhamentos</div>
          </div>
        </div>

        {/* Orientações Gerais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">📋 Orientações Gerais</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Cuidados domiciliares</div>
            <div>• Modificações de estilo de vida</div>
            <div>• Sinais de alerta</div>
            <div>• Educação em saúde</div>
          </div>
        </div>

        {/* Seguimento */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-3">📅 Seguimento</h4>
          <div className="text-sm text-amber-800 space-y-1">
            <div>• Data do retorno</div>
            <div>• Motivo da reavaliação</div>
            <div>• Parâmetros a serem observados</div>
            <div>• Contato em caso de intercorrências</div>
          </div>
        </div>
      </div>

      {/* Example structure for guidance */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">💡 Estrutura sugerida do Plano</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div>
            <strong>1. Tratamento Farmacológico:</strong> Medicações prescritas com posologia detalhada
          </div>
          <div>
            <strong>2. Tratamento Não-Farmacológico:</strong> Fisioterapia, dieta, exercícios
          </div>
          <div>
            <strong>3. Exames Complementares:</strong> Laboratoriais, imagem, funcionais
          </div>
          <div>
            <strong>4. Procedimentos:</strong> Cirúrgicos, diagnósticos, terapêuticos
          </div>
          <div>
            <strong>5. Orientações ao Paciente:</strong> Autocuidado, sinais de alerta, quando retornar
          </div>
          <div>
            <strong>6. Encaminhamentos:</strong> Especialistas, outros serviços de saúde
          </div>
          <div>
            <strong>7. Seguimento:</strong> Retornos programados, reavaliações, monitoramento
          </div>
          <div>
            <strong>8. Prognóstico:</strong> Expectativas de evolução e recuperação
          </div>
        </div>
      </div>

      {/* Action buttons for future modules */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled
          className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
        >
          📝 Prescrever Medicamentos
          <span className="block text-xs mt-1">Em desenvolvimento</span>
        </button>
        
        <button
          type="button"
          disabled
          className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
        >
          🔬 Solicitar Exames
          <span className="block text-xs mt-1">Em desenvolvimento</span>
        </button>
        
        <button
          type="button"
          disabled
          className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
        >
          🏥 Agendar Procedimentos
          <span className="block text-xs mt-1">Em desenvolvimento</span>
        </button>
        
        <button
          type="button"
          disabled
          className="bg-gray-100 text-gray-400 px-4 py-2 rounded-lg border border-gray-200 cursor-not-allowed"
        >
          👨‍⚕️ Encaminhar Especialista
          <span className="block text-xs mt-1">Em desenvolvimento</span>
        </button>
      </div>
    </div>
  );
};

export default PlanSection;
