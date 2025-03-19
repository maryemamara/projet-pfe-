const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma de base pour un utilisateur
const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['petOwner', 'petSitter', 'admin', 'coach', 'veterinaire'], required: true },
  adresse: { type: String, required: true },
  ville: { type: String, required: true },
  gouvernement: { type: String, required: true },
  codePostal: { type: String, required: true },
  telephone: { type: String, required: true },
  age: { type: Number, required: true },
  civilite: { type: String, enum: ['Monsieur', 'Madame'], required: true },
  validPetSitter: { type: Boolean, default: false }, // Champs pour vérifier si le PetOwner a été validé comme PetSitter
  animaux: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }], // Un PetOwner peut avoir plusieurs animaux
  reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // Un PetSitter peut avoir plusieurs réservations
  latitude: { type: Number, required: function() { return this.role === 'petSitter'; } },
  longitude: { type: Number, required: function() { return this.role === 'petSitter'; } },
  disponibilite: { type: [String], default: [], required: function() { return this.role === 'petSitter'; } }, //(par exemple : ['Lundi 9h-12h', 'Mercredi 14h-18h'])
  specialite: { type: String, required: function() { return this.role === 'veterinaire' || this.role === 'coach'; } } 



}, {
  timestamps: true
});

// Middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
  if (this.isModified('motDePasse')) {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  }
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.verifierMotDePasse = async function(motDePasse) {
  return await bcrypt.compare(motDePasse, this.motDePasse);
};

// Méthode pour gérer l'inscription d'un utilisateur (en fonction de son rôle)
userSchema.methods.inscrire = async function() {
  // Logique d'inscription pour chaque utilisateur en fonction de son rôle
  if (this.role === 'petOwner') {
    // Ajouter une logique spécifique pour un PetOwner si nécessaire
    // Par exemple, envoi d'un e-mail de confirmation, etc.
  }
  await this.save();
};

// Méthode pour changer l'email de l'utilisateur
userSchema.methods.changerEmail = async function(nouvelEmail) {
  this.email = nouvelEmail;
  await this.save();
};

// Méthode pour changer le mot de passe de l'utilisateur
userSchema.methods.changerMotDePasse = async function(nouveauMotDePasse) {
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(nouveauMotDePasse, salt);
  await this.save();
};

// Méthode pour permettre à un PetOwner de devenir PetSitter (après validation de l'Admin)
userSchema.methods.validerPetSitter = async function() {
  if (this.role === 'petOwner' && !this.validPetSitter) {
    this.validPetSitter = true;
    this.role = 'petSitter'; // Changer le rôle pour PetSitter après validation
    await this.save();
  } else {
    throw new Error('Le Pet Owner n\'est pas validé ou est déjà un Pet Sitter');
  }
};

// Méthode pour qu'un Admin valide un PetOwner comme PetSitter
userSchema.methods.validerPetSitterParAdmin = async function() {
    if (this.role !== 'petOwner' || this.validPetSitter === false) {
      throw new Error('Ce PetOwner n\'est pas validé pour devenir PetSitter');
    }
  
    // Changer le rôle et valider le PetSitter
    this.role = 'petSitter';
    this.validPetSitter = true;
    await this.save();
  };
  
// Méthode pour modifier les infos d'utilisateur 
userSchema.methods.gererProfil = async function(updatedData) {
    Object.keys(updatedData).forEach((key) => {
      if (key !== 'motDePasse') { // Empêcher la modification du mot de passe ici
        this[key] = updatedData[key];
      }
    });
  
    await this.save();
  };

  // Méthode pour ajouter un animal au profil d'un PetOwner
userSchema.methods.ajouterAnimal = async function(animalId) {
  if (this.role !== 'petOwner') {
    throw new Error('Seul un PetOwner peut ajouter un animal');
  }

  // Ajouter l'ID de l'animal au tableau animaux
  this.animaux.push(animalId);
  await this.save();
};

  

module.exports = mongoose.model('Utilisateur', userSchema);
