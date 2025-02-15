import React, { useState, useRef } from 'react';
import { File, Upload, X, Eye, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { encrypt, decrypt } from '../utils/encryption';

interface SecureDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  encrypted_data: string;
  created_at: string;
}

interface Props {
  userId: string;
  darkMode: boolean;
  translations: any;
}

export const DocumentVault: React.FC<Props> = ({ userId, darkMode, translations: t }) => {
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        const encryptedData = encrypt(data, userId);

        const { error: uploadError } = await supabase
          .from('documents')
          .insert([{
            user_id: userId,
            name: file.name,
            type: file.type,
            size: file.size,
            encrypted_data: encryptedData
          }]);

        if (uploadError) throw uploadError;
        
        // Refresh documents list
        loadDocuments();
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setDocuments(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const downloadDocument = async (document: SecureDocument) => {
    try {
      const decryptedData = decrypt(document.encrypted_data, userId);
      const link = document.createElement('a');
      link.href = decryptedData;
      link.download = document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {t.documents}
        </h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center space-x-2 ${
            darkMode 
              ? 'bg-scarlet-500 hover:bg-scarlet-600' 
              : 'bg-scarlet-600 hover:bg-scarlet-700'
          } text-white px-4 py-2 rounded-lg transition-colors`}
          disabled={uploading}
        >
          <Upload className="w-5 h-5" />
          <span>{uploading ? t.uploading : t.uploadDocument}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.txt,.png,.jpg,.jpeg"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } p-4 rounded-lg flex items-start justify-between`}
          >
            <div className="flex items-center space-x-3">
              <File className={`w-8 h-8 ${darkMode ? 'text-scarlet-400' : 'text-scarlet-600'}`} />
              <div>
                <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {doc.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {(doc.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadDocument(doc)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title={t.download}
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from('documents')
                    .delete()
                    .eq('id', doc.id)
                    .eq('user_id', userId);
                  
                  if (error) setError(error.message);
                  else loadDocuments();
                }}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title={t.delete}
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};