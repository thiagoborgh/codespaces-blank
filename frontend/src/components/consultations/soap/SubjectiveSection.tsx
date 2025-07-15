import React from 'react';
import RichTextEditor from '../../ui/RichTextEditor';
import type { SubjectiveData, TextFormatting } from '../../../types/soap';

interface SubjectiveSectionProps {
  data: SubjectiveData;
  onChange: (data: SubjectiveData) => void;
}

const SubjectiveSection: React.FC<SubjectiveSectionProps> = ({ data, onChange }) => {
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Subjetivo</h3>
        <p className="text-sm text-gray-600">
          Registre aqui as informações relatadas pelo paciente, incluindo queixa principal, 
          história da doença atual, história pregressa e outros dados subjetivos relevantes.
        </p>
      </div>

      {/* Free Text Editor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Relato do Paciente e Anamnese
        </label>
        
        <RichTextEditor
          value={data.freeText.content}
          formatting={data.freeText.formatting}
          onChange={handleTextChange}
          maxLength={4000}
          placeholder="Digite aqui as informações relatadas pelo paciente, queixa principal, história da doença atual, antecedentes pessoais e familiares, e outras informações subjetivas relevantes..."
          className="w-full"
        />
        
        <div className="mt-2 text-xs text-gray-500">
          <p>
            <strong>Dicas:</strong> Inclua queixa principal, história da doença atual (HDA), 
            história patológica pregressa (HPP), história familiar, hábitos de vida, 
            medicamentos em uso, alergias conhecidas e revisão dos sistemas.
          </p>
        </div>
      </div>

      {/* Example sections for guidance */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Estrutura sugerida</h4>
        <div className="text-sm text-blue-800 space-y-2">
          <div>
            <strong>Queixa Principal (QP):</strong> Motivo da consulta relatado pelo paciente
          </div>
          <div>
            <strong>História da Doença Atual (HDA):</strong> Evolução dos sintomas atuais
          </div>
          <div>
            <strong>História Patológica Pregressa (HPP):</strong> Doenças anteriores, cirurgias, internações
          </div>
          <div>
            <strong>História Familiar (HF):</strong> Doenças na família
          </div>
          <div>
            <strong>História Social:</strong> Hábitos, profissão, moradia
          </div>
          <div>
            <strong>Medicamentos:</strong> Medicações em uso
          </div>
          <div>
            <strong>Alergias:</strong> Reações adversas conhecidas
          </div>
          <div>
            <strong>Revisão dos Sistemas:</strong> Sintomas por aparelho/sistema
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectiveSection;
