-- Base de données QTBE - Matériel, Prestations et Prix

-- Table pour le matériel
CREATE TABLE IF NOT EXISTS materiel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie TEXT NOT NULL,
    sous_categorie TEXT NOT NULL,
    service TEXT NOT NULL,
    nom TEXT NOT NULL,
    quantite INTEGER NOT NULL,
    prix_ht REAL NOT NULL
);

-- Table pour les prix des prestations
CREATE TABLE IF NOT EXISTS prix (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie TEXT NOT NULL,
    sous_categorie TEXT NOT NULL,
    service TEXT NOT NULL,
    prix_ht REAL NOT NULL,
    description TEXT NOT NULL
);

-- Table pour les prestations/services
CREATE TABLE IF NOT EXISTS prestations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie TEXT NOT NULL,
    piece TEXT,
    service_value TEXT NOT NULL,
    service_label TEXT NOT NULL
);

-- Table de liaison entre prestations et matériel
CREATE TABLE IF NOT EXISTS prestation_materiel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prestation_id INTEGER NOT NULL,
    materiel_id INTEGER NOT NULL,
    FOREIGN KEY (prestation_id) REFERENCES prestations(id) ON DELETE CASCADE,
    FOREIGN KEY (materiel_id) REFERENCES materiel(id) ON DELETE CASCADE,
    UNIQUE(prestation_id, materiel_id)
);

-- ============================================
-- INSERTION DES DONNÉES - MATÉRIEL
-- ============================================

-- Domotique - Commun - Eclairage
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'eclairage', 'Interrupteur connecté', 1, 25.00),
('domotique', 'commun', 'eclairage', 'Ampoule LED connectée', 2, 15.00),
('domotique', 'commun', 'eclairage', 'Détecteur de présence', 1, 35.00);

-- Domotique - Commun - Prises
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'prises', 'Prise connectée', 2, 20.00),
('domotique', 'commun', 'prises', 'Module de commande', 1, 30.00);

-- Domotique - Commun - Chauffage
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'chauffage', 'Thermostat connecté', 1, 80.00),
('domotique', 'commun', 'chauffage', 'Vanne motorisée', 1, 45.00);

-- Domotique - Commun - Volets
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'volets', 'Moteur volet roulant', 1, 60.00),
('domotique', 'commun', 'volets', 'Télécommande', 1, 25.00);

-- Domotique - Commun - Internet
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'internet', 'Prise RJ45', 1, 15.00),
('domotique', 'commun', 'internet', 'Câble réseau', 5, 2.00);

-- Domotique - Commun - TV
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'tv', 'Prise TV', 1, 20.00),
('domotique', 'commun', 'tv', 'Câble coaxial', 3, 3.00);

-- Domotique - Commun - Tableau
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'commun', 'tableau', 'Tableau électrique connecté', 1, 60.00),
('domotique', 'commun', 'tableau', 'Disjoncteurs connectés', 4, 15.00),
('domotique', 'commun', 'tableau', 'Module de commande', 1, 20.00);

-- Domotique - Cuisine
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'cuisine', 'plaque_cuisson', 'Plaque de cuisson connectée', 1, 120.00),
('domotique', 'cuisine', 'plaque_cuisson', 'Module de commande', 1, 30.00),
('domotique', 'cuisine', 'four', 'Four connecté', 1, 60.00),
('domotique', 'cuisine', 'four', 'Module de commande', 1, 20.00),
('domotique', 'cuisine', 'lave_linge_vaisselle', 'Lave-linge connecté', 1, 80.00),
('domotique', 'cuisine', 'lave_linge_vaisselle', 'Module de commande', 1, 20.00),
('domotique', 'cuisine', 'applique', 'Applique connectée', 1, 30.00),
('domotique', 'cuisine', 'applique', 'Ampoule LED', 2, 10.00);

-- Domotique - Salle de bain
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'salle_de_bain', 'chauffage', 'Sèche-serviette connecté', 1, 80.00),
('domotique', 'salle_de_bain', 'chauffage', 'Module de commande', 1, 20.00),
('domotique', 'salle_de_bain', 'applique_miroir', 'Applique miroir connectée', 1, 50.00),
('domotique', 'salle_de_bain', 'applique_miroir', 'Ampoule LED', 2, 10.00);

