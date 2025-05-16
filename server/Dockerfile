# Dockerfile for the Node.js backend application

# Use an official Node.js runtime as a parent image.
# Alpine Linux is used for a smaller image size.
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json if you use it)
# This step leverages Docker's cache. If these files haven't changed,
# Docker won't re-run npm install in subsequent builds unless the cache is invalidated.
COPY package*.json ./

# Install project dependencies.
# For a development/testing Docker image, including devDependencies is usually fine.
# For a lean production image, you might use 'npm ci --omit=dev' or 'npm install --production'.
RUN npm install

# Copy the rest of the application code into the working directory
COPY . .

# The port the application will run on inside the container.
# This should match the PORT variable in your .env file and the port exposed in docker-compose.yml
EXPOSE 8080

# Define the command to run the application.
# This uses the "start" script defined in your server/package.json.
CMD ["npm", "start"]
