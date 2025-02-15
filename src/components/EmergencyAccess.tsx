import React, { useState } from 'react';
import { UserPlus, Clock, Shield, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmergencyContact {
  id: string;
  email: string;
  status: 'pending' | 'active';
  waiting_period_days: number;
  created_at: string;
}

interface Props {
  userId: string;
  darkMode: boolean;
  translations: any;
}

export const EmergencyAccess: React.FC<Props> = ({ userId, darkMode, translations: t }) => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [email, setEmail] = useState('');
  const [waitingPeriod, setWaitingPeriod] = useState(14);
  const [error, setError] = useState('');

  const addEmergencyContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: userId,
          email,
          waiting_period_days: waitingPeriod,
          status: 'pending'
        }]);

      if (insertError) throw insertError;

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-emergency-invite', {
        body: { email, userId }
      });

      if (emailError) throw emailError;

      setEmail('');
      loadContacts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setContacts(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg`}>
      <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {t.emergencyAccess}
      </h2>

      <form onSubmit={addEmergencyContact} className="mb-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.contactEmail}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              } shadow-sm focus:ring focus:ring-scarlet-200`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {t.waitingPeriod}
            </label>
            <select
              value={waitingPeriod}
              onChange={(e) => setWaitingPeriod(Number(e.target.value))}
              className={`mt-1 block w-full rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'border-gray-300'
              } shadow-sm focus:ring focus:ring-scarlet-200`}
            >
              <option value={7}>7 {t.days}</option>
              <option value={14}>14 {t.days}</option>
              <option value={30}>30 {t.days}</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className={`w-full flex items-center justify-center space-x-2 ${
                darkMode 
                  ? 'bg-scarlet-500 hover:bg-scarlet-600' 
                  : 'bg-scarlet-600 hover:bg-scarlet-700'
              } text-white px-4 py-2 rounded-lg transition-colors`}
            >
              <UserPlus className="w-5 h-5" />
              <span>{t.addContact}</span>
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            } p-4 rounded-lg flex items-center justify-between`}
          >
            <div className="flex items-center space-x-4">
              <Shield className={`w-6 h-6 ${
                contact.status === 'active' ? 'text-green-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {contact.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {contact.waiting_period_days} {t.daysWaitingPeriod}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  const { error } = await supabase
                    .from('emergency_contacts')
                    .delete()
                    .eq('id', contact.id)
                    .eq('user_id', userId);
                  
                  if (error) throw error;
                  loadContacts();
                } catch (err: any) {
                  setError(err.message);
                }
              }}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};