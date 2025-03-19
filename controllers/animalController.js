const mongoose = require('mongoose');
const Animal = require('../models/animal');
const Utilisateur = require('../models/user');

// Ajouter un animal au profil d'un PetOwner
const ajouterAnimal = async (req, res) => {
  try {
    const { utilisateurId, animalData } = req.body;

    // Trouver le PetOwner
    const utilisateur = await Utilisateur.findById(utilisateurId);
    if (!utilisateur || utilisateur.role !== 'petOwner') {
      return res.status(404).json({ error: 'PetOwner non trouvé' });
    }

    // Ajouter l'animal
    const animal = new Animal(animalData);
    await utilisateur.ajouterAnimal(animal);
    res.status(200).json({ message: 'Animal ajouté avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modifier un animal (par exemple : mettre à jour les informations de l'animal)
const modifierAnimal = async (req, res) => {
  try {
    const { animalId, updatedData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(animalId)) {
      return res.status(400).json({ error: "ID d'animal invalide" });
    }

    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }

    // Mettre à jour les informations de l'animal
    Object.assign(animal, updatedData);
    await animal.save();

    res.status(200).json({ message: 'Animal modifié avec succès', animal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer un animal
const supprimerAnimal = async (req, res) => {
  try {
    const { animalId } = req.body;

    const animal = await Animal.findById(animalId);
    if (!animal) {
      return res.status(404).json({ error: 'Animal non trouvé' });
    }

    await animal.deleteOne();
    res.status(200).json({ message: 'Animal supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Consulter tous les animaux
const consulterAnimaux = async (req, res) => {
  try {
    const animaux = await Animal.find();
    if (!animaux || animaux.length === 0) {
      return res.status(404).json({ error: 'Aucun animal trouvé' });
    }

    res.status(200).json({ animaux });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  ajouterAnimal,
  modifierAnimal,
  supprimerAnimal,
  consulterAnimaux,
};
