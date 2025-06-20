# Image Node.js légère
FROM node:22-alpine

# Désactivation du linter
ARG DISABLE_ESLINT_PLUGIN="false"

# Répertoire de travail
WORKDIR /app

# Copie des dépendances
COPY package*.json ./
RUN npm install

# Copie du code source
COPY . .

# Build avec ESLint désactivé si l'argument est true
RUN if [ "$DISABLE_ESLINT_PLUGIN" = "true" ] ; then \
      npm run build -- --no-lint ; \
    else \
      npm run build ; \
    fi

# Port
EXPOSE 3000

# Démarrage
CMD ["npm", "start"]