-- Domotique - Toilette
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'toilette', 'applique_miroir', 'Applique miroir connectée', 1, 40.00),
('domotique', 'toilette', 'applique_miroir', 'Ampoule LED', 1, 10.00);

-- Domotique - Cellier
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'cellier', 'lave_linge_vaisselle', 'Lave-linge connecté', 1, 80.00),
('domotique', 'cellier', 'lave_linge_vaisselle', 'Module de commande', 1, 20.00);

-- Domotique - Cave
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'cave', 'eclairage', 'Interrupteur connecté', 1, 25.00),
('domotique', 'cave', 'eclairage', 'Ampoule LED connectée', 1, 15.00),
('domotique', 'cave', 'prises', 'Prise connectée', 2, 20.00),
('domotique', 'cave', 'lave_linge_seche_linge', 'Lave-linge connecté', 1, 80.00),
('domotique', 'cave', 'lave_linge_seche_linge', 'Sèche-linge connecté', 1, 100.00),
('domotique', 'cave', 'lave_linge_seche_linge', 'Module de commande', 2, 20.00);

-- Domotique - Extérieur
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('domotique', 'exterieur', 'eclairage', 'Éclairage extérieur connecté', 2, 40.00),
('domotique', 'exterieur', 'eclairage', 'Détecteur de présence', 1, 35.00),
('domotique', 'exterieur', 'prises', 'Prise extérieure connectée', 1, 30.00),
('domotique', 'exterieur', 'interphone', 'Interphone vidéo', 1, 180.00),
('domotique', 'exterieur', 'interphone', 'Module de commande', 1, 20.00),
('domotique', 'exterieur', 'alarme_securite', 'Centrale d''alarme', 1, 120.00),
('domotique', 'exterieur', 'alarme_securite', 'Détecteurs', 4, 25.00),
('domotique', 'exterieur', 'alarme_securite', 'Sirène', 1, 50.00),
('domotique', 'exterieur', 'camera', 'Caméra connectée', 2, 80.00),
('domotique', 'exterieur', 'camera', 'Module de commande', 1, 30.00),
('domotique', 'exterieur', 'portail', 'Moteur portail', 1, 200.00),
('domotique', 'exterieur', 'portail', 'Télécommande', 2, 25.00);

-- Installation - Commun
INSERT INTO materiel (categorie, sous_categorie, service, nom, quantite, prix_ht) VALUES
('installation', 'commun', 'eclairage', 'Interrupteur', 1, 8.00),
('installation', 'commun', 'eclairage', 'Ampoule LED', 2, 12.00),
('installation', 'commun', 'eclairage', 'Gaine électrique', 5, 2.00),
('installation', 'commun', 'prises', 'Prise de courant', 3, 6.00),
('installation', 'commun', 'prises', 'Boîte d''encastrement', 3, 3.00),
('installation', 'commun', 'interrupteurs', 'Interrupteur', 2, 8.00),
('installation', 'commun', 'interrupteurs', 'Boîte d''encastrement', 2, 3.00),
('installation', 'commun', 'tableau', 'Disjoncteur', 3, 15.00),
('installation', 'commun', 'tableau', 'Câble électrique', 10, 3.00),
('installation', 'commun', 'detecteur', 'Détecteur de fumée', 1, 25.00);

-- ============================================
-- INSERTION DES DONNÉES - PRIX
-- ============================================

-- Domotique - Commun
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'commun', 'eclairage', 20.00, 'Éclairage connecté/détecteur'),
('domotique', 'commun', 'prises', 30.00, 'Prises de courant connectées/commandées'),
('domotique', 'commun', 'radiateur', 35.00, 'Radiateur connecté/centralisé'),
('domotique', 'commun', 'volets', 85.00, 'Volets roulants connectés'),
('domotique', 'commun', 'internet', 20.00, 'Prise internet'),
('domotique', 'commun', 'tv', 20.00, 'Prise TV'),
('domotique', 'commun', 'tableau', 250.00, 'Installation tableau électrique');

