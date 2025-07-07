/**
 * Utilitários para formatação de idade
 */

/**
 * Calcula a idade detalhada em anos, meses e dias a partir de uma data de nascimento
 * @param birthDate - Data de nascimento no formato YYYY-MM-DD ou objeto Date
 * @returns String formatada "XXa XXm XXd"
 */
export const calculateDetailedAgeShort = (birthDate: string | Date): string => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  // Ajustar se os dias são negativos
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Ajustar se os meses são negativos
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return `${years}a ${months}m ${days}d`;
};

/**
 * Converte o formato abreviado para o formato completo
 * @param ageFormatted - Idade no formato "XXa XXm XXd"
 * @returns String formatada "XXanos XXmeses XXdias de idade"
 */
export const formatAgeFromShort = (ageFormatted: string): string => {
  const match = ageFormatted.match(/(\d+)a\s*(\d+)m\s*(\d+)d/);
  if (!match) return ageFormatted;
  
  const [, years, months, days] = match;
  const yearsNum = parseInt(years);
  const monthsNum = parseInt(months);
  const daysNum = parseInt(days);
  
  const yearsText = yearsNum === 1 ? 'ano' : 'anos';
  const monthsText = monthsNum === 1 ? 'mês' : 'meses';
  const daysText = daysNum === 1 ? 'dia' : 'dias';
  
  return `${yearsNum} ${yearsText} ${monthsNum} ${monthsText} ${daysNum} ${daysText} de idade`;
};

/**
 * Versão compacta para exibição em cards
 * @param ageFormatted - Idade no formato "XXa XXm XXd"
 * @returns String formatada mais compacta
 */
export const formatAgeCompact = (ageFormatted: string): string => {
  return ageFormatted; // Já está no formato compacto
};

/**
 * Formata a data de nascimento no padrão "Nascimento: dd/mm/aaaa (XXa Xm XXd)"
 * @param birthDate - Data de nascimento no formato YYYY-MM-DD ou objeto Date
 * @returns String formatada "Nascimento: dd/mm/aaaa (XXa Xm XXd)"
 */
export const formatBirthDateWithAge = (birthDate: string | Date): string => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  // Formatar data de nascimento
  const birthFormatted = birth.toLocaleDateString('pt-BR');
  
  // Calcular idade
  const ageFormatted = calculateDetailedAgeShort(birthDate);
  
  return `Nascimento: ${birthFormatted} (${ageFormatted})`;
};

/**
 * Formata a data de nascimento sem o label "Nascimento:"
 * @param birthDate - Data de nascimento no formato YYYY-MM-DD ou objeto Date
 * @returns String formatada "dd/mm/aaaa (XXa Xm XXd)"
 */
export const formatBirthDateWithAgeNoLabel = (birthDate: string | Date): string => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  
  // Formatar data de nascimento
  const birthFormatted = birth.toLocaleDateString('pt-BR');
  
  // Calcular idade
  const ageFormatted = calculateDetailedAgeShort(birthDate);
  
  return `${birthFormatted} (${ageFormatted})`;
};

/**
 * Calcula apenas a idade em anos (para compatibilidade)
 * @param birthDate - Data de nascimento no formato YYYY-MM-DD ou objeto Date
 * @returns Idade em anos
 */
export const calculateAge = (birthDate: string | Date): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
