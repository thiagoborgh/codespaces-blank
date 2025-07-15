import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PatientRegistration {
  // Dados Pessoais
  cpf: string;
  cns: string;
  fullName: string;
  socialName?: string;
  birthDate: string;
  sex: 'masculino' | 'feminino' | 'outro';
  raceColor: string;
  nationality: 'brasileira' | 'naturalizado' | 'estrangeiro';
  motherName: string;
  fatherName: string;
  birthCity: string;
  
  // Equipe Responsável
  responsibleTeam: string;
  responsibleUnit: string;
  useIndividualRegistry: boolean;
  
  // Endereço
  country: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  streetType: string;
  street: string;
  number: string;
  complement?: string;
  reference?: string;
  area?: string;
  microarea?: string;
  
  // Contatos
  residentialPhone?: string;
  cellPhone?: string;
  contactPhone?: string;
  email?: string;
  
  // Informações Sociodemográficas
  nis?: string;
  occupation?: string;
  maritalStatus?: string;
  bloodType?: string;
  education?: string;
  wantsToInformSexualOrientation?: boolean;
  sexualOrientation?: string;
  wantsToInformGenderIdentity?: boolean;
  genderIdentity?: string;
  
  // Compartilhamento
  disableSharing: boolean;
  
  lastUpdate: string;
}

