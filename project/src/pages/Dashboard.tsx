import React, { useState, useEffect } from 'react';
import { Lock, Plus, LogOut, Key, Languages, Sun, Moon } from 'lucide-react';
import { PasswordList } from '../components/PasswordList';
import { PasswordGenerator } from '../components/PasswordGenerator';
import { PasswordForm } from '../components/PasswordForm';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { useAuth } from '../hooks/useAuth';
import type { Password } from '../types';
import type { Language } from '../utils/translations';
import { translations } from '../utils/translations';
import { supabase } from '../lib/supabase';
import { encrypt, decrypt } from '../utils/encryption';

interface Props {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

export const Dashboard: React.FC<Props> = ({ darkMode, setDarkMode, language, setLanguage }) => {
  const { user, signOut } = useAuth();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [error, setError] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);
  const t = translations[language];

  useEffect(() => {
    if (user) {
      loadPasswords();
    }
  }, [user]);

  const loadPasswords = async () => {
    try {
      if (!user) {
        setPasswords([]);
        return;
      }

      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userEncryptionKey = `${user.id}-${user.email}`;
      const decrypted = data.map((p: any) => ({
        ...p,
        password: decrypt(p.encrypted_password, userEncryptionKey),
      }));

      setPasswords(decrypted);
      setError('');
    } catch (error: any) {
      console.error('Error loading passwords:', error);
      setError(error.message);
    }
  };

  const savePassword = async (passwordData: Password) => {
    try {
      if (!user) {
        throw new Error('User must be authenticated');
      }

      const userEncryptionKey = `${user.id}-${user.email}`;
      
      const encrypted = {
        title: passwordData.title.trim(),
        username: passwordData.username.trim(),
        encrypted_password: encrypt(passwordData.password.trim(), userEncryptionKey),
        website: passwordData.website?.trim(),
        user_id: user.id,
      };

      if (editingPassword) {
        const { error } = await supabase
          .from('passwords')
          .update(encrypted)
          .eq('id', editingPassword.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('passwords')
          .insert([encrypted]);
        
        if (error) throw error;
      }

      await loadPasswords();
      setShowPasswordForm(false);
      setShowGenerator(false);
      setEditingPassword(null);
      setError('');
    } catch (error: any) {
      console.error('Error saving password:', error);
      setError(error.message);
    }
  };

  return (
    <>
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-scarlet-100'} rounded-lg`}>
              <Key className={`w-6 h-6 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'}`} />
            </div>
            <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {t.passwordManager}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
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
            <button
              onClick={() => {
                setShowPasswordForm(true);
                setShowGenerator(false);
                setEditingPassword(null);
              }}
              className={`flex items-center space-x-2 ${
                darkMode 
                  ? 'bg-scarlet-500 hover:bg-scarlet-600' 
                  : 'bg-scarlet-600 hover:bg-scarlet-700'
              } text-white px-4 py-2 rounded-lg transition-colors`}
            >
              <Plus className="w-5 h-5" />
              <span>{t.newPassword}</span>
            </button>
            <button
              onClick={signOut}
              className={`flex items-center space-x-1 ${
                darkMode ? 'text-gray-400 hover:text-scarlet-400' : 'text-gray-600 hover:text-scarlet-600'
              } transition-colors`}
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
              darkMode={darkMode}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className={`${
                  darkMode ? 'text-scarlet-400' : 'text-scarlet-600'
                } hover:opacity-80 transition-opacity`}
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
              darkMode={darkMode}
            />
          </div>
        )}

        <PasswordList
          passwords={passwords}
          onDelete={async (id) => {
            try {
              const { error } = await supabase
                .from('passwords')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);
              if (error) throw error;
              await loadPasswords();
            } catch (error: any) {
              console.error('Error deleting password:', error);
              setError(error.message);
            }
          }}
          onEdit={(password) => {
            setEditingPassword(password);
            setShowPasswordForm(true);
            setShowGenerator(false);
          }}
          translations={t}
          darkMode={darkMode}
        />
      </main>
    </>
  );
};