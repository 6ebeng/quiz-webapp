FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy application code
COPY . .

# Environment variable for the port (server.js uses process.env.PORT)
ENV PORT 8080
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]