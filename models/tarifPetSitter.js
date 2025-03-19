const mongoose = require('mongoose');

const tarifPetSitterSchema = new mongoose.Schema({
  petSitterId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Utilisateur', // Référence au modèle Utilisateur
    required: true 
  },
  tarifHoraire: { type: Number, required: true }, // Tarif par heure
  tarifJournalier: { type: Number, required: false }, // Tarif par jour (optionnel)
  duree: { type: Number, required: true }, // Durée du service en heures
  devise: { type: String, required: true, default: 'EUR' }, // Devise du tarif
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('TarifPetSitter', tarifPetSitterSchema);
