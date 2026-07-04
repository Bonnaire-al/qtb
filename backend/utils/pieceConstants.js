/** Pièces retirées du catalogue (obsolètes) */
const EXCLUDED_PIECE_VALUES = ['exterieur'];

const INSTALLATION_PIECE_VALUES = [
  'chambre', 'salon', 'cuisine', 'salle_de_bain', 'toilette', 'couloir', 'escalier',
  'cellier', 'cave', 'garage', 'grenier', 'jardin', 'terrasse', 'veranda'
].filter((p) => !EXCLUDED_PIECE_VALUES.includes(p));

const PIECES_LABELS = {
  chambre: 'Chambre',
  salon: 'Salon',
  cuisine: 'Cuisine',
  salle_de_bain: 'Salle de bain',
  toilette: 'Toilette',
  couloir: 'Couloir',
  escalier: 'Escalier',
  cellier: 'Cellier',
  cave: 'Cave',
  garage: 'Garage',
  grenier: 'Grenier',
  jardin: 'Jardin',
  terrasse: 'Terrasse',
  veranda: 'Véranda',
  portail: 'Portail électrique',
  volet: 'Volet roulant',
  securite: 'Sécurité'
};

function isExcludedPiece(piece) {
  return EXCLUDED_PIECE_VALUES.includes(piece);
}

module.exports = {
  EXCLUDED_PIECE_VALUES,
  INSTALLATION_PIECE_VALUES,
  PIECES_LABELS,
  isExcludedPiece
};