-- Domotique - Cuisine
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'cuisine', 'plaque_cuisson', 30.00, 'Plaque cuisson connectée'),
('domotique', 'cuisine', 'four', 30.00, 'Four connecté'),
('domotique', 'cuisine', 'lave_linge_vaisselle', 40.00, 'Lave linge/vaisselle connecté'),
('domotique', 'cuisine', 'applique', 20.00, 'Applique connectée');

-- Domotique - Salle de bain
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'salle_de_bain', 'radiateur', 35.00, 'sèche serviette connecté/centralisé'),
('domotique', 'salle_de_bain', 'applique_miroir', 20.00, 'Applique/miroir connecté');

-- Domotique - Toilette
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'toilette', 'applique_miroir', 20.00, 'Applique/miroir connecté');

-- Domotique - Cellier
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'cellier', 'lave_linge_vaisselle', 40.00, 'Lave linge/vaisselle connecté');

-- Domotique - Cave
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'cave', 'eclairage', 30.00, 'Éclairage connecté/détecteur'),
('domotique', 'cave', 'prises', 25.00, 'Prises de courant connectées/commandées'),
('domotique', 'cave', 'lave_linge_seche_linge', 40.00, 'Lave-linge/sèche-linge connecté');

-- Domotique - Extérieur
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('domotique', 'exterieur', 'eclairage', 35.00, 'Éclairage connecté/détecteur'),
('domotique', 'exterieur', 'prises', 45.00, 'Prise connectée/commandée'),
('domotique', 'exterieur', 'interphone', 70.00, 'Interphone connecté'),
('domotique', 'exterieur', 'alarme_securite', 150.00, 'Alarme sécurité connectée'),
('domotique', 'exterieur', 'camera', 35.00, 'Caméra connectée'),
('domotique', 'exterieur', 'portail', 130.00, 'Portail connecté');

-- Installation - Commun
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('installation', 'commun', 'eclairage', 35.00, 'Installation éclairage'),
('installation', 'commun', 'prises', 25.00, 'Installation prises de courant'),
('installation', 'commun', 'interrupteurs', 20.00, 'Installation interrupteurs'),
('installation', 'commun', 'tableau', 50.00, 'Connexion tableau électrique'),
('installation', 'commun', 'detecteur', 40.00, 'Installation détecteur de fumée'),
('installation', 'commun', 'tv', 30.00, 'Installation prise TV'),
('installation', 'commun', 'internet', 25.00, 'Installation prise internet RJ45'),
('installation', 'commun', 'radiateur', 60.00, 'Installation radiateur');

-- Installation - Cuisine
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('installation', 'cuisine', 'plaque_cuisson', 80.00, 'Installation plaque de cuisson'),
('installation', 'cuisine', 'four', 60.00, 'Installation four électrique'),
('installation', 'cuisine', 'lave_linge', 50.00, 'Installation lave-linge'),
('installation', 'cuisine', 'vaisselle', 50.00, 'Installation lave-vaisselle');

-- Installation - Salle de bain
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('installation', 'salle_de_bain', 'seche_serviette', 70.00, 'Installation sèche-serviette'),
('installation', 'salle_de_bain', 'chauffe_eau', 80.00, 'Installation chauffe-eau');

-- Portail
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('portail', 'portail', 'portail_coulissant', 300.00, 'Portail coulissant'),
('portail', 'portail', 'portail_battant', 250.00, 'Portail battant'),
('portail', 'portail', 'portail_sectionnel', 400.00, 'Portail sectionnel'),
('portail', 'portail', 'portail_basculant', 200.00, 'Portail basculant');

-- Sécurité
INSERT INTO prix (categorie, sous_categorie, service, prix_ht, description) VALUES
('securite', 'securite', 'alarme_intrusion', 200.00, 'Alarme d''intrusion'),
('securite', 'securite', 'alarme_incendie', 150.00, 'Alarme incendie'),
('securite', 'securite', 'alarme_gaz', 120.00, 'Détecteur de gaz'),
('securite', 'securite', 'camera_exterieur', 180.00, 'Caméras extérieures'),
('securite', 'securite', 'camera_interieur', 150.00, 'Caméras intérieures'),
('securite', 'securite', 'controle_acces', 180.00, 'Contrôle d''accès'),
('securite', 'securite', 'serrure_connectee', 120.00, 'Serrure connectée'),
('securite', 'securite', 'gash_electrique', 80.00, 'Gash électrique'),
('securite', 'securite', 'interphone', 120.00, 'Interphone'),
('securite', 'securite', 'interphone_video', 250.00, 'Interphone vidéo');

