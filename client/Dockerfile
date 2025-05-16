# Dockerfile for the Angular client application

# Stage 1: Build the Angular application
# Use a Node.js image that includes npm and Angular CLI capabilities.
# Match the Node version with your development environment if possible.
FROM node:18 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application for production.
# Ensure --configuration production is used for an optimized build.
RUN npm run build -- --configuration development

# Stage 2: Serve the application with Nginx
# Use a lightweight Nginx image
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the 'build' stage to Nginx's web root
# Adjust 'dist/kveez' if your angular.json 'outputPath' is different (e.g., 'dist/projekt')
COPY --from=build /usr/src/app/dist/projekt /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
