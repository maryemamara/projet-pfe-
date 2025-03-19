const Utilisateur = require('../models/user');  

// Middleware pour vérifier si l'utilisateur est un Admin
const estAdmin = (req, res, next) => {
  try {
    const { adminId } = req.body;

    // Trouver l'utilisateur en utilisant l'ID passé dans la requête
    Utilisateur.findById(adminId)
      .then((utilisateur) => {
        if (!utilisateur || utilisateur.role !== 'admin') {
          return res.status(403).json({ error: "Accès refusé : Seul un Admin peut faire cette action " });
        }
        // Si c'est un Admin, on passe à la suite
        next();
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//Middleware pour vérifier si l'utilisateur est un pet sitter 
const estPetSitter = (req, res, next) => {

  console.log("Middleware estPetSitter appelé !");
  console.log("Utilisateur extrait :", req.utilisateur);

  if (req.utilisateur && req.utilisateur.role === 'petSitter') {
      next();       // Laisser passer si l'utilisateur est un PetSitter
  } else {
      res.status(403).json({ error: "Accès refusé : seul un PetSitter peut faire cette action" });
  }
};

const estPetSitterModificationCoordonnees = (req, res, next) => {
  const { role } = req.utilisateur; // L'utilisateur authentifié
  const { latitude, longitude } = req.body.updatedData;

  if ((latitude !== undefined || longitude !== undefined) && role !== 'petSitter') {
      return res.status(403).json({ error: 'Seul un PetSitter peut modifier ses coordonnées GPS' });
  }

  next();
};

//Middleware pour vérifier si l'utilisateur est un pet owner
const estPetOwner = async (req, res, next) => {
  try {
    const { utilisateurId } = req.body; // ou req.params en fonction de la façon dont tu passes l'ID

    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur || utilisateur.role !== 'petOwner') {
      return res.status(403).json({ error: 'Seul un PetOwner peut ajouter un animal' });
    }

    // Si l'utilisateur est un PetOwner, on passe à la suite de la requête
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Middleware pour vérifier si l'utilisateur est un vétérinaire ou coach 
const estVeterinaireOuCoach = async (req, res, next) => {
  try {
    const { utilisateurId } = req.params;

    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur || (utilisateur.role !== 'veterinaire' && utilisateur.role !== 'coach')) {
      return res.status(403).json({ error: "Accès refusé : Seuls les vétérinaires et les coachs peuvent afficher leur profil." });
    }

    // Si l'utilisateur est vétérinaire ou coach, on passe à la suite
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};










module.exports = {
  estAdmin,
  estPetSitter,
  estPetSitterModificationCoordonnees,
  estPetOwner,
  estVeterinaireOuCoach
};
