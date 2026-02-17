#etape1 developpement
FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install && npm run build 
COPY . .
#etape 2 production
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist

# Installer un serveur léger pour servir le build
RUN npm install -g serve

# Exposer le port de prod
EXPOSE 5173

# Lancer le serveur
CMD ["serve", "-s", "dist", "-l", "5173"]
