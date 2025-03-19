const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');
const { estPetOwner, estPetSitter } = require('../middleware/reservationMiddleware');

// Routes accessibles uniquement par le Pet Owner
router.post('/effectuerReservation', authMiddleware, estPetOwner, reservationController.effectuerReservation);
router.get('/obtenirReservations', authMiddleware, estPetOwner, reservationController.obtenirToutesLesReservations);
router.get('/obtenirReservation/:id', authMiddleware, estPetOwner, reservationController.obtenirReservationParId);
router.put('/modifierReservation/:id', authMiddleware, estPetOwner, reservationController.modifierReservation);
router.delete('/annulerReservation/:id', authMiddleware, estPetOwner, reservationController.annulerReservation);

// Route accessible uniquement par le Pet Sitter
router.patch('/changerStatutReservation/:id/statut', authMiddleware, estPetSitter, reservationController.changerStatutReservation);

module.exports = router;
