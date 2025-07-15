import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ProblemData } from '../../../types/soap';

interface ExistingProblem {
  id: string;
  descricao: string;
  codigo: string;
  tipo: 'CIAP2' | 'CID10';
  status: 'Ativo' | 'Latente';
  dataRegistro: Date;
}

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Omit<ProblemData, 'id'>) => void;
  existingProblem?: ProblemData;
  existingProblems: ExistingProblem[];
}

// Mock data for CIAP2 and CID10
const mockCIAP2 = [
  { codigo: 'A01', descricao: 'Dor generalizada' },
  { codigo: 'A02', descricao: 'Calafrios' },
  { codigo: 'A03', descricao: 'Febre' },
  { codigo: 'A04', descricao: 'Debilidade/cansaço geral' },
  { codigo: 'A05', descricao: 'Sensação de estar doente' },
  { codigo: 'K86', descricao: 'Hipertensão arterial sem complicação' },
  { codigo: 'K87', descricao: 'Hipertensão arterial com complicação' },
  { codigo: 'T90', descricao: 'Diabetes mellitus não insulinodependente' },
  { codigo: 'T89', descricao: 'Diabetes mellitus insulinodependente' }
];

const mockCID10 = [
  { codigo: 'E10', descricao: 'Diabetes mellitus tipo 1' },
  { codigo: 'E11', descricao: 'Diabetes mellitus tipo 2' },
  { codigo: 'I10', descricao: 'Hipertensão essencial (primária)' },
  { codigo: 'I15', descricao: 'Hipertensão secundária' },
  { codigo: 'J06', descricao: 'Infecção aguda das vias aéreas superiores' },
  { codigo: 'R50', descricao: 'Febre não especificada' },
  { codigo: 'M25.5', descricao: 'Dor articular' },
  { codigo: 'R53', descricao: 'Mal-estar e fadiga' }
];

