FROM node:12

# Creare la directory per il servizio
RUN mkdir -p /usr/src/app

# Impostare la directory come directory corrente
WORKDIR /usr/src/app

# Copiare i file del progetto nella directory
COPY . .

# Installare le dipendenze del progetto
RUN npm install

# Esporre la porta su cui il servizio sarà in ascolto
EXPOSE 3000

# Avviare il servizio
CMD ["npm", "start"]
