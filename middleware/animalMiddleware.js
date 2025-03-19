


const estPetOwner = (req, res, next) => {
  // Vérifier si l'utilisateur est bien authentifié
  if (!req.utilisateur) {
      return res.status(401).json({ error: 'Authentification requise' });
  }

  // Vérifier si l'utilisateur est un PetOwner
  if (req.utilisateur.role !== 'petOwner') {
      return res.status(403).json({ error: 'Seul un PetOwner peut gérer les animaux' });
  }

  next(); // Passer à la suite si l'utilisateur est un PetOwner
};

module.exports = estPetOwner;
