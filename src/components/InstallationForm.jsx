import React, { useState } from 'react';

export default function InstallationForm1({ onClose }) {
  const [details, setDetails] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Détaillez votre projet d'installation (rénovation globale / neuf) *</label>
        <textarea
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          rows={4}
          required
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Ex : installation complète, rénovation, mise aux normes, etc."
        />
      </div>
      <div className="text-center">
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">Valider</button>
      </div>
    </form>
  );
} 