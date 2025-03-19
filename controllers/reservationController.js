const mongoose = require('mongoose');
const Reservation = require('../models/reservation');  


// Méthode pour effectuer une nouvelle réservation
const effectuerReservation = async (req, res) => {
  try {
    const {  statut, dateDebut, dateFin } = req.body;

    // Créer une nouvelle réservation
    const reservation = new Reservation({
      statut,
      dateDebut,
      dateFin
    });

    // Sauvegarder la réservation dans la base de données
    await reservation.save();

    res.status(201).json({ message: 'Réservation créée avec succès', reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode pour obtenir toutes les réservations
const obtenirToutesLesReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ error: 'Aucune réservation trouvée' });
    }
    res.status(200).json({ reservations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode pour obtenir une réservation par son ID
const obtenirReservationParId = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifie si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    const reservation = await Reservation.findById( id );
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    res.status(200).json({ reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode pour modifier une réservation
const modifierReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, dateDebut, dateFin } = req.body;

    const reservation = await Reservation.findById( id );
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Modifier les informations de la réservation
    reservation.statut = statut || reservation.statut;
    reservation.dateDebut = dateDebut || reservation.dateDebut;
    reservation.dateFin = dateFin || reservation.dateFin;

    // Sauvegarder les modifications
    await reservation.save();

    res.status(200).json({ message: 'Réservation modifiée avec succès', reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode pour supprimer une réservation
const annulerReservation = async (req, res) => {
  try {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("ID invalide !");
      return res.status(400).json({ error: 'ID invalide' });
    }


    const reservation = await Reservation.findById(id );
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Supprimer la réservation
    await reservation.deleteOne();

    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Méthode pour changer le statut d'une réservation (exemple: accepter ou terminer)
const changerStatutReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;


    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    console.log("ID reçu :", id);

    const reservation = await Reservation.findById( id );

    console.log("Réservation trouvée :", reservation); 
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Modifier le statut de la réservation
    reservation.statut = statut || reservation.statut;
    await reservation.save();

    res.status(200).json({ message: 'Statut de la réservation modifié avec succès', reservation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  effectuerReservation,
  obtenirToutesLesReservations,
  obtenirReservationParId,
  modifierReservation,
  annulerReservation,
  changerStatutReservation
};
