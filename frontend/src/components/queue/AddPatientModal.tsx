import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (patientData: any) => void;
}

interface NewPatientData {
  name: string;
  cpf: string;
  cns: string;
  birthDate: string;
  sex: string;
  race: string;
  phone: string;
  contactPhone: string;
  motherName: string;
  fatherName: string;
  nationality: string;
  birthState: string;
  cep: string;
  streetType: string;
  street: string;
  number: string;
  neighborhood: string;
  professional: string;
  team: string;
  serviceTypes: string[];
  priority: string;
  notes: string;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [currentStep, setCurrentStep] = useState<'search' | 'create' | 'queue'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');
  const [createdPatient, setCreatedPatient] = useState<NewPatientData | null>(null);
  
  const [newPatientData, setNewPatientData] = useState<NewPatientData>({
    name: '',
    cpf: '',
    cns: '',
    birthDate: '',
    sex: '',
    race: '',
    phone: '',
    contactPhone: '',
    motherName: '',
    fatherName: '',
    nationality: '',
    birthState: '',
    cep: '',
    streetType: '',
    street: '',
    number: '',
    neighborhood: '',
    professional: '',
    team: '',
    serviceTypes: [],
    priority: 'normal',
    notes: ''
  });

  const serviceTypeOptions = [
    { id: 'consultation', label: 'Consulta Médica' },
    { id: 'medication', label: 'Administração de Medicamento' },
    { id: 'listening', label: 'Escuta Inicial' },
    { id: 'dentistry', label: 'Odontologia' },
    { id: 'dressing', label: 'Curativo' },
    { id: 'exams', label: 'Exames' },
    { id: 'procedures', label: 'Procedimentos' },
    { id: 'spontaneous', label: 'Demanda Espontânea' },
    { id: 'nebulization', label: 'Nebulização' },
    { id: 'vaccine', label: 'Vacina' }
  ];

  const handleSearchPatient = () => {
    if (!searchTerm.trim()) {
      setSearchResult('Digite um termo para pesquisar');
      return;
    }
    
    // Simular busca por paciente existente
    // TODO: Integrar com API real
    setSearchResult('Nenhum resultado encontrado. Clique em "Adicionar Novo" para cadastrar.');
  };

