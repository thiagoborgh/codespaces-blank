import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import type { ExamResult } from '../../../types/soap';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Omit<ExamResult, 'id'>) => void;
  existingExam?: ExamResult;
}

// Mock de exames SIGTAP
const mockExames = [
  { codigo: '0202010015', nome: 'Hemograma completo' },
  { codigo: '0202010023', nome: 'Glicose' },
  { codigo: '0202010031', nome: 'Ureia' },
  { codigo: '0202010040', nome: 'Creatinina' },
  { codigo: '0202020348', nome: 'Colesterol total' },
  { codigo: '0202020356', nome: 'Triglicérides' },
  { codigo: '0202030113', nome: 'TSH' },
  { codigo: '0202030121', nome: 'T4 livre' },
  { codigo: '0211060010', nome: 'Radiografia de tórax' },
  { codigo: '0211060028', nome: 'Radiografia de abdome' },
  { codigo: '0211070019', nome: 'Ultrassonografia de abdome' },
  { codigo: '0211070027', nome: 'Ultrassonografia pélvica' },
  { codigo: '0205020018', nome: 'Eletrocardiograma' },
  { codigo: '0205020026', nome: 'Ecocardiograma' }
];

const ExamModal: React.FC<ExamModalProps> = ({ isOpen, onClose, onSave, existingExam }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<{ codigo: string; nome: string } | null>(
    existingExam ? { codigo: existingExam.codigo, nome: existingExam.procedimento } : null
  );
  const [dataRealizacao, setDataRealizacao] = useState<string>(
    existingExam?.dataRealizacao || ''
  );
  const [resultado, setResultado] = useState(existingExam?.resultado || '');
  const [observacoes, setObservacoes] = useState(existingExam?.observacoes || '');
  const [laboratorio, setLaboratorio] = useState(existingExam?.laboratorio || '');
  const [tipo, setTipo] = useState<'laboratorial' | 'imagem' | 'outros'>(existingExam?.tipo || 'laboratorial');

  const filteredExames = mockExames.filter(exam =>
    exam.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.codigo.includes(searchTerm)
  );

  const handleSave = () => {
    if (!selectedExam || !resultado.trim()) {
      alert('Selecione um exame e preencha o resultado');
      return;
    }

    const examData: Omit<ExamResult, 'id'> = {
      codigo: selectedExam.codigo,
      procedimento: selectedExam.nome,
      resultado: resultado.trim(),
      dataRealizacao: dataRealizacao || undefined,
      observacoes: observacoes.trim() || undefined,
      laboratorio: laboratorio.trim() || undefined,
      tipo
    };

    onSave(examData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSearchTerm('');
    setSelectedExam(null);
    setDataRealizacao('');
    setResultado('');
    setObservacoes('');
    setLaboratorio('');
    setTipo('laboratorial');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingExam ? 'Editar Resultado de Exame' : 'Adicionar Resultado de Exame'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Busca de Exames */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Buscar Exame (SIGTAP)
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite o código ou nome do exame..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Lista de exames filtrados */}
            {searchTerm && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredExames.map((exam) => (
                  <button
                    key={exam.codigo}
                    onClick={() => {
                      setSelectedExam(exam);
                      setSearchTerm('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-sm">{exam.nome}</div>
                    <div className="text-xs text-gray-500">{exam.codigo}</div>
                  </button>
                ))}
                {filteredExames.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Nenhum exame encontrado
                  </div>
                )}
              </div>
            )}

            {/* Exame selecionado */}
            {selectedExam && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900">{selectedExam.nome}</div>
                <div className="text-sm text-blue-700">{selectedExam.codigo}</div>
              </div>
            )}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Realização
              </label>
              <input
                type="date"
                value={dataRealizacao}
                onChange={(e) => setDataRealizacao(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tipo de Exame */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Exame
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'laboratorial' | 'imagem' | 'outros')}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="laboratorial">Laboratorial</option>
              <option value="imagem">Imagem</option>
              <option value="outros">Outros</option>
            </select>
          </div>

          {/* Resultado (obrigatório) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resultado <span className="text-red-500">*</span>
            </label>
            <textarea
              value={resultado}
              onChange={(e) => setResultado(e.target.value)}
              placeholder="Descreva o resultado do exame..."
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Laboratório (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Laboratório (opcional)
            </label>
            <input
              type="text"
              value={laboratorio}
              onChange={(e) => setLaboratorio(e.target.value)}
              placeholder="Ex: Laboratório Central"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Observações (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações (opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre o exame..."
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedExam || !resultado.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {existingExam ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
