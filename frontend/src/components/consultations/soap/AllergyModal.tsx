import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { AllergyData } from '../../../types/soap';

interface ExistingAllergy {
  id: string;
  substancia: string;
  tipo: string;
  criticidade: string;
  dataRegistro: Date;
}

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allergy: Omit<AllergyData, 'id'>) => void;
  existingAllergy?: AllergyData;
  existingAllergies: ExistingAllergy[];
}

// Mock data for allergens by category
const mockAllergens = {
  Alimento: [
    { nome: 'Clara do ovo', codigo: 'CBARA001' },
    { nome: 'Leite de vaca', codigo: 'CBARA002' },
    { nome: 'Amendoim', codigo: 'CBARA003' },
    { nome: 'Castanha de caju', codigo: 'CBARA004' },
    { nome: 'Camarão', codigo: 'CBARA005' },
    { nome: 'Peixe', codigo: 'CBARA006' },
    { nome: 'Soja', codigo: 'CBARA007' },
    { nome: 'Trigo', codigo: 'CBARA008' }
  ],
  Ambiente: [
    { nome: 'Poeira doméstica', codigo: 'CBARA101' },
    { nome: 'Ácaro', codigo: 'CBARA102' },
    { nome: 'Pólen', codigo: 'CBARA103' },
    { nome: 'Pelo de gato', codigo: 'CBARA104' },
    { nome: 'Pelo de cão', codigo: 'CBARA105' },
    { nome: 'Mofo', codigo: 'CBARA106' }
  ],
  Medicamento: [
    { nome: 'Dipirona Sódica', codigo: 'AMPP001' },
    { nome: 'Ácido Acetilsalicílico', codigo: 'AMPP002' },
    { nome: 'Penicilina', codigo: 'AMPP003' },
    { nome: 'Ibuprofeno', codigo: 'AMPP004' },
    { nome: 'Paracetamol', codigo: 'AMPP005' }
  ],
  Biológico: [
    { nome: 'Vacina tríplice viral', codigo: 'IMU001' },
    { nome: 'Vacina contra hepatite B', codigo: 'IMU002' },
    { nome: 'Vacina DTP', codigo: 'IMU003' },
    { nome: 'Vacina contra influenza', codigo: 'IMU004' }
  ]
};

const manifestacoes = [
  { nome: 'Anafilaxia', sinonimos: ['Reação anafilática'] },
  { nome: 'Angioedema', sinonimos: ['Edema Angioneurótico', 'Doença de Quincke'] },
  { nome: 'Artrite', sinonimos: ['Inflamação nas articulações'] },
  { nome: 'Asma', sinonimos: ['Asma brônquica', 'Bronquite asmática'] },
  { nome: 'Broncoespasmo', sinonimos: ['Broncoconstrição'] },
  { nome: 'Conjuntivite', sinonimos: ['Inflamação da conjuntiva'] },
  { nome: 'Dermatite atópica', sinonimos: ['Dermatite alérgica'] },
  { nome: 'Dermatite de contato', sinonimos: ['Eczema de contato'] },
  { nome: 'Diarreia', sinonimos: ['Fezes diarreicas'] },
  { nome: 'Dispneia', sinonimos: ['Dificuldade respiratória'] },
  { nome: 'Edema de glote', sinonimos: ['Edema da laringe'] },
  { nome: 'Eritema multiforme', sinonimos: [] },
  { nome: 'Exantema bolhoso', sinonimos: ['Eruptões bolhosas'] },
  { nome: 'Exantema maculopapular', sinonimos: ['Erupção maculopapular'] },
  { nome: 'Fotossensibilidade', sinonimos: ['Fotossensibilidade cutânea', 'Reação de fotossensibilidade'] },
  { nome: 'Mucosite', sinonimos: ['Inflamação das mucosas'] },
  { nome: 'Nefrite', sinonimos: ['Inflamação no rim'] },
  { nome: 'Parada cardiorrespiratória', sinonimos: ['Parada cardíaca'] },
  { nome: 'Prurido', sinonimos: ['Coceira'] },
  { nome: 'Rinite', sinonimos: ['Inflamação da mucosa nasal'] },
  { nome: 'Síndrome de DRESS', sinonimos: [] },
  { nome: 'Síndrome de Lyell', sinonimos: ['Necrólise epidérmica tóxica'] },
  { nome: 'Síndrome de Stevens-Johnson', sinonimos: ['Eritema multiforme bolhoso'] },
  { nome: 'Tosse', sinonimos: [] },
  { nome: 'Urticária', sinonimos: ['Rash urticariforme'] },
  { nome: 'Vasculite', sinonimos: ['Angeíte'] },
  { nome: 'Vômito', sinonimos: ['Êmese'] }
];

