const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');  // Assure-toi que le chemin est correct pour le modèle Reservation
const PetSitter = require('./models/PetSitter');  // Assure-toi que le chemin est correct pour le modèle PetSitter
const PetOwner = require('./models/PetOwner');  // Assure-toi que le chemin est correct pour le modèle PetOwner

async function seedData() {
  try {
    // Connecter à MongoDB
    await mongoose.connect('mongodb://localhost:27017/tonDb', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connexion réussie");

    // Trouver un PetSitter et un PetOwner existants
    const petSitter = await PetSitter.findOne(); // Trouve un PetSitter
    const petOwner = await PetOwner.findOne(); // Trouve un PetOwner

    if (petSitter && petOwner) {
      const reservationExemple = new Reservation({
        petSitterId: petSitter._id,
        petOwnerId: petOwner._id,
        dateReservation: new Date('2025-03-04T10:00:00'),
        details: 'Garde d\'un chien',
      });

      await reservationExemple.save();
      console.log("Réservation ajoutée avec succès !");
    } else {
      console.log("PetSitter ou PetOwner non trouvé.");
    }

    mongoose.connection.close(); // Ferme la connexion à la base de données après l'insertion
  } catch (err) {
    console.log("Erreur lors de l'ajout des données", err);
    mongoose.connection.close();
  }
}

seedData();
