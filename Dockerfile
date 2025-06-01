# Image Node.js légère
FROM node:22-alpine

# Répertoire de travail
WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Port
EXPOSE 3000

# Démarrage
CMD ["npm", "start"]