const AllergyModal: React.FC<AllergyModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingAllergy, 
  existingAllergies 
}) => {
  const [searchExisting, setSearchExisting] = useState('');
  const [showExistingResults, setShowExistingResults] = useState(false);
  const [selectedExisting, setSelectedExisting] = useState<ExistingAllergy | null>(null);
  
  const [categoriaAgente, setCategoriaAgente] = useState<'Alimento' | 'Ambiente' | 'Biológico' | 'Medicamento' | ''>('');
  const [agenteSearch, setAgenteSearch] = useState('');
  const [selectedAgente, setSelectedAgente] = useState<{codigo?: string; nome: string} | null>(null);
  
  const [tipoReacao, setTipoReacao] = useState<'Alergia' | 'Intolerância' | ''>('');
  const [criticidade, setCriticidade] = useState<'Alta' | 'Baixa' | ''>('');
  const [grauCerteza, setGrauCerteza] = useState<'Confirmado' | 'Refutado' | 'Resolvido' | 'Suspeito' | ''>('');
  
  const [manifestacoesSelecionadas, setManifestacoesSelecionadas] = useState<string[]>([]);
  const [manifestacoesSearch, setManifestacoesSearch] = useState('');
  const [showManifestacoes, setShowManifestacoes] = useState(false);
  
  const [inicioTipo, setInicioTipo] = useState<'data' | 'idade' | null>(null);
  const [inicioData, setInicioData] = useState('');
  const [inicioAnos, setInicioAnos] = useState('');
  const [inicioMeses, setInicioMeses] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Initialize form if editing
  useEffect(() => {
    if (existingAllergy) {
      setCategoriaAgente(existingAllergy.categoriaAgente);
      setSelectedAgente(existingAllergy.agenteEspecifico);
      setTipoReacao(existingAllergy.tipoReacao || '');
      setCriticidade(existingAllergy.criticidade || '');
      setGrauCerteza(existingAllergy.grauCerteza || '');
      setManifestacoesSelecionadas(existingAllergy.manifestacoes || []);
      setObservacoes(existingAllergy.observacoes || '');
      
      if (existingAllergy.inicio) {
        setInicioTipo(existingAllergy.inicio.tipo);
        if (existingAllergy.inicio.tipo === 'data' && existingAllergy.inicio.data) {
          setInicioData(existingAllergy.inicio.data.toISOString().split('T')[0]);
        } else if (existingAllergy.inicio.tipo === 'idade' && existingAllergy.inicio.idade) {
          setInicioAnos(existingAllergy.inicio.idade.anos.toString());
          setInicioMeses(existingAllergy.inicio.idade.meses.toString());
        }
      }
    }
  }, [existingAllergy]);

  const filteredExistingAllergies = existingAllergies.filter(allergy =>
    allergy.substancia.toLowerCase().includes(searchExisting.toLowerCase()) ||
    allergy.tipo.toLowerCase().includes(searchExisting.toLowerCase())
  );

  const filteredAgentes = categoriaAgente ? mockAllergens[categoriaAgente].filter(item =>
    item.nome.toLowerCase().includes(agenteSearch.toLowerCase()) ||
    (item.codigo && item.codigo.toLowerCase().includes(agenteSearch.toLowerCase()))
  ) : [];

  const filteredManifestacoes = manifestacoes.filter(item =>
    item.nome.toLowerCase().includes(manifestacoesSearch.toLowerCase()) ||
    item.sinonimos.some(sin => sin.toLowerCase().includes(manifestacoesSearch.toLowerCase()))
  );

  const handleManifestacaoToggle = (manifestacao: string) => {
    setManifestacoesSelecionadas(prev => 
      prev.includes(manifestacao)
        ? prev.filter(m => m !== manifestacao)
        : [...prev, manifestacao]
    );
  };

  const handleSave = () => {
    // Validation: categoria and agente are required
    if (!categoriaAgente || !selectedAgente) {
      alert('Categoria do agente causador e agente específico são obrigatórios');
      return;
    }

    const allergyData: Omit<AllergyData, 'id'> = {
      categoriaAgente,
      agenteEspecifico: selectedAgente,
      tipoReacao: tipoReacao || undefined,
      criticidade: criticidade || undefined,
      grauCerteza: grauCerteza || undefined,
      manifestacoes: manifestacoesSelecionadas,
      observacoes: observacoes.trim() || undefined,
      inicio: inicioTipo ? {
        tipo: inicioTipo,
        data: inicioTipo === 'data' && inicioData ? new Date(inicioData) : undefined,
        idade: inicioTipo === 'idade' && inicioAnos ? {
          anos: parseInt(inicioAnos) || 0,
          meses: parseInt(inicioMeses) || 0
        } : undefined
      } : undefined
    };

    onSave(allergyData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setSearchExisting('');
    setShowExistingResults(false);
    setSelectedExisting(null);
    setCategoriaAgente('');
    setAgenteSearch('');
    setSelectedAgente(null);
    setTipoReacao('');
    setCriticidade('');
    setGrauCerteza('');
    setManifestacoesSelecionadas([]);
    setManifestacoesSearch('');
    setShowManifestacoes(false);
    setInicioTipo(null);
    setInicioData('');
    setInicioAnos('');
    setInicioMeses('');
    setObservacoes('');
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
              {existingAllergy ? 'Editar Alergia' : 'Registro de Alergias e Reações Adversas'}
            </h2>
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
          {/* Search Existing Allergies */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Buscar por alergias existentes
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
                placeholder="Pesquisar por alergias e reações adversas do cidadão"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {showExistingResults && (
              <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredExistingAllergies.map((allergy) => (
                  <button
                    key={allergy.id}
                    onClick={() => {
                      setSelectedExisting(allergy);
                      setSearchExisting('');
                      setShowExistingResults(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-sm">
                      {allergy.substancia} – {allergy.tipo} – {allergy.criticidade}
                    </div>
                  </button>
                ))}
                {filteredExistingAllergies.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Nenhum resultado encontrado
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Categoria do Agente Causador (Required) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Categoria do Agente Causador <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['Alimento', 'Ambiente', 'Biológico', 'Medicamento'] as const).map(categoria => (
                <label key={categoria} className="flex items-center">
                  <input
                    type="radio"
                    name="categoria"
                    value={categoria}
                    checked={categoriaAgente === categoria}
                    onChange={() => {
                      setCategoriaAgente(categoria);
                      setSelectedAgente(null);
                      setAgenteSearch('');
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Agente Específico (Required) */}
          {categoriaAgente && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Agente ou Substância Específica <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={agenteSearch}
                  onChange={(e) => setAgenteSearch(e.target.value)}
                  placeholder={`Buscar ${categoriaAgente.toLowerCase()}...`}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {agenteSearch && (
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredAgentes.map((item) => (
                    <button
                      key={item.codigo}
                      onClick={() => {
                        setSelectedAgente(item);
                        setAgenteSearch('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{item.nome}</div>
                      {item.codigo && <div className="text-xs text-gray-600">{item.codigo}</div>}
                    </button>
                  ))}
                </div>
              )}

              {selectedAgente && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-900">
                    {selectedAgente.nome}
                    {selectedAgente.codigo && ` (${selectedAgente.codigo})`}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional Classification Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tipo de Reação */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Tipo de Reação</label>
              <div className="space-y-2">
                {(['Alergia', 'Intolerância'] as const).map(tipo => (
                  <label key={tipo} className="flex items-center">
                    <input
                      type="radio"
                      name="tipoReacao"
                      value={tipo}
                      checked={tipoReacao === tipo}
                      onChange={() => setTipoReacao(tipo)}
                      className="mr-2"
                    />
                    <span className="text-sm">{tipo}</span>
                  </label>
                ))}
                <button
                  onClick={() => setTipoReacao('')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ✕ Limpar
                </button>
              </div>
            </div>

            {/* Criticidade */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Criticidade</label>
              <div className="space-y-2">
                {(['Alta', 'Baixa'] as const).map(crit => (
                  <label key={crit} className="flex items-center">
                    <input
                      type="radio"
                      name="criticidade"
                      value={crit}
                      checked={criticidade === crit}
                      onChange={() => setCriticidade(crit)}
                      className="mr-2"
                    />
                    <span className="text-sm">{crit}</span>
                  </label>
                ))}
                <button
                  onClick={() => setCriticidade('')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ✕ Limpar
                </button>
              </div>
            </div>

            {/* Grau de Certeza */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Grau de Certeza</label>
              <div className="space-y-2">
                {(['Confirmado', 'Refutado', 'Resolvido', 'Suspeito'] as const).map(grau => (
                  <label key={grau} className="flex items-center">
                    <input
                      type="radio"
                      name="grauCerteza"
                      value={grau}
                      checked={grauCerteza === grau}
                      onChange={() => setGrauCerteza(grau)}
                      className="mr-2"
                    />
                    <span className="text-sm">{grau}</span>
                  </label>
                ))}
                <button
                  onClick={() => setGrauCerteza('')}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ✕ Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Manifestações Clínicas */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Manifestações Clínicas</label>
            <div className="relative">
              <input
                type="text"
                value={manifestacoesSearch}
                onChange={(e) => setManifestacoesSearch(e.target.value)}
                onFocus={() => setShowManifestacoes(true)}
                placeholder="Digite para filtrar manifestações..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {showManifestacoes && (
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  {filteredManifestacoes.map((manifestacao) => (
                    <label key={manifestacao.nome} className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        checked={manifestacoesSelecionadas.includes(manifestacao.nome)}
                        onChange={() => handleManifestacaoToggle(manifestacao.nome)}
                        className="mr-2"
                      />
                      <span>{manifestacao.nome}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={() => setShowManifestacoes(false)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Fechar lista
                </button>
              </div>
            )}

            {manifestacoesSelecionadas.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {manifestacoesSelecionadas.map((manifestacao) => (
                  <span
                    key={manifestacao}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {manifestacao}
                    <button
                      onClick={() => handleManifestacaoToggle(manifestacao)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Início (Optional) */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Início</label>
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
                  />
                </div>
              </div>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Observações</label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              maxLength={400}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observações complementares..."
            />
            <div className="text-xs text-gray-500 text-right">
              {observacoes.length}/400 caracteres
            </div>
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
            disabled={!categoriaAgente || !selectedAgente}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {existingAllergy ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllergyModal;
