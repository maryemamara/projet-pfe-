const Utilisateur = require('../models/user');
const Reservation = require('../models/Reservation'); // On suppose qu'il existe un modèle de réservation
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// Inscription d'un utilisateur
const inscrireUtilisateur = async (req, res) => {
    try {
      const { 
        nom, prenom, email, motDePasse, role,
        adresse, ville, gouvernement, codePostal, telephone, age, civilite,
        latitude, longitude
      } = req.body; 
  
      if (!['petOwner', 'petSitter', 'admin', 'coach', 'veterinaire'].includes(role)) {
        return res.status(400).json({ error: 'Rôle invalide' });
      }
  
      // Vérification des coordonnées pour les Pet Sitters
      if (role === 'petSitter' && (latitude === undefined || longitude === undefined)) {
        return res.status(400).json({ error: 'Les coordonnées GPS sont requises pour les Pet Sitters.' });
      }
  
      const utilisateur = new Utilisateur({
        nom, prenom, email, motDePasse, role,
        adresse, ville, gouvernement, codePostal, telephone, age, civilite,
        latitude: role === 'petSitter' ? latitude : undefined,
        longitude: role === 'petSitter' ? longitude : undefined
      });
  
      await utilisateur.inscrire();
      res.status(201).json({ message: 'Utilisateur créé avec succès', utilisateur });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

//connexion d'un utilisateur
const seConnecterUtilisateur = async (req, res) => {
    try {
      const { email, motDePasse } = req.body;
      const utilisateur = await Utilisateur.findOne({ email });
  
      if (!utilisateur) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
  
      const motDePasseValide = await utilisateur.verifierMotDePasse(motDePasse);
      if (!motDePasseValide) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
  
      const token = jwt.sign({ user: { id: utilisateur._id, role: utilisateur.role } }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  
      res.json({ token, utilisateur });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

//Méthode pour modifier les informations d'utilisateur
  const gererProfil = async (req, res) => {
    try {
        const { utilisateurId, updatedData } = req.body;

        const utilisateur = await Utilisateur.findById(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier si l'utilisateur essaie de changer des champs non autorisés
        if (updatedData.role && updatedData.role !== utilisateur.role) {
            return res.status(403).json({ error: 'Modification du rôle interdite' });
        }

        // Si l'email est modifié, il faut vérifier qu'il est unique et autorisé
        if (updatedData.email && updatedData.email !== utilisateur.email) {
            const emailExistant = await Utilisateur.findOne({ email: updatedData.email });
            if (emailExistant) {
                return res.status(400).json({ error: 'Cet email est déjà utilisé' });
            }
            utilisateur.email = updatedData.email;  // Changer l'email
        }

        // Si un mot de passe est fourni, on le hache et on le met à jour
        if (updatedData.motDePasse) {
            const hashedPassword = await bcrypt.hash(updatedData.motDePasse, 10);  // Assurez-vous d'utiliser un bon algorithme de hashage
            utilisateur.motDePasse = hashedPassword;  // Mettre à jour le mot de passe
        }

        // Vérifier si un PetOwner veut devenir PetSitter
        if (utilisateur.role === 'petOwner' && updatedData.validPetSitter === true) {
            utilisateur.validPetSitter = true;
            utilisateur.role = 'petSitter';
        }

        // Vérifier si un Pet Sitter met à jour ses coordonnées GPS
        if (utilisateur.role === 'petSitter') {
            if (updatedData.latitude !== undefined) utilisateur.latitude = updatedData.latitude;
            if (updatedData.longitude !== undefined) utilisateur.longitude = updatedData.longitude;
        }

        // Mettre à jour les autres informations
        await utilisateur.gererProfil(updatedData);

        res.status(200).json({ message: 'Profil mis à jour avec succès', utilisateur });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



  // Validation par l'Admin d'un PetOwner comme PetSitter
const validerPetSitter = async (req, res) => {
    try {
      const { utilisateurId } = req.body;
  
      const utilisateur = await Utilisateur.findById(utilisateurId);
      if (!utilisateur || utilisateur.role !== 'petOwner') {
        return res.status(404).json({ error: 'Utilisateur non trouvé ou ce n\'est pas un PetOwner' });
      }
  
      // Appeler la méthode de validation du PetSitter
      await utilisateur.validerPetSitterParAdmin();
  
      res.status(200).json({ message: 'PetOwner validé comme PetSitter avec succès', utilisateur });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


// Gérer la disponibilité d'un PetSitter
const gererDisponibilite = async (req, res) => {
  try {
    const { utilisateurId, disponibilite } = req.body;

    // Trouver l'utilisateur et vérifier qu'il est bien un PetSitter
    const petSitter = await Utilisateur.findById(utilisateurId);
    if (!petSitter || petSitter.role !== 'petSitter') {
      return res.status(404).json({ error: 'PetSitter non trouvé' });
    }

    // Mettre à jour la disponibilité
    petSitter.disponibilite = disponibilite;
    await petSitter.save();

    res.status(200).json({ message: 'Disponibilité mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consulter les réservations d'un PetSitter
const consulterReservations = async (req, res) => {
  try {
    const { utilisateurId } = req.params;

    // Trouver les réservations du PetSitter
    const reservations = await Reservation.find({ petSitterId: utilisateurId });
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ error: 'Aucune réservation trouvée' });
    }

    res.status(200).json({ reservations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Gérer les utilisateurs (ajouter, modifier, supprimer, consulter)
const gererUtilisateur = async (req, res) => {
  try {
    const { action, utilisateurId, updatedData } = req.body;

    let utilisateur;
    switch (action) {
      case 'ajouter':
        // Ajouter un nouvel utilisateur
        utilisateur = new Utilisateur(updatedData); // Par exemple, ajouter un PetOwner, cela peut être généralisé
        await utilisateur.inscrire();
        break;
      case 'modifier':
        // Modifier un utilisateur existant
        utilisateur = await Utilisateur.findById(utilisateurId); // Tu peux aussi gérer d'autres types d'utilisateurs
        if (!utilisateur) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        Object.assign(utilisateur, updatedData); // Mise à jour des informations
        await utilisateur.save();
        break;
      case 'supprimer':
        // Supprimer un utilisateur
        utilisateur = await Utilisateur.findById(utilisateurId);
        if (!utilisateur) {
          return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        await utilisateur.deleteOne();
        break;
      default:
        return res.status(400).json({ error: 'Action invalide' });
    }

    res.status(200).json({ message: `Utilisateur ${action} avec succès` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consulter les réservations de tous les Pet Sitters pour un Admin
const consulterReservationsAdmin = async (req, res) => {
    try {
      // Trouver toutes les réservations, tu peux ajouter un filtrage si nécessaire
      const reservations = await Reservation.find().populate('petSitter').populate('petOwner');
      
      // Si aucune réservation n'est trouvée
      if (!reservations || reservations.length === 0) {
        return res.status(404).json({ error: 'Aucune réservation trouvée' });
      }
  
      res.status(200).json({ reservations });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


// Ajouter un animal au profil d'un PetOwner
const ajouterAnimal = async (req, res) => {
  try {
    const { utilisateurId, animalData } = req.body;

    // Trouver le PetOwner
    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur || utilisateur.role !== 'petOwner') {
      return res.status(404).json({ error: 'PetOwner non trouvé' });
    }

    // Ajouter l'animal
    await utilisateur.ajouterAnimal(animalData);
    res.status(200).json({ message: 'Animal ajouté avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gérer l'image de profil de l'utilisateur
const gererImageProfil = async (req, res) => {
  try {
    const { utilisateurId } = req.params;
    const imageUrl = req.file.path; // Utilisation de multer pour obtenir le chemin du fichier

    // Trouver l'utilisateur
    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }


    // Mettre à jour l'image de profil
    utilisateur.image = imageUrl;
    await utilisateur.save();

    res.status(200).json({ message: 'Image de profil mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Méthode pour afficher le profil pour le vétérinaire et coach 
const afficherProfil = async (req, res) => {
    try {
        const { utilisateurId } = req.params;


        //Trouver l'utilisateur dans la base de données
        const utilisateur = await Utilisateur.findById(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        // Vérifier que l'utilisateur est un Vétérinaire ou un Coach
        if (utilisateur.role !== 'veterinaire' && utilisateur.role !== 'coach') {
            return res.status(403).json({ error: "Accès refusé : Seuls les vétérinaires et les coachs peuvent afficher leur profil." });
        }

        res.status(200).json({ message: "Profil récupéré avec succès", profil: utilisateur });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
  inscrireUtilisateur,
  seConnecterUtilisateur,
  gererProfil,
  validerPetSitter,
  gererUtilisateur,
  consulterReservations,
  consulterReservationsAdmin,
  gererDisponibilite,
  ajouterAnimal,
  afficherProfil,
  gererImageProfil
};
