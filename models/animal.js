const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  
  nom: { type: String, required: true },
  type: { type: String, required: true },
  age: { type: Number, required: true },
  race: { type: String, required: true },
  couleur: { type: String, required: true },
  poids: { type: Number, required: true },
  caracteristiques: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Animal', animalSchema);
