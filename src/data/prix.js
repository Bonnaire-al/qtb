// Données de prix pour les prestations

export const prixPrestations = {
  domotique: {
    // Services communs à toutes les pièces
    commun: {
      eclairage: { prixHT: 20.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 30.00, description: "Prises de courant connectées/commandées" },
      radiateur: { prixHT: 35.00, description: "Radiateur connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 20.00, description: "Prise internet" },
      tv: { prixHT: 20.00, description: "Prise TV" },
      tableau: { prixHT: 250.00, description: "Installation tableau électrique" }
    },
    // Services spécifiques par pièce
    cuisine: {
      plaque_cuisson: { prixHT: 30.00, description: "Plaque cuisson connectée" },
      four: { prixHT: 30.00, description: "Four connecté" },
      lave_linge_vaisselle: { prixHT: 40.00, description: "Lave linge/vaisselle connecté" },
      applique: { prixHT: 20.00, description: "Applique connectée" }
    },
    salle_de_bain: {
      radiateur: { prixHT: 35.00, description: "sèche serviette connecté/centralisé" },
      applique_miroir: { prixHT: 20.00, description: "Applique/miroir connecté" }
    },
    toilette: {
      applique_miroir: { prixHT: 20.00, description: "Applique/miroir connecté" }
    },
    couloir: {
      // Aucun prix spécifique - utilise les prix communs
    },
    cellier: {
      lave_linge_vaisselle: { prixHT: 40.00, description: "Lave linge/vaisselle connecté" }
    },
    cave: {
      eclairage: { prixHT: 30.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 25.00, description: "Prises de courant connectées/commandées" },
      lave_linge_seche_linge: { prixHT: 40.00, description: "Lave-linge/sèche-linge connecté" }
    },
    exterieur: {
      eclairage: { prixHT: 35.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 45.00, description: "Prise connectée/commandée" },
      interphone: { prixHT: 70.00, description: "Interphone connecté" },
      alarme_securite: { prixHT: 150.00, description: "Alarme sécurité connectée" },
      camera: { prixHT: 35.00, description: "Caméra connectée" },
      portail: { prixHT: 130.00, description: "Portail connecté" }
    }
  },
  installation: {
    // Services communs à toutes les pièces
    commun: {
      eclairage: { prixHT: 35.00, description: "Installation éclairage" },
      prises: { prixHT: 25.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 20.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      detecteur: { prixHT: 40.00, description: "Installation détecteur de fumée" },
      tv: { prixHT: 30.00, description: "Installation prise TV" },
      internet: { prixHT: 25.00, description: "Installation prise internet RJ45" },
      radiateur: { prixHT: 60.00, description: "Installation radiateur" }
    },
    // Services spécifiques par pièce
    salon: {
      // Aucun prix spécifique - utilise les prix communs
    },
    cuisine: {
      plaque_cuisson: { prixHT: 80.00, description: "Installation plaque de cuisson" },
      four: { prixHT: 60.00, description: "Installation four électrique" },
      lave_linge: { prixHT: 50.00, description: "Installation lave-linge" },
      vaisselle: { prixHT: 50.00, description: "Installation lave-vaisselle" }
    },
    salle_de_bain: {
      seche_serviette: { prixHT: 70.00, description: "Installation sèche-serviette" },
      chauffe_eau: { prixHT: 80.00, description: "Installation chauffe-eau" }
    },
    toilette: {
      // Aucun prix spécifique - utilise les prix communs
    },
    couloir: {
      detecteur: { prixHT: 35.00, description: "Installation détecteur de fumée" }
    },
    garage: {
      eclairage: { prixHT: 30.00, description: "Installation éclairage" },
      prises: { prixHT: 20.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 15.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 40.00, description: "Connexion tableau électrique" },
      portail: { prixHT: 100.00, description: "Installation portail électrique" }
    },
    cave: {
      eclairage: { prixHT: 25.00, description: "Installation éclairage" },
      prises: { prixHT: 20.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 15.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 40.00, description: "Connexion tableau électrique" },
      lave_linge: { prixHT: 50.00, description: "Installation lave-linge" },
      seche_linge: { prixHT: 50.00, description: "Installation sèche-linge" }
    },
    grenier: {
      eclairage: { prixHT: 25.00, description: "Installation éclairage" },
      prises: { prixHT: 20.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 15.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 40.00, description: "Connexion tableau électrique" }
    },
    exterieur: {
      eclairage: { prixHT: 50.00, description: "Installation éclairage extérieur" },
      prises: { prixHT: 35.00, description: "Installation prises extérieures" },
      interrupteurs: { prixHT: 25.00, description: "Installation interrupteurs extérieurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      portail: { prixHT: 100.00, description: "Installation portail électrique" },
      volet: { prixHT: 80.00, description: "Installation volets roulants" }
    }
  },
  appareillage: {
    // Services communs à toutes les pièces (sauf extérieur)
    commun: {
      changement_prise: { prixHT: 25.00, description: "Changement de prise" },
      changement_luminaire: { prixHT: 30.00, description: "Changement de luminaire" },
      changement_alarme: { prixHT: 40.00, description: "Changement d'alarme" },
      changement_tableau: { prixHT: 60.00, description: "Changement de tableau" },
      changement_interrupteur: { prixHT: 20.00, description: "Changement d'interrupteur" },
      changement_poussoir: { prixHT: 25.00, description: "Changement de poussoir" },
      changement_interphone: { prixHT: 80.00, description: "Changement d'interphone" }
    },
    // Services spécifiques pour l'extérieur
    exterieur: {
      changement_prise: { prixHT: 35.00, description: "Changement de prise extérieure" },
      changement_luminaire: { prixHT: 40.00, description: "Changement de luminaire extérieur" },
      changement_alarme: { prixHT: 50.00, description: "Changement d'alarme extérieure" },
      changement_tableau: { prixHT: 60.00, description: "Changement de tableau" },
      changement_interrupteur: { prixHT: 30.00, description: "Changement d'interrupteur extérieur" },
      changement_poussoir: { prixHT: 35.00, description: "Changement de poussoir extérieur" },
      changement_interphone: { prixHT: 100.00, description: "Changement d'interphone extérieur" }
    }
  },
  portail: {
    portail_coulissant: { prixHT: 300.00, description: "Portail coulissant" },
    portail_battant: { prixHT: 250.00, description: "Portail battant" },
    portail_sectionnel: { prixHT: 400.00, description: "Portail sectionnel" },
    portail_basculant: { prixHT: 200.00, description: "Portail basculant" },
    volet_roulant_exterieur: { prixHT: 150.00, description: "Volet roulant extérieur" },
    volet_roulant_interieur: { prixHT: 120.00, description: "Volet roulant intérieur" },
    volet_roulant_solaire: { prixHT: 200.00, description: "Volet roulant solaire" },
    volet_roulant_thermique: { prixHT: 180.00, description: "Volet roulant thermique" },
    porte_garage_sectionnelle: { prixHT: 350.00, description: "Porte de garage sectionnelle" },
    porte_garage_basculante: { prixHT: 300.00, description: "Porte de garage basculante" },
    porte_garage_enroulable: { prixHT: 280.00, description: "Porte de garage enroulable" },
    motorisation_chaine: { prixHT: 150.00, description: "Motorisation à chaîne" },
    motorisation_vis: { prixHT: 180.00, description: "Motorisation à vis" },
    motorisation_cremaillere: { prixHT: 200.00, description: "Motorisation à crémaillère" },
    telecommande_radio: { prixHT: 50.00, description: "Télécommande radio" },
    telecommande_filaire: { prixHT: 40.00, description: "Télécommande filaire" },
    detecteur_obstacle: { prixHT: 80.00, description: "Détecteur d'obstacle" },
    detecteur_photocellule: { prixHT: 60.00, description: "Photocellule de sécurité" },
    centrale_commande: { prixHT: 120.00, description: "Centrale de commande" },
    batterie_secours: { prixHT: 100.00, description: "Batterie de secours" },
    installation_electrique: { prixHT: 80.00, description: "Installation électrique" },
    maintenance_preventive: { prixHT: 60.00, description: "Maintenance préventive" }
  },
  securite: {
    alarme_intrusion: { prixHT: 200.00, description: "Alarme d'intrusion" },
    alarme_incendie: { prixHT: 150.00, description: "Alarme incendie" },
    alarme_gaz: { prixHT: 120.00, description: "Détecteur de gaz" },
    camera_exterieur: { prixHT: 180.00, description: "Caméras extérieures" },
    camera_interieur: { prixHT: 150.00, description: "Caméras intérieures" },
    controle_acces: { prixHT: 180.00, description: "Contrôle d'accès" },
    serrure_connectee: { prixHT: 120.00, description: "Serrure connectée" },
    gash_electrique: { prixHT: 80.00, description: "Gash électrique" },
    interphone: { prixHT: 120.00, description: "Interphone" },
    interphone_video: { prixHT: 250.00, description: "Interphone vidéo" },
    interphone_gash_electrique: { prixHT: 180.00, description: "Interphone + Gash électrique" }
  }
};
