const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ error: 'Aucun token, autorisation refusée' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;  // Ajoute les informations de l'utilisateur à la requête
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;
