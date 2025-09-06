// Données centralisées pour tous les services

export const rooms = {
  domotique: [
    { value: 'chambre', label: 'Chambre' },
    { value: 'salon', label: 'Salon' },
    { value: 'cuisine', label: 'Cuisine' },
    { value: 'salle_de_bain', label: 'Salle de bain' },
    { value: 'toilette', label: 'Toilette' },
    { value: 'couloir', label: 'Couloir' },
    { value: 'cellier', label: 'Cellier' },
    { value: 'cave', label: 'Cave' },
    { value: 'exterieur', label: 'Extérieur' }
  ],
  installation: [
    { value: 'chambre', label: 'Chambre' },
    { value: 'salon', label: 'Salon' },
    { value: 'cuisine', label: 'Cuisine' },
    { value: 'salle_de_bain', label: 'Salle de bain' },
    { value: 'toilette', label: 'Toilette' },
    { value: 'couloir', label: 'Couloir' },
    { value: 'garage', label: 'Garage' },
    { value: 'cave', label: 'Cave' },
    { value: 'grenier', label: 'Grenier' },
    { value: 'exterieur', label: 'Extérieur' }
  ],
  portail: [], // Pas de pièces pour le portail
  securite: [] // Pas de pièces pour la sécurité
};

export const servicesByRoom = {
  domotique: {
    chambre: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    salon: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    cuisine: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' },
      { value: 'plaque_cuisson', label: 'Plaque cuisson connectée' },
      { value: 'four', label: 'Four connecté' },
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' },
      { value: 'applique', label: 'Applique connectée' }
    ],
    salle_de_bain: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'sèche serviette connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    toilette: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prise connectée/détecteur' },
      { value: 'applique_miroir', label: 'Applique/miroir connecté' }
    ],
    couloir: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' }
    ],
    cellier: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'chauffage', label: 'Chauffage connecté/centralisé' },
      { value: 'volets', label: 'Volets roulants connectés' },
      { value: 'internet', label: 'Prise internet' },
      { value: 'tv', label: 'Prise TV' },
      { value: 'lave_linge_vaisselle', label: 'Lave linge/vaisselle connecté' }
    ],
    cave: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prises de courant connectées/commandées' },
      { value: 'lave_linge_seche_linge', label: 'Lave-linge/sèche-linge connecté' }
    ],
    exterieur: [
      { value: 'eclairage', label: 'Éclairage connecté/détecteur' },
      { value: 'prises', label: 'Prise connectée/commandée' },
      { value: 'interphone', label: 'Interphone connecté' },
      { value: 'alarme_securite', label: 'Alarme sécurité connectée' },
      { value: 'camera', label: 'Caméra connectée' },
      { value: 'portail', label: 'Portail connecté' },
    ]
  },
  installation: {
    chambre: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' }
    ],
    salon: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' },
      { value: 'tv', label: 'Installation prises TV/Internet' }
    ],
    cuisine: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' },
      { value: 'plaque_cuisson', label: 'Installation plaque de cuisson' },
      { value: 'four', label: 'Installation four électrique' },
      { value: 'lave_linge', label: 'Installation lave-linge' },
      { value: 'vaisselle', label: 'Installation lave-vaisselle' }
    ],
    salle_de_bain: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' },
      { value: 'seche_serviette', label: 'Installation sèche-serviette' },
      { value: 'chauffe_eau', label: 'Installation chauffe-eau' }
    ],
    toilette: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' }
    ],
    couloir: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'detecteur', label: 'Installation détecteur de fumée' }
    ],
    garage: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'portail', label: 'Installation portail électrique' }
    ],
    cave: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'lave_linge', label: 'Installation lave-linge' },
      { value: 'seche_linge', label: 'Installation sèche-linge' }
    ],
    grenier: [
      { value: 'eclairage', label: 'Installation éclairage' },
      { value: 'prises', label: 'Installation prises de courant' },
      { value: 'interrupteurs', label: 'Installation interrupteurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' }
    ],
    exterieur: [
      { value: 'eclairage', label: 'Installation éclairage extérieur' },
      { value: 'prises', label: 'Installation prises extérieures' },
      { value: 'interrupteurs', label: 'Installation interrupteurs extérieurs' },
      { value: 'tableau', label: 'Connexion tableau électrique' },
      { value: 'portail', label: 'Installation portail électrique' },
      { value: 'volet', label: 'Installation volets roulants' }
    ]
  }
};

