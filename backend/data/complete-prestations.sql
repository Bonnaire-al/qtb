-- Compléter la table prestations avec TOUTES les données de servicesData.js
-- Format: (categorie, piece, service_value, service_label)

-- ============================================
-- INSTALLATION - Prestations manquantes
-- ============================================

-- Installation - Chambre (utilise les services communs)
-- Installation - Salon (utilise les services communs)  
-- Installation - Toilette (utilise les services communs)
-- Installation - Garage (utilise les services communs)
-- Installation - Grenier (utilise les services communs)

-- Installation - Couloir
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'couloir', 'eclairage', 'Installation éclairage'),
('installation', 'couloir', 'prises', 'Installation prises de courant'),
('installation', 'couloir', 'interrupteurs', 'Installation interrupteurs'),
('installation', 'couloir', 'detecteur', 'Installation détecteur de fumée');

-- Installation - Cellier
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'cellier', 'eclairage', 'Installation éclairage'),
('installation', 'cellier', 'prises', 'Installation prises de courant'),
('installation', 'cellier', 'lave_linge', 'Installation lave-linge'),
('installation', 'cellier', 'vaisselle', 'Installation lave-vaisselle');

-- Installation - Cave
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'cave', 'eclairage', 'Installation éclairage'),
('installation', 'cave', 'prises', 'Installation prises de courant'),
('installation', 'cave', 'lave_linge', 'Installation lave-linge'),
('installation', 'cave', 'seche_linge', 'Installation sèche-linge');

-- Installation - Extérieur
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'exterieur', 'eclairage', 'Installation éclairage extérieur'),
('installation', 'exterieur', 'prises', 'Installation prises extérieures'),
('installation', 'exterieur', 'interrupteurs', 'Installation interrupteurs extérieurs');

-- Installation - Cuisine (ajouts)
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'cuisine', 'eclairage_applique', 'Installation éclairage applique'),
('installation', 'cuisine', 'interrupteur_double', 'Installation interrupteur double');

-- Installation - Salle de bain (ajouts)
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('installation', 'salle_de_bain', 'eclairage_applique', 'Installation éclairage applique/miroir'),
('installation', 'salle_de_bain', 'interrupteur_double', 'Installation interrupteur double');

-- ============================================
-- APPAREILLAGE - SUPPRIMÉ
-- ============================================
-- Tous les services de changement d'appareil électrique ont été supprimés
-- car ils ne sont plus nécessaires dans le système.

-- ============================================

-- ============================================
-- PORTAIL - Toutes les catégories
-- ============================================

-- Portail - Portail électrique
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('portail', 'portail', 'portail_coulissant', 'Portail coulissant'),
('portail', 'portail', 'portail_battant', 'Portail battant'),
('portail', 'portail', 'portail_battant_connecte', 'Portail battant connecté'),
('portail', 'portail', 'portail_coulissant_connecte', 'Portail coulissant connecté');

-- Portail - Volets roulants
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('portail', 'volet', 'volet_roulant_petit', 'Volet roulant (petit - 1m sur 1m)'),
('portail', 'volet', 'volet_roulant_moyen', 'Volet roulant (moyen - 2m sur 2m)'),
('portail', 'volet', 'volet_roulant_grand', 'Volet roulant (grand - 3m sur 3m)'),
('portail', 'volet', 'volet_roulant_extra', 'Volet roulant (extra - plus de 3m)');

-- ============================================
-- SECURITE - Services sans pièces
-- ============================================

INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('securite', NULL, 'gash_electrique', 'Gash électrique'),
('securite', NULL, 'interphone_gash_electrique', 'Interphone + Gash électrique');

-- ============================================
-- DOMOTIQUE - Services manquants
-- ============================================

-- Domotique - Volets (commun)
INSERT OR IGNORE INTO prestations (categorie, piece, service_value, service_label) VALUES
('domotique', 'commun', 'volets', 'Volets roulants connectés');

-- Domotique - Chambres, Salon, Couloir, Garage, Grenier (utilisent les services communs)
-- Pas besoin d'entrées spécifiques, la logique "commun" les gère


