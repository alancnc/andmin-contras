import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import type { Password } from '../types';

interface Props {
  onSave: (password: Password) => void;
  onCancel: () => void;
  initialData?: Password;
  mode: 'create' | 'edit';
  translations: any;
}

export const PasswordForm: React.FC<Props> = ({ onSave, onCancel, initialData, mode, translations: t }) => {
  const [formData, setFormData] = useState<Partial<Password>>(
    initialData || {
      title: '',
      username: '',
      password: '',
      website: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Date.now().toString(),
      title: formData.title || '',
      username: formData.username || '',
      password: formData.password || '',
      website: formData.website,
      createdAt: initialData?.createdAt || Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">
          {mode === 'create' ? t.addNewPassword : t.editPassword}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.title}</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.username}</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.password}</label>
          <input
            type="text"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">{t.website}</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-scarlet-500 focus:ring focus:ring-scarlet-200"
            placeholder="https://"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 bg-scarlet-600 text-white py-2 px-4 rounded-lg hover:bg-scarlet-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{mode === 'create' ? t.savePassword : t.updatePassword}</span>
        </button>
      </div>
    </form>
  );
};