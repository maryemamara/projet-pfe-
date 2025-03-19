const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// Route pour envoyer un message (nécessite d'être authentifié)
router.post('/envoyer', authMiddleware, chatController.envoyerMessage);

// Route pour récupérer les messages entre deux utilisateurs
router.get('/messages/:utilisateurId', authMiddleware, chatController.recupererMessages);

module.exports = router;
