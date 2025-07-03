import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { EyeIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    if (theme === 'hybrid') {
      return <span className="h-4 w-4 text-gray-600 text-sm">🎨</span>;
    }
    return <EyeIcon className="h-4 w-4 text-gray-600" />;
  };

  const getLabel = () => {
    if (theme === 'hybrid') {
      return 'Híbrido';
    }
    return 'Padrão';
  };

  const getNextTheme = () => {
    return theme === 'default' ? 'Híbrido' : 'Padrão';
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
      title={`Tema atual: ${getLabel()}. Clique para ${getNextTheme()}`}
    >
      {getIcon()}
      <span className="text-sm text-gray-600 hidden sm:inline">{getLabel()}</span>
    </button>
  );
};

export default ThemeToggle;
