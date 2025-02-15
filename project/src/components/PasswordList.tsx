import React, { useState } from 'react';
import { Key, Edit, Trash2, Globe, Copy, Check, Eye, EyeOff } from 'lucide-react';
import type { Password } from '../types';

interface Props {
  passwords: Password[];
  onDelete: (id: string) => void;
  onEdit: (password: Password) => void;
  translations: any;
}

export const PasswordList: React.FC<Props> = ({ passwords, onDelete, onEdit, translations: t }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {passwords.map((password) => (
        <div
          key={password.id}
          className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-scarlet-100 rounded-lg">
                <Key className="w-5 h-5 text-scarlet-600" />
              </div>
              <h3 className="font-semibold text-gray-800">{password.title}</h3>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => copyToClipboard(password.password, password.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={t.copyToClipboard}
              >
                {copiedId === password.id ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => togglePasswordVisibility(password.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {visiblePasswords.has(password.id) ? (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-600" />
                )}
              </button>
              <button
                onClick={() => onEdit(password)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDelete(password.id)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-scarlet-600" />
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center justify-between">
              <span>{t.username}:</span>
              <span className="font-medium">{password.username}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>{t.password}:</span>
              <span className="font-mono">
                {visiblePasswords.has(password.id) 
                  ? password.password 
                  : '••••••••'}
              </span>
            </p>
            {password.website && (
              <p className="flex items-center space-x-2 mt-2 pt-2 border-t border-gray-100">
                <Globe className="w-4 h-4" />
                <a
                  href={password.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-scarlet-600 hover:underline truncate"
                >
                  {password.website}
                </a>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};