const Feedback = require('../models/feedback');
const Utilisateur = require('../models/user');



// Ajouter un feedback
const ajouterFeedback = async (req, res) => {
  try {
    const { petOwnerId, petSitterId, commentaire, note } = req.body;

    // Vérifier que la note est bien entre 1 et 5
    if (note < 1 || note > 5) {
      return res.status(400).json({ error: "La note doit être entre 1 et 5." });
    }

    const nouveauFeedback = new Feedback({ petOwnerId, petSitterId, commentaire, note });
    await nouveauFeedback.save();

    res.status(201).json({ message: "Feedback ajouté avec succès", feedback: nouveauFeedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer les feedbacks d'un Pet Sitter
const obtenirFeedbacksPetSitter = async (req, res) => {
  try {
    const { petSitterId } = req.params;

    const feedbacks = await Feedback.find({ petSitterId }).sort({ date: -1 });

    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un feedback (optionnel, seulement pour l'admin)
const supprimerFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;

    await Feedback.findByIdAndDelete(feedbackId);

    res.status(200).json({ message: "Feedback supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = 
{
     ajouterFeedback,
    obtenirFeedbacksPetSitter,
    supprimerFeedback
 };
