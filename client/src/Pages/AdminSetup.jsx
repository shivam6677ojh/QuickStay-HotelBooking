import React, { useState } from 'react';
import apiClient from '../api/client';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AdminSetup = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (!isSignedIn) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg">Please sign in to access the admin setup page.</p>
      </div>
    );
  }

  const promote = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await apiClient.post('/admin/promote', { token });
      setMessage({ type: 'success', text: res.data?.message || 'Promoted to admin' });
      // Give a short delay then navigate to owner dashboard
      setTimeout(() => navigate('/owner'), 800);
    } catch (err) {
      const text = err?.response?.data?.message || err.message || 'Promotion failed';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Setup</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Use this page to promote the signed-in user to admin for initial setup. This requires a server-side secret token. Remove this page after setup.</p>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Promotion Token</label>
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter admin promotion token" className="w-full mb-4 p-2 border rounded bg-gray-50 dark:bg-gray-900" />

        <button onClick={promote} disabled={loading || !token} className="w-full py-2 rounded bg-indigo-600 text-white disabled:opacity-60">
          {loading ? 'Promoting...' : 'Promote to Admin'}
        </button>

        {message && (
          <div className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{message.text}</div>
        )}
      </div>
    </div>
  );
};

export default AdminSetup;
