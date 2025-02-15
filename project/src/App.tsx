import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Lock, Plus, LogOut, Key, Languages, Sun, Moon } from 'lucide-react';
import { FaceRecognition } from './components/FaceRecognition';
import { PasswordList } from './components/PasswordList';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PasswordForm } from './components/PasswordForm';
import { LanguageSwitch } from './components/LanguageSwitch';
import { ResetPassword } from './pages/ResetPassword';
import { ConfirmEmail } from './pages/ConfirmEmail';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import type { Password } from './types';
import type { Language } from './utils/translations';

function App() {
  const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = React.useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const [language, setLanguage] = React.useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'es' || saved === 'en') ? saved : 'en';
  });

  React.useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  React.useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scarlet-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Routes>
        <Route 
          path="/" 
          element={
            user ? (
              <Dashboard 
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                language={language}
                setLanguage={setLanguage}
              />
            ) : (
              <Login 
                darkMode={darkMode} 
                setDarkMode={setDarkMode}
                language={language}
                setLanguage={setLanguage}
              />
            )
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <ResetPassword 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              language={language}
              setLanguage={setLanguage}
            />
          } 
        />
        <Route 
          path="/confirm-email" 
          element={
            <ConfirmEmail 
              darkMode={darkMode} 
              language={language}
            />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App