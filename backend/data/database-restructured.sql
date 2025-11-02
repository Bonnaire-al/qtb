-- Base de données QTBE - Matériel, Prestations et Prix (Structure restructurée)

-- Table pour le matériel (Nouvelle structure)
CREATE TABLE IF NOT EXISTS materiel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    service_value TEXT NOT NULL,
    type_produit TEXT NOT NULL CHECK(type_produit IN ('fourniture', 'materiel')) DEFAULT 'materiel',
    prix_ht REAL NOT NULL
);

-- Table pour les prestations/services
CREATE TABLE IF NOT EXISTS prestations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie TEXT NOT NULL,
    piece TEXT,
    pieces_applicables TEXT,
    service_value TEXT NOT NULL,
    service_label TEXT NOT NULL,
    prix_ht REAL DEFAULT 0
);

-- Table de liaison entre prestations et matériel (via service_value)
CREATE TABLE IF NOT EXISTS prestation_materiel (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prestation_service_value TEXT NOT NULL,
    materiel_id INTEGER NOT NULL,
    FOREIGN KEY (materiel_id) REFERENCES materiel(id) ON DELETE CASCADE,
    UNIQUE(prestation_service_value, materiel_id)
);