interface PatientRegistrationProps {
  patientId: string;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ patientId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PatientRegistration>({
    // Mock data - em um app real, viria da API
    cpf: '473.552.608-04',
    cns: '123456789012345',
    fullName: 'JOÃO DA SILVA SANTOS',
    socialName: '',
    birthDate: '15/03/1985',
    sex: 'masculino',
    raceColor: 'Branca',
    nationality: 'brasileira',
    motherName: 'MARIA DA SILVA',
    fatherName: 'JOSÉ SANTOS',
    birthCity: 'São Paulo/SP',
    
    responsibleTeam: 'UBS Jardim Itamaraty – 0002405644',
    responsibleUnit: 'UBS Jardim Itamaraty',
    useIndividualRegistry: true,
    
    country: 'Brasil',
    cep: '01234-567',
    state: 'São Paulo',
    city: 'São Paulo',
    neighborhood: 'Jardim Itamaraty',
    streetType: 'Rua',
    street: 'das Flores',
    number: '123',
    complement: 'Apto 45',
    reference: 'Próximo ao mercado',
    area: 'Área 1',
    microarea: 'Microárea 1',
    
    residentialPhone: '(11) 3333-4444',
    cellPhone: '(11) 99999-8888',
    contactPhone: '',
    email: 'joao.silva@email.com',
    
    nis: '12345678901',
    occupation: 'Analista de Sistemas',
    maritalStatus: 'Casado(a)',
    bloodType: 'A+',
    education: 'Ensino Superior',
    wantsToInformSexualOrientation: true,
    sexualOrientation: 'Heterossexual',
    wantsToInformGenderIdentity: true,
    genderIdentity: 'Cisgênero',
    
    disableSharing: false,
    lastUpdate: '15/01/2025'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({});
  };

  const handleCancel = () => {
    // Aqui seria implementado um modal de confirmação
    setIsEditing(false);
    setErrors({});
    // Resetar formData para valores originais
  };

  const handleSave = () => {
    // Validação
    const newErrors: Record<string, string> = {};
    
    if (!formData.cpf.trim()) newErrors.cpf = 'Preenchimento obrigatório.';
    if (!formData.fullName.trim()) newErrors.fullName = 'Preenchimento obrigatório.';
    if (!formData.birthDate.trim()) newErrors.birthDate = 'Preenchimento obrigatório.';
    if (!formData.sex) newErrors.sex = 'Preenchimento obrigatório.';
    if (!formData.raceColor.trim()) newErrors.raceColor = 'Preenchimento obrigatório.';
    if (!formData.motherName.trim()) newErrors.motherName = 'Preenchimento obrigatório.';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Preenchimento obrigatório.';
    
    // Validação de pelo menos um telefone
    if (!formData.residentialPhone?.trim() && !formData.cellPhone?.trim() && !formData.contactPhone?.trim()) {
      newErrors.phone = 'É obrigatório o preenchimento de pelo menos um telefone.';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Salvar dados
    setIsEditing(false);
    setErrors({});
    // Aqui seria feita a chamada para a API
  };

  const handleInputChange = (field: keyof PatientRegistration, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const renderField = (label: string, field: keyof PatientRegistration, type: 'text' | 'select' | 'radio' = 'text', options?: string[]) => {
    const value = formData[field] as string;
    const hasError = errors[field];
    
    if (!isEditing) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <span className="font-semibold text-gray-700">{label}</span>
          </div>
          <div>
            <span className="text-gray-900">{value || '–'}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {label.includes('*') && <span className="text-red-500">*</span>}
        </label>
        
        {type === 'text' && (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full p-2 border rounded-lg ${hasError ? 'border-red-500' : 'border-gray-300'}`}
          />
        )}
        
        {type === 'select' && options && (
          <select
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={`w-full p-2 border rounded-lg ${hasError ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Selecione...</option>
            {options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        
        {hasError && (
          <p className="text-red-500 text-sm mt-1">{hasError}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <div className="text-right">
          {!isEditing ? (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Atualizar cadastro
              </button>
              <p className="text-sm text-gray-500 mt-1">
                Última atualização em {formData.lastUpdate}
              </p>
            </>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dados Pessoais */}
      {renderSection("Dados pessoais", (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("CPF*", "cpf")}
          {renderField("CNS", "cns")}
          {renderField("Nome completo*", "fullName")}
          {renderField("Nome social", "socialName")}
          {renderField("Data de nascimento*", "birthDate")}
          {renderField("Sexo*", "sex", "select", ["masculino", "feminino", "outro"])}
          {renderField("Raça/Cor*", "raceColor", "select", ["Branca", "Preta", "Parda", "Amarela", "Indígena"])}
          {renderField("Nome da mãe*", "motherName")}
          {renderField("Nome do pai*", "fatherName")}
          {renderField("Nacionalidade", "nationality", "select", ["brasileira", "naturalizado", "estrangeiro"])}
          {renderField("Município de nascimento*", "birthCity")}
        </div>
      ))}

      {/* Equipe Responsável */}
      {renderSection("Equipe responsável pelo cidadão", (
        <div>
          {!isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">Equipe responsável</span>
                </div>
                <div>
                  <span className="text-gray-900">{formData.responsibleTeam}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">Unidade responsável</span>
                </div>
                <div>
                  <span className="text-gray-900">{formData.responsibleUnit}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 italic">
                Utilizando a informação do cadastro individual do cidadão.
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.useIndividualRegistry}
                    onChange={(e) => handleInputChange('useIndividualRegistry', e.target.checked)}
                    className="mr-2"
                  />
                  Utilizar informação do cadastro individual do cidadão
                </label>
              </div>
              
              {!formData.useIndividualRegistry && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipe responsável*
                  </label>
                  <select
                    value={formData.responsibleTeam}
                    onChange={(e) => handleInputChange('responsibleTeam', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione...</option>
                    <option value="UBS Jardim Itamaraty – 0002405644">UBS Jardim Itamaraty – 0002405644</option>
                  </select>
                  {errors.responsibleTeam && (
                    <p className="text-red-500 text-sm mt-1">{errors.responsibleTeam}</p>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade de saúde responsável
                </label>
                <input
                  type="text"
                  value={formData.responsibleUnit}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Endereço */}
      {renderSection("Endereço", (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("País de residência*", "country", "select", ["Brasil"])}
          {renderField("CEP*", "cep")}
          {renderField("Estado*", "state", "select", ["São Paulo", "Rio de Janeiro", "Minas Gerais"])}
          {renderField("Município*", "city")}
          {renderField("Bairro*", "neighborhood")}
          {renderField("Tipo de logradouro*", "streetType", "select", ["Rua", "Avenida", "Travessa", "Alameda"])}
          {renderField("Logradouro*", "street")}
          {renderField("Número*", "number")}
          {renderField("Complemento", "complement")}
          {renderField("Ponto de referência", "reference")}
          {renderField("Área", "area")}
          {renderField("Microárea", "microarea")}
        </div>
      ))}

      {/* Contatos */}
      {renderSection("Contatos", (
        <div>
          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                É obrigatório o preenchimento de pelo menos um telefone.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("Telefone residencial", "residentialPhone")}
            {renderField("Telefone celular", "cellPhone")}
            {renderField("Telefone de contato", "contactPhone")}
            {renderField("E-mail", "email")}
          </div>
          
          {errors.phone && (
            <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
          )}
        </div>
      ))}

      {/* Informações Sociodemográficas */}
      {renderSection("Informações sociodemográficas", (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderField("Nº NIS (PIS/PASEP)", "nis")}
          {renderField("Ocupação", "occupation")}
          {renderField("Estado civil", "maritalStatus", "select", ["Solteiro(a)", "Casado(a)", "Separado judicialmente", "União estável", "Viúvo(a)"])}
          {renderField("Tipo sanguíneo", "bloodType", "select", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])}
          {renderField("Escolaridade", "education", "select", ["Ensino Fundamental", "Ensino Médio", "Ensino Superior", "Pós-graduação"])}
          
          {isEditing && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deseja informar orientação sexual?*
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wantsToInformSexualOrientation"
                      checked={formData.wantsToInformSexualOrientation === true}
                      onChange={() => handleInputChange('wantsToInformSexualOrientation', true)}
                      className="mr-2"
                    />
                    Sim
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wantsToInformSexualOrientation"
                      checked={formData.wantsToInformSexualOrientation === false}
                      onChange={() => handleInputChange('wantsToInformSexualOrientation', false)}
                      className="mr-2"
                    />
                    Não
                  </label>
                </div>
              </div>
              
              {formData.wantsToInformSexualOrientation && (
                <div className="md:col-span-2">
                  {renderField("Qual a orientação sexual?*", "sexualOrientation", "select", ["Heterossexual", "Homossexual", "Bissexual", "Outro"])}
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deseja informar identidade de gênero?*
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wantsToInformGenderIdentity"
                      checked={formData.wantsToInformGenderIdentity === true}
                      onChange={() => handleInputChange('wantsToInformGenderIdentity', true)}
                      className="mr-2"
                    />
                    Sim
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="wantsToInformGenderIdentity"
                      checked={formData.wantsToInformGenderIdentity === false}
                      onChange={() => handleInputChange('wantsToInformGenderIdentity', false)}
                      className="mr-2"
                    />
                    Não
                  </label>
                </div>
              </div>
              
              {formData.wantsToInformGenderIdentity && (
                <div className="md:col-span-2">
                  {renderField("Qual a identidade de gênero?*", "genderIdentity", "select", ["Cisgênero", "Transgênero", "Não binário", "Outro"])}
                </div>
              )}
            </>
          )}
          
          {!isEditing && formData.wantsToInformSexualOrientation && (
            <>
              {renderField("Orientação sexual", "sexualOrientation")}
            </>
          )}
          
          {!isEditing && formData.wantsToInformGenderIdentity && (
            <>
              {renderField("Identidade de gênero", "genderIdentity")}
            </>
          )}
        </div>
      ))}

      {/* Compartilhamento de Prontuário */}
      {isEditing && renderSection("Compartilhamento de prontuário", (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Por padrão, o prontuário é compartilhado entre todas as unidades da mesma instalação. 
            O cidadão pode optar por desativar esse compartilhamento.
          </p>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.disableSharing}
              onChange={(e) => handleInputChange('disableSharing', e.target.checked)}
              className="mr-3"
            />
            <span className="text-sm text-gray-700">
              Desativar compartilhamento de prontuário para este cidadão
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default PatientRegistration;
