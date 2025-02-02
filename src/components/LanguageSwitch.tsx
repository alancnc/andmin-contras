import React from 'react';
import { Languages } from 'lucide-react';
import type { Language } from '../utils/translations';

interface Props {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSwitch: React.FC<Props> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <button
      onClick={() => onLanguageChange(currentLanguage === 'en' ? 'es' : 'en')}
      className="flex items-center space-x-1 text-gray-600 hover:text-scarlet-600 transition-colors"
      title={currentLanguage === 'en' ? 'Cambiar a Español' : 'Switch to English'}
    >
      <Languages className="w-5 h-5" />
      <span className="uppercase">{currentLanguage}</span>
    </button>
  );
};