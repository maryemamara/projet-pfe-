


// Middleware pour vérifier si l'utilisateur est un PetOwner
const estPetOwner = (req, res, next) => {
    const utilisateur = req.utilisateur;  // Utilisateur authentifié par le middleware d'authentification
  
    if (utilisateur.role !== 'petOwner') {
      return res.status(403).json({ error: 'Seul un PetOwner peut ajouter un feedback' });
    }
  
    next();
  };
  
  // Middleware pour vérifier si l'utilisateur est un PetOwner ou un Admin
  const estPetOwnerOuAdmin = (req, res, next) => {
    const utilisateur = req.utilisateur;
  
    if (utilisateur.role !== 'petOwner' && utilisateur.role !== 'admin') {
      return res.status(403).json({ error: 'Seul un PetOwner ou un Admin peut supprimer un feedback' });
    }

    next();
  };
  
  module.exports = {
    estPetOwner,
    estPetOwnerOuAdmin,
  };
  