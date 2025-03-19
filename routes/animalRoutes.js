const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); 
const animalController = require('../controllers/animalController');
const estPetOwner = require('../middleware/animalMiddleware'); 

// Ajouter un animal, uniquement accessible par un PetOwner
router.post('/ajouterAnimal/:id', authMiddleware, estPetOwner, animalController.ajouterAnimal);

// Modifier un animal, uniquement accessible par un PetOwner
router.patch('/modifierAnimal/:id', authMiddleware, estPetOwner, animalController.modifierAnimal);

// Supprimer un animal, uniquement accessible par un PetOwner
router.delete('/supprimerAnimal/:id', authMiddleware, estPetOwner, animalController.supprimerAnimal);

// Consulter tous les animaux, accessible par tout utilisateur authentifié
router.get('/consulterAnimaux', authMiddleware, animalController.consulterAnimaux);

module.exports = router;
