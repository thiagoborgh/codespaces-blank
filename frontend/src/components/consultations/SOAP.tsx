import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

// Importação dos componentes SOAP
import SubjectiveSection from './soap/SubjectiveSection';
import ObjectiveSection from './soap/ObjectiveSection';
import AssessmentSection from './soap/AssessmentSection';
import PlanSection from './soap/PlanSection';

// Importação dos tipos
import type { 
  Patient, 
  SOAPData, 
  SubjectiveData, 
  ObjectiveData, 
  AssessmentData, 
  PlanData,
  TextFormatting 
} from '../../types/soap';

interface SOAPProps {
  patient: Patient;
  onSave: (data: SOAPData) => void;
  initialData?: SOAPData;
}

const SOAP: React.FC<SOAPProps> = ({ patient, onSave, initialData }) => {
  const [activeSection, setActiveSection] = useState<'subjective' | 'objective' | 'assessment' | 'plan'>('subjective');
  const [soapData, setSOAPData] = useState<SOAPData>(initialData || {
    subjective: {
      freeText: { content: '', formatting: { bold: false, italic: false, underline: false, strikethrough: false, quote: false } }
    },
    objective: {
      freeText: { content: '', formatting: { bold: false, italic: false, underline: false, strikethrough: false, quote: false } },
      anthropometry: {},
      foodMarkers: { faixaEtaria: '2anosOuMais', respostas: {}, todasRespondidas: false },
      vaccination: null,
      examResults: []
    },
    assessment: {
      freeText: { content: '', formatting: { bold: false, italic: false, underline: false, strikethrough: false, quote: false } },
      problems: [],
      allergies: []
    },
    plan: {
      freeText: { content: '', formatting: { bold: false, italic: false, underline: false, strikethrough: false, quote: false } }
    }
  });

  const sections = [
    { key: 'subjective', label: 'Subjetivo', description: 'Relato do paciente e anamnese' },
    { key: 'objective', label: 'Objetivo', description: 'Dados objetivos e exame físico' },
    { key: 'assessment', label: 'Avaliação', description: 'Análise clínica e diagnósticos' },
    { key: 'plan', label: 'Plano', description: 'Conduta e prescrições' }
  ];

  const handleSectionChange = (section: typeof activeSection) => {
    setActiveSection(section);
  };

  const handleSave = () => {
    onSave(soapData);
  };

  const renderNavigationTabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {sections.map((section) => (
          <button
            key={section.key}
            onClick={() => handleSectionChange(section.key as typeof activeSection)}
            className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeSection === section.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold">{section.label}</span>
              <span className="text-xs mt-1 text-gray-400">{section.description}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'subjective':
        return <SubjectiveSection 
          data={soapData.subjective} 
          onChange={(data: SubjectiveData) => setSOAPData(prev => ({ ...prev, subjective: data }))}
        />;
      case 'objective':
        return <ObjectiveSection 
          data={soapData.objective} 
          patient={patient}
          onChange={(data: ObjectiveData) => setSOAPData(prev => ({ ...prev, objective: data }))}
        />;
      case 'assessment':
        return <AssessmentSection 
          data={soapData.assessment} 
          patient={patient}
          onChange={(data: AssessmentData) => setSOAPData(prev => ({ ...prev, assessment: data }))}
        />;
      case 'plan':
        return <PlanSection 
          data={soapData.plan} 
          onChange={(data: PlanData) => setSOAPData(prev => ({ ...prev, plan: data }))}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">SOAP</h2>
            <p className="text-sm text-gray-600">Método estruturado de documentação clínica</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Salvar SOAP
        </button>
      </div>

      {/* Navigation Tabs */}
      {renderNavigationTabs()}

      {/* Section Content */}
      <div className="min-h-[400px]">
        {renderSectionContent()}
      </div>
    </div>
  );
};

export default SOAP;