const ProblemModal: React.FC<ProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingProblem, 
  existingProblems 
}) => {
  const [searchExisting, setSearchExisting] = useState('');
  const [showExistingResults, setShowExistingResults] = useState(false);
  const [selectedExisting, setSelectedExisting] = useState<ExistingProblem | null>(null);
  
  const [ciap2Search, setCiap2Search] = useState('');
  const [cid10Search, setCid10Search] = useState('');
  const [selectedCiap2, setSelectedCiap2] = useState<{codigo: string; descricao: string} | null>(null);
  const [selectedCid10, setSelectedCid10] = useState<{codigo: string; descricao: string} | null>(null);
  
  const [situacao, setSituacao] = useState<'Ativo' | 'Latente' | 'Resolvido'>('Ativo');
  const [inicioTipo, setInicioTipo] = useState<'data' | 'idade' | null>(null);
  const [inicioData, setInicioData] = useState('');
  const [inicioAnos, setInicioAnos] = useState('');
  const [inicioMeses, setInicioMeses] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [incluirNaLista, setIncluirNaLista] = useState(false);

  // Initialize form if editing
  useEffect(() => {
    if (existingProblem) {
      if (existingProblem.tipo === 'CIAP2') {
        setSelectedCiap2({ codigo: existingProblem.codigo, descricao: existingProblem.descricao });
      } else {
        setSelectedCid10({ codigo: existingProblem.codigo, descricao: existingProblem.descricao });
      }
      setSituacao(existingProblem.situacao);
      setObservacoes(existingProblem.observacoes || '');
      setIncluirNaLista(existingProblem.incluirNaLista);
      
      if (existingProblem.inicio) {
        setInicioTipo(existingProblem.inicio.tipo);
        if (existingProblem.inicio.tipo === 'data' && existingProblem.inicio.data) {
          setInicioData(existingProblem.inicio.data.toISOString().split('T')[0]);
        } else if (existingProblem.inicio.tipo === 'idade' && existingProblem.inicio.idade) {
          setInicioAnos(existingProblem.inicio.idade.anos.toString());
          setInicioMeses(existingProblem.inicio.idade.meses.toString());
        }
      }
    }
  }, [existingProblem]);

  const filteredExistingProblems = existingProblems.filter(problem =>
    problem.descricao.toLowerCase().includes(searchExisting.toLowerCase()) ||
    problem.codigo.toLowerCase().includes(searchExisting.toLowerCase())
  );

  const filteredCiap2 = mockCIAP2.filter(item =>
    item.codigo.toLowerCase().includes(ciap2Search.toLowerCase()) ||
    item.descricao.toLowerCase().includes(ciap2Search.toLowerCase())
  );

  const filteredCid10 = mockCID10.filter(item =>
    item.codigo.toLowerCase().includes(cid10Search.toLowerCase()) ||
    item.descricao.toLowerCase().includes(cid10Search.toLowerCase())
  );

  const handleSave = () => {
    // Validation: at least one classification must be selected
    if (!selectedCiap2 && !selectedCid10 && !selectedExisting) {
      alert('Pelo menos um campo (CIAP2 ou CID10) deve ser preenchido');
      return;
    }

    let problemData: Omit<ProblemData, 'id'>;

    if (selectedExisting) {
      // Use existing problem data
      problemData = {
        codigo: selectedExisting.codigo,
        descricao: selectedExisting.descricao,
        tipo: selectedExisting.tipo,
        situacao,
        observacoes: observacoes.trim() || undefined,
        incluirNaLista,
        inicio: inicioTipo ? {
          tipo: inicioTipo,
          data: inicioTipo === 'data' && inicioData ? new Date(inicioData) : undefined,
          idade: inicioTipo === 'idade' && inicioAnos ? {
            anos: parseInt(inicioAnos) || 0,
            meses: parseInt(inicioMeses) || 0
          } : undefined
        } : undefined
      };
    } else {
      // Use CIAP2 or CID10 selection
      const selected = selectedCiap2 || selectedCid10;
      const tipo = selectedCiap2 ? 'CIAP2' : 'CID10';
      
      if (!selected) return;

      problemData = {
        codigo: selected.codigo,
        descricao: selected.descricao,
        tipo: tipo as 'CIAP2' | 'CID10',
        situacao,
        observacoes: observacoes.trim() || undefined,
        incluirNaLista,
        inicio: inicioTipo ? {
          tipo: inicioTipo,
          data: inicioTipo === 'data' && inicioData ? new Date(inicioData) : undefined,
          idade: inicioTipo === 'idade' && inicioAnos ? {
            anos: parseInt(inicioAnos) || 0,
            meses: parseInt(inicioMeses) || 0
          } : undefined
        } : undefined
      };
    }

    onSave(problemData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSearchExisting('');
    setShowExistingResults(false);
    setSelectedExisting(null);
    setCiap2Search('');
    setCid10Search('');
    setSelectedCiap2(null);
    setSelectedCid10(null);
    setSituacao('Ativo');
    setInicioTipo(null);
    setInicioData('');
    setInicioAnos('');
    setInicioMeses('');
    setObservacoes('');
    setIncluirNaLista(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {existingProblem ? 'Editar Problema' : 'Registro de Problemas e Condições'}
            </h2>
            <p className="text-sm text-blue-600 mt-1">
              Pelo menos um dos campos é de preenchimento obrigatório
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Existing Problems */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Buscar por problemas existentes
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchExisting}
                onChange={(e) => {
                  setSearchExisting(e.target.value);
                  setShowExistingResults(e.target.value.length > 0);
                }}
                placeholder="Pesquisar por problemas e/ou condições ativos ou latentes do cidadão"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {showExistingResults && (
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredExistingProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      setSelectedExisting(problem);
                      setSearchExisting('');
                      setShowExistingResults(false);
                      // Clear manual selections
                      setSelectedCiap2(null);
                      setSelectedCid10(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm">
                      {problem.descricao} - {problem.codigo} - {problem.status}
                    </div>
                  </button>
                ))}
                {filteredExistingProblems.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
            )}

            {selectedExisting && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-900">
                  {selectedExisting.descricao} - {selectedExisting.codigo} - {selectedExisting.status}
                </div>
                <button
                  onClick={() => setSelectedExisting(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                >
                  ✕ Remover seleção
                </button>
              </div>
            )}
          </div>

          {/* Manual Classification Fields */}
          {!selectedExisting && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CIAP2 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  CIAP-2
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={ciap2Search}
                    onChange={(e) => setCiap2Search(e.target.value)}
                    placeholder="Buscar por código ou descrição CIAP-2"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {ciap2Search && (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredCiap2.map((item) => (
                      <button
                        key={item.codigo}
                        onClick={() => {
                          setSelectedCiap2(item);
                          setCiap2Search('');
                          setSelectedCid10(null); // Clear CID10 selection
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-sm">{item.codigo}</div>
                        <div className="text-xs text-gray-600">{item.descricao}</div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedCiap2 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900">
                      {selectedCiap2.codigo} - {selectedCiap2.descricao}
                    </div>
                  </div>
                )}
              </div>

              {/* CID10 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  CID-10
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={cid10Search}
                    onChange={(e) => setCid10Search(e.target.value)}
                    placeholder="Buscar por código ou descrição CID-10"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {cid10Search && (
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredCid10.map((item) => (
                      <button
                        key={item.codigo}
                        onClick={() => {
                          setSelectedCid10(item);
                          setCid10Search('');
                          setSelectedCiap2(null); // Clear CIAP2 selection
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-sm">{item.codigo}</div>
                        <div className="text-xs text-gray-600">{item.descricao}</div>
                      </button>
                    ))}
                  </div>
                )}

                {selectedCid10 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900">
                      {selectedCid10.codigo} - {selectedCid10.descricao}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Situação (Required) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Situação <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {(['Ativo', 'Latente', 'Resolvido'] as const).map(opcao => (
                <label key={opcao} className="flex items-center">
                  <input
                    type="radio"
                    name="situacao"
                    value={opcao}
                    checked={situacao === opcao}
                    onChange={() => setSituacao(opcao)}
                    className="mr-2"
                  />
                  <span className="text-sm">{opcao}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Início (Optional) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Início (opcional)
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="inicioTipo"
                  checked={inicioTipo === 'data'}
                  onChange={() => setInicioTipo('data')}
                  className="mr-2"
                />
                <span className="text-sm">Data</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="inicioTipo"
                  checked={inicioTipo === 'idade'}
                  onChange={() => setInicioTipo('idade')}
                  className="mr-2"
                />
                <span className="text-sm">Idade</span>
              </label>
              <button
                onClick={() => {
                  setInicioTipo(null);
                  setInicioData('');
                  setInicioAnos('');
                  setInicioMeses('');
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                ✕ Limpar
              </button>
            </div>

            {inicioTipo === 'data' && (
              <input
                type="date"
                value={inicioData}
                onChange={(e) => setInicioData(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}

            {inicioTipo === 'idade' && (
              <div className="flex gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Anos</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={inicioAnos}
                    onChange={(e) => setInicioAnos(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Meses</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={inicioMeses}
                    onChange={(e) => setInicioMeses(e.target.value)}
                    className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="00"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Observações (opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              maxLength={200}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observações complementares..."
            />
            <div className="text-xs text-gray-500 text-right">
              {observacoes.length}/200 caracteres
            </div>
          </div>

          {/* Incluir na Lista */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={incluirNaLista}
                onChange={(e) => setIncluirNaLista(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Incluir na lista de problemas ativos
              </span>
            </label>
            <p className="text-xs text-gray-500">
              {incluirNaLista 
                ? 'Este problema será registrado na lista de problemas ativos do paciente' 
                : 'Este problema não será incluído na lista de problemas ativos'
              }
            </p>
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
            disabled={!selectedCiap2 && !selectedCid10 && !selectedExisting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {existingProblem ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemModal;
