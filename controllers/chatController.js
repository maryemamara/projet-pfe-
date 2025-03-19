const Chat = require('../models/chat');
const Utilisateur = require('../models/user');


// Envoyer un message
const envoyerMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const sender = req.utilisateur.id; // L'ID de l'utilisateur connecté

    // Vérifier que receiver est bien passé dans la requête
    if (!receiver) {
      return res.status(400).json({ error: 'Le destinataire (receiver) est requis.' });
    }

      // Vérifier que le message n'est pas vide
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
      }

    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();

    res.status(201).json({ message: 'Message envoyé avec succès', chat: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les messages entre deux utilisateurs
const recupererMessages = async (req, res) => {
  try {
    const { utilisateurId } = req.params;
    const currentUserId = req.utilisateur.id; // L'ID de l'utilisateur connecté

    const messages = await Chat.find({
      $or: [
        { sender: currentUserId, receiver: utilisateurId },
        { sender: utilisateurId, receiver: currentUserId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { envoyerMessage, recupererMessages };
