
const estPetOwner = (req, res, next) => {
    if (!req.utilisateur || req.utilisateur.role !== 'petOwner') {
        return res.status(403).json({ error: 'Accès refusé : seuls les Pet Owners peuvent effectuer cette action' });
    }
    next();
};

const estPetSitter = (req, res, next) => {
    if (!req.utilisateur || req.utilisateur.role !== 'petSitter') {
        return res.status(403).json({ error: 'Accès refusé : seuls les Pet Sitters peuvent effectuer cette action' });
    }
    next();
};

module.exports = 
{ 
    estPetOwner,
    estPetSitter 
};
