import React, { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { generatePassword, PasswordOptions } from '../utils/passwordGenerator';

interface Props {
  onGenerate: (password: string) => void;
  translations: any;
}

export const PasswordGenerator: React.FC<Props> = ({ onGenerate, translations: t }) => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const password = generatePassword(options);
    setGeneratedPassword(password);
    onGenerate(password);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.generateStrongPassword}</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">{t.passwordLength}: {options.length}</label>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-scarlet-600"
          />
        </div>

        <div className="space-y-2">
          {[
            { key: 'includeUppercase', label: t.uppercaseLetters },
            { key: 'includeLowercase', label: t.lowercaseLetters },
            { key: 'includeNumbers', label: t.numbers },
            { key: 'includeSymbols', label: t.specialCharacters },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options[key as keyof PasswordOptions]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded border-gray-300 text-scarlet-600 focus:ring-scarlet-500"
              />
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>

        {generatedPassword && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <span className="font-mono text-sm">{generatedPassword}</span>
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title={t.copyToClipboard}
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center space-x-2 bg-scarlet-600 text-white py-2 px-4 rounded-lg hover:bg-scarlet-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.generatePassword}</span>
        </button>
      </div>
    </div>
  );
};