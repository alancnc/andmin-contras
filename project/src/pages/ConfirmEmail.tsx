import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface Props {
  darkMode: boolean;
  language: Language;
}

export const ConfirmEmail: React.FC<Props> = ({ darkMode, language }) => {
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const t = translations[language];

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        
        if (!access_token || !refresh_token) {
          throw new Error('No confirmation tokens found');
        }

        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) throw error;

        setVerifying(false);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error: any) {
        setError(error.message);
        setVerifying(false);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

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
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/90'} backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full text-center`}>
          <div className="flex justify-center mb-6">
            <div className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-scarlet-100'} rounded-full`}>
              <Lock className={`w-12 h-12 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'}`} />
            </div>
          </div>

          <h1 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {t.emailVerification}
          </h1>

          {verifying ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scarlet-600"></div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.verifyingEmail}
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500">
              <p>{t.verificationError}</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          ) : (
            <div className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              <p>{t.emailVerified}</p>
              <p className="text-sm mt-2">{t.redirecting}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};