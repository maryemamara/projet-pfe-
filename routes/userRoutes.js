const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/uploads');
const authMiddleware = require('../middleware/authMiddleware'); 


const { validerPetSitter } = require('../controllers/userController');
const { gererUtilisateur } = require('../controllers/userController');
const { consulterReservationsAdmin } = require('../controllers/userController');
const { estAdmin } = require('../middleware/userMiddleware');

const { gererProfil } = require('../controllers/userController');  
const { gererDisponibilite } = require('../controllers/userController');
const { consulterReservations } = require('../controllers/userController');
const { estPetSitterModificationCoordonnees } = require('../middleware/userMiddleware');
const { estPetSitter } = require('../middleware/userMiddleware');

const { ajouterAnimal } = require('../controllers/userController');
const { estPetOwner } = require('../middleware/userMiddleware');

const { afficherProfil } = require('../controllers/userController');
const { estVeterinaireOuCoach } = require('../middleware/userMiddleware');


// Routes pour l'inscription, la connexion, et la gestion des profils
router.post('/inscrire', userController.inscrireUtilisateur);
router.post('/seConnecter', userController.seConnecterUtilisateur);
router.put('/gererProfil', userController.gererProfil);

// Routes spécifiques pour PetSitter
router.put('/gererDisponibilite', authMiddleware, estPetSitter, gererDisponibilite);
router.get('/consulterReservations/:utilisateurId', authMiddleware, estPetSitter, consulterReservations);
router.put('/gererProfil', estPetSitterModificationCoordonnees, gererProfil);


// Routes pour l'Admin
router.post('/validerPetSitter', estAdmin, validerPetSitter);
router.post('/gererUtilisateur', estAdmin, gererUtilisateur);
router.get('/consulterReservationsAdmin', estAdmin, consulterReservationsAdmin);

// Nouvelles routes pour changer l'email et le mot de passe
//router.put('/changer-email', userController.changerEmail); // Changer l'email de l'utilisateur
//router.put('/changer-mot-de-passe', userController.changerMotDePasse); // Changer le mot de passe de l'utilisateur

// Nouvelles routes pour l'ajout d'animaux et la gestion de l'image de profil
router.post('/ajouterAnimal', estPetOwner, ajouterAnimal); 
router.put('/gererImageProfil/:utilisateurId', upload.single('imageProfil'), userController.gererImageProfil); 

//Route pour afficher le profil pour le vétérinare et le coach
router.get('/afficherProfil/:utilisateurId', estVeterinaireOuCoach, afficherProfil);


module.exports = router;
