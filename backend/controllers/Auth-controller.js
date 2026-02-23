const { addToken, removeToken } = require('../middleware/authAdmin');

class AuthController {
  /** POST /api/admin/login - Connexion admin (mot de passe dans process.env.ADMIN_PASSWORD) */
  static login(req, res) {
    const password = (req.body && req.body.password) ? String(req.body.password).trim() : '';
    const expected = process.env.ADMIN_PASSWORD || '';

    if (!expected) {
      return res.status(500).json({
        error: 'Configuration serveur manquante (ADMIN_PASSWORD non défini).'
      });
    }

    if (password !== expected) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    const token = addToken();
    return res.json({ success: true, token });
  }

  /** POST /api/admin/logout - Révoquer le token (optionnel) */
  static logout(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) removeToken(token);
    return res.json({ success: true });
  }
}

module.exports = AuthController;
