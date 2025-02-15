import React from 'react';
import { Shield, AlertTriangle, Clock, Key } from 'lucide-react';
import { PasswordAnalysis } from '../utils/passwordStrength';
import type { Password } from '../types';

interface Props {
  passwords: Password[];
  darkMode: boolean;
  translations: any;
}

export const SecurityDashboard: React.FC<Props> = ({ passwords, darkMode, translations: t }) => {
  const [weakPasswords, setWeakPasswords] = useState<Password[]>([]);
  const [compromisedPasswords, setCompromisedPasswords] = useState<Password[]>([]);
  const [oldPasswords, setOldPasswords] = useState<Password[]>([]);

  useEffect(() => {
    const analyzePasswords = async () => {
      const weak: Password[] = [];
      const compromised: Password[] = [];
      const old: Password[] = [];
      const threeMonthsAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);

      for (const password of passwords) {
        const analysis = await analyzePassword(password.password);
        if (analysis.strength === 'weak') weak.push(password);
        if (analysis.isCompromised) compromised.push(password);
        if (password.createdAt < threeMonthsAgo) old.push(password);
      }

      setWeakPasswords(weak);
      setCompromisedPasswords(compromised);
      setOldPasswords(old);
    };

    analyzePasswords();
  }, [passwords]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.securityScore}
          </h3>
          <Shield className={`w-6 h-6 ${
            weakPasswords.length > 0 ? 'text-yellow-500' : 'text-green-500'
          }`} />
        </div>
        <div className="text-3xl font-bold mb-2">
          {Math.round(((passwords.length - weakPasswords.length) / passwords.length) * 100)}%
        </div>
        <p className="text-sm text-gray-500">
          {weakPasswords.length > 0 
            ? t.weakPasswordsFound(weakPasswords.length)
            : t.allPasswordsStrong}
        </p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.compromisedPasswords}
          </h3>
          <AlertTriangle className={`w-6 h-6 ${
            compromisedPasswords.length > 0 ? 'text-red-500' : 'text-green-500'
          }`} />
        </div>
        <div className="text-3xl font-bold mb-2">
          {compromisedPasswords.length}
        </div>
        <p className="text-sm text-gray-500">
          {compromisedPasswords.length > 0 
            ? t.compromisedPasswordsFound(compromisedPasswords.length)
            : t.noCompromisedPasswords}
        </p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.oldPasswords}
          </h3>
          <Clock className={`w-6 h-6 ${
            oldPasswords.length > 0 ? 'text-yellow-500' : 'text-green-500'
          }`} />
        </div>
        <div className="text-3xl font-bold mb-2">
          {oldPasswords.length}
        </div>
        <p className="text-sm text-gray-500">
          {oldPasswords.length > 0 
            ? t.oldPasswordsFound(oldPasswords.length)
            : t.allPasswordsRecent}
        </p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.totalPasswords}
          </h3>
          <Key className={`w-6 h-6 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'}`} />
        </div>
        <div className="text-3xl font-bold mb-2">
          {passwords.length}
        </div>
        <p className="text-sm text-gray-500">
          {t.passwordsStored}
        </p>
      </div>
    </div>
  );
};