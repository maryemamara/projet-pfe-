const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Chercher le token dans l'en-tête 'Authorization'
  const token = req.header('Authorization')?.split(' ')[1];  // Enlever le 'Bearer ' pour ne garder que le token
  if (!token) {
    return res.status(401).json({ error: 'Aucun token, autorisation refusée' });
  }

  try {
    // Vérifier et décoder le token
    console.log("Clé secrète dans authMiddleware avant vérification du token :", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, "mysecretkey");
    req.utilisateur = decoded.user;  // Assurez-vous que le token contient un champ 'id'
    next();  // Passer à la méthode suivante

  } catch (err) {
    console.error("Erreur de vérification du token :", err.message);
    res.status(401).json({ error: 'Token invalide' });
  }
};

module.exports = authMiddleware;
