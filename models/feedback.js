const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  petOwnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, // Pet Owner qui laisse un feedback
  petSitterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, // Pet Sitter qui reçoit le feedback
  commentaire: { type: String, required: true }, // Contenu du feedback
  note: { type: Number, min: 1, max: 5, required: true }, // Note sur 5
  date: { type: Date, default: Date.now } // Date du feedback
});

module.exports = mongoose.model('Feedback', feedbackSchema);
