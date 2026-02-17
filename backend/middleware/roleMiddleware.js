const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;  // Le rôle est extrait du token dans req.user
    
    // Vérifie si le rôle de l'utilisateur est dans la liste des rôles autorisés
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé.' });
    }

    next();
  };
};

module.exports = allowRoles;
