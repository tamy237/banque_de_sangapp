# Utilise Node 23
FROM node:23

# Crée un dossier dans le container
WORKDIR /app

# Copie package.json
COPY package*.json ./

# Installe les dépendances
RUN npm install --production

# Copie le reste du code
COPY . .

# Expose le port
EXPOSE 5500

# Commande de démarrage
CMD ["npm", "start"]