-- ============================================
-- INSERTION DES DONNÉES - PRESTATIONS
-- ============================================

-- Domotique - Services communs
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'commun', 'eclairage', 'Éclairage connecté/détecteur'),
('domotique', 'commun', 'prises', 'Prises de courant connectées/commandées'),
('domotique', 'commun', 'radiateur', 'Radiateur connecté/centralisé'),
('domotique', 'commun', 'internet', 'Prise internet'),
('domotique', 'commun', 'tv', 'Prise TV'),
('domotique', 'commun', 'tableau', 'Installation tableau électrique');

-- Domotique - Cuisine
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'cuisine', 'plaque_cuisson', 'Plaque cuisson connectée'),
('domotique', 'cuisine', 'four', 'Four connecté'),
('domotique', 'cuisine', 'lave_linge_vaisselle', 'Lave linge/vaisselle connecté'),
('domotique', 'cuisine', 'applique', 'Applique connectée');

-- Domotique - Salle de bain
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'salle_de_bain', 'radiateur', 'sèche serviette connecté/centralisé'),
('domotique', 'salle_de_bain', 'applique_miroir', 'Applique/miroir connecté');

-- Installation - Services communs
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'commun', 'eclairage', 'Installation éclairage'),
('installation', 'commun', 'prises', 'Installation prises de courant'),
('installation', 'commun', 'interrupteurs', 'Installation interrupteurs'),
('installation', 'commun', 'tableau', 'Connexion tableau électrique'),
('installation', 'commun', 'detecteur', 'Installation détecteur de fumée'),
('installation', 'commun', 'tv', 'Installation prise TV'),
('installation', 'commun', 'internet', 'Installation prise internet RJ45'),
('installation', 'commun', 'radiateur', 'Installation radiateur');

-- Installation - Cuisine
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'cuisine', 'plaque_cuisson', 'Installation plaque de cuisson'),
('installation', 'cuisine', 'four', 'Installation four électrique'),
('installation', 'cuisine', 'lave_linge', 'Installation lave-linge'),
('installation', 'cuisine', 'vaisselle', 'Installation lave-vaisselle');

-- Domotique - Toilette
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'toilette', 'applique_miroir', 'Applique/miroir connecté');

-- Domotique - Cellier
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'cellier', 'lave_linge_vaisselle', 'Lave linge/vaisselle connecté');

-- Domotique - Cave
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'cave', 'eclairage', 'Éclairage connecté/détecteur'),
('domotique', 'cave', 'prises', 'Prises de courant connectées/commandées'),
('domotique', 'cave', 'lave_linge_seche_linge', 'Lave-linge/sèche-linge connecté');

-- Domotique - Extérieur
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'exterieur', 'eclairage', 'Éclairage connecté/détecteur'),
('domotique', 'exterieur', 'prises', 'Prise connectée/commandée'),
('domotique', 'exterieur', 'interphone', 'Interphone connecté'),
('domotique', 'exterieur', 'alarme_securite', 'Alarme sécurité connectée'),
('domotique', 'exterieur', 'camera', 'Caméra connectée'),
('domotique', 'exterieur', 'portail', 'Portail connecté');

-- Installation - Salle de bain
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'salle_de_bain', 'seche_serviette', 'Installation sèche-serviette'),
('installation', 'salle_de_bain', 'chauffe_eau', 'Installation chauffe-eau');

-- Sécurité
INSERT INTO prestations (categorie, piece, service_value, service_label) VALUES
('securite', NULL, 'alarme_intrusion', 'Alarme d''intrusion'),
('securite', NULL, 'alarme_incendie', 'Alarme incendie'),
('securite', NULL, 'alarme_gaz', 'Détecteur de gaz'),
('securite', NULL, 'camera_exterieur', 'Caméras extérieures'),
('securite', NULL, 'camera_interieur', 'Caméras intérieures'),
('securite', NULL, 'controle_acces', 'Contrôle d''accès'),
('securite', NULL, 'serrure_connectee', 'Serrure connectée'),
('securite', NULL, 'interphone', 'Interphone'),
('securite', NULL, 'interphone_video', 'Interphone vidéo');

