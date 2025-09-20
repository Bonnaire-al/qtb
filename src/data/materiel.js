// Données de matériel pour les prestations

export const materielPrestations = {
  domotique: {
    // Matériel commun à toutes les pièces
    commun: {
      eclairage: [
        { nom: "Interrupteur connecté", quantite: 1, prixHT: 25.00 },
        { nom: "Ampoule LED connectée", quantite: 2, prixHT: 15.00 },
        { nom: "Détecteur de présence", quantite: 1, prixHT: 35.00 }
      ],
      prises: [
        { nom: "Prise connectée", quantite: 2, prixHT: 20.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 30.00 }
      ],
      chauffage: [
        { nom: "Thermostat connecté", quantite: 1, prixHT: 80.00 },
        { nom: "Vanne motorisée", quantite: 1, prixHT: 45.00 }
      ],
      volets: [
        { nom: "Moteur volet roulant", quantite: 1, prixHT: 60.00 },
        { nom: "Télécommande", quantite: 1, prixHT: 25.00 }
      ],
      internet: [
        { nom: "Prise RJ45", quantite: 1, prixHT: 15.00 },
        { nom: "Câble réseau", quantite: 5, prixHT: 2.00 }
      ],
      tv: [
        { nom: "Prise TV", quantite: 1, prixHT: 20.00 },
        { nom: "Câble coaxial", quantite: 3, prixHT: 3.00 }
      ],
      tableau: [
        { nom: "Tableau électrique connecté", quantite: 1, prixHT: 60.00 },
        { nom: "Disjoncteurs connectés", quantite: 4, prixHT: 15.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ]
    },
    // Matériel spécifique par pièce
    cuisine: {
      plaque_cuisson: [
        { nom: "Plaque de cuisson connectée", quantite: 1, prixHT: 120.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 30.00 }
      ],
      four: [
        { nom: "Four connecté", quantite: 1, prixHT: 60.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ],
      lave_linge_vaisselle: [
        { nom: "Lave-linge connecté", quantite: 1, prixHT: 80.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ],
      applique: [
        { nom: "Applique connectée", quantite: 1, prixHT: 30.00 },
        { nom: "Ampoule LED", quantite: 2, prixHT: 10.00 }
      ]
    },
    salle_de_bain: {
      chauffage: [
        { nom: "Sèche-serviette connecté", quantite: 1, prixHT: 80.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ],
      applique_miroir: [
        { nom: "Applique miroir connectée", quantite: 1, prixHT: 50.00 },
        { nom: "Ampoule LED", quantite: 2, prixHT: 10.00 }
      ]
    },
    toilette: {
      applique_miroir: [
        { nom: "Applique miroir connectée", quantite: 1, prixHT: 40.00 },
        { nom: "Ampoule LED", quantite: 1, prixHT: 10.00 }
      ]
    },
    couloir: {
      // Aucun matériel spécifique - utilise le matériel commun
    },
    cellier: {
      lave_linge_vaisselle: [
        { nom: "Lave-linge connecté", quantite: 1, prixHT: 80.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ]
    },
    cave: {
      eclairage: [
        { nom: "Interrupteur connecté", quantite: 1, prixHT: 25.00 },
        { nom: "Ampoule LED connectée", quantite: 1, prixHT: 15.00 }
      ],
      prises: [
        { nom: "Prise connectée", quantite: 2, prixHT: 20.00 }
      ],
      lave_linge_seche_linge: [
        { nom: "Lave-linge connecté", quantite: 1, prixHT: 80.00 },
        { nom: "Sèche-linge connecté", quantite: 1, prixHT: 100.00 },
        { nom: "Module de commande", quantite: 2, prixHT: 20.00 }
      ]
    },
    exterieur: {
      eclairage: [
        { nom: "Éclairage extérieur connecté", quantite: 2, prixHT: 40.00 },
        { nom: "Détecteur de présence", quantite: 1, prixHT: 35.00 }
      ],
      prises: [
        { nom: "Prise extérieure connectée", quantite: 1, prixHT: 30.00 }
      ],
      interphone: [
        { nom: "Interphone vidéo", quantite: 1, prixHT: 180.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
      ],
      alarme_securite: [
        { nom: "Centrale d'alarme", quantite: 1, prixHT: 120.00 },
        { nom: "Détecteurs", quantite: 4, prixHT: 25.00 },
        { nom: "Sirène", quantite: 1, prixHT: 50.00 }
      ],
      camera: [
        { nom: "Caméra connectée", quantite: 2, prixHT: 80.00 },
        { nom: "Module de commande", quantite: 1, prixHT: 30.00 }
      ],
      portail: [
        { nom: "Moteur portail", quantite: 1, prixHT: 200.00 },
        { nom: "Télécommande", quantite: 2, prixHT: 25.00 }
      ]
    }
  },
  installation: {
    // Matériel commun à toutes les pièces
    commun: {
      eclairage: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Ampoule LED", quantite: 2, prixHT: 12.00 },
        { nom: "Gaine électrique", quantite: 5, prixHT: 2.00 }
      ],
      prises: [
        { nom: "Prise de courant", quantite: 3, prixHT: 6.00 },
        { nom: "Boîte d'encastrement", quantite: 3, prixHT: 3.00 }
      ],
      interrupteurs: [
        { nom: "Interrupteur", quantite: 2, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 2, prixHT: 3.00 }
      ],
      tableau: [
        { nom: "Disjoncteur", quantite: 3, prixHT: 15.00 },
        { nom: "Câble électrique", quantite: 10, prixHT: 3.00 }
      ],
      detecteur: [
        { nom: "Détecteur de fumée", quantite: 1, prixHT: 25.00 }
      ]
    },
    // Matériel spécifique par pièce
    salon: {
      tv: [
        { nom: "Prise TV", quantite: 2, prixHT: 12.00 },
        { nom: "Câble coaxial", quantite: 5, prixHT: 3.00 }
      ]
    },
    cuisine: {
      plaque_cuisson: [
        { nom: "Plaque de cuisson", quantite: 1, prixHT: 60.00 },
        { nom: "Câble spécialisé", quantite: 3, prixHT: 8.00 }
      ],
      four: [
        { nom: "Four électrique", quantite: 1, prixHT: 45.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ],
      lave_linge: [
        { nom: "Lave-linge", quantite: 1, prixHT: 35.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ],
      vaisselle: [
        { nom: "Lave-vaisselle", quantite: 1, prixHT: 35.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ]
    },
    salle_de_bain: {
      seche_serviette: [
        { nom: "Sèche-serviette", quantite: 1, prixHT: 50.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ],
      chauffe_eau: [
        { nom: "Chauffe-eau", quantite: 1, prixHT: 60.00 },
        { nom: "Câble spécialisé", quantite: 3, prixHT: 8.00 }
      ]
    },
    toilette: {
      // Aucun matériel spécifique - utilise le matériel commun
    },
    couloir: {
      detecteur: [
        { nom: "Détecteur de fumée", quantite: 1, prixHT: 25.00 }
      ]
    },
    garage: {
      eclairage: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Ampoule LED", quantite: 2, prixHT: 12.00 },
        { nom: "Gaine électrique", quantite: 5, prixHT: 2.00 }
      ],
      prises: [
        { nom: "Prise de courant", quantite: 2, prixHT: 6.00 },
        { nom: "Boîte d'encastrement", quantite: 2, prixHT: 3.00 }
      ],
      interrupteurs: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      tableau: [
        { nom: "Disjoncteur", quantite: 3, prixHT: 15.00 },
        { nom: "Câble électrique", quantite: 8, prixHT: 3.00 }
      ],
      portail: [
        { nom: "Moteur portail", quantite: 1, prixHT: 80.00 },
        { nom: "Télécommande", quantite: 2, prixHT: 15.00 }
      ]
    },
    cave: {
      eclairage: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Ampoule LED", quantite: 1, prixHT: 12.00 },
        { nom: "Gaine électrique", quantite: 3, prixHT: 2.00 }
      ],
      prises: [
        { nom: "Prise de courant", quantite: 2, prixHT: 6.00 },
        { nom: "Boîte d'encastrement", quantite: 2, prixHT: 3.00 }
      ],
      interrupteurs: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      tableau: [
        { nom: "Disjoncteur", quantite: 3, prixHT: 15.00 },
        { nom: "Câble électrique", quantite: 8, prixHT: 3.00 }
      ],
      lave_linge: [
        { nom: "Lave-linge", quantite: 1, prixHT: 35.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ],
      seche_linge: [
        { nom: "Sèche-linge", quantite: 1, prixHT: 40.00 },
        { nom: "Câble spécialisé", quantite: 2, prixHT: 8.00 }
      ]
    },
    grenier: {
      eclairage: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Ampoule LED", quantite: 1, prixHT: 12.00 },
        { nom: "Gaine électrique", quantite: 3, prixHT: 2.00 }
      ],
      prises: [
        { nom: "Prise de courant", quantite: 1, prixHT: 6.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      interrupteurs: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      tableau: [
        { nom: "Disjoncteur", quantite: 2, prixHT: 15.00 },
        { nom: "Câble électrique", quantite: 5, prixHT: 3.00 }
      ]
    },
    exterieur: {
      eclairage: [
        { nom: "Éclairage extérieur", quantite: 2, prixHT: 30.00 },
        { nom: "Détecteur de présence", quantite: 1, prixHT: 25.00 }
      ],
      prises: [
        { nom: "Prise extérieure", quantite: 1, prixHT: 20.00 }
      ],
      interrupteurs: [
        { nom: "Interrupteur extérieur", quantite: 1, prixHT: 15.00 }
      ],
      tableau: [
        { nom: "Disjoncteur", quantite: 3, prixHT: 15.00 },
        { nom: "Câble électrique", quantite: 10, prixHT: 3.00 }
      ],
      portail: [
        { nom: "Moteur portail", quantite: 1, prixHT: 80.00 },
        { nom: "Télécommande", quantite: 2, prixHT: 15.00 }
      ],
      volet: [
        { nom: "Moteur volet roulant", quantite: 1, prixHT: 60.00 },
        { nom: "Télécommande", quantite: 1, prixHT: 20.00 }
      ]
    }
  },
  appareillage: {
    // Services communs à toutes les pièces (sauf extérieur)
    commun: {
      changement_prise: [
        { nom: "Prise de courant", quantite: 1, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      changement_luminaire: [
        { nom: "Luminaire", quantite: 1, prixHT: 20.00 },
        { nom: "Ampoule LED", quantite: 1, prixHT: 10.00 }
      ],
      changement_alarme: [
        { nom: "Alarme", quantite: 1, prixHT: 30.00 },
        { nom: "Câble électrique", quantite: 2, prixHT: 3.00 }
      ],
      changement_tableau: [
        { nom: "Tableau électrique", quantite: 1, prixHT: 50.00 },
        { nom: "Disjoncteurs", quantite: 3, prixHT: 15.00 }
      ],
      changement_interrupteur: [
        { nom: "Interrupteur", quantite: 1, prixHT: 8.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      changement_poussoir: [
        { nom: "Poussoir", quantite: 1, prixHT: 12.00 },
        { nom: "Boîte d'encastrement", quantite: 1, prixHT: 3.00 }
      ],
      changement_interphone: [
        { nom: "Interphone", quantite: 1, prixHT: 60.00 },
        { nom: "Câble téléphonique", quantite: 5, prixHT: 2.00 }
      ]
    },
    // Services spécifiques pour l'extérieur
    exterieur: {
      changement_prise: [
        { nom: "Prise extérieure", quantite: 1, prixHT: 15.00 },
        { nom: "Boîte d'encastrement étanche", quantite: 1, prixHT: 8.00 }
      ],
      changement_luminaire: [
        { nom: "Luminaire extérieur", quantite: 1, prixHT: 30.00 },
        { nom: "Ampoule LED étanche", quantite: 1, prixHT: 12.00 }
      ],
      changement_alarme: [
        { nom: "Alarme extérieure", quantite: 1, prixHT: 40.00 },
        { nom: "Câble électrique étanche", quantite: 3, prixHT: 4.00 }
      ],
      changement_tableau: [
        { nom: "Tableau électrique", quantite: 1, prixHT: 50.00 },
        { nom: "Disjoncteurs", quantite: 3, prixHT: 15.00 }
      ],
      changement_interrupteur: [
        { nom: "Interrupteur extérieur", quantite: 1, prixHT: 15.00 },
        { nom: "Boîte d'encastrement étanche", quantite: 1, prixHT: 8.00 }
      ],
      changement_poussoir: [
        { nom: "Poussoir extérieur", quantite: 1, prixHT: 18.00 },
        { nom: "Boîte d'encastrement étanche", quantite: 1, prixHT: 8.00 }
      ],
      changement_interphone: [
        { nom: "Interphone extérieur", quantite: 1, prixHT: 80.00 },
        { nom: "Câble téléphonique étanche", quantite: 5, prixHT: 3.00 }
      ]
    }
  },
  portail: {
    portail_coulissant: [
      { nom: "Portail coulissant", quantite: 1, prixHT: 200.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 50.00 }
    ],
    portail_battant: [
      { nom: "Portail battant", quantite: 1, prixHT: 150.00 },
      { nom: "Gonds renforcés", quantite: 2, prixHT: 25.00 }
    ],
    portail_sectionnel: [
      { nom: "Portail sectionnel", quantite: 1, prixHT: 300.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 60.00 }
    ],
    portail_basculant: [
      { nom: "Portail basculant", quantite: 1, prixHT: 120.00 },
      { nom: "Gonds renforcés", quantite: 2, prixHT: 20.00 }
    ],
    volet_roulant_exterieur: [
      { nom: "Volet roulant extérieur", quantite: 1, prixHT: 100.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 30.00 }
    ],
    volet_roulant_interieur: [
      { nom: "Volet roulant intérieur", quantite: 1, prixHT: 80.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 25.00 }
    ],
    volet_roulant_solaire: [
      { nom: "Volet roulant solaire", quantite: 1, prixHT: 150.00 },
      { nom: "Panneau solaire", quantite: 1, prixHT: 50.00 }
    ],
    volet_roulant_thermique: [
      { nom: "Volet roulant thermique", quantite: 1, prixHT: 120.00 },
      { nom: "Isolation thermique", quantite: 1, prixHT: 40.00 }
    ],
    porte_garage_sectionnelle: [
      { nom: "Porte garage sectionnelle", quantite: 1, prixHT: 250.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 50.00 }
    ],
    porte_garage_basculante: [
      { nom: "Porte garage basculante", quantite: 1, prixHT: 200.00 },
      { nom: "Gonds renforcés", quantite: 2, prixHT: 30.00 }
    ],
    porte_garage_enroulable: [
      { nom: "Porte garage enroulable", quantite: 1, prixHT: 180.00 },
      { nom: "Rail de guidage", quantite: 1, prixHT: 40.00 }
    ],
    motorisation_chaine: [
      { nom: "Motorisation à chaîne", quantite: 1, prixHT: 100.00 },
      { nom: "Chaîne de traction", quantite: 1, prixHT: 25.00 }
    ],
    motorisation_vis: [
      { nom: "Motorisation à vis", quantite: 1, prixHT: 120.00 },
      { nom: "Vis de traction", quantite: 1, prixHT: 30.00 }
    ],
    motorisation_cremaillere: [
      { nom: "Motorisation à crémaillère", quantite: 1, prixHT: 140.00 },
      { nom: "Crémaillère", quantite: 1, prixHT: 35.00 }
    ],
    telecommande_radio: [
      { nom: "Télécommande radio", quantite: 2, prixHT: 25.00 }
    ],
    telecommande_filaire: [
      { nom: "Télécommande filaire", quantite: 1, prixHT: 20.00 },
      { nom: "Câble de commande", quantite: 5, prixHT: 2.00 }
    ],
    detecteur_obstacle: [
      { nom: "Détecteur d'obstacle", quantite: 1, prixHT: 50.00 }
    ],
    detecteur_photocellule: [
      { nom: "Photocellule de sécurité", quantite: 1, prixHT: 40.00 }
    ],
    centrale_commande: [
      { nom: "Centrale de commande", quantite: 1, prixHT: 80.00 }
    ],
    batterie_secours: [
      { nom: "Batterie de secours", quantite: 1, prixHT: 60.00 }
    ],
    installation_electrique: [
      { nom: "Câble électrique", quantite: 10, prixHT: 3.00 },
      { nom: "Gaine électrique", quantite: 10, prixHT: 2.00 }
    ],
    maintenance_preventive: [
      { nom: "Kit de maintenance", quantite: 1, prixHT: 30.00 }
    ]
  },
  securite: {
    alarme_intrusion: [
      { nom: "Centrale d'alarme", quantite: 1, prixHT: 100.00 },
      { nom: "Détecteurs de mouvement", quantite: 4, prixHT: 25.00 },
      { nom: "Sirène", quantite: 1, prixHT: 50.00 }
    ],
    alarme_incendie: [
      { nom: "Centrale d'alarme incendie", quantite: 1, prixHT: 80.00 },
      { nom: "Détecteurs de fumée", quantite: 3, prixHT: 20.00 },
      { nom: "Sirène", quantite: 1, prixHT: 40.00 }
    ],
    alarme_gaz: [
      { nom: "Détecteur de gaz", quantite: 2, prixHT: 35.00 },
      { nom: "Centrale de commande", quantite: 1, prixHT: 50.00 }
    ],
    camera_exterieur: [
      { nom: "Caméra extérieure", quantite: 2, prixHT: 80.00 },
      { nom: "Câble vidéo", quantite: 10, prixHT: 3.00 }
    ],
    camera_interieur: [
      { nom: "Caméra intérieure", quantite: 2, prixHT: 60.00 },
      { nom: "Câble vidéo", quantite: 8, prixHT: 3.00 }
    ],
    controle_acces: [
      { nom: "Contrôleur d'accès", quantite: 1, prixHT: 120.00 },
      { nom: "Lecteur de badge", quantite: 1, prixHT: 40.00 }
    ],
    serrure_connectee: [
      { nom: "Serrure connectée", quantite: 1, prixHT: 80.00 },
      { nom: "Module de commande", quantite: 1, prixHT: 20.00 }
    ],
    gash_electrique: [
      { nom: "Gash électrique", quantite: 1, prixHT: 60.00 },
      { nom: "Câble électrique", quantite: 5, prixHT: 3.00 },
      { nom: "Boîte d'encastrement", quantite: 1, prixHT: 5.00 }
    ],
    interphone: [
      { nom: "Interphone", quantite: 1, prixHT: 80.00 },
      { nom: "Câble téléphonique", quantite: 10, prixHT: 2.00 },
      { nom: "Boîte d'encastrement", quantite: 1, prixHT: 5.00 }
    ],
    interphone_video: [
      { nom: "Interphone vidéo", quantite: 1, prixHT: 150.00 },
      { nom: "Câble vidéo", quantite: 5, prixHT: 3.00 }
    ],
    interphone_gash_electrique: [
      { nom: "Interphone + Gash électrique", quantite: 1, prixHT: 120.00 },
      { nom: "Câble électrique", quantite: 5, prixHT: 3.00 },
      { nom: "Câble téléphonique", quantite: 10, prixHT: 2.00 },
      { nom: "Boîte d'encastrement", quantite: 1, prixHT: 5.00 }
    ]
  }
};
