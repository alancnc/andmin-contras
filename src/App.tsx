import React, { useState, useEffect } from 'react';
import { Lock, Plus, LogOut, Key, Languages } from 'lucide-react';
import { FaceRecognition } from './components/FaceRecognition';
import { PasswordList } from './components/PasswordList';
import { PasswordGenerator } from './components/PasswordGenerator';
import { PasswordForm } from './components/PasswordForm';
import { LanguageSwitch } from './components/LanguageSwitch';
import type { Password, User } from './types';
import { encrypt, decrypt } from './utils/encryption';
import type { Language } from './utils/translations';
import { translations } from './utils/translations';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [useFaceId, setUseFaceId] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'es' || saved === 'en') ? saved : 'en';
  });

  const t = translations[language];

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      setIsRegistering(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      if (user.username === username && user.password === password) {
        setIsAuthenticated(true);
        loadPasswords();
      } else {
        setError(t.invalidCredentials);
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user: User = { username, password };
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
    setIsRegistering(false);
  };

  const handleFaceLogin = (faceDescriptor: Float32Array) => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      if (user.faceDescriptor) {
        setIsAuthenticated(true);
        loadPasswords();
      }
    }
  };

  const loadPasswords = () => {
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      const decrypted = JSON.parse(storedPasswords).map((p: Password) => ({
        ...p,
        password: decrypt(p.password),
      }));
      setPasswords(decrypted);
    }
  };

  const savePassword = (passwordData: Password) => {
    const encrypted = {
      ...passwordData,
      password: encrypt(passwordData.password),
    };

    let updated;
    if (editingPassword) {
      updated = passwords.map((p) => 
        p.id === editingPassword.id ? encrypted : p
      );
    } else {
      updated = [...passwords, encrypted];
    }

    localStorage.setItem('passwords', JSON.stringify(updated));
    loadPasswords();
    setShowPasswordForm(false);
    setShowGenerator(false);
    setEditingPassword(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setPasswords([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-scarlet-500 to-scarlet-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-scarlet-500 to-scarlet-800 animate-gradient"></div>
          <div className="absolute inset-0 opacity-50">
            <div className="absolute w-96 h-96 -top-48 -left-48 bg-scarlet-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-scarlet-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute w-96 h-96 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-scarlet-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="p-4 bg-scarlet-100 rounded-full">
                <Lock className="w-12 h-12 text-scarlet-600" />
              </div>
              <LanguageSwitch
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6">
              {isRegistering ? t.createAccount : t.welcomeBack}
            </h1>
            
            {useFaceId ? (
              <div className="space-y-4">
                <FaceRecognition
                  onFaceDetected={handleFaceLogin}
                  onError={setError}
                />
                <button
                  onClick={() => setUseFaceId(false)}
                  className="w-full py-2 text-scarlet-600 hover:text-scarlet-700 transition-colors"
                >
                  {t.usePassword}
                </button>
              </div>
            ) : (
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.username}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t.password}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-scarlet-600 text-white py-3 px-4 rounded-lg hover:bg-scarlet-700 transition-colors"
                >
                  {isRegistering ? t.register : t.login}
                </button>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => setUseFaceId(true)}
                    className="w-full py-2 text-scarlet-600 hover:text-scarlet-700 transition-colors"
                  >
                    {t.useFaceId}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-scarlet-100 rounded-lg">
              <Key className="w-6 h-6 text-scarlet-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{t.passwordManager}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitch
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setShowGenerator(false);
                setEditingPassword(null);
              }}
              className="flex items-center space-x-2 bg-scarlet-600 text-white px-4 py-2 rounded-lg hover:bg-scarlet-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>{t.newPassword}</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-scarlet-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPasswordForm && (
          <div className="mb-8">
            <PasswordForm
              mode={editingPassword ? 'edit' : 'create'}
              initialData={editingPassword || undefined}
              onSave={savePassword}
              onCancel={() => {
                setShowPasswordForm(false);
                setEditingPassword(null);
              }}
              translations={t}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className="text-scarlet-600 hover:text-scarlet-700 transition-colors"
              >
                {showGenerator ? t.hidePasswordGenerator : t.needStrongPassword}
              </button>
            </div>
          </div>
        )}

        {showGenerator && (
          <div className="mb-8">
            <PasswordGenerator
              onGenerate={(generatedPassword) => {
                if (editingPassword) {
                  setEditingPassword({
                    ...editingPassword,
                    password: generatedPassword,
                  });
                } else {
                  const newPassword: Password = {
                    id: Date.now().toString(),
                    title: '',
                    username: '',
                    password: generatedPassword,
                    createdAt: Date.now(),
                  };
                  setShowPasswordForm(true);
                  setEditingPassword(newPassword);
                }
              }}
              translations={t}
            />
          </div>
        )}

        <PasswordList
          passwords={passwords}
          onDelete={(id) => {
            const updated = passwords.filter((p) => p.id !== id);
            localStorage.setItem('passwords', JSON.stringify(updated));
            setPasswords(updated);
          }}
          onEdit={(password) => {
            setEditingPassword(password);
            setShowPasswordForm(true);
            setShowGenerator(false);
          }}
          translations={t}
        />
      </main>
    </div>
  );
}

export default App;