  const handleCreateNewPatient = () => {
    // Validações básicas
    if (!newPatientData.name.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    if (!newPatientData.cpf.trim()) {
      alert('CPF é obrigatório');
      return;
    }
    if (!newPatientData.birthDate) {
      alert('Data de nascimento é obrigatória');
      return;
    }

    // Salvar dados do paciente criado e avançar para próximo step
    setCreatedPatient({ ...newPatientData });
    setCurrentStep('queue');
  };

  const handleServiceTypeChange = (serviceId: string, checked: boolean) => {
    setServiceTypes(prev => 
      checked 
        ? [...prev, serviceId]
        : prev.filter(id => id !== serviceId)
    );
  };

  const handleAddPatient = () => {
    if (currentStep === 'search' && !searchTerm.trim()) {
      alert('Por favor, pesquise por um paciente ou cadastre um novo.');
      return;
    }

    if (serviceTypes.length === 0) {
      alert('Por favor, selecione pelo menos um tipo de serviço.');
      return;
    }

    const patientData = {
      name: createdPatient ? createdPatient.name : searchTerm,
      serviceTypes: serviceTypes,
      professional: selectedProfessional,
      team: selectedTeam,
      priority: priority,
      notes: notes,
      appointmentDate: appointmentDate,
      ...(createdPatient && createdPatient)
    };

    onAdd(patientData);
    handleClearForm();
    onClose();
  };

  const handleClearForm = () => {
    setSearchTerm('');
    setSearchResult('');
    setCurrentStep('search');
    setSelectedProfessional('');
    setSelectedTeam('');
    setServiceTypes([]);
    setPriority('normal');
    setNotes('');
    setCreatedPatient(null);
    setNewPatientData({
      name: '',
      cpf: '',
      cns: '',
      birthDate: '',
      sex: '',
      race: '',
      phone: '',
      contactPhone: '',
      motherName: '',
      fatherName: '',
      nationality: '',
      birthState: '',
      cep: '',
      streetType: '',
      street: '',
      number: '',
      neighborhood: '',
      professional: '',
      team: '',
      serviceTypes: [],
      priority: 'normal',
      notes: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999] flex items-start justify-center p-4">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStep === 'search' && 'Buscar Paciente'}
              {currentStep === 'create' && 'Cadastrar Novo Paciente'}
              {currentStep === 'queue' && 'Adicionar à Fila de Atendimento'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mt-2">
            <span className={`text-sm ${currentStep === 'search' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              1. Buscar
            </span>
            <span className="text-gray-300">›</span>
            <span className={`text-sm ${currentStep === 'create' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              2. Cadastrar
            </span>
            <span className="text-gray-300">›</span>
            <span className={`text-sm ${currentStep === 'queue' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
              3. Adicionar à Fila
            </span>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] p-4 sm:p-6 space-y-4">
          {/* STEP 1: Busca de Paciente */}
          {currentStep === 'search' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidadão <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome, CPF, CNS ou Data de Nascimento"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSearchPatient}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Buscar
                  </button>
                </div>
                {searchResult && (
                  <div className="mt-1">
                    <small className="text-gray-500">{searchResult}</small>
                    {searchResult.includes('Nenhum resultado') && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep('create')}
                        className="block text-blue-600 hover:underline mt-1"
                      >
                        Cadastrar Novo Paciente
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* STEP 2: Cadastrar Novo Paciente */}
          {currentStep === 'create' && (
            <>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Dados do Paciente</h4>
                <p className="text-sm text-gray-600">Preencha os dados básicos do novo paciente</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CPF <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatientData.cpf}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CNS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPatientData.cns}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, cns: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="000 0000 0000 0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Nascimento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newPatientData.birthDate}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, birthDate: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sexo <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newPatientData.sex}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, sex: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Selecione</option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome da Mãe</label>
                  <input
                    type="text"
                    value={newPatientData.motherName}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, motherName: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome do Pai</label>
                  <input
                    type="text"
                    value={newPatientData.fatherName}
                    onChange={(e) => setNewPatientData(prev => ({ ...prev, fatherName: e.target.value }))}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Adicionar à Fila */}
          {currentStep === 'queue' && (
            <>
              {createdPatient && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-green-800">Paciente Cadastrado:</h4>
                  <p className="text-sm text-green-700">{createdPatient.name}</p>
                  <p className="text-xs text-green-600">CPF: {createdPatient.cpf}</p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Configurações do Atendimento</h4>
                <p className="text-sm text-gray-600">Configure os detalhes para adicionar à fila</p>
              </div>

              {/* Data do Agendamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Agendamento do dia</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Profissional */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Profissional</label>
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione o profissional</option>
                  <option value="maria">Maria Assunção - Médica</option>
                  <option value="joao">João Silva - Enfermeiro</option>
                  <option value="carlos">Carlos Pereira - Médico</option>
                </select>
              </div>

              {/* Equipe */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Equipe</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione a equipe</option>
                  <option value="equipe1">Equipe 1</option>
                  <option value="equipe2">Equipe 2</option>
                  <option value="equipe3">Equipe 3</option>
                </select>
              </div>

              {/* Prioridade */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Prioridade</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              {/* Tipo de Serviço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Serviço <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {serviceTypeOptions.map((service) => (
                    <div key={service.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={service.id}
                        checked={serviceTypes.includes(service.id)}
                        onChange={(e) => handleServiceTypeChange(service.id, e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={service.id} className="text-sm text-gray-700 select-none">
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Observações sobre o atendimento..."
                />
              </div>
            </>
          )}

          {/* Botões de Ação */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex space-x-2">
              {currentStep !== 'search' && (
                <button
                  onClick={() => setCurrentStep(currentStep === 'create' ? 'search' : 'create')}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  ← Voltar
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClearForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Limpar
              </button>
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              
              {currentStep === 'create' && (
                <button
                  onClick={handleCreateNewPatient}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  Cadastrar Paciente →
                </button>
              )}
              
              {currentStep === 'queue' && (
                <button
                  onClick={handleAddPatient}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar à Fila
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
