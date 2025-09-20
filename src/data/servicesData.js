// Données centralisées pour tous les services

// Pièces communes pour domotique et installation
export const rooms = [
  { value: 'chambre', label: 'Chambre' },
  { value: 'salon', label: 'Salon' },
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'salle_de_bain', label: 'Salle de bain' },
  { value: 'toilette', label: 'Toilette' },
  { value: 'couloir', label: 'Couloir' },
  { value: 'cellier', label: 'Cellier' },
  { value: 'cave', label: 'Cave' },
  { value: 'garage', label: 'Garage' },
  { value: 'grenier', label: 'Grenier' },
  { value: 'exterieur', label: 'Extérieur' }
];

// Pièces spécifiques par service (pour les services qui n'ont pas de pièces)
export const roomsByService = {
  domotique: rooms.filter(room => !['garage', 'grenier'].includes(room.value)),
  installation: rooms,
  appareillage: rooms, // Changement d'appareillage électrique utilise les mêmes pièces
  portail: [], // Pas de pièces pour le portail
  securite: [] // Pas de pièces pour la sécurité
};

export const servicesByRoom = {
  domotique: {
    // Services communs à toutes les pièces
    commun: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'radiateur', label: 'Radiateur connecté/centralisé' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' },
      { value: 'tableau', label: 'Installation tableau électrique' }
    ],
    // Services spécifiques par pièce
    cuisine: [
      { value: 'plaque_cuisson', label: 'Plaque cuisson connectée' },
      { value: 'four', label: 'Four connecté' },
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' },
      { value: 'applique', label: 'Applique connectée' }
    ],
    salle_de_bain: [
      { value: 'radiateur', label: 'sèche serviette connecté/centralisé' },
      { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    toilette: [
    { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    cellier: [
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' }
    ],
    cave: [
      { value: 'lave_linge_seche_linge', label: 'Lave-linge/sèche-linge connecté' }
    ],
    exterieur: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prise connectée/commandée' },
      { value: 'interphone', label: 'Interphone connecté' },
      { value: 'alarme_securite', label: 'Alarme sécurité connectée' },
      { value: 'camera', label: 'Caméra connectée' },
      { value: 'portail', label: 'Portail connecté' }
    ]
  },
  installation: {
    // Services communs à toutes les pièces
    commun: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' },
      { value: 'tv', label: 'Installation prise TV' },
      { value: 'internet', label: 'Installation prise internet RJ45' },
      { value: 'radiateur', label: 'Installation radiateur' }
    ],
    // Services spécifiques par pièce
    cuisine: [
      { value: 'eclairage_applique', label: 'Installation éclairage applique' },
      { value: 'interrupteur_double', label: 'Installation interrupteur double' },
      { value: 'plaque_cuisson', label: 'Installation plaque de cuisson' },
      { value: 'four', label: 'Installation four électrique' },
      { value: 'lave_linge', label: 'Installation lave-linge' },
      { value: 'vaisselle', label: 'Installation lave-vaisselle' }
    ],
    salle_de_bain: [
      { value: 'eclairage_applique', label: 'Installation éclairage applique/miroir' },
      { value: 'interrupteur_double', label: 'Installation interrupteur double' },
      { value: 'seche_serviette', label: 'Installation sèche-serviette' },
      { value: 'chauffe_eau', label: 'Installation chauffe-eau' }
    ],
    couloir: [
      { value: 'detecteur', label: 'Installation détecteur de fumée' }
    ],
    cellier: [
      { value: 'lave_linge', label: 'Installation lave-linge' },
      { value: 'vaisselle', label: 'Installation lave-vaisselle' }
    ],
    cave: [
      { value: 'lave_linge', label: 'Installation lave-linge' },
      { value: 'seche_linge', label: 'Installation sèche-linge' }
    ],
    exterieur: [
      { value: 'eclairage', label: 'Installation éclairage extérieur' },
      { value: 'prises', label: 'Installation prises extérieures' },
      { value: 'interrupteurs', label: 'Installation interrupteurs extérieurs' }
    ]
  },
  appareillage: {
    // Services communs à toutes les pièces (sauf extérieur)
    commun: [
      { value: 'changement_prise', label: 'Changement de prise' },
      { value: 'changement_luminaire', label: 'Changement de luminaire' },
      { value: 'changement_alarme', label: 'Changement d\'alarme' },
      { value: 'changement_tableau', label: 'Changement de tableau' },
      { value: 'changement_interrupteur', label: 'Changement d\'interrupteur' },
      { value: 'changement_poussoir', label: 'Changement de poussoir' },
      { value: 'changement_interphone', label: 'Changement d\'interphone' }
    ],
    // Services spécifiques pour l'extérieur
    exterieur: [
      { value: 'changement_prise', label: 'Changement de prise extérieure' },
      { value: 'changement_luminaire', label: 'Changement de luminaire extérieur' },
      { value: 'changement_alarme', label: 'Changement d\'alarme extérieure' },
      { value: 'changement_tableau', label: 'Changement de tableau' },
      { value: 'changement_interrupteur', label: 'Changement d\'interrupteur extérieur' },
      { value: 'changement_poussoir', label: 'Changement de poussoir extérieur' },
      { value: 'changement_interphone', label: 'Changement d\'interphone extérieur' }
    ]
  }
};

// Catégories pour portail et volet
export const portailCategories = [
  { value: 'portail', label: 'Portail électrique' },
  { value: 'volet', label: 'Volet roulant' }
];

// Services par catégorie pour portail
export const servicesByPortailCategory = {
  portail: [
    { value: 'portail_coulissant', label: 'Portail coulissant' },
    { value: 'portail_battant', label: 'Portail battant' },
    { value: 'portail_battant_connecte', label: 'Portail battant connecté' },
    { value: 'portail_coulissant_connecte', label: 'Portail coulissant connecté' }
  ],
  volet: [
    { value: 'volet_roulant_petit', label: 'Volet roulant (petit - 1m sur 1m)' },
    { value: 'volet_roulant_moyen', label: 'Volet roulant (moyen - 2m sur 2m)' },
    { value: 'volet_roulant_grand', label: 'Volet roulant (grand - 3m sur 3m)' },
    { value: 'volet_roulant_extra', label: 'Volet roulant (extra - plus de 3m)' }
  ]
};

// Services spécifiques pour sécurité (sans pièces)
export const specificServices = {
  securite: [
    { value: 'alarme_intrusion', label: 'Alarme d\'intrusion' },
    { value: 'alarme_incendie', label: 'Alarme incendie' },
    { value: 'alarme_gaz', label: 'Détecteur de gaz' },
    { value: 'camera_exterieur', label: 'Caméras extérieures' },
    { value: 'camera_interieur', label: 'Caméras intérieures' },
    { value: 'controle_acces', label: 'Contrôle d\'accès' },
    { value: 'serrure_connectee', label: 'Serrure connectée' },
    { value: 'gash_electrique', label: 'Gash électrique' },
    { value: 'interphone', label: 'Interphone' },
    { value: 'interphone_video', label: 'Interphone vidéo' },
    { value: 'interphone_gash_electrique', label: 'Interphone + Gash électrique' }
  ]
};

// Configuration des titres pour chaque service
export const serviceConfig = {
  domotique: {
    title: 'Projet rénovation / installation neuf',
    categoryLabel: 'Domotique'
  },
  installation: {
    title: 'Installation électrique générale',
    categoryLabel: 'Installation'
  },
  appareillage: {
    title: 'Changement d\'appareillage électrique',
    categoryLabel: 'Appareillage'
  },
  portail: {
    title: 'Portail électrique / Volet roulant',
    categoryLabel: 'Portail / Volet'
  },
  securite: {
    title: 'Système de sécurité',
    categoryLabel: 'Sécurité'
  }
};
