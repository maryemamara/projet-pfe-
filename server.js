const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
dotenv.config();

app.use(cors());
app.use('/uploads', express.static('uploads'));



// Middleware
app.use(express.json()); // Pour analyser les requêtes JSON
app.use('/api/utilisateurs', userRoutes); // Routes des utilisateurs

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.log('Erreur de connexion à MongoDB :', err));

// Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.PORT}`);
});
