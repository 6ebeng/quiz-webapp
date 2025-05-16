# Stage 1: Build (if needed, though for Node.js, often not a separate build stage unless using TypeScript without ts-node)
FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# Install ALL dependencies, including devDependencies like nodemon
RUN npm install

COPY . .

EXPOSE 8080
# The CMD from docker-compose will override this, but it's good for direct docker run
CMD [ "npm", "run", "dev" ]