const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploads');



// Routes pour l'inscription, la connexion, et la gestion des profils
router.post('/inscrire', userController.inscrireUtilisateur);
router.post('/seConnecter', userController.seConnecterUtilisateur);
router.put('/gererProfil', userController.gererProfil);

// Routes spécifiques pour PetSitter
router.put('/gererDisponibilite', userController.gererDisponibilite);
router.get('/consulterReservations/:utilisateurId', userController.consulterReservations);
router.put('/gerer-coordonnees', userController.gererProfil);


// Routes pour l'Admin
router.put('/validerPetSitter', userController.validerPetSitter); // Modification ici
router.post('/gererUtilisateur', userController.gererUtilisateur); // Action: ajouter, modifier, supprimer
router.get('/consulterReservations', userController.consulterReservationsAdmin);

// Nouvelles routes pour changer l'email et le mot de passe
//router.put('/changer-email', userController.changerEmail); // Changer l'email de l'utilisateur
//router.put('/changer-mot-de-passe', userController.changerMotDePasse); // Changer le mot de passe de l'utilisateur

// Nouvelles routes pour l'ajout d'animaux et la gestion de l'image de profil
router.post('/ajouterAnimal', userController.ajouterAnimal); // Ajouter un animal au profil d'un PetOwner
router.put('/gererImageProfil/:utilisateurId', upload.single('imageProfil'), userController.gererImageProfil); // Gérer l'image de profil de l'utilisateur

//Route pour afficher le profil pour le vétérinare et le coach
router.get('/afficherProfil/:utilisateurId', userController.afficherProfil);


module.exports = router;
