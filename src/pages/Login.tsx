import React, { useState } from 'react';
import { Lock, Sun, Moon } from 'lucide-react';
import { FaceRecognition } from '../components/FaceRecognition';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const Login: React.FC<Props> = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const { signIn, signUp } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [useFaceId, setUseFaceId] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setError(t.checkEmail);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        if (error.status === 429) {
          throw new Error(t.tooManyAttempts);
        } else if (error.message.includes('rate limit')) {
          throw new Error(t.tooManyAttempts);
        } else if (error.message.includes('sending')) {
          throw new Error(t.emailSendError);
        }
        throw error;
      }
      
      setResetEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-scarlet-100 text-scarlet-600'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <LanguageSwitch
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>

          <h1 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {resetPasswordMode ? t.resetPassword : (isRegistering ? t.createAccount : t.welcomeBack)}
          </h1>
          
          {useFaceId ? (
            <div className="space-y-4">
              <FaceRecognition
                onFaceDetected={() => {}}
                onError={setError}
                translations={t}
              />
              <button
                onClick={() => setUseFaceId(false)}
                className={`w-full py-2 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'} hover:opacity-80 transition-opacity`}
              >
                {t.usePassword}
              </button>
            </div>
          ) : resetPasswordMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {resetEmailSent ? (
                <div className={`text-center space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p>{t.resetEmailSent}</p>
                  <p className="text-sm">{t.checkSpamFolder}</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {t.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`mt-1 block w-full rounded-lg ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-scarlet-400 focus:ring-scarlet-400/20' 
                          : 'border-gray-300 focus:border-scarlet-500 focus:ring-scarlet-200'
                      } shadow-sm focus:ring`}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm p-3 bg-red-100 rounded-lg">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full ${
                      darkMode 
                        ? 'bg-scarlet-500 hover:bg-scarlet-600' 
                        : 'bg-scarlet-600 hover:bg-scarlet-700'
                    } text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50`}
                  >
                    {isSubmitting ? t.sending : t.sendResetLink}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setResetPasswordMode(false);
                  setResetEmailSent(false);
                  setError('');
                }}
                disabled={isSubmitting}
                className={`w-full py-2 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'} hover:opacity-80 transition-opacity disabled:opacity-50`}
              >
                {t.backToLogin}
              </button>
            </form>
          ) : (
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-scarlet-400 focus:ring-scarlet-400/20' 
                      : 'border-gray-300 focus:border-scarlet-500 focus:ring-scarlet-200'
                  } shadow-sm focus:ring`}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {t.password}
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
                  disabled={isSubmitting}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  darkMode 
                    ? 'bg-scarlet-500 hover:bg-scarlet-600' 
                    : 'bg-scarlet-600 hover:bg-scarlet-700'
                } text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50`}
              >
                {isSubmitting ? t.loading : (isRegistering ? t.register : t.login)}
              </button>
              {!isRegistering && (
                <>
                  <button
                    type="button"
                    onClick={() => setUseFaceId(true)}
                    disabled={isSubmitting}
                    className={`w-full py-2 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'} hover:opacity-80 transition-opacity disabled:opacity-50`}
                  >
                    {t.useFaceId}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordMode(true);
                      setError('');
                    }}
                    disabled={isSubmitting}
                    className={`w-full py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:opacity-80 transition-opacity disabled:opacity-50`}
                  >
                    {t.forgotPassword}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                disabled={isSubmitting}
                className={`w-full py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'} hover:opacity-80 transition-opacity disabled:opacity-50`}
              >
                {isRegistering ? t.alreadyHaveAccount : t.needAccount}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};