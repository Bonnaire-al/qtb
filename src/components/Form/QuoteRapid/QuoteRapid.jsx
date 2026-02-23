import React, { useEffect, useMemo, useState } from 'react';
import ApiService from '../../../services/api';
import {
  RAPID_GAMMES,
  INSTALLATION_TYPES
} from './logic';

const Legend = () => (
  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
    <div className="text-xs text-gray-700">
      <div className="font-semibold text-gray-900 mb-1">Légende</div>
      <div><span className="font-semibold">Classic</span> : le minimum de prises et points d'éclairage</div>
      <div><span className="font-semibold">Premium</span> : Ajout de prises et de points d'éclairage </div>
      <div><span className="font-semibold">Luxe</span> : Appareillages haut de gamme</div>
    </div>
  </div>
);

const RadioPills = ({ name, value, onChange }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {RAPID_GAMMES.map((g) => (
      <label
        key={g.value}
        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
          value === g.value ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-cyan-800 border-cyan-200 hover:bg-cyan-50'
        }`}
      >
        <input
          className="sr-only"
          type="radio"
          name={name}
          value={g.value}
          checked={value === g.value}
          onChange={() => onChange(g.value)}
        />
        {g.label}
      </label>
    ))}
  </div>
);

export default function QuoteRapid({ onGenerate, onBack }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [pieces, setPieces] = useState([]); // [{value,label}]
  const [securityServices, setSecurityServices] = useState([]); // [{value,label}]
  const [portailServices, setPortailServices] = useState([]); // [{value,label}]
  const [voletServices, setVoletServices] = useState([]); // [{value,label}]

  const [selectedPieces, setSelectedPieces] = useState({}); // pieceValue -> bool
  const [pieceGammes, setPieceGammes] = useState({}); // pieceValue -> gamme
  const [installationType, setInstallationType] = useState('');

  const [securityQtyByValue, setSecurityQtyByValue] = useState({}); // service_value -> qty
  const [portailQtyByValue, setPortailQtyByValue] = useState({}); // service_value -> qty
  const [voletQtyByValue, setVoletQtyByValue] = useState({}); // service_value -> qty

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError('');

        const [installationStructure, securiteStructure, portailStructure] = await Promise.all([
          ApiService.getFormStructure('installation'),
          ApiService.getFormStructure('securite'),
          ApiService.getFormStructure('portail')
        ]);

        if (cancelled) return;

        setPieces(installationStructure?.pieces || []);

        setSecurityServices(securiteStructure?.servicesByRoom?.specific || []);
        setPortailServices(portailStructure?.servicesByRoom?.portail || []);
        setVoletServices(portailStructure?.servicesByRoom?.volet || []);
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || 'Erreur lors du chargement du devis rapide');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const allPieces = useMemo(() => (pieces || []), [pieces]);

  const togglePiece = (pieceValue) => {
    setSelectedPieces(prev => {
      const isChecked = !!prev[pieceValue];
      const next = { ...prev };
      if (isChecked) {
        delete next[pieceValue];
        // supprimer la gamme associée
        setPieceGammes(gPrev => {
          const gNext = { ...gPrev };
          delete gNext[pieceValue];
          return gNext;
        });
      } else {
        next[pieceValue] = true;
      }
      return next;
    });
  };

  const handleGenerate = () => {
    try {
      setError('');

      if (!installationType) {
        setError('Veuillez sélectionner le passage des câbles.');
        return;
      }

      const securitySelections = (securityServices || [])
        .map(s => ({ label: s.label, quantity: parseInt(securityQtyByValue[s.value], 10) || 0 }))
        .filter(s => s.quantity > 0);

      const portailSelections = (portailServices || [])
        .map(s => ({ label: s.label, quantity: parseInt(portailQtyByValue[s.value], 10) || 0 }))
        .filter(s => s.quantity > 0);

      const voletSelections = (voletServices || [])
        .map(s => ({ label: s.label, quantity: parseInt(voletQtyByValue[s.value], 10) || 0 }))
        .filter(s => s.quantity > 0);

      const hasAnyPiece = Object.keys(pieceGammes || {}).length > 0;
      const hasAnyOther = securitySelections.length > 0 || portailSelections.length > 0 || voletSelections.length > 0;
      if (!hasAnyPiece && !hasAnyOther) {
        setError('Veuillez sélectionner au moins une pièce, ou une quantité pour sécurité/portail/volet.');
        return;
      }

      // Préparation côté backend (expand packs -> prestations + tableau obligatoire)
      ApiService.prepareRapidDevis({
        installationType,
        pieceGammes,
        securitySelections,
        portailSelections,
        voletSelections
      })
        .then((result) => {
          const items = result?.devisItems || [];
          if (!items.length) {
            setError('Impossible de préparer le devis (packs vides ?).');
            return;
          }
          onGenerate(items);
        })
        .catch((e) => {
          setError(e?.message || 'Impossible de générer le devis');
        });
    } catch (e) {
      setError(e?.message || 'Impossible de générer le devis');
    }
  };

  if (isLoading) {
    return (
      <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-600">Chargement du devis rapide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto max-w-md mx-auto px-8">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-cyan-800">Devis rapide</h2>
        <p className="text-xs text-gray-600 mt-1">Sélectionnez les pièces + la gamme, puis le passage des câbles.</p>
      </div>

      <Legend />

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Section pièces */}
      <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">PIÈCES</h3>
      <div className="space-y-3">
        {allPieces.map((p) => {
          const checked = !!selectedPieces[p.value];
          return (
            <div key={p.value} className="border border-gray-200 rounded-lg p-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-gray-800">{p.label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePiece(p.value)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
              </label>

              {checked && (
                <RadioPills
                  name={`gamme-${p.value}`}
                  value={pieceGammes[p.value] || ''}
                  onChange={(v) => setPieceGammes(prev => ({ ...prev, [p.value]: v }))}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Sécurité */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">SÉCURITÉ</h3>
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          {(securityServices || []).length === 0 ? (
            <p className="text-xs text-gray-500">Aucune prestation sécurité trouvée en base.</p>
          ) : (
            (securityServices || []).map((s) => (
              <div key={s.value} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-800">{s.label}</span>
                <input
                  type="number"
                  min="0"
                  value={securityQtyByValue[s.value] ?? 0}
                  onChange={(e) => setSecurityQtyByValue(prev => ({ ...prev, [s.value]: e.target.value }))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
            ))
          )}
          <p className="text-xs text-gray-500 mt-2">Quantité à 0 = non inclus.</p>
        </div>
      </div>

      {/* Portail */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">PORTAIL</h3>
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          {(portailServices || []).length === 0 ? (
            <p className="text-xs text-gray-500">Aucune prestation portail trouvée en base.</p>
          ) : (
            (portailServices || []).map((s) => (
              <div key={s.value} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-800">{s.label}</span>
                <input
                  type="number"
                  min="0"
                  value={portailQtyByValue[s.value] ?? 0}
                  onChange={(e) => setPortailQtyByValue(prev => ({ ...prev, [s.value]: e.target.value }))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
            ))
          )}
          <p className="text-xs text-gray-500 mt-2">Quantité à 0 = non inclus.</p>
        </div>
      </div>

      {/* Volet roulant */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">VOLET ROULANT</h3>
        <div className="border border-gray-200 rounded-lg p-3 space-y-2">
          {(voletServices || []).length === 0 ? (
            <p className="text-xs text-gray-500">Aucune prestation volet trouvée en base.</p>
          ) : (
            (voletServices || []).map((s) => (
              <div key={s.value} className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-800">{s.label}</span>
                <input
                  type="number"
                  min="0"
                  value={voletQtyByValue[s.value] ?? 0}
                  onChange={(e) => setVoletQtyByValue(prev => ({ ...prev, [s.value]: e.target.value }))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
              </div>
            ))
          )}
          <p className="text-xs text-gray-500 mt-2">Quantité à 0 = non inclus.</p>
        </div>
      </div>

      {/* Passage des câbles */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-2 tracking-wide">PASSAGE DES CÂBLES</h3>
        <div className="border border-gray-200 rounded-lg p-3">
          <select
            value={installationType}
            onChange={(e) => setInstallationType(e.target.value)}
            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
          >
            <option value="">Choisissez le type d'installation</option>
            {INSTALLATION_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Ce choix applique automatiquement le coefficient de main d’œuvre et sélectionne les matériels associés au type.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={!installationType}
          className={`font-semibold py-2 px-6 rounded-lg transition-colors text-sm ${
            installationType
              ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Générer devis
        </button>
      </div>
    </div>
  );
}

