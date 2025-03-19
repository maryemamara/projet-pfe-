const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');  // Middleware d'authentification
const { estPetOwner, estPetOwnerOuAdmin } = require('../middleware/feedbackMiddleware');  

// Route pour ajouter un feedback (uniquement par un PetOwner)
router.post('/ajouterFeedback', authMiddleware, estPetOwner, feedbackController.ajouterFeedback);

// Route pour récupérer les feedbacks d'un PetSitter (accessible à tous les utilisateurs authentifiés)
router.get('/obtenirFeedback/:petSitterId', authMiddleware, feedbackController.obtenirFeedbacksPetSitter);

// Route pour supprimer un feedback (réservé à l'Admin ou PetOwner)
router.delete('/supprimerFeedback/:feedbackId', authMiddleware, estPetOwnerOuAdmin, feedbackController.supprimerFeedback);

module.exports = router;


