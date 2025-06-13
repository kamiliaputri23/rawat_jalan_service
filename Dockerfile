FROM node:18-alpine
WORKDIR /app

# Copy dependency dari package.json (root)
COPY package*.json ./
RUN npm install

# Salin kedua folder
COPY backend/ ./
COPY frontend/ ./frontend/

EXPOSE 8004
CMD ["node", "index.js"]
