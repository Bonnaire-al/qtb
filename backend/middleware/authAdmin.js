const crypto = require('crypto');

// Tokens valides en mémoire (invalidés au redémarrage du serveur)
const validTokens = new Set();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/** Créer un nouveau token (après login réussi). */
function addToken() {
  const token = generateToken();
  validTokens.add(token);
  return token;
}

/** Révoquer un token (logout). */
function removeToken(token) {
  validTokens.delete(token);
}

/**
 * Middleware : exige un token admin valide.
 * En-tête attendu : Authorization: Bearer <token>
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || !validTokens.has(token)) {
    return res.status(401).json({ error: 'Non autorisé. Connexion admin requise.' });
  }
  req.adminToken = token;
  next();
}

module.exports = {
  addToken,
  removeToken,
  requireAuth
};
