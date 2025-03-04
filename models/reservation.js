const mongoose = require('mongoose');

// Schéma de la réservation
const reservationSchema = new mongoose.Schema({
  id: {
    type: Number, // L'ID sous forme de nombre entier
    required: true,
    unique: true
  },
  statut: {
    type: String,
    enum: ['en attente', 'accepté', 'terminé'], // Statut de la réservation
    default: 'en attente', // Statut par défaut
    required: true
  },
  dateDebut: {
    type: Date, // Date de début de la réservation
    required: true
  },
  dateFin: {
    type: Date, // Date de fin de la réservation
    required: true
  }
});

// Création du modèle de réservation
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
