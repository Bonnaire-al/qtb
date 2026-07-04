import React from 'react';
import { TableauFieldLabel } from './TableauFieldTooltip';

export function isTableauQuestionnairePart1Valid(questionnaire) {
  const triphaseOk =
    questionnaire.nombrePhase === 'triphaser'
      ? questionnaire.appareilTriphase !== ''
      : true;

  return (
    questionnaire.nombrePhase &&
    triphaseOk &&
    questionnaire.nombreRangees &&
    questionnaire.nombreDisjoncteurs !== ''
  );
}

export function isTableauQuestionnaireValid(questionnaire) {
  return isTableauQuestionnairePart1Valid(questionnaire);
}

export const EMPTY_QUESTIONNAIRE = {
  nombrePhase: '',
  appareilTriphase: '',
  nombreRangees: '',
  nombreDifferentiels: '',
  nombreDisjoncteurs: '',
  lignesSpeciales: [],
  radiateurElectrique: '',
  telerupteur: false
};

export default function TableauQuestionnaireFields({
  questionnaire,
  onChange,
  onLigneSpecialeToggle,
  section = 'all'
}) {
  const Label = TableauFieldLabel;
  const showPart1 = section === 'all' || section === 'part1';
  const showPart2 = section === 'all' || section === 'part2';

  return (
    <div className="space-y-6">
      {showPart1 && (
        <>
      <div>
        <Label field="nombrePhase">Nombre de phase ?</Label>
        <div className="flex gap-4">
          {[
            { value: 'monophaser', label: 'Monophasé' },
            { value: 'triphaser', label: 'Triphasé' }
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex-1"
            >
              <input
                type="radio"
                name="nombrePhase"
                value={opt.value}
                checked={questionnaire.nombrePhase === opt.value}
                onChange={(e) => {
                  const value = e.target.value;
                  onChange('nombrePhase', value);
                  if (value === 'monophaser') {
                    onChange('appareilTriphase', '');
                  }
                }}
                className="w-4 h-4 text-cyan-600"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {questionnaire.nombrePhase === 'triphaser' && (
        <div>
          <Label field="appareilTriphase">Appareil triphasé ?</Label>
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((num) => (
              <label
                key={num}
                className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  questionnaire.appareilTriphase === num.toString()
                    ? 'border-cyan-600 bg-cyan-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="appareilTriphase"
                  value={num}
                  checked={questionnaire.appareilTriphase === num.toString()}
                  onChange={(e) => onChange('appareilTriphase', e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                />
                <span className="ml-2">{num}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label field="nombreRangees">Nombre de rangées ?</Label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => (
            <label
              key={num}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                questionnaire.nombreRangees === num.toString()
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="nombreRangees"
                value={num}
                checked={questionnaire.nombreRangees === num.toString()}
                onChange={(e) => onChange('nombreRangees', e.target.value)}
                className="w-4 h-4 text-cyan-600"
              />
              <span className="ml-2">{num}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label field="nombreDisjoncteurs">Nombre de disjoncteur/porte fusible ?</Label>
        <input
          type="number"
          min="0"
          value={questionnaire.nombreDisjoncteurs}
          onChange={(e) => onChange('nombreDisjoncteurs', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Saisir le nombre"
        />
      </div>
        </>
      )}

      {showPart2 && (
        <>
      <div>
        <Label field="lignesSpeciales">Ligne spéciale ?</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'plaque_cuisson', label: 'Plaque de cuisson' },
            { key: 'lave_vaisselle', label: 'Lave vaisselle' },
            { key: 'machine_laver', label: 'Machine à laver' },
            { key: 'chauffeau', label: 'Chauffeau' }
          ].map(({ key, label }) => (
            <label
              key={key}
              className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                questionnaire.lignesSpeciales.includes(key)
                  ? 'border-cyan-600 bg-cyan-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={questionnaire.lignesSpeciales.includes(key)}
                onChange={() => onLigneSpecialeToggle(key)}
                className="w-4 h-4 text-cyan-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label field="radiateurElectrique">Nombre de radiateurs électriques</Label>
        <input
          type="number"
          min="0"
          value={questionnaire.radiateurElectrique}
          onChange={(e) => onChange('radiateurElectrique', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Saisir le nombre (0 si aucun)"
        />
      </div>
        </>
      )}
    </div>
  );
}
