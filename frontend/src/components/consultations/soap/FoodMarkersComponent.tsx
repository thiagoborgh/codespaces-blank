import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { FaixaEtaria, FoodMarkersData } from '../../../types/soap';

type OpcaoResposta = 'Sim' | 'Não' | 'Não sabe';
type OpcaoFrequencia = '1 vez' | '2 vezes' | '3 vezes' | 'Não sabe';
type OpcaoConsistencia = 'Em pedaço' | 'Amassada' | 'Passada na peneira' | 'Liquidificada' | 'Só o caldo' | 'Não sabe';
type OpcaoRefeicao = 'Café da manhã' | 'Lanche da manhã' | 'Almoço' | 'Lanche da tarde' | 'Jantar' | 'Ceia';

interface FoodMarkersComponentProps {
  patientAge: number;
  data: FoodMarkersData;
  onChange: (data: FoodMarkersData) => void;
}

const FoodMarkersComponent: React.FC<FoodMarkersComponentProps> = ({ patientAge, data, onChange }) => {
  const [respostas, setRespostas] = useState<Record<string, string | string[]>>(data.respostas || {});

  // Determinar faixa etária baseada na idade
  const getFaixaEtaria = (age: number): FaixaEtaria => {
    if (age < 0.5) return 'menor6meses'; // menor que 6 meses
    if (age < 2) return '6a23meses'; // 6 meses a 23 meses
    return '2anosOuMais'; // 2 anos ou mais
  };

  const faixaEtaria = getFaixaEtaria(patientAge);

  // Perguntas por faixa etária
  const perguntasMenor6Meses = [
    'A criança ontem tomou leite do peito?',
    'Ontem a criança consumiu: Mingau',
    'Ontem a criança consumiu: Água/Chá',
    'Ontem a criança consumiu: Leite de vaca',
    'Ontem a criança consumiu: Fórmula infantil',
    'Ontem a criança consumiu: Suco de fruta',
    'Ontem a criança consumiu: Fruta',
    'Ontem a criança consumiu: Comida de sal',
    'Ontem a criança consumiu: Outros alimentos/bebidas'
  ];

  const perguntas6a23Meses = [
    'A criança ontem tomou leite do peito?',
    'Ontem a criança tomou outros tipos de leite?',
    'Ontem a criança comeu fruta inteira?',
    'Ontem a criança comeu comida de sal?',
    'Ontem a criança tomou água?',
    'Ontem a criança tomou outros líquidos?'
  ];

  const perguntasMaior2Anos = [
    'Ontem você consumiu feijão?',
    'Ontem você consumiu frutas frescas?',
    'Ontem você consumiu verduras e/ou legumes?',
    'Ontem você consumiu hambúrguer e/ou embutidos?',
    'Ontem você consumiu bebidas adoçadas?',
    'Ontem você consumiu macarrão instantâneo, salgadinhos de pacote ou biscoitos salgados?',
    'Ontem você consumiu biscoito recheado, doces ou guloseimas?'
  ];

  const refeicoesMaior2Anos: OpcaoRefeicao[] = [
    'Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'
  ];

  useEffect(() => {
    const novaFaixaEtaria = getFaixaEtaria(patientAge);
    if (novaFaixaEtaria !== data.faixaEtaria) {
      // Reset respostas quando muda faixa etária
      setRespostas({});
      onChange({
        faixaEtaria: novaFaixaEtaria,
        respostas: {},
        todasRespondidas: false
      });
    }
  }, [patientAge]);

  const handleRespostaChange = (pergunta: string, resposta: string) => {
    const novasRespostas = { ...respostas, [pergunta]: resposta };
    setRespostas(novasRespostas);
    
    onChange({
      ...data,
      faixaEtaria,
      respostas: novasRespostas,
      todasRespondidas: verificarTodasRespondidas(novasRespostas)
    });
  };

  const handleMultiplaSelecao = (pergunta: string, opcao: string, checked: boolean) => {
    const respostasAtuais = (respostas[pergunta] as string[]) || [];
    let novasRespostasArray: string[];
    
    if (checked) {
      novasRespostasArray = [...respostasAtuais, opcao];
    } else {
      novasRespostasArray = respostasAtuais.filter(r => r !== opcao);
    }
    
    const novasRespostas = { ...respostas, [pergunta]: novasRespostasArray };
    setRespostas(novasRespostas);
    
    onChange({
      ...data,
      faixaEtaria,
      respostas: novasRespostas,
      todasRespondidas: verificarTodasRespondidas(novasRespostas)
    });
  };

  const verificarTodasRespondidas = (respostasAtual: Record<string, string | string[]>): boolean => {
    const perguntasObrigatorias = getPerguntasObrigatorias();
    return perguntasObrigatorias.every(pergunta => {
      const resposta = respostasAtual[pergunta];
      return resposta !== undefined && resposta !== '' && 
             (Array.isArray(resposta) ? resposta.length > 0 : true);
    });
  };

  const getPerguntasObrigatorias = (): string[] => {
    switch (faixaEtaria) {
      case 'menor6meses':
        return perguntasMenor6Meses;
      case '6a23meses':
        return perguntas6a23Meses;
      case '2anosOuMais':
        return [...perguntasMaior2Anos, 'Quais refeições você faz ao longo do dia?'];
      default:
        return [];
    }
  };

  const limparCampos = () => {
    setRespostas({});
    onChange({
      ...data,
      respostas: {},
      todasRespondidas: false
    });
  };

  const temRespostasPreenchidas = Object.keys(respostas).length > 0;

  const getMensagemInformativa = (): string => {
    switch (faixaEtaria) {
      case 'menor6meses':
        return 'Para crianças menores de 6 meses - Todas as perguntas são obrigatórias';
      case '6a23meses':
        return 'Para crianças de 6 a 23 meses - Todas as perguntas são obrigatórias';
      case '2anosOuMais':
        return 'Para pessoas de 2 anos ou mais - Todas as perguntas são obrigatórias';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Mensagem informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium">
          {getMensagemInformativa()}
        </p>
      </div>

      {/* Botão limpar campos */}
      {temRespostasPreenchidas && (
        <div className="flex justify-end">
          <button
            onClick={limparCampos}
            className="flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Limpar campos
          </button>
        </div>
      )}

      {/* Perguntas por faixa etária */}
      {faixaEtaria === 'menor6meses' && (
        <div className="space-y-4">
          {perguntasMenor6Meses.map((pergunta, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{pergunta}</label>
              <div className="flex gap-4">
                {(['Sim', 'Não', 'Não sabe'] as OpcaoResposta[]).map(opcao => (
                  <label key={opcao} className="flex items-center">
                    <input
                      type="radio"
                      name={`pergunta_${index}`}
                      value={opcao}
                      checked={respostas[pergunta] === opcao}
                      onChange={() => handleRespostaChange(pergunta, opcao)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {faixaEtaria === '6a23meses' && (
        <div className="space-y-4">
          {perguntas6a23Meses.map((pergunta, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{pergunta}</label>
              <div className="flex gap-4">
                {(['Sim', 'Não', 'Não sabe'] as OpcaoResposta[]).map(opcao => (
                  <label key={opcao} className="flex items-center">
                    <input
                      type="radio"
                      name={`pergunta_${index}`}
                      value={opcao}
                      checked={respostas[pergunta] === opcao}
                      onChange={() => handleRespostaChange(pergunta, opcao)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{opcao}</span>
                  </label>
                ))}
              </div>
              
              {/* Perguntas condicionais para fruta */}
              {pergunta === 'Ontem a criança comeu fruta inteira?' && respostas[pergunta] === 'Sim' && (
                <div className="ml-4 space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Se sim, quantas vezes?</label>
                  <div className="flex gap-4">
                    {(['1 vez', '2 vezes', '3 vezes', 'Não sabe'] as OpcaoFrequencia[]).map(freq => (
                      <label key={freq} className="flex items-center">
                        <input
                          type="radio"
                          name={`freq_fruta`}
                          value={freq}
                          checked={respostas[`${pergunta}_frequencia`] === freq}
                          onChange={() => handleRespostaChange(`${pergunta}_frequencia`, freq)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Perguntas condicionais para comida de sal */}
              {pergunta === 'Ontem a criança comeu comida de sal?' && respostas[pergunta] === 'Sim' && (
                <div className="ml-4 space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Se sim, quantas vezes?</label>
                    <div className="flex gap-4">
                      {(['1 vez', '2 vezes', '3 vezes', 'Não sabe'] as OpcaoFrequencia[]).map(freq => (
                        <label key={freq} className="flex items-center">
                          <input
                            type="radio"
                            name={`freq_sal`}
                            value={freq}
                            checked={respostas[`${pergunta}_frequencia`] === freq}
                            onChange={() => handleRespostaChange(`${pergunta}_frequencia`, freq)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">{freq}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-600">Se sim, essa comida foi oferecida:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Em pedaço', 'Amassada', 'Passada na peneira', 'Liquidificada', 'Só o caldo', 'Não sabe'] as OpcaoConsistencia[]).map(cons => (
                        <label key={cons} className="flex items-center">
                          <input
                            type="radio"
                            name={`consistencia_sal`}
                            value={cons}
                            checked={respostas[`${pergunta}_consistencia`] === cons}
                            onChange={() => handleRespostaChange(`${pergunta}_consistencia`, cons)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-600">{cons}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {faixaEtaria === '2anosOuMais' && (
        <div className="space-y-4">
          {/* Perguntas simples sim/não */}
          {perguntasMaior2Anos.map((pergunta, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">{pergunta}</label>
              <div className="flex gap-4">
                {(['Sim', 'Não', 'Não sabe'] as OpcaoResposta[]).map(opcao => (
                  <label key={opcao} className="flex items-center">
                    <input
                      type="radio"
                      name={`pergunta_${index}`}
                      value={opcao}
                      checked={respostas[pergunta] === opcao}
                      onChange={() => handleRespostaChange(pergunta, opcao)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{opcao}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          {/* Pergunta múltipla seleção - refeições */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quais refeições você faz ao longo do dia?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {refeicoesMaior2Anos.map(refeicao => {
                const respostasRefeicoes = (respostas['Quais refeições você faz ao longo do dia?'] as string[]) || [];
                return (
                  <label key={refeicao} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={respostasRefeicoes.includes(refeicao)}
                      onChange={(e) => handleMultiplaSelecao('Quais refeições você faz ao longo do dia?', refeicao, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{refeicao}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Indicador de status */}
      <div className="mt-4">
        {data.todasRespondidas ? (
          <div className="text-sm text-green-600 font-medium">
            ✓ Todas as perguntas foram respondidas
          </div>
        ) : (
          <div className="text-sm text-amber-600 font-medium">
            ⚠ Algumas perguntas ainda precisam ser respondidas
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodMarkersComponent;
