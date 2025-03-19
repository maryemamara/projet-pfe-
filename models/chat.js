const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, 
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, 
  message: { type: String, required: true }, 
  timestamp: { type: Date, default: Date.now }, // Date et heure du message
  
});

module.exports = mongoose.model('Chat', chatSchema);