// Services spécifiques pour portail et sécurité (sans pièces)
export const specificServices = {
  portail: [
    { value: 'portail_coulissant', label: 'Portail coulissant' },
    { value: 'portail_battant', label: 'Portail battant' },
    { value: 'portail_sectionnel', label: 'Portail sectionnel' },
    { value: 'portail_basculant', label: 'Portail basculant' },
    { value: 'volet_roulant_exterieur', label: 'Volet roulant extérieur' },
    { value: 'volet_roulant_interieur', label: 'Volet roulant intérieur' },
    { value: 'volet_roulant_solaire', label: 'Volet roulant solaire' },
    { value: 'volet_roulant_thermique', label: 'Volet roulant thermique' },
    { value: 'porte_garage_sectionnelle', label: 'Porte de garage sectionnelle' },
    { value: 'porte_garage_basculante', label: 'Porte de garage basculante' },
    { value: 'porte_garage_enroulable', label: 'Porte de garage enroulable' },
    { value: 'motorisation_chaine', label: 'Motorisation à chaîne' },
    { value: 'motorisation_vis', label: 'Motorisation à vis' },
    { value: 'motorisation_cremaillere', label: 'Motorisation à crémaillère' },
    { value: 'telecommande_radio', label: 'Télécommande radio' },
    { value: 'telecommande_filaire', label: 'Télécommande filaire' },
    { value: 'detecteur_obstacle', label: 'Détecteur d\'obstacle' },
    { value: 'detecteur_photocellule', label: 'Photocellule de sécurité' },
    { value: 'centrale_commande', label: 'Centrale de commande' },
    { value: 'batterie_secours', label: 'Batterie de secours' },
    { value: 'installation_electrique', label: 'Installation électrique' },
    { value: 'maintenance_preventive', label: 'Maintenance préventive' }
  ],
  securite: [
    { value: 'alarme_intrusion', label: 'Alarme d\'intrusion' },
    { value: 'alarme_incendie', label: 'Alarme incendie' },
    { value: 'alarme_gaz', label: 'Détecteur de gaz' },
    { value: 'camera_exterieur', label: 'Caméras extérieures' },
    { value: 'camera_interieur', label: 'Caméras intérieures' },
    { value: 'camera_dome', label: 'Caméras dôme' },
    { value: 'camera_ptz', label: 'Caméras PTZ' },
    { value: 'interphone_video', label: 'Interphone vidéo' },
    { value: 'controle_acces', label: 'Contrôle d\'accès' },
    { value: 'badge_rfid', label: 'Badges RFID' },
    { value: 'serrure_connectee', label: 'Serrure connectée' },
    { value: 'detecteur_mouvement', label: 'Détecteurs de mouvement' },
    { value: 'detecteur_ouverture', label: 'Détecteurs d\'ouverture' },
    { value: 'centrale_alarme', label: 'Centrale d\'alarme' },
    { value: 'clavier_code', label: 'Clavier à code' },
    { value: 'telecommande', label: 'Télécommande' },
    { value: 'sirene', label: 'Sirène' },
    { value: 'transmetteur_telephonique', label: 'Transmetteur téléphonique' }
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
  portail: {
    title: 'Portail électrique / Volet roulant',
    categoryLabel: 'Portail / Volet'
  },
  securite: {
    title: 'Système de sécurité',
    categoryLabel: 'Sécurité'
  }
};
