import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LanguageSwitch } from '../components/LanguageSwitch';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const ResetPassword: React.FC<Props> = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    if (!access_token) {
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    try {
      const access_token = searchParams.get('access_token');
      if (!access_token) {
        throw new Error('No access token found');
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-scarlet-500 to-scarlet-800'} relative overflow-hidden`}>
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-scarlet-500 to-scarlet-800'} animate-gradient`}></div>
        {!darkMode && (
          <div className="absolute inset-0 opacity-50">
            <div className="absolute w-96 h-96 -top-48 -left-48 bg-scarlet-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-scarlet-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-scarlet-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/90'} backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full`}>
          <div className="flex justify-between items-center mb-6">
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-scarlet-100'} rounded-full`}>
              <Lock className={`w-12 h-12 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'}`} />
            </div>
            <LanguageSwitch
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>

          <h1 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.resetPassword}
          </h1>

          {success ? (
            <p className={`text-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {t.passwordResetSuccess}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.newPassword}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-scarlet-400 focus:ring-scarlet-400/20' 
                      : 'border-gray-300 focus:border-scarlet-500 focus:ring-scarlet-200'
                  } shadow-sm focus:ring`}
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-scarlet-400 focus:ring-scarlet-400/20' 
                      : 'border-gray-300 focus:border-scarlet-500 focus:ring-scarlet-200'
                  } shadow-sm focus:ring`}
                  required
                  minLength={8}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className={`w-full ${
                  darkMode 
                    ? 'bg-scarlet-500 hover:bg-scarlet-600' 
                    : 'bg-scarlet-600 hover:bg-scarlet-700'
                } text-white py-3 px-4 rounded-lg transition-colors`}
              >
                {t.resetPassword}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};