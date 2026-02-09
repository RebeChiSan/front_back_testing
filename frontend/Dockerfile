FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile || npm install
COPY . .
RUN chmod +x node_modules/.bin/vite
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]