-- ============================================
-- LIAISONS PRESTATIONS ↔ MATÉRIEL
-- ============================================

-- Domotique - Commun - Eclairage (prestation_id=1) → Matériel (id=1,2,3)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(1, 1), (1, 2), (1, 3);

-- Domotique - Commun - Prises (prestation_id=2) → Matériel (id=4,5)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(2, 4), (2, 5);

-- Domotique - Commun - Radiateur (prestation_id=3) → Matériel (id=6,7)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(3, 6), (3, 7);

-- Domotique - Commun - Internet (prestation_id=4) → Matériel (id=10,11)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(4, 10), (4, 11);

-- Domotique - Commun - TV (prestation_id=5) → Matériel (id=12,13)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(5, 12), (5, 13);

-- Domotique - Commun - Tableau (prestation_id=6) → Matériel (id=14,15,16)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(6, 14), (6, 15), (6, 16);

-- Domotique - Cuisine - Plaque cuisson (prestation_id=7) → Matériel (id=17,18)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(7, 17), (7, 18);

-- Domotique - Cuisine - Four (prestation_id=8) → Matériel (id=19,20)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(8, 19), (8, 20);

-- Domotique - Cuisine - Lave linge/vaisselle (prestation_id=9) → Matériel (id=21,22)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(9, 21), (9, 22);

-- Domotique - Cuisine - Applique (prestation_id=10) → Matériel (id=23,24)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(10, 23), (10, 24);

-- Domotique - Salle de bain - Radiateur (prestation_id=11) → Matériel (id=25,26)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(11, 25), (11, 26);

-- Domotique - Salle de bain - Applique miroir (prestation_id=12) → Matériel (id=27,28)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(12, 27), (12, 28);

-- Installation - Commun - Eclairage (prestation_id=13) → Matériel (id=51,52,53)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(13, 51), (13, 52), (13, 53);

-- Installation - Commun - Prises (prestation_id=14) → Matériel (id=54,55)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(14, 54), (14, 55);

-- Installation - Commun - Interrupteurs (prestation_id=15) → Matériel (id=56,57)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(15, 56), (15, 57);

-- Installation - Commun - Tableau (prestation_id=16) → Matériel (id=58,59)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(16, 58), (16, 59);

-- Installation - Commun - Détecteur (prestation_id=17) → Matériel (id=60)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(17, 60);

-- Domotique - Toilette - Applique miroir (prestation_id=25) → Matériel (id=29,30)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(25, 29), (25, 30);

-- Domotique - Cellier - Lave linge/vaisselle (prestation_id=26) → Matériel (id=31,32)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(26, 31), (26, 32);

-- Domotique - Cave - Eclairage (prestation_id=27) → Matériel (id=33,34)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(27, 33), (27, 34);

-- Domotique - Cave - Prises (prestation_id=28) → Matériel (id=35)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(28, 35);

-- Domotique - Cave - Lave linge seche linge (prestation_id=29) → Matériel (id=36,37,38)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(29, 36), (29, 37), (29, 38);

-- Domotique - Extérieur - Eclairage (prestation_id=30) → Matériel (id=39,40)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(30, 39), (30, 40);

-- Domotique - Extérieur - Prises (prestation_id=31) → Matériel (id=41)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(31, 41);

-- Domotique - Extérieur - Interphone (prestation_id=32) → Matériel (id=42,43)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(32, 42), (32, 43);

-- Domotique - Extérieur - Alarme sécurité (prestation_id=33) → Matériel (id=44,45,46)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(33, 44), (33, 45), (33, 46);

-- Domotique - Extérieur - Camera (prestation_id=34) → Matériel (id=47,48)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(34, 47), (34, 48);

-- Domotique - Extérieur - Portail (prestation_id=35) → Matériel (id=49,50)
INSERT INTO prestation_materiel (prestation_id, materiel_id) VALUES
(35, 49), (35, 50);
