// Données de prix pour les prestations

export const prixPrestations = {
  domotique: {
    chambre: {
      eclairage: { prixHT: 45.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 35.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 120.00, description: "Chauffage connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 25.00, description: "Prise internet" },
      tv: { prixHT: 30.00, description: "Prise TV" }
    },
    salon: {
      eclairage: { prixHT: 45.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 35.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 120.00, description: "Chauffage connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 25.00, description: "Prise internet" },
      tv: { prixHT: 30.00, description: "Prise TV" }
    },
    cuisine: {
      eclairage: { prixHT: 45.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 35.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 120.00, description: "Chauffage connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 25.00, description: "Prise internet" },
      tv: { prixHT: 30.00, description: "Prise TV" },
      plaque_cuisson: { prixHT: 150.00, description: "Plaque cuisson connectée" },
      four: { prixHT: 80.00, description: "Four connecté" },
      lave_linge_vaisselle: { prixHT: 100.00, description: "Lave linge/vaisselle connecté" },
      applique: { prixHT: 40.00, description: "Applique connectée" }
    },
    salle_de_bain: {
      eclairage: { prixHT: 45.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 35.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 100.00, description: "sèche serviette connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      applique_miroir: { prixHT: 60.00, description: "Applique/miroir connecté" }
    },
    toilette: {
      eclairage: { prixHT: 35.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 25.00, description: "Prise connectée/détecteur" },
      applique_miroir: { prixHT: 50.00, description: "Applique/miroir connecté" }
    },
    couloir: {
      eclairage: { prixHT: 40.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 30.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 100.00, description: "Chauffage connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 25.00, description: "Prise internet" },
      tv: { prixHT: 30.00, description: "Prise TV" }
    },
    cellier: {
      eclairage: { prixHT: 35.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 30.00, description: "Prises de courant connectées/commandées" },
      chauffage: { prixHT: 100.00, description: "Chauffage connecté/centralisé" },
      volets: { prixHT: 85.00, description: "Volets roulants connectés" },
      internet: { prixHT: 25.00, description: "Prise internet" },
      tv: { prixHT: 30.00, description: "Prise TV" },
      lave_linge_vaisselle: { prixHT: 100.00, description: "Lave linge/vaisselle connecté" }
    },
    cave: {
      eclairage: { prixHT: 30.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 25.00, description: "Prises de courant connectées/commandées" },
      lave_linge_seche_linge: { prixHT: 120.00, description: "Lave-linge/sèche-linge connecté" }
    },
    exterieur: {
      eclairage: { prixHT: 60.00, description: "Éclairage connecté/détecteur" },
      prises: { prixHT: 40.00, description: "Prise connectée/commandée" },
      interphone: { prixHT: 200.00, description: "Interphone connecté" },
      alarme_securite: { prixHT: 300.00, description: "Alarme sécurité connectée" },
      camera: { prixHT: 150.00, description: "Caméra connectée" },
      portail: { prixHT: 250.00, description: "Portail connecté" }
    }
  },
  installation: {
    chambre: {
      eclairage: { prixHT: 35.00, description: "Installation éclairage" },
      prises: { prixHT: 25.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 20.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      detecteur: { prixHT: 40.00, description: "Installation détecteur de fumée" }
    },
    salon: {
      eclairage: { prixHT: 35.00, description: "Installation éclairage" },
      prises: { prixHT: 25.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 20.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      detecteur: { prixHT: 40.00, description: "Installation détecteur de fumée" },
      tv: { prixHT: 30.00, description: "Installation prises TV/Internet" }
    },
    cuisine: {
      eclairage: { prixHT: 35.00, description: "Installation éclairage" },
      prises: { prixHT: 25.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 20.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      detecteur: { prixHT: 40.00, description: "Installation détecteur de fumée" },
      plaque_cuisson: { prixHT: 80.00, description: "Installation plaque de cuisson" },
      four: { prixHT: 60.00, description: "Installation four électrique" },
      lave_linge: { prixHT: 50.00, description: "Installation lave-linge" },
      vaisselle: { prixHT: 50.00, description: "Installation lave-vaisselle" }
    },
    salle_de_bain: {
      eclairage: { prixHT: 35.00, description: "Installation éclairage" },
      prises: { prixHT: 25.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 20.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 50.00, description: "Connexion tableau électrique" },
      detecteur: { prixHT: 40.00, description: "Installation détecteur de fumée" },
      seche_serviette: { prixHT: 70.00, description: "Installation sèche-serviette" },
      chauffe_eau: { prixHT: 80.00, description: "Installation chauffe-eau" }
    },
    toilette: {
      eclairage: { prixHT: 30.00, description: "Installation éclairage" },
      prises: { prixHT: 20.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 15.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 40.00, description: "Connexion tableau électrique" }
    },
    couloir: {
      eclairage: { prixHT: 30.00, description: "Installation éclairage" },
      prises: { prixHT: 20.00, description: "Installation prises de courant" },
      interrupteurs: { prixHT: 15.00, description: "Installation interrupteurs" },
      tableau: { prixHT: 40.00, description: "Connexion tableau électrique" },
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
    camera_dome: { prixHT: 200.00, description: "Caméras dôme" },
    camera_ptz: { prixHT: 300.00, description: "Caméras PTZ" },
    interphone_video: { prixHT: 250.00, description: "Interphone vidéo" },
    controle_acces: { prixHT: 180.00, description: "Contrôle d'accès" },
    badge_rfid: { prixHT: 50.00, description: "Badges RFID" },
    serrure_connectee: { prixHT: 120.00, description: "Serrure connectée" },
    detecteur_mouvement: { prixHT: 60.00, description: "Détecteurs de mouvement" },
    detecteur_ouverture: { prixHT: 40.00, description: "Détecteurs d'ouverture" },
    centrale_alarme: { prixHT: 150.00, description: "Centrale d'alarme" },
    clavier_code: { prixHT: 80.00, description: "Clavier à code" },
    telecommande: { prixHT: 30.00, description: "Télécommande" },
    sirene: { prixHT: 100.00, description: "Sirène" },
    transmetteur_telephonique: { prixHT: 90.00, description: "Transmetteur téléphonique" }
  }
};
